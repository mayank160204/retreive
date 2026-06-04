'use client';

import { AuthProvider } from '@/lib/auth-context';
import { StudyProvider } from '@/lib/study-context';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

/**
 * OfflineQueueInitializer — silently initializes the IndexedDB offline write
 * queue on mount and registers the online/background flush listeners.
 */
function OfflineQueueInitializer() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    import('@/lib/offline-queue').then(({ initOfflineQueue }) => {
      cleanup = initOfflineQueue();
    }).catch((err) => {
      console.warn('Offline queue init failed:', err);
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}

export function Providers({ children }: { readonly children: ReactNode }) {
  return (
    <AuthProvider>
      <StudyProvider>
        <OfflineQueueInitializer />
        {children}
      </StudyProvider>
    </AuthProvider>
  );
}
