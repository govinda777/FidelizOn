# language: pt
Funcionalidade: Campanhas Promocionais e Cupons de Black Friday
  Como um lojista parceiro
  Eu quero disparar cupons sazonais com limites de estoque e validade
  Para atrair e recompensar clientes durante datas especiais como Black Friday

  Contexto:
    Dado que existe uma campanha ativa "Black Friday Cafeteria Aroma - 20% OFF"
    E o cupom oferece 20% de desconto
    E o estoque máximo é de 200 cupons (onChainTokenId 1)
    E o cliente está autenticado com sua Smart Wallet

  Cenário: Aplicação bem-sucedida de cupom percentual no checkout
    Dado que o cliente possui itens no valor total de R$ 50,00 no carrinho
    Quando o cliente aplica o cupom "black-friday-20"
    Então o valor do desconto deve ser calculado como R$ 10,00 (20% de R$ 50,00)
    E o valor final a pagar deve ser atualizado para R$ 40,00

  Cenário: Restrição de um cupom por carteira
    Dado que o cliente já resgatou e utilizou o cupom "black-friday-20" anteriormente
    Quando o cliente tenta resgatar o mesmo cupom novamente
    Então o contrato "TenantCoupons" deve rejeitar a transação
    E o sistema deve alertar "Você já atingiu o limite de resgate deste cupom"

  Cenário: Rejeição de cupom com estoque esgotado
    Dado que todos os 200 cupons da campanha já foram cunhados
    Quando um novo cliente tenta resgatar o cupom
    Então a transação deve ser bloqueada com o erro "Estoque esgotado para esta campanha"
