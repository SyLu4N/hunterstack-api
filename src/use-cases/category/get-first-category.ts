import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';

import { BadRequestError } from '../@errors/bad-request-error';

interface GetFirstCategoryUseCaseRequest {
  categoryName: string;
}

interface GetFirstCategoryUseCaseResponse {
  category: CategoryWithAdditionalInfo | null;
}

export class GetFirstCategoryUseCase {
  constructor(private categoryRepository: InterfaceCategoryRepository) {}

  async execute({
    categoryName,
  }: GetFirstCategoryUseCaseRequest): Promise<GetFirstCategoryUseCaseResponse> {
    if (!categoryName) throw new BadRequestError('Nome da categoria inválido.');

    const category = await this.categoryRepository.findFirst(categoryName);

    return { category };
  }
}
