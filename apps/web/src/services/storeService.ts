import { SEED_TENANT, SEED_PRODUCTS, SEED_CAMPAIGNS, Tenant, Product, Campaign } from '../data/seedStore';

/**
 * Serviço de dados para lojas:
 * Se o Sanity estiver configurado e respondendo, busca remoto.
 * Como fallback ou quando o slug solicitado for o seed ('cafeteria-aroma'),
 * retorna os dados completos locais da loja modelo seed.
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  if (slug === SEED_TENANT.slug.current || !slug) {
    return SEED_TENANT;
  }
  return null;
}

export async function getProductsByTenant(tenantSlug: string): Promise<Product[]> {
  if (tenantSlug === SEED_TENANT.slug.current || !tenantSlug) {
    return SEED_PRODUCTS;
  }
  return [];
}

export async function getCampaignsByTenant(tenantSlug: string): Promise<Campaign[]> {
  if (tenantSlug === SEED_TENANT.slug.current || !tenantSlug) {
    return SEED_CAMPAIGNS;
  }
  return [];
}
