import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  try {
    const key = `ratelimit:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);
    const windowKey = `${key}:${windowStart}`;

    const current = await redis.incr(windowKey);
    if (current === 1) {
      await redis.expire(windowKey, windowSeconds);
    }

    const remaining = Math.max(0, limit - current);
    const reset = windowStart + windowSeconds;

    return {
      success: current <= limit,
      remaining,
      reset,
    };
  } catch (e) {
    console.error("Rate limit check failed:", e);
    return { success: true, remaining: limit, reset: 0 };
  }
}
