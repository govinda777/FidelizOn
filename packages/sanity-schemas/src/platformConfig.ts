export const platformConfigSchema = {
  name: 'platformConfig',
  title: 'Configurações Globais da Plataforma FidelizOn',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Título Principal do Hotsite B2B',
      type: 'string',
    },
    {
      name: 'heroSubtitle',
      title: 'Subtítulo Explicativo',
      type: 'text',
    },
    {
      name: 'benefits',
      title: 'Lista de Vantagens e Benefícios',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Título', type: 'string' },
            { name: 'description', title: 'Descrição', type: 'text' },
            { name: 'icon', title: 'Ícone ou Ilustração', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'faq',
      title: 'Perguntas Frequentes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Pergunta', type: 'string' },
            { name: 'answer', title: 'Resposta', type: 'text' },
          ],
        },
      ],
    },
  ],
};
