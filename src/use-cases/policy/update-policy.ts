import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';
import { Policy, Prisma } from '@prisma/client';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface UpdatePolicyUseCaseRequest {
  id: number;
  data: Prisma.PolicyUncheckedUpdateInput;
}

interface UpdatePolicyUseCaseResponse {
  policy: Policy;
}

export class UpdatePolicyUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({
    data,
    id,
  }: UpdatePolicyUseCaseRequest): Promise<UpdatePolicyUseCaseResponse> {
    if (!id) throw new BadRequestError('ID da política inválido.');
    if (!data) throw new BadRequestError('Política inválida.');

    const policyExists = await this.policyRepository.findById(id);
    if (!policyExists) {
      throw new ResourceNotFoundError('Política não encontrada.');
    }

    const policy = await this.policyRepository.update(id, data);

    return { policy };
  }
}
