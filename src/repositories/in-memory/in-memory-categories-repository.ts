import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { FetchCategoriesQuery } from '@/@types/fetch-categories-query';
import { Prisma } from '@prisma/client';

import { InterfaceCategoryRepository } from '../@interface/interface-category-repository';

export class InMemoryCategoriesRepository
  implements InterfaceCategoryRepository
{
  public categories: CategoryWithAdditionalInfo[] = [];

  async create(data: Prisma.CategoryCreateInput) {
    const category = {
      ...data,
      id: this.categories.length + 1,

      createdAt: new Date(),
    } as CategoryWithAdditionalInfo;

    this.categories.push(category);

    return category;
  }

  async findFirst(name: string) {
    const category = this.categories.find((category) =>
      category.name.includes(name),
    );

    if (!category) return null;

    return category;
  }

  async findBySlug(categorySlug: string) {
    const category = this.categories.find(
      (category) => category.slug === categorySlug,
    );

    if (!category) return null;

    return category;
  }

  async findById(categoryId: number) {
    const category = this.categories.find(
      (category) => category.id === categoryId,
    );

    if (!category) return null;

    return category;
  }

  async findMany({ page, name }: FetchCategoriesQuery) {
    let categories = this.categories;

    if (name) {
      categories = categories.filter((policy) => policy.name.includes(name));
    }

    categories = categories.slice((page - 1) * 12, page * 12);

    return { categories, totalCount: this.categories.length };
  }

  async delete(categoryId: number) {
    this.categories = this.categories.filter(
      (category) => category.id !== categoryId,
    );
  }
}
