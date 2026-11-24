import { prisma } from './prisma';

/**
 * Ultra-fast safe database query helper.
 * If the database connection hangs, times out, or fails,
 * it returns the fallback data within timeoutMs (default 1200ms)
 * to prevent 500 Internal Server Errors and eliminate page loading delays.
 */
export async function dbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  timeoutMs = 6000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<T>((resolve) => {
      const timer = setTimeout(() => {
        resolve(fallback);
      }, timeoutMs);
      // unref timer in Node if available
      if (typeof timer === 'object' && 'unref' in timer) {
        (timer as unknown as { unref: () => void }).unref();
      }
    });

    const result = await Promise.race([
      queryFn().catch(() => fallback),
      timeoutPromise,
    ]);

    return result ?? fallback;
  } catch {
    return fallback;
  }
}

