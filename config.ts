import { config } from 'dotenv';
import { z } from 'zod';

config();

const portSchema = z.preprocess(
  (data) => parseInt(String(data), 10),
  z.number().min(0).max(65535)
);

export const CONFIG = z
  .object({
    APP_PORT: portSchema,

    APP_BASE_ADMIN_EMAIL: z.string().email(),
    APP_BASE_ADMIN_PASSWORD: z.string(),

    APP_JWT_ACCESS_SECRET: z.string(),
    APP_JWT_REFRESH_SECRET: z.string(),

    OPENAI_API_KEY: z.string(),

    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: portSchema,
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),

    DATABASE_URL: z.string().url(),

    NODE_ENV: z.enum(['development', 'production', 'test'])
  })
  .parse(process.env);
