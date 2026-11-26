import { createThirdwebClient, getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';

export const clientId =
  import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'f2f70da0a0864a3544298b1c89be825e';

export const client = createThirdwebClient({
  clientId,
});

export const LOYALTY_CONTRACT_ADDRESS =
  import.meta.env.VITE_LOYALTY_CONTRACT_ADDRESS ||
  '0x6883FD842E0b7901873a6a00042B602991a6bd2E';

export const loyaltyContract = getContract({
  client,
  chain: baseSepolia,
  address: LOYALTY_CONTRACT_ADDRESS,
});
