import { PolicyWithAdditionalInfo } from '@/@types/@policy-with-additional-info';
import { FetchPoliciesQuery } from '@/@types/fetch-policies-query';
import { Prisma } from '@prisma/client';

export interface InterfacePolicyRepository {
  create(data: Prisma.PolicyCreateInput): Promise<PolicyWithAdditionalInfo>;

  findById(policyId: number): Promise<PolicyWithAdditionalInfo | null>;
  findBySlug(policySlug: string): Promise<PolicyWithAdditionalInfo | null>;

  findMany({ page, title, orderByCreated }: FetchPoliciesQuery): Promise<{
    policies: PolicyWithAdditionalInfo[];
    totalCount: number;
  }>;

  update(
    policyId: number,
    data: Prisma.PolicyUncheckedUpdateInput,
  ): Promise<PolicyWithAdditionalInfo>;

  delete(policyId: number): Promise<void>;
}
