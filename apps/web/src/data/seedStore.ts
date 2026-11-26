export interface TenantBranding {
  logo?: string;
  primaryColor: string;
  bannerImage?: string;
  welcomeMessage: string;
}

export interface LoyaltyConfig {
  stampsGoal: number;
  rewardTitle: string;
  cooldownSeconds: number;
}

export interface Web3Config {
  chainId: number;
  loyaltyContractAddress?: string;
  couponsContractAddress?: string;
  prepaidContractAddress?: string;
  ownerWallet?: string;
}

export interface EnabledModules {
  loyalty: boolean;
  products: boolean;
  selfService: boolean;
  coupons: boolean;
  prepaid: boolean;
}

export interface Tenant {
  _id: string;
  name: string;
  slug: { current: string };
  status: 'active' | 'trial' | 'past_due' | 'suspended';
  branding: TenantBranding;
  loyaltyConfig: LoyaltyConfig;
  web3: Web3Config;
  enabledModules: EnabledModules;
}

export interface Product {
  _id: string;
  tenantSlug: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  active: boolean;
  priceBrlCents: number;
  loyaltyStampsCost: number; // 0 se não resgatável por selos
  grantsStampOnPurchase: boolean;
  stampsAwarded: number;
  allowPrepaid: boolean;
  eligibleForCoupons: boolean;
}

export interface Campaign {
  _id: string;
  tenantSlug: string;
  title: string;
  slug: { current: string };
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 20 para 20%, ou 1000 para R$ 10,00
  startsAt: string;
  endsAt: string;
  maxSupply: number;
  onChainTokenId: number;
  minStampsRequired: number;
}

export const SEED_TENANT: Tenant = {
  _id: 'tenant_cafeteria_aroma',
  name: 'Cafeteria Aroma',
  slug: { current: 'cafeteria-aroma' },
  status: 'active',
  branding: {
    primaryColor: '#10B981',
    welcomeMessage: 'Junte 10 selos no seu Cartão Fidelidade e ganhe 1 Café Especial 250g!',
    bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  },
  loyaltyConfig: {
    stampsGoal: 10,
    rewardTitle: '1 Café Especial Torra Média 250g Grátis',
    cooldownSeconds: 60,
  },
  web3: {
    chainId: 84532, // Base Sepolia
    loyaltyContractAddress: '0x6883FD842E0b7901873a6a00042B602991a6bd2E',
    ownerWallet: '0xaB12Cd34Ef567890123456789012345678901234',
  },
  enabledModules: {
    loyalty: true,
    products: true,
    selfService: true,
    coupons: true,
    prepaid: true,
  },
};

export const SEED_PRODUCTS: Product[] = [
  {
    _id: 'prod_1',
    tenantSlug: 'cafeteria-aroma',
    name: 'Café Expresso Tradicional',
    description: 'Expresso encorpado com crema espessa, grãos 100% arábica.',
    category: 'Bebidas Quentes',
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 750,
    loyaltyStampsCost: 0,
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
  {
    _id: 'prod_2',
    tenantSlug: 'cafeteria-aroma',
    name: 'Cappuccino Italiano 200ml',
    description: 'Expresso, leite vaporizado e crema de leite com toque de canela.',
    category: 'Bebidas Quentes',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 1400,
    loyaltyStampsCost: 0,
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
  {
    _id: 'prod_3',
    tenantSlug: 'cafeteria-aroma',
    name: 'Café Especial em Grãos 250g',
    description: 'Torra média com notas florais e achocolatadas, altitude 1.200m.',
    category: 'Empório',
    imageUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 3500,
    loyaltyStampsCost: 10, // Prêmio do cartão fidelidade!
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
  {
    _id: 'prod_4',
    tenantSlug: 'cafeteria-aroma',
    name: 'Pão de Queijo Canastra (Dupla)',
    description: 'Feito com legítimo queijo da Serra da Canastra, crocante por fora e macio por dentro.',
    category: 'Lanches',
    imageUrl: 'https://images.unsplash.com/photo-1598143152818-38842ad3210e?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 1200,
    loyaltyStampsCost: 0,
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
  {
    _id: 'prod_5',
    tenantSlug: 'cafeteria-aroma',
    name: 'Cookie Artesanal Gotas de Chocolate',
    description: 'Massa amanteigada recheada com gotas de chocolate meio amargo nobre.',
    category: 'Sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 900,
    loyaltyStampsCost: 3, // Resgate rápido de 3 selos
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
  {
    _id: 'prod_6',
    tenantSlug: 'cafeteria-aroma',
    name: 'Combo Matinal (Expresso + Pão de Queijo)',
    description: 'A combinação clássica para começar o dia com energia.',
    category: 'Combos',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    active: true,
    priceBrlCents: 1650,
    loyaltyStampsCost: 0,
    grantsStampOnPurchase: true,
    stampsAwarded: 1,
    allowPrepaid: true,
    eligibleForCoupons: true,
  },
];

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    _id: 'camp_black_friday_1',
    tenantSlug: 'cafeteria-aroma',
    title: 'Black Friday Cafeteria Aroma - 20% OFF',
    slug: { current: 'black-friday-20' },
    discountType: 'percentage',
    discountValue: 20,
    startsAt: '2026-11-20T00:00:00.000Z',
    endsAt: '2026-11-30T23:59:59.000Z',
    maxSupply: 200,
    onChainTokenId: 1,
    minStampsRequired: 0,
  },
];
