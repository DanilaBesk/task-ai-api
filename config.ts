import { z } from 'zod';
import { config } from 'dotenv';

config();

const portSchema = z.preprocess(
  (data) => parseInt(String(data), 10),
  z.number().min(0).max(65535)
);

export const CONFIG = z
  .object({
    APP_PORT: portSchema,
    APP_HOST: z.string(),
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    BASE_ADMIN_EMAIL: z.string().email(),
    BASE_ADMIN_PASSWORD: z.string(),
    NODE_ENV: z.enum(['development', 'production', 'test'])
  })
  .parse(process.env);
