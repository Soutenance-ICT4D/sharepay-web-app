import { z } from "zod";

const envSchema = z.object({
  // Variables Serveur (cachées)
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // Variables Client (visibles, préfixées par NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL: z.string().url().default("http://localhost:8080"),
});
// Validation
// process.env contient tes variables, safeParse vérifie si elles respectent le schéma
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;