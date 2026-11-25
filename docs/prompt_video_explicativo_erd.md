# 🎬 Roteiro e Prompt de Produção de Vídeo: Arquitetura e ERD FidelizOn (Sanity CMS + Thirdweb)

> Este prompt foi estruturado para ser utilizado em geradores de vídeo por IA (como InVideo, HeyGen, Synthesia, Runway) ou como roteiro técnico (*storyboard*) para gravação com motion design.

---

## 🎯 Metadados e Diretrizes de Produção

- **Título do Vídeo:** *Por Dentro do FidelizOn: Arquitetura Híbrida Web2 + Web3 e Modelo Entidade-Relacionamento*
- **Duração Estimada:** 4 a 6 minutos
- **Público-Alvo:** Desenvolvedores, Arquitetos de Software, Tech Leads, Gerentes de Produto e Stakeholders
- **Tom de Voz:** Técnico, didático, profissional, moderno e inspirador
- **Estilo Visual:** Interface escura (*Dark Mode* moderno), diagramas técnicos animados (estilo Manim/Mermaid fluido), efeitos de luz neon (verde esmeralda `#10B981` e azul Base L2 `#0052FF`), divisões de tela dinâmicas (*split-screen*)
- **Trilha Sonora:** Lo-fi eletrônico/synthwave corporativo suave de fundo, transmitindo inovação e tecnologia

---

## 📝 Prompt Mestre para Geradores de Vídeo por IA

Copie e cole o prompt estruturado abaixo na ferramenta de criação de vídeo ou passe para a equipe audiovisual:

```text
Atue como um Diretor de Tecnologia e Motion Designer especializado em Engenharia de Software e Web3. Crie um vídeo explicativo e dinâmico de 5 minutos detalhando a arquitetura e o Modelo Entidade-Relacionamento (ERD) da plataforma "FidelizOn".

O FidelizOn é um SaaS B2B2C de fidelidade inteligente que une duas camadas complementares:
1. Camada Off-Chain (Sanity CMS / Content Lake): gerenciamento flexível de catálogo, identidade visual e regras de negócio.
2. Camada On-Chain (Thirdweb / Base L2): identidade segura via carteiras inteligentes (ERC-4337), contratos clones isolados por loja (EIP-1167) e transações sem fricção (gasless).

Siga rigorosamente a seguinte estrutura cena a cena, incluindo narração em áudio (voz profissional em português brasileiro), elementos visuais em tela e transições:

[CENA 1: INTRODUÇÃO & O PARADIGMA HÍBRIDO - 00:00 a 00:45]
- VISUAL: Abertura cinematográfica com o logo da FidelizOn pulsando. A tela se divide ao meio: do lado esquerdo (ícone laranja/vermelho representando Sanity CMS - Nuvem e Conteúdo); do lado direito (ícone azul representando Thirdweb & Base L2 - Blockchain).
- TEXTO EM TELA: "FidelizOn: O Encontro do Web2 com a Imutabilidade Web3"
- LOCUÇÃO: "Como construir uma plataforma de fidelidade que ofereça a agilidade de um e-commerce moderno e, ao mesmo tempo, a segurança criptográfica da blockchain, sem exigir que o cliente final sequer saiba o que é uma carteira digital? Sejam bem-vindos à arquitetura do FidelizOn. Hoje vamos dissecar o Modelo Entidade-Relacionamento que faz essa engrenagem funcionar em perfeita harmonia entre o Sanity CMS e a infraestrutura Thirdweb."

[CENA 2: A CAMADA OFF-CHAIN NO SANITY CMS - 00:45 a 01:45]
- VISUAL: Zoom suave no lado esquerdo da tela. Surge o diagrama das entidades do Sanity destacadas em cards elegantes com seus campos.
  Cards: [saasPlan] conectando-se a [tenant], que se conecta a [product] e [campaign].
- ANIMAÇÃO: Destaque com efeito de brilho nos relacionamentos (1 plano para N tenants; 1 tenant para N produtos).
- TEXTO EM TELA: "Camada Sanity: Catálogo Dinâmico & Multi-Tenant"
- LOCUÇÃO: "Tudo começa no Sanity CMS, nossa fonte de verdade off-chain. Aqui gerenciamos:
Primeiro, o 'saasPlan', que dita as regras do nosso negócio B2B: planos como Starter ou Pro, que limitam cotas de selos e operadores liberados.
Cada plano atende múltiplos 'tenants', os nossos lojistas. O Tenant guarda a identidade visual, mensagens de boas-vindas, a meta do cartão de fidelidade e os apontadores para a blockchain.
Vinculados a cada tenant, temos o catálogo de 'product', definindo preços em reais, mas também o custo de resgate em selos e quantos selos o item concede.
E para ações promocionais, a entidade 'campaign' gerencia cupons sazonais, como a Black Friday, com datas de início e fim."

[CENA 3: A PONTE HÍBRIDA (COMO AS DUAS CAMADAS SE FALAM) - 01:45 a 02:45]
- VISUAL: Linhas de energia luminosas conectam os documentos do Sanity aos Smart Contracts no lado Web3.
  Destaque na entidade [tenant] apontando para [TenantLoyaltyContract], [TenantCouponsContract] e [OperatorAccount].
  Destaque na entidade [campaign] apontando para [CouponTokenOnChain] via onChainTokenId.
- TEXTO EM TELA: "A Conexão Híbrida: IDs do Sanity vinculados a Contratos Inteligentes"
- LOCUÇÃO: "Mas como o catálogo do Sanity conversa com o mundo Web3? Essa é a chave de ouro da nossa arquitetura.
O documento do lojista no Sanity guarda os endereços dos seus contratos exclusivos na rede Base L2: o Loyalty Contract e o Coupons Contract.
Além disso, autoriza operadores de caixa através de suas carteiras com a role 'OPERATOR_ROLE'.
Já as campanhas promocionais possuem o atributo 'onChainTokenId', ligando diretamente um banner visual no Sanity a um token utilitário emitido on-chain."

[CENA 4: A CAMADA ON-CHAIN NO THIRDWEB & BASE L2 - 02:45 a 03:45]
- VISUAL: Zoom no lado direito. Diagrama dos contratos e carteiras inteligentes.
  Cards: [CustomerSmartWallet] conectada a [LoyaltyTokenBalance], [CustomerCouponHoldings] e [CustomerPrepaidBalance].
  Destaque no contrato [TenantLoyaltyContract] com selos (token 0) e badges de nível (tokens 1 a N).
- TEXTO EM TELA: "Camada Web3: Contratos Clones EIP-1167 & Carteiras ERC-4337"
- LOCUÇÃO: "No lado da Thirdweb e da rede Base, cada loja possui contratos leves e independentes baseados no padrão de clones EIP-1167. Isso isola os saldos e impede que selos de uma cafeteria se misturem com os de outra.
Para o cliente, nada de frases sementes ou extensões complexas: a 'CustomerSmartWallet' é uma carteira inteligente ERC-4337 criada instantaneamente via login social por Google ou biometria.
Nela ficam registrados os selos de fidelidade na entidade 'LoyaltyTokenBalance', cupons resgatados em 'CustomerCouponHoldings' e até saldos pré-pagos em centavos na entidade 'CustomerPrepaidBalance'."

[CENA 5: A MÁGICA DO GASLESS COM THIRDWEB PAYMASTER - 03:45 a 04:30]
- VISUAL: Animação mostrando uma transação ocorrendo. O operador escaneia o QR Code dinâmico do cliente. Uma nuvem protetora chamada [ThirdwebPaymaster] intercepta a transação e cobre a taxa de rede. A transação é gravada na blockchain sem cobrar nenhuma criptomoeda do usuário.
- TEXTO EM TELA: "Account Abstraction (ERC-4337): Transações Zero Gás para o Cliente"
- LOCUÇÃO: "A grande barreira da Web3 sempre foi o custo do gás. No FidelizOn, eliminamos essa barreira com o 'ThirdwebPaymaster'.
Quando o caixa carimba o cartão ou o cliente resgata um produto, o Paymaster patrocina 100% da taxa da rede Base através da nossa cota de API.
Nem o operador de caixa nem o cliente precisam possuir um único centavo de Ethereum para validar seus benefícios. É a experiência fluida da Web2 com a segurança e auditabilidade da Web3."

[CENA 6: EXEMPLO PRÁTICO (JORNADA DA CAFETERIA AROMA) - 04:30 a 05:15]
- VISUAL: Demonstração da tela da aplicação rodando com a Loja Modelo 'Cafeteria Aroma'. Mostra o cartão fidelidade acumulando selos (9/10... 10/10), gerando o QR Code de resgate do Café Especial em Grãos e o operador confirmando a baixa no PDV.
- TEXTO EM TELA: "Loja Modelo Cafeteria Aroma: Demonstração em Tempo Real"
- LOCUÇÃO: "Vejamos isso na prática com a nossa loja modelo: a Cafeteria Aroma.
O cardápio com cafés artesanais e pães de queijo é servido instantaneamente pelo Sanity CDN.
Ao comprar seu expresso, o cliente apresenta seu QR Code. O operador carimba o décimo selo. A Smart Wallet reconhece a meta batida e queima os 10 selos no contrato on-chain em troca do Café Especial 250g.
Tudo rápido, transparente, auditável e imutável."

[CENA 7: CONCLUSÃO & ENCERRAMENTO - 05:15 a 05:45]
- VISUAL: Diagrama ERD completo reunido na tela inteira com as conexões brilhando suavemente. Links para o repositório GitHub e para a documentação técnica. Logo FidelizOn ao centro.
- TEXTO EM TELA: "Arquitetura Pronta para Escalar | Repositório no GitHub"
- LOCUÇÃO: "Essa é a arquitetura do FidelizOn: dados flexíveis no Sanity, propriedade real no Thirdweb e foco absoluto na experiência do usuário.
Toda a modelagem e os diagramas completos estão documentados no nosso repositório. Obrigado por assistir, e até o próximo deploy!"
```
