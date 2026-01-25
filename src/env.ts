import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_BACKEND_BASE_URL: z.string().url().default("http://localhost:8080"),
});

// Validation
const _env = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;