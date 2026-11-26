import { createThirdwebClient, getContract } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { grantRole, hasRole } from 'thirdweb/extensions/permissions';
import { baseSepolia, base } from 'thirdweb/chains';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script IaC: Gerenciamento de Controle de Acesso (RBAC) no Contrato DropERC1155.
 * Distingue as funções do Caixa/Operador (MINTER_ROLE) das permissões do Cliente comum.
 */
async function main() {
  const rootEnvPath = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(rootEnvPath)) {
    const lines = fs.readFileSync(rootEnvPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }

  const clientId = process.env.VITE_THIRDWEB_CLIENT_ID;
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.VITE_LOYALTY_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error('❌ Erro: VITE_LOYALTY_CONTRACT_ADDRESS não configurado.');
    process.exit(1);
  }

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId: clientId || '' }
  );

  const rawKey = (adminPrivateKey || '').trim().replace(/['"]/g, '');
  const formattedKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`;
  const adminAccount = privateKeyToAccount({ client, privateKey: formattedKey });
  const network = process.env.VITE_ACTIVE_CHAIN === 'base' ? base : baseSepolia;

  const contract = getContract({
    client,
    chain: network,
    address: contractAddress,
  });

  // Endereço de exemplo para carteira do operador de caixa
  const cashierWallet = process.argv[2] || '0x4dC1E996baeEb35Ee74DcedD83022093d1B60051';

  console.log(`🔐 Configurando Controle de Acesso no Contrato: ${contractAddress}`);
  console.log(`👤 Administrador do Contrato: ${adminAccount.address}`);
  console.log(`🏪 Carteira do Operador/Caixa: ${cashierWallet}`);

  try {
    const isMinter = await hasRole({
      contract,
      role: 'minter',
      target: cashierWallet,
    });

    console.log(`🔎 Status atual de 'minter' para o caixa: ${isMinter ? 'ATIVO ✅' : 'INATIVO ❌'}`);

    if (!isMinter) {
      console.log('⏳ Concedendo permissão de MINTER ao Caixa...');
      const tx = grantRole({
        contract,
        role: 'minter',
        target: cashierWallet,
      });
      // Emissão via conta admin
      console.log(`✅ Permissão de minter pronta para envio on-chain pela conta admin.`);
    }

    console.log('\n--- Arquitetura de Permissões ---');
    console.log('1. ADMIN (Lojista Proprietário): Configura regras, contratos e autoriza caixas.');
    console.log('2. MINTER / OPERATOR (Caixa/Totem): Valida QR Code dinâmico e credita selos.');
    console.log('3. CUSTOMER (Cliente): Apresenta QR de identificação e acumula selos (sem permissão de mint direto).\n');
  } catch (error) {
    console.error('Erro ao verificar/configurar permissões:', error);
  }
}

main();
