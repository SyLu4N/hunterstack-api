import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';
import { Policy } from '@prisma/client';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface GetBySlugPolicyUseCaseRequest {
  slug: string;
}

interface GetBySlugPolicyUseCaseResponse {
  policy: Policy | null;
}

export class GetBySlugPolicyUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({
    slug,
  }: GetBySlugPolicyUseCaseRequest): Promise<GetBySlugPolicyUseCaseResponse> {
    if (!slug) throw new BadRequestError('Slug inválido.');

    const policy = await this.policyRepository.findBySlug(slug);
    if (!policy) throw new ResourceNotFoundError('Política não encontrada.');

    return { policy };
  }
}
