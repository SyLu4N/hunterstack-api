import { Policy, Category } from '@prisma/client';

export interface CategoryWithAdditionalInfo extends Category {
  policies: Policy[];
}
