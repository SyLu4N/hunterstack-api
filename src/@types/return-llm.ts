export type CategoriaLLM = {
  title: string;
  category: string;
  description: string;
  summary: string;
};

export type ReturnLLM = {
  data: {
    categories: CategoriaLLM[];
    source: string;
  };
};
