import { z } from "zod";
import { config } from "dotenv";

config();

const portSchema = z.preprocess(
  (data) => parseInt(String(data), 10),
  z.number().min(0).max(65535)
);

export const CONFIG = z
  .object({
    APP_PORT: portSchema,
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
  })
  .parse(process.env);
