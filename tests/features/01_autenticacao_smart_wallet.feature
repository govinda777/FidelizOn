# language: pt
Funcionalidade: Autenticação Invisível e Criação de Smart Wallet (ERC-4337)
  Como um cliente final ou lojista da plataforma FidelizOn
  Eu quero me autenticar usando métodos tradicionais da Web2 (Google, E-mail ou Biometria)
  Para que uma Smart Wallet seja provisionada automaticamente sem complexidade de chaves privadas ou seed phrases

  Contexto:
    Dado que a plataforma FidelizOn está configurada com o Thirdweb SDK v5
    E a rede ativa configurada é "Base Sepolia"
    E a política de Account Abstraction com Paymaster está habilitada

  Cenário: Login bem-sucedido de cliente via Google OAuth
    Dado que o cliente acessa a página da loja "/cafeteria-aroma"
    Quando o cliente clica em "Entrar com Google"
    E conclui a autorização com o e-mail "cliente@gmail.com"
    Então o sistema deve provisionar uma "Smart Account" ERC-4337 associada ao e-mail
    E o endereço público da carteira deve ser exibido de forma truncada no cabeçalho
    E o cliente não deve ser solicitado a guardar seed phrases ou assinar transações manuais com taxas

  Cenário: Login bem-sucedido via código OTP por E-mail
    Dado que o cliente está na tela de autenticação
    Quando o cliente insere o e-mail "usuario@teste.com" e solicita o código
    E digita o código OTP de 6 dígitos "123456" enviado para sua caixa de entrada
    Então a sessão do usuário deve ser autenticada com sucesso
    E a mesma Smart Wallet persistida anteriormente para esse e-mail deve ser recuperada

  Cenário: Tentativa de login com código OTP inválido ou expirado
    Dado que o cliente solicitou um código OTP para "usuario@teste.com"
    Quando o cliente informa o código "000000" incorreto
    Então o sistema deve exibir a mensagem de erro "Código de verificação inválido ou expirado"
    E a Smart Wallet não deve ser desbloqueada
