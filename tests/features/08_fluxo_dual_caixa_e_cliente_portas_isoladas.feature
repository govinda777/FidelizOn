# language: pt
Funcionalidade: Fluxo Dual de Caixa e Cliente em Instâncias e Portas Isoladas
  Como arquiteto e desenvolvedor da plataforma FidelizOn
  Eu quero executar instâncias dedicadas para o Cliente (porta 5173) e para o Caixa (porta 5174)
  Para simular com fidelidade a interação física de PDV e consumidor sem compartilhamento indevido de estado ou privilégios

  Contexto:
    Dado que a plataforma suporta execução multi-instância local
    E a porta 5173 está reservada para a interface do Cliente
    E a porta 5174 está reservada para o Terminal de PDV do Caixa
    E o contrato inteligente DropERC1155 está ativo na Base Sepolia com MINTER_ROLE configurada

  Cenário: Inicialização da interface do Cliente na porta 5173
    Dado que o usuário acessa a aplicação na porta "5173"
    Quando a aplicação é carregada no navegador
    Então o papel ativo deve ser automaticamente "customer"
    E o Cartão Fidelidade do Cliente deve ser visível na tela
    E o painel administrativo de carimbo do Caixa não deve estar exposto
    E o botão de autoatendimento e catálogo deve estar disponível

  Cenário: Inicialização do Terminal do Caixa na porta 5174
    Dado que o operador acessa a aplicação na porta "5174"
    Quando a aplicação é carregada no terminal do operador
    Então o papel ativo deve ser automaticamente "cashier"
    E o Terminal do Caixa deve exibir as permissões de operador ("MINTER / OPERATOR")
    E as ações de "Confirmar +1 Selo" e "Escanear QR de Resgate" devem estar habilitadas
    E o cartão de cliente não deve ser manipulável diretamente sem um QR válido

  Cenário: Interação de ponta a ponta entre a porta do Cliente e a porta do Caixa
    Dado que o cliente na porta 5173 possui 9 selos e gera um QR Code Dinâmico
    Quando o operador do caixa na porta 5174 processa a leitura do QR do cliente
    Então o caixa deve emitir o 10º selo via contrato on-chain
    E a meta de 10 selos deve ser completada
    E o cliente na porta 5173 deve ter seu estado atualizado com recompensa pronta para resgate
