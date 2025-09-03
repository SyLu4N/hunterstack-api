import 'dotenv/config';
import { z } from 'zod';

const envShcema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),

  SECRET_KEY_GEMINIAI: z.string(),
});

const _env = envShcema.safeParse(process.env);

if (_env.success === false) {
  console.error('❌ Variaveis ambientes inválidas', _env.error.format());

  throw new Error('Variaveis ambientes inválidas');
}

export const env = _env.data;
