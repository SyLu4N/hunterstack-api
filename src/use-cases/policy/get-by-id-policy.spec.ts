import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { expect, describe, it, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { GetByIdPolicyUseCase } from './get-by-id-policy';

let policiesRepository: InMemoryPoliciesRepository;
let sut: GetByIdPolicyUseCase;

describe('GetByIdPolicyUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    sut = new GetByIdPolicyUseCase(policiesRepository);
  });

  it('Deve ser possível retornar a política pelo ID', async () => {
    const createdPolicy = await policiesRepository.create({
      title: 'Política A',
      description: 'Descrição A',
      source: 'Empresa X',
      category: { connect: { id: 1 } },
      slug: 'politica-a',
      createdAt: new Date(),
    });

    const { policy } = await sut.execute({ id: 1 });

    expect(policy).toEqual(
      expect.objectContaining({ id: createdPolicy.id, title: 'Política A' }),
    );
  });

  // ---

  it('Deve ser possível lançar ResourceNotFoundError se a política não for achada', async () => {
    await expect(sut.execute({ id: 999 })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  // ---

  it('Deve ser possível lançar BadRequestError se o ID não for fornecido', async () => {
    await expect(sut.execute({ id: 0 })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
