import crypto from 'crypto';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { createThirdwebClient } from 'thirdweb';

/**
 * Utilitário: Gera uma carteira de testes descartável e segura para deploy na Base Sepolia.
 */
function main() {
  const client = createThirdwebClient({
    clientId: '00000000000000000000000000000000',
  });

  // Gera uma chave privada criptograficamente segura de 32 bytes hexadecimais
  const randomHex = crypto.randomBytes(32).toString('hex');
  const privateKey = `0x${randomHex}` as const;
  const account = privateKeyToAccount({ client, privateKey });

  console.log('='.repeat(75));
  console.log('✨ NOVA CARTEIRA ADMINISTRADORA GERADA (FIDELIZON)');
  console.log('='.repeat(75));
  console.log(`\n📍 Endereço Público (Pode compartilhar):`);
  console.log(`   ${account.address}`);
  console.log(`   👉 Use este endereço para solicitar ETH gratuito nas torneiras (faucets) da Base Sepolia.`);
  console.log(`\n🔑 Chave Privada (ADMIN_PRIVATE_KEY):`);
  console.log(`   ${privateKey}`);

  console.log('\n' + '-'.repeat(75));
  console.log('🛡️  BOA PRÁTICA DE CUSTÓDIA: SALVE NO SEU GERENCIADOR (PROTON PASS)');
  console.log('-'.repeat(75));
  console.log('Para evitar perda de acesso ou vazamento acidental em commits do Git:');
  console.log('1. Salve no seu gerenciador de senhas (ex: Proton Pass):');
  console.log('   - Título: "FidelizOn - Admin Wallet (Base Sepolia)"');
  console.log(`   - Campo Usuário: ${account.address}`);
  console.log(`   - Campo Senha / Nota Secreta: ${privateKey}`);
  console.log('2. Exporte temporariamente na sua sessão do terminal antes do deploy:');
  console.log(`   export ADMIN_PRIVATE_KEY="${privateKey}"`);
  console.log('='.repeat(75) + '\n');
}

main();
