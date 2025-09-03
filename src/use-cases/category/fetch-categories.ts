import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { FetchCategoriesQuery } from '@/@types/fetch-categories-query';
import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';

import { BadRequestError } from '../@errors/bad-request-error';

interface FetchCategoriesUseCaseRequest {
  data: FetchCategoriesQuery;
}

interface FetchCategoriesUseCaseResponse {
  categories: CategoryWithAdditionalInfo[];
  totalCount: number;
}

export class FetchCategoriesUseCase {
  constructor(private categoryRepository: InterfaceCategoryRepository) {}

  async execute({
    data,
  }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    if (!data) throw new BadRequestError('Parametros inválidos.');

    const { categories, totalCount } = await this.categoryRepository.findMany({
      ...data,
    });

    return { categories, totalCount };
  }
}
