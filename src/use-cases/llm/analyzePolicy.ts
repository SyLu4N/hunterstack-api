import { ReturnLLM } from '@/@types/return-llm';
import { createChat } from '@/lib/gemini-ai';

import { BadRequestError } from '../@errors/bad-request-error';

export interface AnalizePolicyUseCaseRequest {
  text: string;
}

export class AnalizePolicyUseCase {
  async execute({ text }: AnalizePolicyUseCaseRequest): Promise<ReturnLLM> {
    if (!text || text.trim().length <= 100) {
      throw new BadRequestError('Texto inválido ou muito curto para análise.');
    }

    const contents = `Você é um organizador e reescritor de conteúdos.  
    Receberá um texto livre sobre políticas de segurança da informação.  
    Sua tarefa é:  

    1. Reescreva o conteúdo em linguagem clara, objetiva e informativa.  
    2. Para cada categoria, produza:  
      - Um artigo completo e complexo, com mínimo de 4 parágrafos.  
      - Inclua listas ou tópicos numerados sempre que fizer sentido.  
      - Inclua exemplos práticos de aplicação da política.  
      - Um resumo final, claro e objetivo, com **mínimo de 400 caracteres**, separado do artigo.  
    3. Estruture cada descrição em três partes:  
      - Explicação conceitual e prática da política (mínimo 4 parágrafos).  
      - Situações do dia a dia ou casos conhecidos onde essa prática é essencial (use listas se possível).  
      - No final, mencione a empresa do texto como exemplo ilustrativo.  

    4. Organize o texto em seções temáticas como: Governança, Gestão de Ativos, Proteção de Dados, Continuidade de Negócios, Conscientização, etc.  
    5. Retorne **apenas JSON válido**, no formato:  

    {
      "categories": [
        { 
          "title": "Título resumido do trecho", 
          "category": "nome da categoria", 
          "description": "artigo completo com parágrafos separados por \\n\\n e listas quando necessário", 
          "summary": "Um resumo (max. 250 caracteres)"
        }
      ],
      "source": "nome da empresa original (apenas nome, sem links)"
    }

    Importante:  
    - Use \\n\\n para indicar novas linhas/parágrafos no campo description.  
    - Para listas dentro do artigo, use - item ou 1. item.  
    - Retorne somente JSON puro, sem Markdown, comentários ou blocos de código.  
    - As descrições devem ser ricas, informativas e sempre trazer exemplos práticos.  

    Texto recebido:  
    ${text}`;

    const rawData = await createChat(contents);
    if (!rawData) {
      throw new BadRequestError('Nenhum dado retornado pela IA.');
    }

    const tryParse = (input: string): ReturnLLM['data'] | null => {
      try {
        return JSON.parse(input);
      } catch {
        return null;
      }
    };

    let parsed = tryParse(rawData);

    if (!parsed) {
      const prompt = `Retorne apenas JSON válido (sem blocos de código, comentários ou markdown):\n${rawData}`;
      const reformatted = await createChat(prompt);

      parsed = reformatted ? tryParse(reformatted) : null;
    }

    if (!parsed) {
      throw new BadRequestError(
        'Não foi possível converter a resposta da IA para JSON válido.',
      );
    }

    return { data: parsed };
  }
}
