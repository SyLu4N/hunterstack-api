import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { FetchCategoriesQuery } from '@/@types/fetch-categories-query';
import { Prisma } from '@prisma/client';

export interface InterfaceCategoryRepository {
  create(data: Prisma.CategoryCreateInput): Promise<CategoryWithAdditionalInfo>;

  findFirst(categoryName: string): Promise<CategoryWithAdditionalInfo | null>;
  findBySlug(categorySlug: string): Promise<CategoryWithAdditionalInfo | null>;
  findById(categoryId: number): Promise<CategoryWithAdditionalInfo | null>;

  findMany({ page, name, orderByCreated }: FetchCategoriesQuery): Promise<{
    categories: CategoryWithAdditionalInfo[];
    totalCount: number;
  }>;

  delete(categoryId: number): Promise<void>;
}
