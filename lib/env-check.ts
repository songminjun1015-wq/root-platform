/**
 * 필수 환경변수 검증 — 서버 시작 시점에 실행
 * 운영 환경에서 보안에 치명적인 문제가 있을 경우에만 프로세스를 종료합니다.
 */

const REQUIRED_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;

// 운영 환경에서 절대 있으면 안 되는 값 — 발견 시 부팅 중단
const FATAL_DEFAULTS: Record<string, string[]> = {
  JWT_SECRET: ["root-mvp-secret-change-in-production", "CHANGE_ME_USE_STRONG_RANDOM_SECRET"],
  NEXT_PUBLIC_APP_URL: ["http://localhost", "yourdomain.com"],
};

// 운영 환경에서 권장되진 않지만 동작은 하는 값 — 경고만
const WARN_DEFAULTS: Record<string, string[]> = {
  EMAIL_FROM: ["onboarding@resend.dev"],
};

const MIN_JWT_SECRET_LENGTH = 32;

export function checkEnvVars() {
  const isProduction = process.env.NODE_ENV === "production";
  const missing: string[] = [];
  const fatal: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  for (const [key, defaults] of Object.entries(FATAL_DEFAULTS)) {
    const val = process.env[key];
    if (val && defaults.some((d) => val.includes(d))) {
      fatal.push(`${key} (기본/예시 값 사용 중)`);
    }
  }

  for (const [key, defaults] of Object.entries(WARN_DEFAULTS)) {
    const val = process.env[key];
    if (val && defaults.some((d) => val.includes(d))) {
      warnings.push(`${key} (기본/예시 값 — 운영에선 실제 도메인 사용 권장)`);
    }
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    fatal.push(`JWT_SECRET (${MIN_JWT_SECRET_LENGTH}자 미만 — 최소 ${MIN_JWT_SECRET_LENGTH}자 필요)`);
  }

  if (missing.length > 0) {
    console.warn(`\n⚠️  [ROOT] 필수 환경변수 누락:\n${missing.map((k) => `   - ${k}`).join("\n")}\n`);
  }
  if (fatal.length > 0) {
    console.error(`\n🚨 [ROOT] 안전하지 않은 환경변수 (부팅 중단):\n${fatal.map((k) => `   - ${k}`).join("\n")}\n`);
  }
  if (warnings.length > 0) {
    console.warn(`\n⚠️  [ROOT] 환경변수 경고:\n${warnings.map((k) => `   - ${k}`).join("\n")}\n`);
  }

  const shouldExit = isProduction && (missing.length > 0 || fatal.length > 0);
  if (shouldExit) {
    console.error(
      "\n❌ [ROOT] 운영 환경에서 치명적 문제가 발견되어 서버를 시작할 수 없습니다.\n" +
        "   .env 파일을 확인하고 모든 값을 운영용으로 교체하세요.\n"
    );
    process.exit(1);
  }
}
