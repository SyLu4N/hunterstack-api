import { PrismaCategoriesRepository } from '@/repositories/prisma/prisma-categories-repository';
import { PrismaPoliciesRepository } from '@/repositories/prisma/prisma-policies-repository';
import { AnalizePolicyUseCase } from '@/use-cases/llm/analyzePolicy';
import { CreatePolicyUseCase } from '@/use-cases/policy/create-policy';
import { GetBySlugPolicyUseCase } from '@/use-cases/policy/get-by-slug-policy';
import { ScrapePolicyUseCase } from '@/use-cases/scrape/scrape-policy';
import { SacrapingAndPostingUseCase } from '@/use-cases/scrape/scraping-and-posting';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function scrapingAndPosting(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const ScrapeQuerySchema = z.object({
    url: z.string({ invalid_type_error: 'URL do artigo inválida.' }).url({
      message: 'URL do artigo inválida',
    }),
  });

  const { url } = ScrapeQuerySchema.parse(req.query);

  const prismaPoliciesRepository = new PrismaPoliciesRepository();
  const prismaCategoryRepository = new PrismaCategoriesRepository();

  const createPolicyUseCase = new CreatePolicyUseCase(
    prismaPoliciesRepository,
    prismaCategoryRepository,
  );

  const getBySlugPolicyUseCase = new GetBySlugPolicyUseCase(
    prismaPoliciesRepository,
  );

  const scrapePolicyUseCase = new ScrapePolicyUseCase();
  const analyzePolicyUseCase = new AnalizePolicyUseCase();
  const scrapingAndPosting = new SacrapingAndPostingUseCase(
    createPolicyUseCase,
    scrapePolicyUseCase,
    analyzePolicyUseCase,
    getBySlugPolicyUseCase,
  );

  try {
    await scrapingAndPosting.execute({ url });

    return res.status(201).send(null);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    throw error;
  }
}
