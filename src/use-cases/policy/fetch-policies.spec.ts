import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { expect, describe, it, beforeEach } from 'vitest';

import { BadRequestError } from '../@errors/bad-request-error';
import { FetchPoliciesUseCase } from './fetch-policies';

let policiesRepository: InMemoryPoliciesRepository;
let sut: FetchPoliciesUseCase;

describe('FetchPoliciesUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    sut = new FetchPoliciesUseCase(policiesRepository);
  });

  it('Deve ser possível retornar todas as políticas', async () => {
    await policiesRepository.create({
      title: 'Política A',
      description: 'Descrição A',
      source: 'Empresa X',
      category: { connect: { id: 1 } },
      slug: 'politica-a',
      createdAt: new Date(),
    });

    await policiesRepository.create({
      title: 'Política B',
      description: 'Descrição B',
      source: 'Empresa Y',
      category: { connect: { id: 2 } },
      slug: 'politica-b',
      createdAt: new Date(),
    });

    const { policies, totalCount } = await sut.execute({ data: { page: 1 } });

    expect(policies.length).toBe(2);
    expect(totalCount).toBe(2);
    expect(policies[0].title).toBe('Política A');
    expect(policies[1].title).toBe('Política B');
  });

  // ---

  it('Deve ser possível filtrar as políticas pelo título', async () => {
    await policiesRepository.create({
      title: 'Segurança de Rede',
      description: 'Descrição A',
      source: 'Empresa X',
      category: { connect: { id: 1 } },
      slug: 'seguranca-de-rede',
      createdAt: new Date(),
    });

    await policiesRepository.create({
      title: 'Backup e Continuidade',
      description: 'Descrição B',
      source: 'Empresa Y',
      category: { connect: { id: 2 } },
      slug: 'backup-e-continuidade',
      createdAt: new Date(),
    });

    const { policies, totalCount } = await sut.execute({
      data: { page: 1, title: 'Rede' },
    });

    expect(policies.length).toBe(1);
    expect(totalCount).toBe(2);
    expect(policies[0].title).toBe('Segurança de Rede');
  });

  // ---

  it('Deve ser possível lançar BadRequestError se os parâmetros forem inválidos', async () => {
    await expect(sut.execute({ data: null as any })).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
