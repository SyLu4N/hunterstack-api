import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface GetByIdCategoryUseCaseRequest {
  categoryId: number;
}

interface GetByIdCategoryUseCaseResponse {
  category: CategoryWithAdditionalInfo | null;
}

export class GetByIdCategoryUseCase {
  constructor(private categoryRepository: InterfaceCategoryRepository) {}

  async execute({
    categoryId,
  }: GetByIdCategoryUseCaseRequest): Promise<GetByIdCategoryUseCaseResponse> {
    if (!categoryId) throw new BadRequestError('ID da categoria inválido.');

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new ResourceNotFoundError('Categoria não encontrada.');

    return { category };
  }
}
