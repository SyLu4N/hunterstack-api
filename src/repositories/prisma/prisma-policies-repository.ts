import { FetchPoliciesQuery } from '@/@types/fetch-policies-query';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { InterfacePolicyRepository } from '../@interface/interface-policy-repository';

const include: Prisma.PolicyInclude = {
  category: true,
};

export class PrismaPoliciesRepository implements InterfacePolicyRepository {
  async create(data: Prisma.PolicyCreateInput) {
    const policy = await prisma.policy.create({ data, include });

    return policy;
  }

  async findById(policyId: number) {
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include,
    });

    return policy;
  }

  async findBySlug(slug: string) {
    const policy = await prisma.policy.findUnique({
      where: { slug },
      include,
    });

    return policy;
  }

  async findMany({
    page,
    category,
    title,
    search,
    orderByCreated,
  }: FetchPoliciesQuery) {
    const where: Prisma.PolicyWhereInput = {};
    const orderBy: Prisma.PolicyOrderByWithRelationInput[] = [];

    const skip = (page - 1) * 12;
    const take = 12;

    if (title) where.title = { contains: title };
    if (category) where.category = { slug: { equals: category } };

    if (orderByCreated) orderBy.push({ createdAt: orderByCreated });

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [policies, totalCount] = await Promise.all([
      prisma.policy.findMany({
        skip,
        take,
        include,
        where,
        orderBy,
      }),

      prisma.policy.count({ where }),
    ]);

    return { policies, totalCount };
  }

  async update(policyId: number, data: Prisma.PolicyUncheckedUpdateInput) {
    const policy = await prisma.policy.update({
      where: { id: policyId },
      data,
      include,
    });

    return policy;
  }

  async delete(policyId: number) {
    await prisma.policy.delete({ where: { id: policyId } });
  }
}
