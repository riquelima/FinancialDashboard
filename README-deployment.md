# Dashboard Financeiro - Versão Simplificada

## 📋 Sobre o Projeto

Dashboard financeiro brasileiro desenvolvido com React e Node.js, otimizado para upload manual no Git com menos de 100 arquivos.

## 🚀 Arquivos Essenciais (Total: ~25 arquivos)

### Frontend
- `client/src/App.tsx` - Aplicação principal
- `client/src/main.tsx` - Ponto de entrada
- `client/src/pages/simple-dashboard.tsx` - Dashboard principal
- `client/src/pages/not-found.tsx` - Página 404
- `client/src/lib/simple-query.ts` - Utilitários de API
- `client/src/index.css` - Estilos globais

### Backend
- `server/index.ts` - Servidor Express
- `server/routes.ts` - Rotas da API
- `server/storage.ts` - Armazenamento em memória
- `shared/schema.ts` - Tipos TypeScript

### APIs para Vercel
- `api/dashboard.js` - Endpoint principal
- `api/financial-data.js` - Dados financeiros
- `api/expense-categories.js` - Categorias de gastos
- `api/monthly-summary.js` - Resumo mensal

### Configuração
- `package.json` - Dependências
- `vite.config.ts` - Configuração do Vite
- `tailwind.config.ts` - Configuração do Tailwind
- `tsconfig.json` - Configuração TypeScript
- `vercel.json` - Configuração do Vercel

## 🔧 Deploy Manual no Git

1. **Criar repositório:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Fazer push para GitHub:**
   ```bash
   git remote add origin <seu-repositorio>
   git push -u origin main
   ```

3. **Deploy no Vercel:**
   - Conectar repositório GitHub no Vercel
   - Configurar variáveis de ambiente se necessário
   - Deploy automático

## ⚡ Funcionalidades

- ✅ Dashboard financeiro completo
- ✅ Controle de receitas e gastos
- ✅ Categorias de despesas (Essenciais, Investimentos, Não Essenciais, Torrar)
- ✅ Gráficos de pizza e barras
- ✅ Resumo mensal com variações
- ✅ Interface editável
- ✅ Design responsivo
- ✅ Deploy no Vercel

## 🎨 Stack Tecnológica Mínima

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Charts:** Recharts
- **Routing:** Wouter
- **Build:** Vite + esbuild
- **Deploy:** Vercel

## 📦 Comandos

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Start produção
npm run start
```

## 📁 Estrutura Otimizada

```
financial-dashboard/
├── api/                    # APIs serverless para Vercel
├── client/src/            # Frontend React
├── server/                # Backend Express
├── shared/                # Tipos compartilhados
├── package.json          # Dependências mínimas
├── vercel.json           # Configuração Vercel
└── vite.config.ts        # Configuração build
```

## 🏗️ Arquitetura

- **Frontend:** React simples sem bibliotecas complexas
- **Backend:** Express com armazenamento em memória
- **API:** Endpoints RESTful compatíveis com Vercel
- **Build:** Vite para desenvolvimento, esbuild para produção

Total de arquivos: ~25 (vs ~13k originais)