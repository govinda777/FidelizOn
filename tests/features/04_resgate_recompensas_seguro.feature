# language: pt
Funcionalidade: Resgate Seguro de Recompensas e Queima de Selos
  Como um cliente fiel que atingiu a meta do cartão
  Eu quero resgatar meu prêmio gerando um QR Code dinâmico seguro
  Para que o caixa libere o item e queime os selos utilizados de forma inviolável

  Contexto:
    Dado que a meta de selos da "Cafeteria Aroma" é 10 selos
    E o prêmio configurado é "1 Café Especial 250g Grátis"
    E o cliente possui saldo de 10 selos acumulados

  Cenário: Geração de QR Code dinâmico com nonce e expiração
    Dado que o cliente clica no botão "Resgatar Prêmio"
    Quando o aplicativo gera o payload de resgate
    Então o QR Code deve conter o endereço da carteira, timestamp, nonce criptográfico e hash de assinatura
    E o tempo de validade do QR Code deve ser de 3 minutos
    E um contador regressivo deve ser exibido na tela do cliente

  Cenário: Baixa bem-sucedida do resgate pelo operador do caixa
    Dado que o cliente apresenta o QR Code de resgate válido ao caixa
    Quando o operador escaneia o código no scanner do PDV
    E confirma a entrega do prêmio "1 Café Especial 250g Grátis"
    Então o contrato inteligente deve executar a queima (burn) de 10 selos da carteira do cliente
    E o saldo do cliente deve retornar para 0 selos
    E o QR Code dinâmico utilizado deve ser invalidado para impedir reuso (anti-replay attack)
    E a transação deve ser registrada no histórico do cliente como resgate concluído

  Cenário: Tentativa de resgate com QR Code expirado
    Dado que o cliente gerou um QR Code de resgate há mais de 3 minutos
    Quando o operador do caixa escaneia o código
    Então o scanner do PDV deve acusar "QR Code expirado. Por favor, gere um novo código"
    E nenhum selo deve ser debitado da carteira do cliente
