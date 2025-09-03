import { InMemoryPoliciesRepository } from '@/repositories/in-memory/in-memory-policies-repository';
import { expect, describe, it, beforeEach } from 'vitest';

import { ResourceNotFoundError } from '../@errors/resource-not-found-error';
import { DeletePolicyUseCase } from './delete-policy';

let policiesRepository: InMemoryPoliciesRepository;
let sut: DeletePolicyUseCase;

describe('DeletePolicyUseCase', () => {
  beforeEach(() => {
    policiesRepository = new InMemoryPoliciesRepository();
    sut = new DeletePolicyUseCase(policiesRepository);
  });

  it('Deve ser possível deletar uma política existente', async () => {
    const policy = await policiesRepository.create({
      title: 'Política Teste',
      description: 'Descrição da política',
      source: 'Empresa Exemplo',
      category: { connect: { id: 1 } },
      slug: 'politica-teste',
      createdAt: new Date(),
    });

    await sut.execute({ policyId: policy.id });

    const deletedPolicy = await policiesRepository.findById(policy.id);
    expect(deletedPolicy).toBeNull();
  });

  // ---

  it('Deve lançar ResourceNotFoundError ao tentar deletar uma política inexistente', async () => {
    await expect(() => sut.execute({ policyId: 999 })).rejects.toThrow(
      ResourceNotFoundError,
    );
  });
});
