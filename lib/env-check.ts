/**
 * 필수 환경변수 검증 — 서버 시작 시점에 실행
 * 운영 환경에서는 안전하지 않은 설정일 경우 즉시 프로세스를 종료합니다.
 */

const REQUIRED_VARS = [
  "DATABASE_URL",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
] as const;

const UNSAFE_DEFAULTS: Record<string, string[]> = {
  JWT_SECRET: ["root-mvp-secret-change-in-production", "CHANGE_ME_USE_STRONG_RANDOM_SECRET"],
  NEXT_PUBLIC_APP_URL: ["http://localhost:3000"],
  EMAIL_FROM: ["onboarding@resend.dev"],
};

const MIN_JWT_SECRET_LENGTH = 32;

export function checkEnvVars() {
  const isProduction = process.env.NODE_ENV === "production";
  const missing: string[] = [];
  const unsafe: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  for (const [key, defaults] of Object.entries(UNSAFE_DEFAULTS)) {
    const val = process.env[key];
    if (val && defaults.some((d) => val.includes(d))) {
      unsafe.push(`${key} (기본/예시 값 사용 중)`);
    }
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    unsafe.push(`JWT_SECRET (${MIN_JWT_SECRET_LENGTH}자 미만 — 최소 ${MIN_JWT_SECRET_LENGTH}자 권장)`);
  }

  const hasIssue = missing.length > 0 || unsafe.length > 0;

  if (missing.length > 0) {
    console.warn(`\n⚠️  [ROOT] 필수 환경변수 누락:\n${missing.map((k) => `   - ${k}`).join("\n")}\n`);
  }
  if (unsafe.length > 0) {
    console.warn(`\n🚨 [ROOT] 안전하지 않은 환경변수:\n${unsafe.map((k) => `   - ${k}`).join("\n")}\n`);
  }

  if (isProduction && hasIssue) {
    console.error(
      "\n❌ [ROOT] 운영 환경(NODE_ENV=production)에서 환경변수 문제가 발견되어 서버를 시작할 수 없습니다.\n" +
        "   .env 파일을 확인하고 모든 값을 운영용으로 교체하세요.\n"
    );
    process.exit(1);
  }
}
