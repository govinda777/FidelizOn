# language: pt
Funcionalidade: Isolamento Multi-Tenant e Segurança On-Chain
  Como a governança da plataforma FidelizOn
  Eu quero que cada lojista opere em seu próprio contrato clone EIP-1167
  Para assegurar que selos, saldos e permissões fiquem 100% isolados entre estabelecimentos concorrentes

  Contexto:
    Dado que existem dois lojistas cadastrados na plataforma:
      | Tenant Slug       | Nome              | Contrato Loyalty |
      | cafeteria-aroma   | Cafeteria Aroma   | 0x1111...1111    |
      | padaria-central   | Padaria Central   | 0x2222...2222    |

  Cenário: Selos da Cafeteria Aroma não podem ser resgatados na Padaria Central
    Dado que o cliente possui 10 selos no contrato "0x1111...1111" da "Cafeteria Aroma"
    E possui 0 selos no contrato "0x2222...2222" da "Padaria Central"
    Quando o cliente tenta solicitar um resgate na "Padaria Central"
    Então o saldo verificado no contrato da Padaria Central deve ser 0 selos
    E o sistema não deve permitir o resgate
    E os selos da Cafeteria Aroma devem permanecer intactos

  Cenário: Operador da Cafeteria Aroma não pode carimbar na Padaria Central
    Dado que o operador "0xOperatorAroma" possui "OPERATOR_ROLE" apenas no contrato "0x1111...1111"
    Quando o operador tenta enviar uma transação de carimbo para o contrato "0x2222...2222"
    Então a blockchain Base L2 deve reverter a chamada por falta de permissão
    E nenhum selo deve ser emitido
