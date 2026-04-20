/**
 * 간단한 인메모리 Rate Limiter
 * 운영 환경에서 스케일링 시 Redis 기반으로 교체 권장
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// 오래된 엔트리 주기적 정리 (메모리 누수 방지)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export interface RateLimitConfig {
  /** 허용 요청 수 */
  maxRequests: number;
  /** 윈도우 크기 (밀리초) */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // 기존 엔트리가 없거나 윈도우가 지났으면 리셋
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // 윈도우 내: 카운트 증가
  entry.count += 1;

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}
