import { createThirdwebClient, getContract, sendAndConfirmTransaction } from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { baseSepolia } from 'thirdweb/chains';
import { lazyMint, setClaimConditions, nextTokenIdToMint } from 'thirdweb/extensions/erc1155';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script IaC: Inicializa os tokens de fidelidade (Token 0: Selo de Café)
 * e define as condições de reivindicação pública/patrocinada (Claim Conditions).
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
  const contractAddress = process.env.VITE_LOYALTY_CONTRACT_ADDRESS || '0x6883FD842E0b7901873a6a00042B602991a6bd2E';

  const client = createThirdwebClient(
    secretKey ? { secretKey } : { clientId: clientId || '' }
  );

  const rawKey = (adminPrivateKey || '').trim().replace(/['"]/g, '');
  const formattedKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`;
  const adminAccount = privateKeyToAccount({ client, privateKey: formattedKey });

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: contractAddress,
  });

  console.log(`🚀 Inicializando Token On-Chain no Contrato: ${contractAddress}`);
  console.log(`👤 Administrador: ${adminAccount.address}`);

  try {
    const nextId = await nextTokenIdToMint({ contract });
    console.log(`ℹ️ Próximo Token ID a ser criado: ${nextId.toString()}`);

    if (nextId === 0n) {
      console.log('⏳ Criando metadados do Token 0 (Selo FidelizOn Cafeteria Aroma)...');
      const lazyMintTx = lazyMint({
        contract,
        nfts: [
          {
            name: 'Selo FidelizOn - Cafeteria Aroma',
            description: 'Selo digital de fidelidade acumulável na blockchain Base Sepolia. Complete 10 para ganhar 1 Café Especial 250g.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
            properties: {
              tenant: 'cafeteria-aroma',
              tierRequired: 'Bronze',
              type: 'loyalty_stamp',
            },
          },
        ],
      });

      console.log('📡 Enviando transação de lazyMint para a Base Sepolia...');
      const receipt = await sendAndConfirmTransaction({
        transaction: lazyMintTx,
        account: adminAccount,
      });
      console.log(`✅ Token 0 criado com sucesso! Hash: ${receipt.transactionHash}`);
    } else {
      console.log('ℹ️ Token 0 já existe no contrato.');
    }

    // Configura condições de reivindicação (Claim Conditions) gratuitas para o Token 0
    console.log('⏳ Configurando condições de Claim para o Token 0...');
    const claimConditionsTx = setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 1000000n,
          maxClaimablePerWallet: 1000n,
          pricePerToken: 0,
          currencyAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Grátis (0 ETH)
        },
      ],
    });

    console.log('📡 Enviando transação de setClaimConditions...');
    const claimReceipt = await sendAndConfirmTransaction({
      transaction: claimConditionsTx,
      account: adminAccount,
    });
    console.log(`🎉 Condições de Claim ativadas com sucesso! Hash: ${claimReceipt.transactionHash}`);
    console.log(`📍 Ver no BaseScan: https://sepolia.basescan.org/address/${contractAddress}`);
  } catch (error: any) {
    console.error('❌ Erro na inicialização on-chain:', error);
  }
}

main();
