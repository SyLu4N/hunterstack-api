export type FetchPoliciesQuery = {
  page: number;
  title?: string;
  category?: string;
  search?: string;
  orderByCreated?: 'desc' | 'asc';
};
