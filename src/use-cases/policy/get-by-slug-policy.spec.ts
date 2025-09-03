import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { expect, describe, it, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { GetBySlugPolicyUseCase } from './get-by-slug-policy';

let policiesRepository: InMemoryPoliciesRepository;
let sut: GetBySlugPolicyUseCase;

describe('GetBySlugPolicyUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    sut = new GetBySlugPolicyUseCase(policiesRepository);
  });

  it('Deve ser possível retornar uma política pelo slug', async () => {
    const createdPolicy = await policiesRepository.create({
      title: 'Política de Segurança',
      description: 'Descrição da política',
      source: 'Esri Portugal',
      summary: 'Descrição resumida da policym de backup',
      slug: 'politica-de-seguranca',
      createdAt: new Date(),
      category: { connect: { id: 1 } },
    });

    const { policy } = await sut.execute({ slug: 'politica-de-seguranca' });

    expect(policy).toEqual(
      expect.objectContaining({
        id: createdPolicy.id,
        title: createdPolicy.title,
      }),
    );
  });

  // ---

  it('Deve ser possível lançar ResourceNotFoundError se não for encontrada a política', async () => {
    await expect(() =>
      sut.execute({ slug: 'NOT-EXISTING' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  // ---

  it('Deve ser possível lançar BadRequestError se slug não for informado', async () => {
    await expect(() => sut.execute({ slug: '' })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
