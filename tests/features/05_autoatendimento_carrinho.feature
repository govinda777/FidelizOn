# language: pt
Funcionalidade: Autoatendimento, Carrinho e Preços Mistos (R$ e Selos)
  Como um cliente no quiosque de autoatendimento ou PWA da loja
  Eu quero montar meu pedido combinando itens pagos em dinheiro/Pix e itens resgatados por selos
  Para ter flexibilidade total no checkout

  Contexto:
    Dado que o cliente está autenticado na "Cafeteria Aroma"
    E o saldo do cliente é de 5 selos

  Cenário: Adicionar produtos regulares em Reais ao carrinho
    Dado que o carrinho está vazio
    Quando o cliente adiciona 2 unidades de "Café Expresso Tradicional" (R$ 7,50 cada)
    E adiciona 1 unidade de "Pão de Queijo Canastra" (R$ 12,00)
    Então o total financeiro do pedido deve ser calculado em R$ 27,00 (2700 centavos)
    E o sistema deve prever que a compra concederá 3 selos após o pagamento

  Cenário: Resgate de item com custo parcial em selos
    Dado que o cliente possui 5 selos no saldo
    Quando o cliente seleciona a opção "Trocar por 3 selos" no item "Cookie Artesanal"
    Então o valor financeiro do Cookie no carrinho deve ser R$ 0,00
    E o custo em selos do carrinho deve indicar 3 selos
    E o saldo remanescente previsto deve ser de 2 selos

  Cenário: Tentativa de resgate sem saldo de selos suficiente
    Dado que o cliente possui apenas 5 selos
    Quando o cliente tenta selecionar a troca por selos do item "Café Especial em Grãos 250g" que custa 10 selos
    Então o sistema deve desabilitar o botão de resgate por selos
    E exibir a mensagem "Você precisa de mais 5 selos para resgatar este item"
