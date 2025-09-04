import { PrismaPoliciesRepository } from '@/repositories/prisma/prisma-policies-repository';
import { ResourceNotFoundError } from '@/use-cases/@errors/resource-not-found-error';
import { GetBySlugPolicyUseCase } from '@/use-cases/policy/get-by-slug-policy';
import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestError } from 'openai';
import { z } from 'zod';

export async function getPolicy(req: FastifyRequest, res: FastifyReply) {
  const policyParamsSchema = z.object({
    slug: z.string({ invalid_type_error: 'SLUG do artigo inválida.' }),
  });

  const { slug } = policyParamsSchema.parse(req.params);

  const prismaPoliciesRepository = new PrismaPoliciesRepository();
  const getBySlugPolicyUseCase = new GetBySlugPolicyUseCase(
    prismaPoliciesRepository,
  );

  try {
    const { policy } = await getBySlugPolicyUseCase.execute({ slug });

    return res.status(200).send(policy);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).send({ message: error.message });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).send({ message: error.message });
    }

    throw error;
  }
}
