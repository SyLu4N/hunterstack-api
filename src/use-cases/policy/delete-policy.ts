import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';

import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface DeletePolicyUseCaseRequest {
  policyId: number;
}

export class DeletePolicyUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({ policyId }: DeletePolicyUseCaseRequest) {
    const policy = await this.policyRepository.findById(policyId);
    if (!policy) throw new ResourceNotFoundError('Política não encontrada.');

    await this.policyRepository.delete(policyId);

    return;
  }
}
