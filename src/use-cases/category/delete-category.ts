import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';

import { ResourceNotFoundError } from '../@errors/resource-not-found-error';

interface DeleteCategoryUseCaseRequest {
  categoryId: number;
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: InterfaceCategoryRepository) {}

  async execute({ categoryId }: DeleteCategoryUseCaseRequest) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new ResourceNotFoundError('Categoria não encontrada.');

    await this.categoryRepository.delete(categoryId);

    return;
  }
}
