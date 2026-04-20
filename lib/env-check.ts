/**
 * 필수 환경변수가 설정되었는지 서버 시작 시 검증
 * 누락된 변수가 있으면 경고 로그 출력
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

export function checkEnvVars() {
  const isProduction = process.env.NODE_ENV === "production";
  const missing: string[] = [];
  const unsafe: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (isProduction) {
    for (const [key, defaults] of Object.entries(UNSAFE_DEFAULTS)) {
      const val = process.env[key];
      if (val && defaults.some((d) => val.includes(d))) {
        unsafe.push(`${key} (운영 환경에서 기본값 사용 중)`);
      }
    }
  }

  if (missing.length > 0) {
    console.warn(`\n⚠️  [ROOT] 필수 환경변수 누락:\n${missing.map((k) => `   - ${k}`).join("\n")}\n`);
  }

  if (unsafe.length > 0) {
    console.warn(`\n🚨 [ROOT] 운영 환경에서 안전하지 않은 환경변수:\n${unsafe.map((k) => `   - ${k}`).join("\n")}\n`);
  }
}
