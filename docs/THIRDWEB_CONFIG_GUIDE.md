# 🌐 Guia de Configuração: Thirdweb Dashboard & Web3 Invisível

Este documento orienta a configuração dos serviços de infraestrutura Web3 da plataforma **FidelizOn**, baseados no **Thirdweb SDK v5** e na rede **Base (Ethereum L2)**.

---

## 1. Criação de API Key e Restrição de Domínios (Segurança)

1. Acesse o [Thirdweb Dashboard](https://thirdweb.com/dashboard/settings/api-keys).
2. Clique em **Create API Key**.
3. Defina o nome: `FidelizOn-Platform`.
4. **Allowed Domains (CRÍTICO):** Para evitar que terceiros utilizem suas cotas de RPC e Paymaster, **NUNCA** marque *All Domains*. Especifique explicitamente:
   - `localhost:5173` (Ambiente de desenvolvimento local)
   - `govinda777.github.io` (Seu endereço oficial no GitHub Pages)
   - `fidelizon.com.br` (Domínio customizado em produção, caso aplicável).
5. Copie o **Client ID** (chave pública) e configure em `VITE_THIRDWEB_CLIENT_ID`.

---

## 2. In-App Embedded Wallets (Login Sem Chaves Privadas)

O FidelizOn utiliza carteiras inteligentes embutidas para garantir que o cliente final e o lojista façam login com a experiência Web2 tradicional:

1. No Thirdweb Dashboard, vá na aba **In-App Wallets**.
2. Habilite os métodos de autenticação desejados:
   - **Google (OAuth)** (Recomendado para lojistas e clientes rápidos)
   - **E-mail (Código OTP de 6 dígitos)**
   - **Telefone / SMS / WhatsApp** (Opcional)
   - **Passkey / Biometria** (Para dispositivos móveis modernos).
3. Salve as alterações.

---

## 3. Account Abstraction (ERC-4337) & Transações Gasless (Paymaster)

Para que nem o cliente nem o operador de caixa precisem possuir ETH para registrar carimbos no cartão fidelidade:

1. No dashboard, acesse a aba **Account Abstraction / Gas Sponsorship**.
2. Selecione a rede desejada:
   - **Base Sepolia (Testnet - Chain ID 84532):** Para desenvolvimento e homologação sem custos.
   - **Base Mainnet (Chain ID 8453):** Para ambiente de produção.
3. Ative a opção **Sponsor Transactions (Paymaster)**.
4. **Regras de Patrocínio (Cotas de Segurança):**
   - Configure um limite diário/mensal de patrocínio (ex.: US$ 50,00 ou cota de 10.000 transações) para blindar a plataforma contra abusos ou ataques de repetição.
5. Copie o endereço do **Smart Account Factory** fornecido ou utilize o padrão da Thirdweb integrado ao SDK v5.

---

## 4. Estratégia On-Chain: Contratos Clones por Estabelecimento

A RFC-001 especifica o padrão **EIP-1167 (Minimal Proxy Clones)**:
- Cada estabelecimento (*Tenant*) possui sua coleção de selos isolada (`TenantLoyalty`).
- Permissões on-chain:
  - `TENANT_ADMIN_ROLE`: Carteira do dono do estabelecimento (gerencia operadores e regras).
  - `OPERATOR_ROLE`: Carteiras de caixas e funcionários (marcam `+1` selo e dão baixa em resgates).
  - `PLATFORM_RECOVERY_ROLE`: Carteira de suporte da FidelizOn para emergências e governança.
