import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { expect, describe, it, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { UpdatePolicyUseCase } from './update-policy';

let policiesRepository: InMemoryPoliciesRepository;
let sut: UpdatePolicyUseCase;

describe('UpdatePolicyUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    sut = new UpdatePolicyUseCase(policiesRepository);
  });

  it('Deve ser possível atualizar uma política existente', async () => {
    const policy = await policiesRepository.create({
      title: 'Política Teste',
      description: 'Descrição antiga',
      source: 'Empresa Exemplo',
      category: { connect: { id: 1 } },
      slug: 'politica-teste',
      createdAt: new Date(),
    });

    const { policy: updatedPolicy } = await sut.execute({
      id: policy.id,
      data: { description: 'Descrição atualizada' },
    });

    expect(updatedPolicy.description).toBe('Descrição atualizada');
    expect(updatedPolicy.title).toBe(policy.title);
  });

  // ---

  it('Deve lançar BadRequestError se o ID não for informado', async () => {
    await expect(() =>
      sut.execute({ id: 0, data: { description: 'Descrição' } }),
    ).rejects.toThrow(BadRequestError);
  });

  // ---

  it('Deve lançar BadRequestError se os dados não forem informados', async () => {
    const policy = await policiesRepository.create({
      title: 'Política Teste 2',
      description: 'Descrição',
      source: 'Empresa Exemplo',
      category: { connect: { id: 1 } },
      slug: 'politica-teste-2',
      createdAt: new Date(),
    });

    await expect(() =>
      // @ts-expect-error: Testando cenário inválido
      sut.execute({ id: policy.id, data: null }),
    ).rejects.toThrow(BadRequestError);
  });

  // ---

  it('Deve lançar ResourceNotFoundError se a política não existir', async () => {
    await expect(() =>
      sut.execute({ id: 999, data: { description: 'Nova descrição' } }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
