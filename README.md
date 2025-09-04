# Hunterstack.io

Projeto para consultar e coletar políticas de segurança da informação.

---

## Front-End Demo
Demonstração resumida do projeto:

<p align="center">
  <img src="./readme/entireProject.gif" alt="Front-end da aplicação." />
</p>

---

## Features

✅ Backend estruturado (Node.js)  
✅ Testes unitários  
✅ Testes E2E  
✅ Scraping de políticas de segurança da informação (Puppeteer)  
✅ Tratamento dos dados via LLM (Gemini.ai)  
✅ Armazenamento das políticas categorizadas em PostgreSQL  
✅ Disponibilização de API para consulta (Fastify)  
✅ Opção de exportar uma política como PDF  
✅ Documentação da API (Swagger UI)  
✅ CRUD das políticas  
✅ CRUD das categorias  

---

## Deploy

- [Acessar o projeto na Vercel](https://hunterstack.vercel.app/)  
> OBS: Back-end está deployado na Render. A versão gratuita apresenta delay de ~50s por inatividade.

- [Acessar o backend](https://hunterstack-api.onrender.com/)  
> OBS: Back-end está deployado na Render. A versão gratuita apresenta delay de ~50s por inatividade.

---

## Apresentação detalhada
<p align="center">
  <img src="./readme/structure.gif" alt="Estrutura do código" />
  <img src="./readme/testeE2e.gif" alt="Testes E2E" />
  <img src="./readme/docs.gif" alt="Documentação da API" />
</p>

---

## Tecnologias Utilizadas

- Node.js  
- Fastify  
- Prisma  
- Puppeteer  
- Swagger UI  
- Vitest  
- PostgreSQL  
- Docker / Docker Compose  
- LLM  

---

## Clonar o projeto

```bash
git clone https://github.com/SyLu4N/hunterstack-api.git
```

## Iniciar o projeto

```bash
# Instalar dependências
npm install           

# Subir as bases de dados com Docker
docker-compose up -d  

# Aplicar migrations do Prisma e criar o banco
npx prisma migrate dev --name init  

# (Opcional) Popular o banco com dados iniciais
npx prisma db seed  

# Rodar o servidor em modo desenvolvimento
npm run dev
```

Rotas Insomnia

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Routes%20Hunterstack&uri=https%3A%2F%2Fgithub.com%2FSyLu4N%2Fhunterstack-api%2Fblob%2Fmain%2Freadme%2FroutsHuntestack.yaml)
