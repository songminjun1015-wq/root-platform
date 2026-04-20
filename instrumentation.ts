export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { checkEnvVars } = await import("@/lib/env-check");
    checkEnvVars();
  }
}
