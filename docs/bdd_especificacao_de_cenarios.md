# 🧪 Especificação de Testes BDD (Gherkin) — Plataforma FidelizOn

Este documento cataloga a suíte completa de **Behavior-Driven Development (BDD)** da plataforma **FidelizOn**, formalizada na pasta [`tests/features/`](file:///Users/govinda/projetos/FidelizOn/tests/features/).

Os cenários foram concebidos para validar o comportamento da aplicação de ponta a ponta, alinhando a **visão de negócio**, o **catálogo/conteúdo do Sanity CMS** e a **imutabilidade dos contratos inteligentes na Thirdweb (Base L2)**.

---

## 📁 Mapa de Funcionalidades BDD

| # | Arquivo Feature | Foco da Validação | Camada Testada |
| :-: | :--- | :--- | :--- |
| **01** | [`01_autenticacao_smart_wallet.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/01_autenticacao_smart_wallet.feature) | Login Web2 (Google OAuth, OTP) provisionando Smart Account ERC-4337 sem seed phrase. | Thirdweb / In-App Wallets |
| **02** | [`02_catalogo_multi_tenant_sanity.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/02_catalogo_multi_tenant_sanity.feature) | Resolução de slug de loja, renderização de branding, catálogo com preço misto e fallback offline. | Sanity CMS / Content Lake |
| **03** | [`03_acumulo_selos_fidelidade.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/03_acumulo_selos_fidelidade.feature) | Concessão de selos por operador autorizado, patrocínio total de gás (Paymaster) e trava de cooldown anti-fraude. | Thirdweb / Base L2 / Paymaster |
| **04** | [`04_resgate_recompensas_seguro.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/04_resgate_recompensas_seguro.feature) | Atingimento da meta, geração de QR Code dinâmico com nonce/tempo, baixa e queima (*burn*) de selos on-chain. | Smart Contracts / PDV Scanner |
| **05** | [`05_autoatendimento_carrinho.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/05_autoatendimento_carrinho.feature) | Kiosk de autoatendimento, combinação de itens em R$ e itens trocados por selos, previsão de saldo. | Web App / Pricing Engine |
| **06** | [`06_cupons_promocionais_black_friday.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/06_cupons_promocionais_black_friday.feature) | Campanhas de cupons, desconto percentual/fixo, trava de 1 uso por carteira e limite de estoque on-chain. | Sanity CMS + Thirdweb Coupons |
| **07** | [`07_isolamento_multitenant_seguranca.feature`](file:///Users/govinda/projetos/FidelizOn/tests/features/07_isolamento_multitenant_seguranca.feature) | Garantia de que contratos clones EIP-1167 isolam selos e permissões entre diferentes estabelecimentos. | EIP-1167 Minimal Proxies |

---

## 🎯 Rastreabilidade Arquitetural
- **ERD Oficial:** [Modelo Entidade-Relacionamento Sanity + Thirdweb](./erd_fidelizon_sanity_thirdweb.md)
- **RFC da Arquitetura:** [RFC-001: Arquitetura SaaS B2B2C](./rfc_001_arquitetura_saas_b2b2c_da_plataforma_fidelizon.md)
- **Decisão de Engenharia:** [ADR-001: Infraestrutura e Configuração como Código](./adr_001_adocao_de_infraestrutura_e_configuracao_como_codigo.md)
