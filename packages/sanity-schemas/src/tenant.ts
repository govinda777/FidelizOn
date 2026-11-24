export const tenantSchema = {
  name: 'tenant',
  title: 'Estabelecimento / Lojista (Tenant)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome do Estabelecimento',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Identificador Único na URL (slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status da Conta',
      type: 'string',
      options: {
        list: [
          { title: 'Ativo', value: 'active' },
          { title: 'Período de Testes (Trial)', value: 'trial' },
          { title: 'Inadimplente (Past Due)', value: 'past_due' },
          { title: 'Suspenso', value: 'suspended' },
        ],
      },
      initialValue: 'active',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'plan',
      title: 'Plano Contratado',
      type: 'reference',
      to: [{ type: 'saasPlan' }],
    },
    {
      name: 'branding',
      title: 'Identidade Visual & Customização',
      type: 'object',
      fields: [
        { name: 'logo', title: 'Logo da Loja', type: 'image' },
        { name: 'primaryColor', title: 'Cor Primária (Hex)', type: 'string', initialValue: '#10B981' },
        { name: 'bannerImage', title: 'Banner de Destaque', type: 'image' },
        { name: 'welcomeMessage', title: 'Mensagem de Boas-vindas', type: 'text' },
      ],
    },
    {
      name: 'loyaltyConfig',
      title: 'Regras do Cartão Fidelidade',
      type: 'object',
      fields: [
        { name: 'stampsGoal', title: 'Meta de Selos para Prêmio', type: 'number', initialValue: 10 },
        { name: 'rewardTitle', title: 'Descrição do Prêmio', type: 'string', initialValue: '1 Café Especial Grátis' },
        { name: 'cooldownSeconds', title: 'Tempo Mínimo entre Carimbos (segundos)', type: 'number', initialValue: 60 },
      ],
    },
    {
      name: 'web3',
      title: 'Configurações de Contratos Web3',
      type: 'object',
      fields: [
        { name: 'chainId', title: 'Chain ID', type: 'number', initialValue: 8453 },
        { name: 'loyaltyContractAddress', title: 'Endereço do Contrato de Fidelidade', type: 'string' },
        { name: 'couponsContractAddress', title: 'Endereço do Contrato de Cupons', type: 'string' },
        { name: 'prepaidContractAddress', title: 'Endereço do Contrato de Pré-Pago', type: 'string' },
        { name: 'ownerWallet', title: 'Carteira do Dono (TENANT_ADMIN)', type: 'string' },
      ],
    },
    {
      name: 'enabledModules',
      title: 'Módulos Habilitados',
      type: 'object',
      fields: [
        { name: 'loyalty', title: 'Cartão Fidelidade', type: 'boolean', initialValue: true },
        { name: 'products', title: 'Cadastro de Produtos', type: 'boolean', initialValue: true },
        { name: 'selfService', title: 'Autoatendimento', type: 'boolean', initialValue: true },
        { name: 'coupons', title: 'Cupons / Black Friday', type: 'boolean', initialValue: false },
        { name: 'prepaid', title: 'Cartão Pré-Pago', type: 'boolean', initialValue: false },
      ],
    },
  ],
};
