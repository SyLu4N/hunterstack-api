import { InMemoryCategoriesRepository } from '@/repositories/in-memory/in-memory-categories-repository';
import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { describe, it, expect, beforeEach } from 'vitest';

import { CreatePolicyUseCase } from './create-policy';

let policyRepository: InMemoryPoliciesRepository;
let categoryRepository: InMemoryCategoriesRepository;
let sut: CreatePolicyUseCase;

describe('CreatePolicyUseCase', () => {
  beforeEach(() => {
    policyRepository = new InMemoryPoliciesRepository();
    categoryRepository = new InMemoryCategoriesRepository();
    sut = new CreatePolicyUseCase(policyRepository, categoryRepository);
  });

  it('Deve ser possível criar uma política conectando a categoria existente', async () => {
    const existingCategory = await categoryRepository.create({
      name: 'Segurança da Informação',
    } as any);

    const { policy } = await sut.execute({
      data: {
        title: 'Política de Backup',
        slug: 'politica-de-backup',
        summary: 'Descrição resumida da policym de backup',
        description: 'Descrição detalhada da política de backup',
        source: 'Empresa XYZ',
        category: 'Segurança da Informação',
      },
    });

    expect(policy).toEqual(
      expect.objectContaining({
        title: 'Política de Backup',
        category: { connect: { id: existingCategory.id } } as any,
      }),
    );
  });
});
