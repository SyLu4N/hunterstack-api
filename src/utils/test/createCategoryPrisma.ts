import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type Props = {
  data: Omit<Prisma.CategoryCreateInput, 'id'>;
};

export async function createCategoryPrismaTest({ data }: Props) {
  const category = await prisma.category.create({ data });

  return { category };
}
