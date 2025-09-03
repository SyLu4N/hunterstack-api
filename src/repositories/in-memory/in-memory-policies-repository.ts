import { PolicyWithAdditionalInfo } from '@/@types/@policy-with-additional-info';
import { FetchPoliciesQuery } from '@/@types/fetch-policies-query';
import { generateSlug } from '@/utils/generate-slug';
import { Prisma } from '@prisma/client';

import { InterfacePolicyRepository } from '../@interface/interface-policy-repository';

export class InMemoryPoliciesRepository implements InterfacePolicyRepository {
  public policies: PolicyWithAdditionalInfo[] = [];

  async create(data: Prisma.PolicyCreateInput) {
    const slug = generateSlug(data.title);

    const policy = {
      ...data,
      id: this.policies.length + 1,
      slug,
      createdAt: new Date(),
    } as PolicyWithAdditionalInfo;

    this.policies.push(policy);

    return policy;
  }

  async findById(policyId: number) {
    const policy = this.policies.find((policy) => policy.id === policyId);
    if (!policy) return null;

    return policy;
  }

  async findBySlug(slug: string) {
    const policy = this.policies.find((policy) => policy.slug === slug);
    if (!policy) return null;

    return policy;
  }

  async findMany({ page, title }: FetchPoliciesQuery) {
    let policies = this.policies;

    if (title) {
      policies = policies.filter((policy) => policy.title.includes(title));
    }

    policies = policies.slice((page - 1) * 12, page * 12);

    return { policies, totalCount: this.policies.length };
  }

  async update(policyId: number, data: Prisma.PolicyUncheckedUpdateInput) {
    const policyIndex = this.policies.findIndex(
      (policy) => policy.id === policyId,
    );
    const policiestorage = this.policies.find(
      (policy) => policy.id === policyId,
    );

    const policy = { ...policiestorage, ...data } as PolicyWithAdditionalInfo;
    this.policies.splice(policyIndex, 1, policy);

    return policy;
  }

  async delete(policyId: number) {
    this.policies = this.policies.filter((policy) => policy.id !== policyId);
  }
}
