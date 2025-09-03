import { env } from '@/env';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: env.SECRET_KEY_GEMINIAI,
});

export async function createChat(contents: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: { thinkingConfig: { thinkingBudget: 0 } },
    contents,
  });

  if (!response || !response.text) return null;

  let cleaned = response.text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}
