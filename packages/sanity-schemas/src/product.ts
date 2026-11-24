export const productSchema = {
  name: 'product',
  title: 'Produto do Catálogo',
  type: 'document',
  fields: [
    {
      name: 'tenant',
      title: 'Estabelecimento Pertencente',
      type: 'reference',
      to: [{ type: 'tenant' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Nome do Item',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Descrição Detalhada',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Foto do Produto',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'active',
      title: 'Disponível para Venda',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'priceBrlCents',
      title: 'Preço em Reais (Centavos, ex: 1500 = R$ 15,00)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'loyaltyStampsCost',
      title: 'Custo de Resgate em Selos (0 se não puder ser trocado por selos)',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'grantsStampOnPurchase',
      title: 'Gera Selo na Compra?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'stampsAwarded',
      title: 'Quantidade de Selos Concedidos',
      type: 'number',
      initialValue: 1,
    },
    {
      name: 'allowPrepaid',
      title: 'Aceita Pagamento com Saldo Pré-Pago?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'eligibleForCoupons',
      title: 'Elegível para Cupons de Desconto?',
      type: 'boolean',
      initialValue: true,
    },
  ],
};
