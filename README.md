# Dashboard Financeiro

Um dashboard financeiro brasileiro com tema escuro, rastreamento de gastos e visualizações de dados.

## Funcionalidades

- 📊 Dashboard financeiro em tempo real
- 💰 Rastreamento de receitas e gastos
- 📈 Gráficos de pizza e barras para análise visual
- 🎨 Interface escura e responsiva
- 💾 Armazenamento em memória com dados iniciais brasileiros

## Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Gráficos**: Recharts
- **Componentes**: Shadcn/ui, Radix UI
- **Backend**: Node.js, Express.js
- **Build**: Vite

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## Deploy no Vercel

### Opção 1: Deploy Automático via GitHub

1. Faça push do código para um repositório GitHub
2. Conecte o repositório no Vercel
3. O Vercel detectará automaticamente a configuração

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para produção
vercel --prod
```

### Configuração do Vercel

O projeto inclui um `vercel.json` configurado com:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **API Routes**: Funções serverless em `/api`
- **Static Files**: Arquivos estáticos servidos do build

### Variáveis de Ambiente

Não são necessárias variáveis de ambiente para a versão com armazenamento em memória.

Para usar banco de dados PostgreSQL (opcional):
- `DATABASE_URL`: URL de conexão do PostgreSQL

## Estrutura da API

### Endpoints Disponíveis

- `GET /api/dashboard` - Buscar dados do dashboard
- `PUT /api/financial-data` - Atualizar dados financeiros
- `PUT /api/expense-categories` - Atualizar categorias de gastos
- `PUT /api/monthly-summary` - Atualizar resumo mensal

### Formato dos Dados

```json
{
  "financialData": {
    "monthStartSalary": "3700.00",
    "monthStartFgts": "200.00",
    "netTotal": "9876.31",
    "remainingBalance": "2631.31"
  },
  "expenseCategories": [
    {
      "categoryType": "essential",
      "percentage": 70,
      "plannedAmount": "5569.20",
      "actualAmount": "5344.54",
      "budgetStatus": "under"
    }
  ],
  "monthlySummary": {
    "totalPlanned": "7245.00",
    "totalSpent": "6644.54",
    "variance": "-600.46",
    "variancePercentage": "-8.29"
  }
}
```

## Categorias de Gastos

- **Essenciais (70%)**: Moradia, alimentação, transporte
- **Não Essenciais (8%)**: Compras extras, conveniências
- **Investimentos (17%)**: Poupança, aplicações
- **Torrar (5%)**: Lazer, entretenimento

## Suporte

Para problemas ou dúvidas, verifique:

1. Se todas as dependências estão instaladas
2. Se o Node.js está na versão 18 ou superior
3. Se as portas 5000 estão disponíveis para desenvolvimento local

## Licença

MIT License