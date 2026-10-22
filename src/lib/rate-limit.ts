/**
 * Small fixed-window rate limiter.
 *
 * LIMITATION: state lives in this server process's memory. It protects a
 * single long-running instance (local dev, one Node server) but is NOT shared
 * across serverless instances. Before the pilot, back it with a shared store
 * or platform rate limiting and keep Supabase Auth's own limits and CAPTCHA
 * enabled (see docs/phase-1-auth.md).
 */

type Window = { count: number; resetAt: number };

export type RateLimitRule = { limit: number; windowMs: number };

export const RATE_LIMITS = {
  signIn: { limit: 8, windowMs: 10 * 60_000 },
  signUp: { limit: 5, windowMs: 60 * 60_000 },
  resendVerification: { limit: 3, windowMs: 15 * 60_000 },
  forgotPassword: { limit: 3, windowMs: 15 * 60_000 },
  resetPassword: { limit: 5, windowMs: 15 * 60_000 },
} satisfies Record<string, RateLimitRule>;

export function createRateLimiter(now: () => number = Date.now) {
  const windows = new Map<string, Window>();

  return function check(key: string, rule: RateLimitRule): { ok: boolean; retryAfterMs: number } {
    const t = now();
    // Opportunistic cleanup so the map cannot grow without bound.
    if (windows.size > 10_000) {
      for (const [k, w] of windows) if (w.resetAt <= t) windows.delete(k);
    }
    const w = windows.get(key);
    if (!w || w.resetAt <= t) {
      windows.set(key, { count: 1, resetAt: t + rule.windowMs });
      return { ok: true, retryAfterMs: 0 };
    }
    if (w.count >= rule.limit) {
      return { ok: false, retryAfterMs: w.resetAt - t };
    }
    w.count += 1;
    return { ok: true, retryAfterMs: 0 };
  };
}

export const rateLimit = createRateLimiter();
