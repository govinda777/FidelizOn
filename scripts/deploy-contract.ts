import { createThirdwebClient } from 'thirdweb';
import { privateKeyToAccount, getWalletBalance } from 'thirdweb/wallets';
import { deployPublishedContract } from 'thirdweb/deploys';
import { baseSepolia, base } from 'thirdweb/chains';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script IaC: Realiza o deploy do contrato de fidelidade (DropERC1155) na Base Sepolia
 * e atualiza automaticamente os arquivos .env e apps/web/.env.
 */
async function main() {
  const rootEnvPath = path.resolve(process.cwd(), '.env');
  const webEnvPath = path.resolve(process.cwd(), 'apps/web/.env');

  // Carrega variáveis do .env se existirem
  if (fs.existsSync(rootEnvPath)) {
    const lines = fs.readFileSync(rootEnvPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }

  const clientId = process.env.VITE_THIRDWEB_CLIENT_ID;
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!secretKey && !clientId) {
    console.error('❌ Erro: Configure VITE_THIRDWEB_CLIENT_ID e THIRDWEB_SECRET_KEY no .env');
    process.exit(1);
  }

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId: clientId || '' }
  );

  const rawKey = (adminPrivateKey || '').trim().replace(/['"]/g, '');
  if (!rawKey) {
    console.error('\n❌ Erro: ADMIN_PRIVATE_KEY não definida na sessão atual do terminal nem no .env.');
    console.log('👉 Para gerar uma carteira administrativa nova, execute:');
    console.log('   npm run create-wallet');
    console.log('\nDepois de abastecer com ETH de teste nas torneiras (faucets), exporte:');
    console.log('   export ADMIN_PRIVATE_KEY="0x..."');
    console.log('   npm run deploy:contract\n');
    process.exit(1);
  }

  const formattedKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`;
  const account = privateKeyToAccount({ client, privateKey: formattedKey });
  const network = process.env.VITE_ACTIVE_CHAIN === 'base' ? base : baseSepolia;

  console.log(`🚀 Conectando à rede: ${network.name}...`);
  console.log(`👤 Carteira Administradora: ${account.address}`);

  // Verifica o saldo da carteira antes de tentar o deploy
  try {
    const balance = await getWalletBalance({
      client,
      chain: network,
      address: account.address,
    });

    console.log(`💰 Saldo atual: ${balance.displayValue} ${balance.symbol}`);

    if (balance.value === 0n) {
      console.log('\n' + '='.repeat(70));
      console.log(`⚠️  SALDO INSUFICIENTE PARA O DEPLOY NA ${network.name.toUpperCase()}`);
      console.log('='.repeat(70));
      console.log(`A sua carteira (${account.address}) está com 0 ${balance.symbol} de teste.`);
      console.log('Para registrar o contrato na blockchain, você precisa de uma fração de ETH gratuito.');
      console.log('\n👉 TORNEIRAS (FAUCETS) DISPONÍVEIS:');
      console.log('1. https://faucets.chain.link (selecione Base Sepolia)');
      console.log('2. https://www.alchemy.com/faucets/base-sepolia');
      console.log('3. https://coinbase.com/faucets/base-ethereum-sepolia-faucet');
      console.log(`\nCole seu endereço: ${account.address}`);
      console.log('Solicite o ETH gratuito e rode novamente: npm run deploy:contract');
      console.log('='.repeat(70) + '\n');
      process.exit(1);
    }
  } catch (err) {
    console.warn('⚠️ Não foi possível verificar o saldo previamente. Prosseguindo com o deploy...');
  }

  try {
    console.log('⏳ Realizando deploy do contrato DropERC1155 (FidelizOn Loyalty)...');
    const contractAddress = await deployPublishedContract({
      client,
      chain: network,
      account,
      contractId: 'DropERC1155',
      contractParams: {
        _defaultAdmin: account.address,
        _name: 'FidelizOn - Cartão Fidelidade',
        _symbol: 'FIDELIZ',
        _contractURI: '',
        _trustedForwarders: [],
        _saleRecipient: account.address,
        _royaltyRecipient: account.address,
        _royaltyBps: 0n,
        _platformFeeBps: 0n,
        _platformFeeRecipient: account.address,
        name: 'FidelizOn - Cartão Fidelidade',
        symbol: 'FIDELIZ',
        description: 'Coleção de selos e badges de fidelidade da plataforma FidelizOn.',
        primary_sale_recipient: account.address,
      },
    });

    console.log(`\n🎉 Contrato deployado com sucesso!`);
    console.log(`📍 Endereço na ${network.name}: ${contractAddress}`);

    // Atualiza o .env na raiz
    updateEnvFile(rootEnvPath, 'VITE_LOYALTY_CONTRACT_ADDRESS', contractAddress);
    // Atualiza o apps/web/.env
    updateEnvFile(webEnvPath, 'VITE_LOYALTY_CONTRACT_ADDRESS', contractAddress);

    console.log('✅ Arquivos .env atualizados com o endereço do contrato automaticamente!\n');
  } catch (error: any) {
    console.error('❌ Falha ao realizar deploy do contrato:', error);
    process.exit(1);
  }
}

function updateEnvFile(filePath: string, key: string, value: string) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(`${key}=`)) {
    content = content.replace(new RegExp(`${key}=.*`), `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

main();
