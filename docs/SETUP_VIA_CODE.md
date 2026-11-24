# 💻 Guia 100% via Código: Setup Rápido do FidelizOn

Este guia foi elaborado para engenheiros que preferem operar via **terminal e código (Infrastructure as Code - IaC)**, agilizando o provisionamento de dependências, chaves e testes sem navegação manual exaustiva.

---

## ⚡ Fluxo Rápido em 3 Passos

```bash
# 1. Instalar dependências em todo o monorepo
npm install

# 2. Executar a suíte completa de testes de unidade e integrados
npm test --workspace=@fidelizon/web

# 3. Iniciar a aplicação web local com a Loja Modelo Seed (Cafeteria Aroma)
npm run dev --workspace=@fidelizon/web
```

---

## 🛠️ Setup Web3 via CLI (Thirdweb)

### 1. Autenticação na CLI do Thirdweb
Para associar seu ambiente de desenvolvimento à sua conta Thirdweb:
```bash
npx thirdweb login
```
*Uma janela abrirá no navegador para autorizar a chave de máquina.*

### 2. Criar a API Key do Projeto
1. Acesse via terminal ou dashboard:
   - Defina o nome do projeto: `FidelizOn`
   - Domínios autorizados (*Allowed Domains*):
     - `localhost:5173`
     - `*.github.io`
2. Adicione o **Client ID** gerado ao seu arquivo `.env`:
   ```bash
   echo "VITE_THIRDWEB_CLIENT_ID=seu_client_id_aqui" >> apps/web/.env
   ```

---

## ☁️ Configuração dos Secrets no GitHub Pages via GitHub CLI (`gh`)

Se você utiliza o **GitHub CLI**, pode configurar os segredos e variáveis da esteira de CI/CD diretamente pelo terminal sem abrir o site do GitHub:

```bash
# 1. Autenticar no GitHub
gh auth login

# 2. Enviar variáveis públicas do .env para a Action
gh secret set VITE_THIRDWEB_CLIENT_ID -b "seu_client_id"
gh secret set VITE_ACTIVE_CHAIN -b "base-sepolia"
gh secret set VITE_SANITY_PROJECT_ID -b "seu_sanity_project_id"
gh secret set VITE_SANITY_DATASET -b "production"
```

---

## 🧪 Comandos Úteis do Monorepo

| Comando | Finalidade |
| :--- | :--- |
| `npm run dev --workspace=@fidelizon/web` | Inicia o servidor Vite local (HMR em `http://localhost:5173`) |
| `npm test --workspace=@fidelizon/web` | Executa todos os testes de unidade e integrados via Vitest |
| `npm run build --workspace=@fidelizon/web` | Gera o build estático otimizado para o GitHub Pages em `apps/web/dist` |
| `npm run preview --workspace=@fidelizon/web` | Pré-visualiza localmente o build estático de produção |
