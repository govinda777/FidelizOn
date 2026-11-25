# language: pt
Funcionalidade: Catálogo Multi-Tenant e Resolução de Conteúdo no Sanity CMS
  Como um cliente acessando uma loja parceira
  Eu quero visualizar a identidade visual personalizada e o cardápio da loja carregados do Sanity Content Lake
  Para que a experiência seja totalmente customizada para aquele estabelecimento

  Contexto:
    Dado que o Sanity CMS está configurado com o dataset "production"
    E o endpoint do Sanity CDN está ativo

  Cenário: Resolução de estabelecimento existente via slug
    Dado que o cliente navega para a URL "/cafeteria-aroma"
    Quando a aplicação consulta o Sanity pelo slug "cafeteria-aroma"
    Então o documento do tenant "Cafeteria Aroma" deve ser carregado com sucesso
    E a cor primária da interface deve ser aplicada como "#10B981"
    E a mensagem de boas-vindas deve ser exibida no topo
    E a meta de 10 selos para o prêmio "1 Café Especial 250g Grátis" deve ser renderizada

  Cenário: Listagem de produtos ativos com precificação mista
    Dado que a loja "cafeteria-aroma" possui 6 produtos cadastrados e ativos no Sanity
    Quando a lista de produtos é renderizada
    Então cada produto deve exibir seu preço em Reais (centavos convertidos)
    E o item "Café Especial em Grãos 250g" deve exibir a opção de resgate por "10 selos"
    E o item "Cookie Artesanal" deve exibir a opção de resgate por "3 selos"

  Cenário: Resiliência e Fallback para Loja Modelo Offline
    Dado que a conexão com o Sanity CMS falha ou as credenciais estão ausentes
    Quando o cliente requisita a loja modelo "cafeteria-aroma"
    Então o "storeService" deve interceptar o erro de rede
    E carregar os dados embutidos da loja modelo seed "cafeteria-aroma"
    E a aplicação deve continuar navegável sem travar para o usuário
