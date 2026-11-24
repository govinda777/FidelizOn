# FidelizOn (v2.0)

> Plataforma SaaS Web3 B2B2C de fidelização digital e vendas com cartões de selos QR Code, autoatendimento, catálogo de produtos, cupons promocionais e cartões pré-pagos.

Construído sobre uma infraestrutura leve, ágil e de baixo custo operacional:
- **Frontend / PWA:** React + Vite + TypeScript + Tailwind CSS (Hospedagem estática no GitHub Pages com roteamento SPA).
- **CMS & Catálogo:** [Sanity CMS](https://www.sanity.io/) (Content Lake + Sanity CDN + Sanity Studio).
- **Camada Web3:** [Thirdweb SDK v5](https://thirdweb.com/) (In-App Wallets, Account Abstraction ERC-4337, transações com gás patrocinado/gasless e contratos isolados na rede Base).
- **Backend Serverless:** Cloudflare Workers para proxy seguro de mutações Sanity com validação SIWE (*Sign-In with Ethereum*).

---

## 📖 Especificação Canônica e Arquitetura

Para conhecer a arquitetura técnica completa, modelo de dados, fluxos de segurança e contratos inteligentes, consulte:
- [RFC-001: Arquitetura SaaS B2B2C da Plataforma FidelizOn](docs/rfc_001_arquitetura_saas_b2b2c_da_plataforma_fidelizon.md)

---

## 🏗️ Estrutura do Projeto

O projeto é organizado em workspaces monorepo:

```text
FidelizOn/
├── apps/
│   ├── web/                     # Aplicação Web SPA / PWA (GitHub Pages)
│   │   ├── public/              # Ativos estáticos (.nojekyll, 404.html, manifest.json)
│   │   └── src/
│   │       ├── components/      # Componentes UI (Cartão, QR Code, Scanner, etc.)
│   │       ├── pages/           # Rotas B2B e B2C (Hotsites, Admin, Checkout, etc.)
│   │       └── services/        # Clientes Sanity e Thirdweb
│   └── serverless/              # API Serverless leve para mutações Sanity seguras
├── packages/
│   └── sanity-schemas/          # Schemas do Sanity CMS (tenant, product, saasPlan, etc.)
├── docs/                        # RFCs e especificações técnicas
└── package.json                 # Orquestração do Monorepo (npm workspaces)
```

---

## 🚀 Rotas Principais

### Camada Plataforma (B2B)
- `/`: Hotsite institucional FidelizOn (Planos, benefícios e FAQ)
- `/contratar`: Checkout self-service e contratação de lojistas
- `/super-admin`: Espaço de governança global do Super ADM FidelizOn

### Camada Estabelecimento (B2C)
- `/:slug`: Hotsite customizado da loja parceira
- `/:slug/conta`: Espaço do consumidor com Cartão Fidelidade e QR Code
- `/:slug/loja`: Catálogo de produtos e autoatendimento
- `/:slug/admin`: Espaço ADM do Lojista e Operadores de Caixa (com scanner de QR Code)

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Node.js >= 20
- npm >= 10

### Instalação e Desenvolvimento
```bash
# Instalar todas as dependências
npm install

# Iniciar aplicação web em modo desenvolvimento
npm run dev --workspace=@fidelizon/web
```

---

## 📄 Licença
Distribuído sob licença [Apache-2.0](LICENSE).
