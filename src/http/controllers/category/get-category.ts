import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found-error';
import { GetBySlugCategoryUseCase } from '@/use-cases/category/get-by-slug-category';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function getCategory(req: FastifyRequest, res: FastifyReply) {
  const categoryParamsSchema = z.object({
    slug: z.string({ invalid_type_error: 'Slug da categoria inválida.' }),
  });

  const { slug } = categoryParamsSchema.parse(req.params);

  const prismaCategoriesRepository = new PrismaCategoriesRepository();
  const getBySlugCategoryUseCase = new GetBySlugCategoryUseCase(
    prismaCategoriesRepository,
  );

  try {
    const { category } = await getBySlugCategoryUseCase.execute({
      categorySlug: slug,
    });

    return res.status(200).send(category);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(400).send({ message: error.message });
    }

    throw error;
  }
}
