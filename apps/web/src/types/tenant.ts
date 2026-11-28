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
  slug: { current: string; _type?: string };
  status: 'active' | 'trial' | 'past_due' | 'suspended';
  branding: TenantBranding;
  loyaltyConfig: LoyaltyConfig;
  web3: Web3Config;
  enabledModules: EnabledModules;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  active: boolean;
  priceBrlCents: number;
  loyaltyStampsCost: number;
  grantsStampOnPurchase?: boolean;
  stampsAwarded?: number;
  allowPrepaid?: boolean;
  eligibleForCoupons?: boolean;
}

export interface Campaign {
  _id: string;
  title: string;
  slug: { current: string; _type?: string };
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startsAt?: string;
  endsAt?: string;
  maxSupply?: number;
  onChainTokenId?: number;
  minStampsRequired?: number;
}
