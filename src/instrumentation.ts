import { env } from "./env";

type GlobalWithSharepayEnvLog = typeof globalThis & {
  __sharepay_env_loaded_logged__?: boolean;
};

export function register() {
  const g = globalThis as GlobalWithSharepayEnvLog;
  if (g.__sharepay_env_loaded_logged__) return;
  g.__sharepay_env_loaded_logged__ = true;

  console.log("✅ Env loaded", {
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_BACKEND_BASE_URL: env.NEXT_PUBLIC_BACKEND_BASE_URL,
  });
}
