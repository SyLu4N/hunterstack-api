import { PrismaPoliciesRepository } from '@/repositories/prisma/prisma-policies-repository';
import { FetchPoliciesUseCase } from '@/use-cases/policy/fetch-policies';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function fetchPolicies(req: FastifyRequest, res: FastifyReply) {
  const fetchQuerysSchema = z.object({
    page: z.coerce.number().default(1),
    title: z.string({ invalid_type_error: 'Título inválido.' }).optional(),

    search: z
      .string({ invalid_type_error: 'Parametro "Texto" inválido.' })
      .optional(),

    slug: z
      .string({ invalid_type_error: 'Slug da política inválida.' })
      .optional(),

    category: z
      .string({ invalid_type_error: 'Categoria inválida.' })
      .optional(),

    orderByCreated: z
      .enum(['asc', 'desc'], { invalid_type_error: 'Ordenação inválida.' })
      .optional(),
  });

  const data = fetchQuerysSchema.parse(req.query);

  const prismaPoliciesRepository = new PrismaPoliciesRepository();
  const fetchPoliciesUseCase = new FetchPoliciesUseCase(
    prismaPoliciesRepository,
  );

  try {
    const { policies, totalCount } = await fetchPoliciesUseCase.execute({
      data,
    });

    return res.status(200).send({ policies, totalCount });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    throw error;
  }
}
