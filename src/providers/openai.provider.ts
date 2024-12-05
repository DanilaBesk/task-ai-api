import OpenAI from 'openai';
import { CONFIG } from '#config';

export const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
  baseURL: 'https://bothub.chat/api/v2/openai/v1'
});
