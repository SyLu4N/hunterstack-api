import { generateSlug } from '@/utils/generate-slug';
import { Policy } from '@prisma/client';

import { BadRequestError } from '../@errors/bad-request-error';
import { AnalizePolicyUseCase } from '../llm/analyzePolicy';
import { CreatePolicyUseCase } from '../policy/create-policy';
import { GetBySlugPolicyUseCase } from '../policy/get-by-slug-policy';
import { ScrapePolicyUseCase } from './scrape-policy';

interface SacrapingAndPostingUseCaseRequest {
  url: string;
}

interface SacrapingAndPostingUseCaseResponse {
  policies: Policy[];
}

export class SacrapingAndPostingUseCase {
  constructor(
    private createPolicyUseCase: CreatePolicyUseCase,
    private scrapePolicyUseCase: ScrapePolicyUseCase,
    private analyzePolicyUseCase: AnalizePolicyUseCase,
    private getBySlugPolicyUseCase: GetBySlugPolicyUseCase,
  ) {}

  async execute({
    url,
  }: SacrapingAndPostingUseCaseRequest): Promise<SacrapingAndPostingUseCaseResponse> {
    const { text } = await this.scrapePolicyUseCase.execute({ url });
    if (!text || text.trim().length <= 100) {
      throw new BadRequestError('Artigo inválido ou muito curto para análise.');
    }

    const { data } = await this.analyzePolicyUseCase.execute({
      text,
    });

    const { categories, source } = data;

    if (!categories || !categories.length) {
      throw new BadRequestError('Nenhuma Categoria encontrada.');
    }

    if (!source) {
      throw new BadRequestError('Fonte do artigo não encontrada.');
    }

    const policies = [];

    for (const policy of categories) {
      const slug = generateSlug(policy.title);

      try {
        const policyExists = await this.getBySlugPolicyUseCase.execute({
          slug,
        });

        if (policyExists.policy) {
          policies.push(policyExists.policy);
          continue;
        }
      } catch {
        // ignore
      }

      const newPolicy = await this.createPolicyUseCase.execute({
        data: { ...policy, source: source, slug },
      });

      policies.push(newPolicy.policy);
    }

    return { policies };
  }
}
