import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';
import { Policy } from '@prisma/client';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface GetByIdPolicyUseCaseRequest {
  id: number;
}

interface GetByIdPolicyUseCaseResponse {
  policy: Policy;
}

export class GetByIdPolicyUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({
    id,
  }: GetByIdPolicyUseCaseRequest): Promise<GetByIdPolicyUseCaseResponse> {
    if (!id) throw new BadRequestError('ID inválido.');

    const policy = await this.policyRepository.findById(id);

    if (!policy) {
      throw new ResourceNotFoundError('Política não encontrada.');
    }

    return { policy };
  }
}
