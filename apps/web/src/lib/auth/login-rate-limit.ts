import {
  AppError,
  ERROR_CODES,
  LOGIN_RATE_LIMIT_MAX,
  LOGIN_RATE_LIMIT_WINDOW_MS,
} from "@manuscript/shared";

type Bucket = { failures: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function keyFor(ip: string, email: string): string {
  return `${ip}|${email.trim().toLowerCase()}`;
}

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function assertLoginAllowed(ip: string, email: string): void {
  const now = Date.now();
  prune(now);
  const key = keyFor(ip, email);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) return;
  if (bucket.failures >= LOGIN_RATE_LIMIT_MAX) {
    throw new AppError(ERROR_CODES.RATE_LIMITED, "Too many login attempts. Try again later.");
  }
}

export function recordLoginFailure(ip: string, email: string): void {
  const now = Date.now();
  const key = keyFor(ip, email);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { failures: 1, resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS });
    return;
  }
  existing.failures += 1;
}

export function recordLoginSuccess(ip: string, email: string): void {
  buckets.delete(keyFor(ip, email));
}

export function clientIpFromHeaders(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return headersList.get("x-real-ip") ?? "unknown";
}
