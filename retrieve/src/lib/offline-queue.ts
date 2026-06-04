/**
 * Offline Session Queue for RETREIVE
 *
 * Uses IndexedDB to queue Firestore write operations when the user is offline
 * or when a write fails. A background sync process retries failed operations
 * when connectivity is restored.
 *
 * Architecture:
 * - All session saves pass through enqueueWrite()
 * - A background flush loop runs every 30 seconds
 * - On network restoration (online event), flush is triggered immediately
 * - Operations are retried up to MAX_RETRIES times with exponential backoff
 */

const DB_NAME = 'retreive_offline_queue';
const STORE_NAME = 'pending_writes';
const DB_VERSION = 1;
const MAX_RETRIES = 5;

export type WriteOperation =
  | { type: 'complete_session'; payload: CompleteSessionPayload }
  | { type: 'update_streak'; payload: UpdateStreakPayload }
  | { type: 'award_badge'; payload: AwardBadgePayload }
  | { type: 'add_xp'; payload: AddXpPayload };

interface CompleteSessionPayload {
  sessionId: string;
  userId: string;
  data: {
    accuracy: number;
    wordsRead: number;
    duration: number;
    xpEarned: number;
    mcqAnswers?: Record<string, string>;
  };
}

interface UpdateStreakPayload {
  userId: string;
}

interface AwardBadgePayload {
  userId: string;
  badgeId: string;
}

interface AddXpPayload {
  userId: string;
  xp: number;
  reason: string;
}

interface QueueEntry {
  id?: number;
  operation: WriteOperation;
  createdAt: number;
  retryCount: number;
  lastError?: string;
}

// ─── IndexedDB Helpers ──────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllEntries(): Promise<QueueEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as QueueEntry[]);
    request.onerror = () => reject(request.error);
  });
}

async function deleteEntry(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function updateEntry(entry: QueueEntry): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Add a write operation to the offline queue.
 * If the user is online, it will be processed immediately by the flush loop.
 */
export async function enqueueWrite(operation: WriteOperation): Promise<void> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    // SSR or no IndexedDB support — attempt direct write
    await executeOperation(operation);
    return;
  }

  const entry: QueueEntry = {
    operation,
    createdAt: Date.now(),
    retryCount: 0,
  };

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(entry);
    request.onsuccess = () => {
      resolve();
      // Immediately try to flush if online
      if (navigator.onLine) {
        flushQueue().catch(console.error);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Execute a single write operation against Firestore.
 */
async function executeOperation(operation: WriteOperation): Promise<void> {
  const { completeSession, updateUserStreak, awardBadgeToUser, addUserXP } = await import('@/lib/db');

  switch (operation.type) {
    case 'complete_session':
      await completeSession(
        operation.payload.sessionId,
        {
          words_read: operation.payload.data.wordsRead,
          accuracy_percentage: operation.payload.data.accuracy,
          time_duration_seconds: operation.payload.data.duration,
          mcq_score: operation.payload.data.xpEarned,
        }
      );
      break;

    case 'update_streak':
      await updateUserStreak(operation.payload.userId);
      break;

    case 'award_badge':
      await awardBadgeToUser(operation.payload.userId, operation.payload.badgeId);
      break;

    case 'add_xp':
      await addUserXP(operation.payload.userId, operation.payload.xp);
      break;

    default:
      console.warn('Unknown operation type:', (operation as WriteOperation).type);
  }
}

/**
 * Process all pending queue entries.
 * Failed entries are retried with exponential backoff up to MAX_RETRIES.
 */
export async function flushQueue(): Promise<{ processed: number; failed: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { processed: 0, failed: 0 };
  }

  const entries = await getAllEntries();

  if (entries.length === 0) return { processed: 0, failed: 0 };

  let processed = 0;
  let failed = 0;

  for (const entry of entries) {
    if (entry.retryCount >= MAX_RETRIES) {
      // Give up after MAX_RETRIES attempts — log and remove
      console.error(
        `Offline queue: Dropping operation after ${MAX_RETRIES} retries:`,
        entry.operation.type,
        entry.lastError
      );
      await deleteEntry(entry.id!);
      failed++;
      continue;
    }

    // Exponential backoff: wait 2^retryCount seconds before retrying
    const backoffMs = Math.pow(2, entry.retryCount) * 1000;
    const timeSinceCreated = Date.now() - entry.createdAt;

    if (entry.retryCount > 0 && timeSinceCreated < backoffMs) {
      // Not ready to retry yet
      continue;
    }

    try {
      await executeOperation(entry.operation);
      await deleteEntry(entry.id!);
      processed++;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(
        `Offline queue: Retry ${entry.retryCount + 1} failed for ${entry.operation.type}:`,
        errorMessage
      );

      await updateEntry({
        ...entry,
        retryCount: entry.retryCount + 1,
        lastError: errorMessage,
      });

      failed++;
    }
  }

  return { processed, failed };
}

/**
 * Initialize the offline queue manager.
 * Registers event listeners and starts the background flush loop.
 * Call this once when the app mounts.
 */
export function initOfflineQueue(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Flush when network is restored
  const handleOnline = () => {
    console.log('Network restored — flushing offline queue...');
    flushQueue().then(({ processed, failed }) => {
      if (processed > 0) {
        console.log(`Offline queue: Flushed ${processed} operations (${failed} failed)`);
      }
    });
  };

  window.addEventListener('online', handleOnline);

  // Background flush every 30 seconds
  const intervalId = setInterval(() => {
    if (navigator.onLine) {
      flushQueue().catch(console.error);
    }
  }, 30_000);

  // Initial flush on mount (in case there are leftover entries from previous session)
  flushQueue().catch(console.error);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    clearInterval(intervalId);
  };
}

/**
 * Get the number of pending operations in the queue.
 * Useful for showing a sync indicator in the UI.
 */
export async function getPendingCount(): Promise<number> {
  if (typeof window === 'undefined' || !window.indexedDB) return 0;
  const entries = await getAllEntries();
  return entries.length;
}
