import { FetchCategoriesQuery } from '@/@types/fetch-categories-query';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

import { InterfaceCategoryRepository } from '../@interface/interface-category-repository';

const select: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
};

export class PrismaCategoriesRepository implements InterfaceCategoryRepository {
  async create(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({ data, select });

    return category;
  }

  async findFirst(categoryName: string) {
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
      select,
    });

    return category;
  }

  async findById(categoryId: number) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select,
    });

    return category;
  }

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      select,
    });

    return category;
  }

  async findMany({ page, name, orderByCreated }: FetchCategoriesQuery) {
    const where: Prisma.CategoryWhereInput = {};
    const orderBy: Prisma.CategoryOrderByWithRelationInput[] = [];

    const skip = (page - 1) * 12;
    const take = 12;

    if (name) where.name = { contains: name };
    if (orderByCreated) orderBy.push({ createdAt: orderByCreated });

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        skip,
        take,
        select,
        where,
        orderBy,
      }),

      prisma.category.count({ where }),
    ]);

    return { categories, totalCount };
  }

  async update(categoryId: number, data: Prisma.CategoryUncheckedUpdateInput) {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
      select,
    });

    return category;
  }

  async delete(categoryId: number) {
    await prisma.category.delete({ where: { id: categoryId } });
  }
}
