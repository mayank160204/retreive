const rateLimitMap = new Map<string, number[]>();

// Periodically clean up stale rate limit entries to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const activeTimestamps = timestamps.filter(ts => now - ts < 60_000); // 1 min max window
      if (activeTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, activeTimestamps);
      }
    }
  }, 60_000);
}

/**
 * Checks if a key has exceeded the rate limit.
 * @param key Unique identifier (e.g. userId or IP)
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(key, activeTimestamps);
  return false;
}
