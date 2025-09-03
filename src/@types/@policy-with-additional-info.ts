import { Policy, Category } from '@prisma/client';

export interface PolicyWithAdditionalInfo extends Policy {
  category: Category;
}
