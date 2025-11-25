/**
 * Request Animation Frame utilities for batching layout reads/writes
 * to prevent forced reflows and layout thrashing
 */

/**
 * Throttles a function using requestAnimationFrame to ensure it only runs
 * once per frame, batching multiple calls together
 */
export function rafThrottle<T extends (...args: any[]) => void>(callback: T): T {
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;

  const throttled = (...args: any[]) => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs !== null) {
          callback(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };

  return throttled as T;
}

/**
 * Batches layout reads in a requestAnimationFrame callback
 * to prevent interleaving reads and writes
 */
export function batchedRead(callback: () => void): void {
  requestAnimationFrame(callback);
}

/**
 * Schedules a write operation after all reads are complete
 */
export function batchedWrite(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
