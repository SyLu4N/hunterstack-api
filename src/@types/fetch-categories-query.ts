export type FetchCategoriesQuery = {
  page: number;
  name?: string;
  orderByCreated?: 'desc' | 'asc';
};
