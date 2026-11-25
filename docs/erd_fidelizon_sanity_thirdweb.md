# 📊 Modelo Entidade-Relacionamento (ERD) — FidelizOn

Este documento especifica o **Modelo Entidade-Relacionamento (ERD)** da plataforma FidelizOn, mapeando de ponta a ponta a interação entre a **Camada de Conteúdo & Catálogo (Sanity CMS / Off-chain)** e a **Camada de Identidade & Regras Imutáveis (Thirdweb / Base L2 / On-chain)**.

---

## 1. Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    %% ==========================================
    %% CAMADA SANITY CMS (OFF-CHAIN / CONTENT LAKE)
    %% ==========================================
    saasPlan ||--o{ tenant : "define limites e modulos para"
    tenant ||--o{ product : "possui catálogo de"
    tenant ||--o{ campaign : "promove cupons de"
    
    %% ==========================================
    %% VÍNCULO SANITY <-> THIRDWEB (OFF-CHAIN / ON-CHAIN)
    %% ==========================================
    tenant ||--|| TenantLoyaltyContract : "aponta endereco do contrato"
    tenant ||--o| TenantCouponsContract : "aponta endereco do contrato"
    tenant ||--o| TenantPrepaidContract : "aponta endereco do contrato"
    tenant ||--o{ OperatorAccount : "autoriza caixas com OPERATOR_ROLE"
    campaign ||--|| CouponTokenOnChain : "mapeia onChainTokenId"

    %% ==========================================
    %% CAMADA THIRDWEB & BASE L2 (ON-CHAIN / SMART CONTRACTS)
    %% ==========================================
    TenantLoyaltyContract ||--o{ LoyaltyTokenBalance : "emite selos e badges"
    CustomerSmartWallet ||--o{ LoyaltyTokenBalance : "acumula saldo de selos"
    
    TenantCouponsContract ||--o{ CouponTokenOnChain : "controla condicoes de claim"
    CustomerSmartWallet ||--o{ CustomerCouponHoldings : "possui cupons resgatados"
    CouponTokenOnChain ||--o{ CustomerCouponHoldings : "reflete estoque e regras"

    TenantPrepaidContract ||--o{ CustomerPrepaidBalance : "registra saldo em centavos R$"
    CustomerSmartWallet ||--o{ CustomerPrepaidBalance : "detem saldo pre-pago"

    ThirdwebPaymaster ||--o{ GaslessTransaction : "patrocina taxas de gas"
    CustomerSmartWallet ||--o{ GaslessTransaction : "interage sem ter ETH"
    OperatorAccount ||--o{ GaslessTransaction : "marca selos sem pagar gas"

    %% ==========================================
    %% DEFINIÇÃO DAS ESTRUTURAS DE CAMPOS
    %% ==========================================
    saasPlan {
        string id PK
        string name
        int priceMonthlyCents
        int monthlyStampsLimit
        int maxOperators
        string allowedModules
    }

    tenant {
        string id PK
        string slug UK
        string name
        string status
        string primaryColor
        int stampsGoal
        string rewardTitle
        string loyaltyContractAddress
        string ownerWallet
    }

    product {
        string id PK
        string tenantRef FK
        string name
        string category
        int priceBrlCents
        int loyaltyStampsCost
        int stampsAwarded
        boolean active
    }

    campaign {
        string id PK
        string tenantRef FK
        string title
        string discountType
        int discountValue
        int onChainTokenId
        datetime startsAt
        datetime endsAt
    }

    OperatorAccount {
        string walletAddress PK
        string tenantSlug FK
        string roleName
    }

    TenantLoyaltyContract {
        string contractAddress PK
        int chainId
        string implementationType
        string adminRoleWallet
    }

    CustomerSmartWallet {
        string smartWalletAddress PK
        string authMethod
        string emailOrOAuthId
    }

    LoyaltyTokenBalance {
        string walletAddress PK,FK
        int tokenId PK
        int stampBalance
        int lifetimeStamps
    }

    TenantCouponsContract {
        string contractAddress PK
        int chainId
    }

    CouponTokenOnChain {
        int tokenId PK
        int maxSupply
        int claimedCount
    }

    CustomerCouponHoldings {
        string walletAddress PK,FK
        int tokenId PK,FK
        int quantity
    }

    TenantPrepaidContract {
        string contractAddress PK
        int chainId
    }

    CustomerPrepaidBalance {
        string walletAddress PK,FK
        int balanceCents
    }

    ThirdwebPaymaster {
        string clientId PK
        int sponsoredQuotaMonth
        string allowedDomains
    }

    GaslessTransaction {
        string txHash PK
        string userOpHash
        string operationType
    }
```

---

## 2. Detalhamento das Entidades

### 2.1. Camada Sanity CMS (Off-Chain / Content Lake)
1. **`saasPlan`**: Define a precificação B2B e as cotas operacionais de cada lojista (volume de selos/mês, número de caixas e módulos liberados).
2. **`tenant`**: Estabelecimento parceiro. Guarda chaves de customização visual (branding), regras do cartão de fidelidade (meta de selos, premiação) e os ponteiros para os contratos inteligentes on-chain.
3. **`product`**: Itens do cardápio/catálogo vinculados ao lojista, suportando precificação mista (R$ e selos) e gatilhos de pontuação.
4. **`campaign`**: Campanhas promocionais sazonais (ex.: cupons de Black Friday), com validade temporal e espelhamento on-chain.

### 2.2. Camada Thirdweb & Base L2 (On-Chain / Smart Contracts)
1. **`CustomerSmartWallet`**: Contas inteligentes (ERC-4337) geradas via In-App Wallet da Thirdweb (autenticação por Google, E-mail ou Passkey).
2. **`TenantLoyaltyContract`**: Contrato clone EIP-1167 exclusivo por loja (ERC-1155 Soulbound). O `tokenId = 0` armazena os selos e `tokenId = 1..N` armazena os badges conquistados.
3. **`TenantCouponsContract`**: Gerenciador de cupons com regras de resgate e queima (*burn*) definitiva no momento do uso.
4. **`TenantPrepaidContract`**: Ledger de saldo pré-pago em centavos de Real.
5. **`ThirdwebPaymaster`**: Infraestrutura que subsidia 100% das taxas de rede (*gasless*), blindando o usuário e o operador de qualquer atrito cripto.

---

## 3. Rastreabilidade Arquitetural
- **RFC Relacionada:** [RFC-001: Arquitetura SaaS B2B2C](./rfc_001_arquitetura_saas_b2b2c_da_plataforma_fidelizon.md)
- **Decisão Arquitetural:** [ADR-001: Infraestrutura e Configuração como Código](./adr_001_adocao_de_infraestrutura_e_configuracao_como_codigo.md)
