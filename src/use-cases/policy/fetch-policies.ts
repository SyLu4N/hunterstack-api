import { PolicyWithAdditionalInfo } from '@/@types/@policy-with-additional-info';
import { FetchPoliciesQuery } from '@/@types/fetch-policies-query';
import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';

import { BadRequestError } from '../@errors/bad-request-error';

interface FetchPoliciesUseCaseRequest {
  data: FetchPoliciesQuery;
}

interface FetchPoliciesUseCaseResponse {
  policies: PolicyWithAdditionalInfo[];
  totalCount: number;
}

export class FetchPoliciesUseCase {
  constructor(private policyRepository: InterfacePolicyRepository) {}

  async execute({
    data,
  }: FetchPoliciesUseCaseRequest): Promise<FetchPoliciesUseCaseResponse> {
    if (!data) throw new BadRequestError('Parametros inválidos.');

    const { policies, totalCount } = await this.policyRepository.findMany({
      ...data,
    });

    return { policies, totalCount };
  }
}
