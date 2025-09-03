import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type Props = {
  data: Omit<Prisma.PolicyCreateInput, 'id'>;
};

export async function createPolicyPrismaTest({ data }: Props) {
  const policy = await prisma.policy.create({ data });

  return { policy };
}
