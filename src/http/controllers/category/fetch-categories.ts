import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { FetchCategoriesUseCase } from '@/use-cases/category/fetch-categories';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function fetchCategories(req: FastifyRequest, res: FastifyReply) {
  const fetchQuerysSchema = z.object({
    page: z.coerce.number().default(1),

    name: z
      .string({ invalid_type_error: 'Nome da categoria inválido.' })
      .optional(),

    orderByCreated: z
      .enum(['asc', 'desc'], { invalid_type_error: 'Ordenação inválida.' })
      .optional(),
  });

  const data = fetchQuerysSchema.parse(req.query);

  const prismaPoliciesRepository = new PrismaCategoriesRepository();
  const fetchPoliciesUseCase = new FetchCategoriesUseCase(
    prismaPoliciesRepository,
  );

  try {
    const { categories, totalCount } = await fetchPoliciesUseCase.execute({
      data,
    });

    return res.status(200).send({ categories, totalCount });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    throw error;
  }
}
