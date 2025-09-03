import { CategoryWithAdditionalInfo } from '@/@types/@category-with-additional-info';
import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface GetBySlugCategoryUseCaseRequest {
  categorySlug: string;
}

interface GetBySlugCategoryUseCaseResponse {
  category: CategoryWithAdditionalInfo | null;
}

export class GetBySlugCategoryUseCase {
  constructor(private categoryRepository: InterfaceCategoryRepository) {}

  async execute({
    categorySlug,
  }: GetBySlugCategoryUseCaseRequest): Promise<GetBySlugCategoryUseCaseResponse> {
    if (!categorySlug) throw new BadRequestError('Slug da categoria inválido.');

    const category = await this.categoryRepository.findBySlug(categorySlug);
    if (!category) throw new ResourceNotFoundError('Categoria não encontrada.');

    return { category };
  }
}
