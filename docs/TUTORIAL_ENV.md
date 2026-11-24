# 📋 Guia de Configuração das Variáveis de Ambiente (`.env`)

Este guia detalha o papel, a criticidade e a configuração de cada variável do ecossistema **FidelizOn (v2.0)**, garantindo a separação estrita entre dados públicos de cliente e credenciais sensíveis de infraestrutura.

---

## 📌 Visão Geral das Variáveis

```text
+--------------------------------------------------------------------------+
| 1. VARIÁVEIS PÚBLICAS (Empacotadas no Frontend pelo Vite)                 |
| - VITE_THIRDWEB_CLIENT_ID  -> Conexão Web3 e In-App Wallets (Client-side)|
| - VITE_ACTIVE_CHAIN        -> 'base-sepolia' (testes) ou 'base' (produção)|
| - VITE_SANITY_PROJECT_ID   -> Identificador do Content Lake no Sanity    |
| - VITE_SANITY_DATASET      -> Dataset de conteúdo ('production')          |
+-------------------------------------+------------------------------------+
                                      |
+-------------------------------------v------------------------------------+
| 2. CREDENCIAIS PRIVADAS (NUNCA comitar nem expor no GitHub Pages)        |
| - SANITY_API_WRITE_TOKEN   -> Usado no Serverless/Script de Seed         |
| - THIRDWEB_SECRET_KEY      -> Usado pelo Engine/Deployer de Contratos    |
| - ADMIN_PRIVATE_KEY        -> Assinatura de deploy na blockchain via CLI |
+--------------------------------------------------------------------------+
```

---

## 🛠️ Detalhamento das Variáveis

### 1. `VITE_THIRDWEB_CLIENT_ID`
* **Tipo:** Pública (Client-side)
* **Onde Obter:** [Thirdweb Dashboard → Settings → API Keys](https://thirdweb.com/dashboard/settings/api-keys)
* **Função:** Identifica a sua aplicação perante os nós RPC, serviços de In-App Wallet (Google/E-mail) e Paymaster da Thirdweb.
* **Segurança:** Requer **Allowed Domains** configurados no Thirdweb Dashboard (ex.: `localhost:5173`, `*.github.io`).

### 2. `VITE_ACTIVE_CHAIN`
* **Tipo:** Pública (Client-side)
* **Valores Possíveis:**
  * `base-sepolia`: Rede de testes (Chain ID `84532`) para homologação sem custo real.
  * `base`: Rede principal L2 da Coinbase/Ethereum (Chain ID `8453`) com liquidação definitiva e taxas mínimas.
* **Função:** Define a cadeia EVM na qual as Smart Wallets e os contratos de fidelidade irão operar.

### 3. `VITE_SANITY_PROJECT_ID` & `VITE_SANITY_DATASET`
* **Tipo:** Pública (Client-side)
* **Onde Obter:** [Sanity Manage](https://www.sanity.io/manage)
* **Função:** Permite que o frontend consulte em tempo real os catálogos de produtos, hotsites de lojas e campanhas promocionais diretamente pela **Sanity CDN** em alta velocidade.
* **Fallback:** Caso estas variáveis estejam vazias (primeiro deploy), o FidelizOn ativa automaticamente o modo de demonstração com a **Loja Modelo Embutida (`cafeteria-aroma`)**.

### 4. `SANITY_API_WRITE_TOKEN`
* **Tipo:** **SEGREDO CRÍTICO (Backend / CI)**
* **Onde Obter:** Sanity Manage → Seu Projeto → Settings → API → Tokens (`Editor` ou `Admin`).
* **Função:** Permite mutações no Content Lake (cadastro de novos lojistas e produtos).
* **Alerta de Segurança:** **NUNCA** adicione o prefixo `VITE_` a esta chave. Ela deve residir apenas na API Serverless ou em scripts administrativos locais.

### 5. `THIRDWEB_SECRET_KEY` & `ADMIN_PRIVATE_KEY`
* **Tipo:** **SEGREDO CRÍTICO (Terminal / DevOps)**
* **Função:** Utilizadas para provisionamento determinístico de contratos clones (EIP-1167) na rede Base via linha de comando (`npx thirdweb deploy` ou scripts IaC).

---

## 🚀 Como Inicializar seu Arquivo Local

No terminal, execute:

```bash
# Na raiz do projeto:
cp .env.example .env

# E no workspace do frontend:
cp apps/web/.env.example apps/web/.env
```

Abra o arquivo `.env` e preencha as variáveis correspondentes aos seus serviços.
