# language: pt
Funcionalidade: Acúmulo de Selos no Cartão Fidelidade e Patrocínio de Gás
  Como um cliente realizando uma compra presencial na loja
  Eu quero apresentar meu identificador ou QR Code ao operador de caixa
  Para acumular selos de fidelidade no meu cartão sem pagar taxas de rede (gasless)

  Contexto:
    Dado que o lojista possui o contrato clone "TenantLoyalty" ativo na Base L2
    E o Thirdweb Paymaster está ativo para subsidiar as taxas de transação
    E o operador do caixa está autenticado com carteira autorizada com "OPERATOR_ROLE"

  Cenário: Concessão bem-sucedida de selo na compra de café
    Dado que o cliente possui 2 selos acumulados no cartão da "Cafeteria Aroma"
    E o cliente compra um "Café Expresso Tradicional" que concede 1 selo
    Quando o operador escaneia o identificador do cliente e confirma o carimbo
    Então o contrato "TenantLoyalty" deve executar a cunhagem (mint) de 1 token de selo (id 0) para o cliente
    E a taxa de gás da transação deve ser 100% coberta pelo Thirdweb Paymaster
    E o saldo do cliente deve ser atualizado para 3 selos
    E o histórico de selos vitalícios (lifetime stamps) deve ser incrementado

  Cenário: Bloqueio por Cooldown temporal anti-fraude
    Dado que o lojista configurou um cooldown de 60 segundos entre carimbos
    E o operador carimbou um selo para o cliente há 15 segundos
    Quando o operador tenta carimbar outro selo para o mesmo cliente
    Então o sistema deve rejeitar o registro
    E exibir o alerta "Aguarde 45 segundos para carimbar novamente este cliente"
    E nenhuma transação on-chain deve ser enviada

  Cenário: Tentativa de emissão de selo por operador não autorizado
    Dado que um usuário mal-intencionado não possui a permissão "OPERATOR_ROLE"
    Quando esse usuário tenta invocar a função de cunhagem de selos
    Então a transação deve ser revertida com erro "Acesso Negado: requer OPERATOR_ROLE"
