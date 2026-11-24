export const saasPlanSchema = {
  name: 'saasPlan',
  title: 'Plano de Assinatura (SaaS FidelizOn)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome do Plano (ex: Starter, Pro, Enterprise)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceMonthlyCents',
      title: 'Preço Mensal em Centavos (ex: 9900 = R$ 99,00)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'stampsMonthlyLimit',
      title: 'Limite Mensal de Transações/Selos Patrocinados (Paymaster)',
      type: 'number',
      initialValue: 1000,
    },
    {
      name: 'maxOperators',
      title: 'Limite de Operadores de Caixa',
      type: 'number',
      initialValue: 3,
    },
    {
      name: 'allowedModules',
      title: 'Módulos Liberados',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Cartão Fidelidade (Loyalty)', value: 'loyalty' },
          { title: 'Catálogo de Produtos', value: 'products' },
          { title: 'Terminal de Autoatendimento', value: 'selfService' },
          { title: 'Cupons e Black Friday', value: 'coupons' },
          { title: 'Cartão Pré-Pago', value: 'prepaid' },
        ],
      },
    },
  ],
};
