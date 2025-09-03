export type CategoriaLLM = {
  category: string;
  description: string;
  title: string;
};

export type ReturnLLM = {
  data: {
    categories: CategoriaLLM[];
    source: string;
  };
};
