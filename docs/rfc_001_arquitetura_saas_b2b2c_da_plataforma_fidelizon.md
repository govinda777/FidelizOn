# RFC-001: Arquitetura e Especificação da Plataforma FidelizOn (v2.0)

| Campo | Valor |
| :--- | :--- |
| **Documento** | RFC-001 (v2.0 — Arquitetura Multi-Tenant + Sanity CMS) |
| **Projeto** | FidelizOn |
| **Modelo de Negócio** | SaaS B2B2C (Plataforma → Lojista → Cliente Final) |
| **Status** | Rascunho para Revisão |
| **Data** | 23/11/2026 |
| **Frontend / Hospedagem** | GitHub Pages (Static Web App / PWA) |
| **CMS & Catálogo** | Sanity CMS (Content Lake + Sanity CDN + Studio/API) |
| **Camada Web3** | Thirdweb (SDK v5, In-App Wallets, Account Abstraction, Engine, L2) |

---

## 1. Resumo Executivo e Modelo B2B2C

A **FidelizOn** é uma plataforma SaaS Web3 de fidelização e vendas projetada para operar com infraestrutura enxuta (**GitHub Pages + Sanity CMS + Thirdweb**).

A plataforma opera em **duas camadas de negócio distintas**, cada uma com sua própria jornada de usuário e seu próprio **espaço administrativo**:

1. **Camada da Plataforma (B2B — FidelizOn → Lojista):**
   * Onde estabelecimentos conhecem a FidelizOn, escolhem um plano, contratam o serviço, configuram sua marca e provisionam sua operação.
   * Gerenciada pelo **Espaço Super ADM (FidelizOn)**.
2. **Camada do Estabelecimento (B2C — Lojista → Cliente Final):**
   * Onde cada lojista oferece ao seu público o **Cartão Fidelidade digital via QR Code (carro-chefe)**, além de **Cartão Pré-Pago**, **Cupons de Desconto (ex.: Black Friday)**, **Cadastro de Produtos** e **Autoatendimento**.
   * Gerenciada pelo **Espaço ADM do Lojista** (e seus Operadores de Caixa).

### Princípio Norteador: "Web3 Invisível"
Nem o lojista nem o cliente final precisam entender carteiras cripto, *gas fees* ou padrões ERC. Toda a camada blockchain (Thirdweb) opera nos bastidores garantindo auditabilidade, prevenção a fraudes e portabilidade, enquanto o **Sanity** centraliza conteúdo, identidade visual de cada loja, planos da plataforma e cadastro de produtos.

---

## 2. Escopo Funcional em Dois Níveis

### 2.1. Módulos da Plataforma (FidelizOn — B2B)
| Módulo | Prioridade | Descrição |
| :--- | :--- | :--- |
| **Hotsite Institucional FidelizOn** | Core (P0) | Página comercial de captação de lojistas, demonstração, planos e FAQ (gerenciados no Sanity). |
| **Onboarding & Contratação B2B** | Core (P0) | Cadastro do lojista, escolha de plano, pagamento da assinatura e provisionamento automático da loja (*Tenant*). |
| **Espaço Super ADM (FidelizOn)** | Core (P0) | Gestão de lojistas (*tenants*), status de assinaturas, limites de gás (Paymaster), planos, suspensão de contas e métricas globais. |

### 2.2. Módulos do Estabelecimento (Lojista — B2C)
| Módulo | Prioridade | Descrição |
| :--- | :--- | :--- |
| **Hotsite da Loja & Login** | Core (P0) | Página personalizada do lojista (`fidelizon.com/nome-da-loja`) com marca própria carregada do Sanity e login sem atrito. |
| **Cartão Fidelidade (Carro-Chefe)** | Core (P0) | Cliente exibe QR Code da conta; ADM/Operador escaneia e marca `+1` selo; acompanhamento de meta, níveis (tiers) e resgate seguro. |
| **Espaço ADM do Lojista & Operador** | Core (P0) | Scanner QR via câmera para pontuar/dar baixa, gestão de operadores, personalização básica da loja e painel de acompanhamento. |
| **Cadastro de Produtos (via Sanity)** | P1 | Gestão de catálogo de itens, preços em R$, valor em selos, estoque/disponibilidade e regras promocionais. |
| **Autoatendimento** | P1 | Cliente navega no catálogo da loja, aplica selos, cupons ou saldo pré-pago e gera QR Code de pedido para retirada/balcão. |
| **Cartão Pré-Pago** | P2 | Crédito antecipado em reais vinculado à conta do cliente, com recarga e débito seguro via aprovação do titular. |
| **Cupons de Desconto (Black Friday)** | P2 | Campanhas sazonais com estoque limitado, validade de data/hora, regra de elegibilidade e queima (*burn*) no uso. |

---

## 3. Papéis e Hierarquia de Acesso (RBAC)

Como o frontend é hospedado de forma estática no **GitHub Pages**, nenhuma trava de segurança pode existir apenas na interface. Todas as ações sensíveis são validadas por **Roles On-Chain**, **assinaturas Web3 (SIWE)** e **políticas de acesso no backend/Sanity**.

| Nível | Papel | Autenticação | Permissões Principais |
| :--- | :--- | :--- | :--- |
| **Plataforma** | **Super ADM (FidelizOn)** | Wallet Master (`PLATFORM_ADMIN`) + Acesso Sanity Studio | Gerenciar todos os lojistas (*tenants*), criar/editar planos e hotsite institucional, aprovar/suspender lojas, monitorar consumo de gás (Paymaster) e gerenciar contratos-fábrica. |
| **Plataforma** | **Visitante B2B (Lead)** | Sem login | Acessar hotsite da FidelizOn, simular planos e iniciar contratação. |
| **Lojista** | **ADM da Loja (Dono/Gerente)** | In-App Wallet (`TENANT_ADMIN_ROLE` da sua loja) | Personalizar hotsite da loja, cadastrar/editar produtos da própria loja, criar campanhas de Black Friday, adicionar/remover operadores, ver relatórios e usar todas as funções de caixa. |
| **Lojista** | **Operador (Balcão/Caixa)** | In-App Wallet (`OPERATOR_ROLE` da sua loja) | Escanear QR Code do cliente para marcar `+1` selo, validar resgate de prêmio, dar baixa em cupons/pedidos de autoatendimento e operar recarga/débito pré-pago. Sem acesso a configurações ou exclusão de produtos. |
| **Consumidor** | **Cliente Final** | In-App Wallet (Google, E-mail ou Telefone) | Exibir QR Code da conta, consultar selos/pré-pago/cupons por loja, resgatar cupons elegíveis, montar pedidos no autoatendimento e assinar autorizações de gasto/resgate. |

---

## 4. Arquitetura Técnica (GitHub Pages + Sanity + Thirdweb)

### 4.1. Visão Geral das Camadas

```text
+-------------------------------------------------------------------------+
| CAMADA 1: FRONTEND ESTÁTICO / PWA (GitHub Pages + HTTPS)                |
| React / Vite ou Next.js (Static Export) + Tailwind + Thirdweb SDK v5    |
|                                                                         |
| [Área Plataforma]                      [Área Lojista / Tenant]          |
| - /                 (Hotsite B2B)      - /:slug           (Hotsite Loja)|
| - /contratar        (Checkout SaaS)    - /:slug/conta     (Cliente QR)  |
| - /super-admin      (ADM FidelizOn)    - /:slug/loja      (Autoatend.)  |
|                                        - /:slug/admin     (ADM Lojista) |
+-------------------+---------------------------+-------------------------+
                    |                           |
        (Leitura rápida CDN)         (Mutações autenticadas / Webhooks)
                    |                           |
                    v                           v
+-----------------------------------+   +-----------------------------------+
| CAMADA 2: SANITY CMS              |   | CAMADA 3: API SERVERLESS LEVE     |
| (Content Lake + Edge CDN)         |   | (Cloudflare Workers / Vercel API) |
| - Planos & Hotsite FidelizOn      |   | - Proxy seguro de escrita Sanity  |
| - Tenants (branding, slugs, cfg)  |   |   (valida SIWE + isola tenantId)  |
| - Produtos por Tenant             |   | - Webhooks de Assinatura B2B      |
| - Campanhas & Metadados           |   | - Provisionamento via Thirdweb    |
| - Sanity Studio (uso Super ADM)   |   |   Engine (deploy/roles por loja)  |
+-----------------------------------+   +-----------------+-----------------+
                                                          |
                                                          v
                                        +-----------------------------------+
                                        | CAMADA 4: WEB3 / THIRDWEB (L2)    |
                                        | Rede: Base ou Polygon             |
                                        | - In-App Wallets + ERC-4337       |
                                        | - Paymaster (cotas por Tenant)    |
                                        | - Contratos por Loja (ou Factory):|
                                        |   Fidelidade, Cupons e Pré-Pago   |
                                        +-----------------------------------+
```

### 4.2. Por que a Camada Serverless Leve é Indispensável com GitHub Pages + Sanity?
O GitHub Pages serve apenas arquivos públicos no navegador. Portanto:
1. **Leitura no Sanity:** Pode ser feita **diretamente do frontend no GitHub Pages** via `@sanity/client` usando o **Sanity CDN** (latência baixíssima e sem expor tokens privados para dados públicos como catálogo e hotsites).
2. **Escrita no Sanity (ex.: Lojista cadastrando um produto):** Um token de escrita do Sanity (`SANITY_API_WRITE_TOKEN`) **nunca** pode ficar no código do GitHub Pages. Assim, quando o ADM do Lojista salva um produto no painel `/slug/admin`, o frontend envia a requisição assinada pela carteira do lojista (SIWE) para uma **API Serverless leve**, que:
   * Verifica on-chain se aquela carteira tem `TENANT_ADMIN_ROLE` daquele `tenantId` específico;
   * Garante o isolamento multi-tenant (impedindo que a Loja A altere produtos da Loja B);
   * Executa a mutação no Sanity Content Lake com segurança.
3. **Provisionamento de Novos Lojistas:** Ao confirmar o pagamento do plano (via webhook de Stripe/Asaas/Pix), a API Serverless cria automaticamente o documento `tenant` no Sanity e aciona o **Thirdweb Engine** para provisionar os contratos/permissões da nova loja.

---

## 5. Modelagem de Dados no Sanity CMS

O Sanity será a fonte única de verdade para conteúdo, configuração multi-tenant, catálogo de produtos e metadados de campanhas.

### 5.1. Schemas Principais

#### A. `platformConfig` e `saasPlan` (Nível Plataforma)
* Conteúdo do Hotsite da FidelizOn (hero, benefícios, casos de uso, FAQ).
* Planos de contratação (`id`, `nome`, `precoMensalCents`, `limiteSelosMes`, `modulosLiberados`: `["loyalty", "products", "selfService", "coupons", "prepaid"]`, `limiteOperadores`).

#### B. `tenant` (Estabelecimento / Lojista)
```json
{
  "_type": "tenant",
  "name": "Cafeteria Aroma",
  "slug": { "current": "cafeteria-aroma" },
  "status": "active", // active | trial | past_due | suspended
  "plan": { "_ref": "plan_pro" },
  "branding": {
    "logo": "image_ref",
    "primaryColor": "#10B981",
    "bannerImage": "image_ref",
    "welcomeMessage": "Junte 10 selos e ganhe um café especial!"
  },
  "loyaltyConfig": {
    "stampsGoal": 10,
    "rewardTitle": "1 Café Especial 250g Grátis",
    "cooldownSeconds": 60
  },
  "web3": {
    "chainId": 8453,
    "loyaltyContractAddress": "0x...",
    "couponsContractAddress": "0x...",
    "prepaidContractAddress": "0x...",
    "ownerWallet": "0x..."
  },
  "enabledModules": {
    "loyalty": true,
    "products": true,
    "selfService": true,
    "coupons": true,
    "prepaid": false
  }
}
```

#### C. `product` (Cadastro de Produtos — Escopo por Tenant)
```json
{
  "_type": "product",
  "tenant": { "_ref": "tenant_cafeteria_aroma" },
  "name": "Café Especial 250g",
  "description": "Torra média, notas achocolatadas.",
  "category": "Cafés",
  "image": "image_ref",
  "active": true,
  "priceBrlCents": 3500,
  "loyaltyStampsCost": 10,
  "grantsStampOnPurchase": true,
  "stampsAwarded": 1,
  "allowPrepaid": true,
  "eligibleForCoupons": true
}
```

#### D. `campaign` (Cupons & Black Friday — Escopo por Tenant)
* Vínculo obrigatório com `tenant`.
* `title`, `slug`, `banner`, `discountType` (`percentage` | `fixed`), `discountValue`, `startsAt`, `endsAt`, `maxSupply`, `onChainTokenId`, `minStampsRequired` (para campanhas exclusivas de clientes fiéis).

### 5.2. Uso do Sanity Studio vs. Painel ADM Customizado
* **Super ADM (FidelizOn):** Pode utilizar tanto o **Painel `/super-admin`** (visão operacional/financeira/Web3) quanto o **Sanity Studio** nativo para edição rica do hotsite institucional, planos e suporte avançado aos documentos.
* **ADM do Lojista:** Usa **exclusivamente** o painel simplificado `/slug/admin` dentro do FidelizOn (UX amigável de loja, sem precisar aprender Sanity Studio), com os formulários salvando diretamente no Sanity via API autenticada.

---

## 6. Modelagem Web3 Multi-Tenant (Thirdweb)

### 6.1. Estratégia de Isolamento On-Chain
Para suportar múltiplos lojistas com segurança e simplicidade operacional, recomenda-se o **Padrão Factory / Clones (EIP-1167) por Lojista** na rede **Base** (ou **Polygon**):
* Ao contratar a plataforma, o **Thirdweb Engine** faz o deploy barato (clone) dos contratos exclusivos daquela loja, já configurando a carteira do lojista como `TENANT_ADMIN_ROLE` e a carteira da plataforma como `PLATFORM_RECOVERY_ROLE` (para suporte/pausa em caso de fraude ou inadimplência).
* **Por que isolar por loja?** Evita mistura de saldos/selos entre lojistas diferentes, facilita auditoria individual, permite que cada loja tenha sua própria coleção/nome de token e viabiliza métricas limpas por endereço de contrato.

### 6.2. Contratos por Estabelecimento
1. **`TenantLoyalty` (ERC-1155 Non-Transferable / Soulbound):**
   * `tokenId = 0`: Selo de fidelidade padrão.
   * `tokenId = 1..N`: Badges de nível (Bronze, Prata, Ouro) emitidos conforme histórico acumulado (`lifetimeStamps`).
   * Apenas `OPERATOR_ROLE` / `TENANT_ADMIN_ROLE` executa `mint`. O `burn` (resgate) exige assinatura válida do cliente.
2. **`TenantCoupons` (ERC-1155 com Claim Conditions):**
   * Cada campanha (ex.: Black Friday) gera um novo `tokenId` com limite de estoque, janela de tempo e trava de 1 unidade por carteira. Uso realiza `burn` definitivo.
3. **`TenantPrepaid` (Contrato de Saldo / Ledger em Centavos):**
   * 1 unidade = R$ 0,01. Crédito feito por `OPERATOR_ROLE` (presencial) ou `ENGINE` (recarga online via Pix). Débito permitido apenas mediante aprovação assinada (EIP-712) do cliente.

### 6.3. Gestão de Gás (Paymaster por Plano)
* A Thirdweb Account Abstraction patrocina o gás tanto dos clientes quanto dos operadores no caixa.
* No **Espaço Super ADM**, cada plano define uma **cota mensal de transações patrocinadas** (ex.: Plano Starter = 1.000 carimbos/mês; Plano Pro = 10.000/mês) com alertas de consumo para evitar abusos em picos como a Black Friday.

---

## 7. Jornadas Completas (Duas Camadas)

### PARTE A — JORNADA DA PLATAFORMA (B2B: FidelizOn → Lojista)

#### Jornada A1: Descoberta, Contratação e Provisionamento do Lojista
1. **Hotsite FidelizOn (`/`):** O empresário acessa o site institucional (conteúdo vindo do Sanity), entende os benefícios (fidelidade via QR Code, pré-pago, Black Friday, autoatendimento) e compara os planos.
2. **Cadastro e Escolha de Plano (`/contratar`):** O lojista cria conta via Thirdweb In-App Wallet (Google/E-mail), informa dados do negócio (Nome da loja, slug desejado, segmento) e escolhe o plano.
3. **Pagamento da Assinatura:** Checkout integrado (Pix/Cartão via gateway como Stripe ou Asaas).
4. **Provisionamento Automático (Zero-Touch):**
   * Webhook de pagamento confirmado aciona a API Serverless;
   * API cria o registro do `tenant` no **Sanity** com os módulos do plano liberados;
   * API dispara no **Thirdweb Engine** o deploy dos contratos da loja e concede `TENANT_ADMIN_ROLE` à carteira do lojista;
   * Lojista recebe confirmação imediata e link direto para o seu **Espaço ADM** (`/:slug/admin`) e para a URL pública da sua loja (`/:slug`).

#### Jornada A2: Espaço Super ADM da Plataforma (`/super-admin`)
Ambiente restrito à equipe FidelizOn (`PLATFORM_ADMIN`):
1. **Gestão de Lojistas (Tenants):** Lista de todas as lojas cadastradas, status (`trial`, `active`, `past_due`, `suspended`), plano contratado e atalho para o documento no Sanity.
2. **Controle de Módulos e Planos:** Ativar/desativar recursos extras por loja (ex.: liberar módulo Black Friday ou Pré-Pago mediante upgrade).
3. **Monitoramento Web3 & Gás:** Painel mostrando volume de selos emitidos por loja, consumo de Paymaster vs. cota do plano e saúde das filas do Thirdweb Engine.
4. **Governança e Emergência:** Botão de suspensão de loja inadimplente (oculta ações operacionais e pausa patrocínio de gás sem apagar os dados/histórico dos clientes).
5. **Gestão de Conteúdo Global:** Acesso rápido ao **Sanity Studio** para atualizar textos do Hotsite institucional, banners e tabelas de preços.

---

### PARTE B — JORNADA DO ESTABELECIMENTO E CLIENTE FINAL (B2C)

#### Jornada B1: Espaço ADM do Lojista (`/:slug/admin`)
Ambiente exclusivo do lojista contratante e sua equipe:
1. **Configuração da Loja:** Upload de logo, cor primária, texto de boas-vindas e meta do cartão fidelidade (ex.: 10 selos = prêmio X) — salvo direto no Sanity via API autenticada.
2. **Gestão de Equipe (Operadores):** Lojista convida/autoriza o e-mail ou wallet de funcionários como `OPERATOR_ROLE` (podem usar o scanner no balcão, mas não editam preços nem apagam dados).
3. **Cadastro de Produtos:** CRUD simples de produtos (foto, nome, preço em R$, valor em selos, se pontua na compra, se aceita cupom/pré-pago) persistido no **Sanity**.
4. **Gestão de Campanhas (Black Friday):** Formulário para criar cupom promocional (desconto, quantidade máxima, início/fim, restrição por nível de fidelidade), gravando metadados no Sanity e configurando o `tokenId` + `Claim Conditions` no contrato da loja.
5. **Modo Caixa / Operação Mobile-First:**
   * Botão principal de destaque: **"Escanear QR Code do Cliente"**.
   * Após leitura, o ADM/Operador escolhe a ação: **Marcar `+1` Selo**, **Validar Resgate de Prêmio**, **Dar Baixa em Cupom/Pedido** ou **Creditar/Debitar Pré-Pago**.
6. **Dashboard da Loja:** Selos emitidos no dia/mês, prêmios resgatados, clientes mais recorrentes, cupons de Black Friday usados e volume de pré-pago.

#### Jornada B2: Hotsite da Loja e Login do Cliente Final (`/:slug`)
1. Cliente escaneia um QR Code de balcão/mesa ou acessa o link `fidelizon.com/cafeteria-aroma`.
2. O frontend busca o documento `tenant` no **Sanity CDN** pelo `slug` e renderiza a interface com a marca, cores, regras e banners daquela loja.
3. Cliente toca em **"Entrar no meu Cartão"** e faz login em 1 passo (Google, E-mail ou Telefone via Thirdweb In-App Wallet).
4. Cliente cai na sua conta (`/:slug/conta`), visualizando o **Cartão Fidelidade**, o **QR Code da sua conta**, **Saldo Pré-Pago** e **Meus Cupons**.

#### Jornada B3: Pontuar e Resgatar no Cartão Fidelidade (Carro-Chefe)
1. **Acúmulo (`+1` Selo):**
   * Cliente abre sua conta e mostra o **QR Code pessoal** no caixa.
   * ADM/Operador escaneia no app (`/:slug/admin`), visualiza a identificação do cliente e o saldo atual (ex.: `4/10`), e toca em **"Confirmar +1 Selo"**.
   * A transação é assinada com gás patrocinado; em poucos segundos a tela do cliente atualiza para `5/10` com feedback visual.
   * *Proteção:* trava de *cooldown* configurável (ex.: 60s) evita duplicação acidental de carimbo.
2. **Resgate de Recompensa (`10/10` Selos):**
   * Ao completar a cartela, aparece o botão **"Resgatar Prêmio"**.
   * Cliente confirma na própria tela, gerando um **QR Code Dinâmico de Resgate** (assinatura EIP-712 válida por 2 minutos).
   * ADM escaneia, entrega o prêmio e confirma a baixa — o contrato realiza o `burn` dos 10 selos e mantém o contador vitalício para evolução de nível (Bronze/Prata/Ouro).

#### Jornada B4: Cartão Pré-Pago
1. **Recarga:** Presencial no balcão (cliente paga via Pix/cartão na maquininha, mostra QR da conta, ADM credita o valor) ou online (Fase 3+, via checkout Pix + webhook/Engine).
2. **Uso / Débito:** Cliente gera um **QR Code Dinâmico de Pagamento** (ou escaneia um QR de cobrança gerado pelo ADM) e aprova o valor exato na sua tela via assinatura EIP-712, impedindo débitos indevidos por foto de QR estático.

#### Jornada B5: Cupons de Desconto (Black Friday)
1. Cliente vê o banner da campanha (carregado do Sanity) no hotsite da loja ou recebe o link promocional.
2. Faz login e toca em **"Garantir Cupom"**. O smart contract valida validade, estoque e trava de 1 unidade por carteira antes de emitir o cupom.
3. Na hora de usar (balcão ou autoatendimento), o cliente autoriza a queima (`burn`) do cupom, garantindo uso único e métricas confiáveis de conversão.

#### Jornada B6: Autoatendimento (`/:slug/loja`)
1. Cliente acessa a vitrine da loja (produtos servidos em alta velocidade pelo **Sanity CDN**).
2. Monta o carrinho combinando itens pagos em dinheiro/Pix, itens trocados por **selos de fidelidade**, aplicação de **cupom de Black Friday** e/ou abatimento com **saldo pré-pago**.
3. Ao finalizar, o sistema gera um **QR Code de Pedido + Senha Curta (ex.: `#A14`)** contendo a assinatura dos benefícios utilizados.
4. O ADM escaneia no balcão, efetiva a baixa on-chain dos benefícios/saldo, recebe eventual diferença em R$ e entrega o pedido (já atribuindo `+1` selo caso os itens sejam elegíveis).

---

## 8. Segurança, Isolamento Multi-Tenant e LGPD

| Vetor de Risco | Estratégia de Mitigação |
| :--- | :--- |
| **Vazamento entre Lojistas no Sanity** | Toda consulta GROQ no frontend e na API filtra obrigatoriamente por `tenant._ref == $tenantId`. Toda escrita passa pela API Serverless, que valida a assinatura SIWE e a `TENANT_ADMIN_ROLE` daquela loja específica antes de tocar no Sanity. |
| **Exposição de segredos no GitHub Pages** | `SANITY_API_WRITE_TOKEN`, chaves do Thirdweb Engine e segredos de webhook residem exclusivamente na camada Serverless (nunca no repositório/bundle estático). |
| **Foto do QR Code usada para fraude** | **Regra de Ouro:** QR Code estático serve *apenas* para **receber** (`+1` selo ou recarga). Qualquer operação de **gasto/queima** (resgate de prêmio, débito pré-pago, queima de cupom) exige QR Code dinâmico com assinatura EIP-712, nonce único e expiração curta (2 minutos). |
| **Abuso de Gás (Paymaster) ou Sybil na Black Friday** | Quotas mensais de patrocínio por Tenant, limite de 1 cupom por carteira, verificação obrigatória de e-mail/telefone na In-App Wallet e opção de restringir campanhas agressivas a clientes com mínimo de selos prévios. |
| **LGPD (Dados Pessoais)** | **Zero PII na blockchain.** Endereços `0x...` e saldos vivem on-chain; dados pessoais de lojistas e clientes ficam segregados off-chain com política de exclusão/anonimização compatível com a LGPD. |

---

## 9. Requisitos Técnicos para GitHub Pages + PWA

* **Roteamento Multi-Tenant em Site Estático:** Como o GitHub Pages não possui servidor Node nativo para rotas dinâmicas (`/:slug/admin`), o build estático deve incluir `.nojekyll` e estratégia de SPA fallback (`404.html` redirecionando para `index.html` preservando a rota, ou suporte a domínio customizado com Cloudflare Pages/Proxy na frente se desejado no futuro).
* **Performance com Sanity CDN:** Imagens de produtos e logos utilizam a **Sanity Image URL Pipeline** (redimensionamento automático, WebP/AVIF e cache em borda), garantindo carregamento instantâneo no 4G dentro de lojas físicas.
* **PWA & Câmera:** GitHub Pages entrega HTTPS obrigatório para uso da câmera no scanner de QR Code (`getUserMedia`). Tanto a área do Cliente quanto o Painel do Operador podem ser instalados na tela inicial do celular.
* **Resiliência Offline Parcial:** O QR Code pessoal do cliente fica em cache local no navegador para poder ser apresentado no caixa mesmo se o sinal do cliente oscilar; apenas o aparelho do operador precisa de conexão ativa para registrar o carimbo.

---

## 10. Roadmap de Implementação

### Fase 1 — Fundação Multi-Tenant + MVP de Fidelidade
* Configuração do projeto **Sanity** com schemas (`platformConfig`, `saasPlan`, `tenant`, `product`).
* Hotsite da Plataforma FidelizOn (`/`) + Hotsite dinâmico por loja (`/:slug`).
* **Espaço Super ADM (v1):** cadastro/ativação manual dos primeiros lojistas piloto e acesso ao Sanity Studio.
* **Espaço ADM do Lojista (v1):** login com `TENANT_ADMIN_ROLE`, scanner QR Code, marcação `+1` selo e resgate seguro.
* **Jornada do Cliente:** login In-App Wallet, visualização do Cartão Fidelidade e QR Code.
* CI/CD via GitHub Actions publicando no GitHub Pages (Homologação em **Base Sepolia** + Produção em **Base**).

### Fase 2 — Contratação B2B Automatizada + Catálogo & Autoatendimento
* Fluxo completo de contratação self-service (`/contratar`) com gateway de pagamento + provisionamento automático (Sanity + Thirdweb Engine).
* API Serverless de escrita segura no Sanity para o **ADM do Lojista** gerenciar branding e **Cadastro de Produtos** direto no seu painel.
* Módulo de **Autoatendimento** (`/:slug/loja`) com vitrine via Sanity CDN e geração de QR Code de pedido.
* Gestão de **Operadores** pelo próprio ADM da loja.

### Fase 3 — Campanhas (Black Friday) e Cartão Pré-Pago
* Contratos `TenantCoupons` e `TenantPrepaid` no fluxo de provisionamento.
* Interface no ADM do Lojista para criação de campanhas sazonais (Black Friday) e operação de recarga/débito pré-pago via QR dinâmico assinado.
* Controle de **Quotas de Paymaster por Plano** no Espaço Super ADM.

### Fase 4 — Escala SaaS & Inteligência
* Recarga online de Pré-Pago via Pix integrado por lojista.
* Domínios customizados por loja (ex.: `clube.sualoja.com.br`).
* Relatórios avançados de retenção, LTV, taxa de retorno e conversão de campanhas para o Lojista e métricas MRR/churn para o Super ADM.

---

## 11. Decisões em Aberto (Próximas ADRs)

1. **Gateway de Pagamento da Plataforma (B2B):** Qual provedor usaremos para a assinatura dos lojistas (ex.: **Asaas** com Pix/Boleto/Cartão no Brasil ou **Stripe**)?
2. **Provedor da API Serverless Leve:** Para o proxy de escrita no Sanity e webhooks de contratação, a preferência é **Cloudflare Workers** (custo quase zero e ótima sinergia com DNS/CNAME) ou **Vercel Functions**?
3. **Estratégia de URLs dos Lojistas:** Começaremos apenas com caminho (`fidelizon.com/nome-da-loja`) ou já planejaremos suporte a subdomínios (`nome-da-loja.fidelizon.com`)?
4. **Identidade do Cliente entre Lojas:** O mesmo cliente que usa a FidelizOn na *Loja A* e na *Loja B* terá uma visão unificada de "Meus Cartões" (hub central do consumidor) ou cada loja terá experiência 100% isolada (white-label puro)?
5. **Regras de Pontuação:** No MVP, o cartão fidelidade será sempre de carimbo simples (`+1` por compra/visita) ou o ADM poderá digitar o valor da compra para converter automaticamente em pontos?