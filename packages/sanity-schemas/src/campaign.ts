export const campaignSchema = {
  name: 'campaign',
  title: 'Campanha de Cupons (Black Friday & Sazonais)',
  type: 'document',
  fields: [
    {
      name: 'tenant',
      title: 'Estabelecimento',
      type: 'reference',
      to: [{ type: 'tenant' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Título da Campanha (ex: Black Friday 30% OFF)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug do Cupom',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'banner',
      title: 'Banner Promocional',
      type: 'image',
    },
    {
      name: 'discountType',
      title: 'Tipo de Desconto',
      type: 'string',
      options: {
        list: [
          { title: 'Percentual (%)', value: 'percentage' },
          { title: 'Valor Fixo (R$)', value: 'fixed' },
        ],
      },
      initialValue: 'percentage',
    },
    {
      name: 'discountValue',
      title: 'Valor do Desconto (ex: 20 para 20%, ou 1000 para R$ 10,00)',
      type: 'number',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'startsAt',
      title: 'Início da Validade',
      type: 'datetime',
    },
    {
      name: 'endsAt',
      title: 'Término da Validade',
      type: 'datetime',
    },
    {
      name: 'maxSupply',
      title: 'Quantidade Total de Cupons (Estoque On-Chain)',
      type: 'number',
      initialValue: 100,
    },
    {
      name: 'onChainTokenId',
      title: 'Token ID correspondente no contrato ERC-1155',
      type: 'number',
    },
    {
      name: 'minStampsRequired',
      title: 'Mínimo de Selos Históricos para ser Elegível (0 = Aberto a todos)',
      type: 'number',
      initialValue: 0,
    },
  ],
};
