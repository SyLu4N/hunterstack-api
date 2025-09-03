import { InterfaceCategoryRepository } from '@/repositories/@interface/interface-category-repository';
import { InterfacePolicyRepository } from '@/repositories/@interface/interface-policy-repository';
import { generateSlug } from '@/utils/generate-slug';
import { Policy, Prisma } from '@prisma/client';

type PolicyWithCategory = Omit<Prisma.PolicyCreateInput, 'category'> & {
  category: string;
};

interface CreatePolicyUseCaseRequest {
  data: PolicyWithCategory;
}

interface CreatePolicyUseCaseResponse {
  policy: Policy;
}

export class CreatePolicyUseCase {
  constructor(
    private policyRepository: InterfacePolicyRepository,
    private categoryRepository: InterfaceCategoryRepository,
  ) {}

  async execute({
    data,
  }: CreatePolicyUseCaseRequest): Promise<CreatePolicyUseCaseResponse> {
    const category = await this.categoryRepository.findFirst(data.category);

    const policy = await this.policyRepository.create({
      ...data,
      category: category
        ? { connect: { id: category.id } }
        : {
            create: { name: data.category, slug: generateSlug(data.category) },
          },
    });

    return { policy };
  }
}
