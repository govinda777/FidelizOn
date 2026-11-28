import { createClient } from '@sanity/client';
import { Tenant, Product, Campaign } from '../types/tenant';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '8fgufitv';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false, // Busca sempre dados frescos do Content Lake
  apiVersion: '2024-01-01',
});

/**
 * Lista todos os estabelecimentos (Tenants) ativos ou em período de teste no Sanity CMS.
 */
export async function listTenants(): Promise<Tenant[]> {
  try {
    const query = `*[_type == "tenant" && (status == "active" || status == "trial")]{
      _id,
      name,
      slug,
      status,
      branding,
      loyaltyConfig,
      web3,
      enabledModules
    } | order(name asc)`;

    const tenants = await sanityClient.fetch<Tenant[]>(query);
    return tenants || [];
  } catch (error) {
    console.error('[storeService] Erro ao listar estabelecimentos no Sanity CMS:', error);
    return [];
  }
}

/**
 * Consulta um estabelecimento (Tenant) específico no Sanity pelo slug.
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  if (!slug) return null;
  try {
    const query = `*[_type == "tenant" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      status,
      branding,
      loyaltyConfig,
      web3,
      enabledModules
    }`;
    const remoteTenant = await sanityClient.fetch<Tenant | null>(query, { slug });
    return remoteTenant || null;
  } catch (error) {
    console.error(`[storeService] Erro ao buscar tenant "${slug}" no Sanity:`, error);
    return null;
  }
}

/**
 * Consulta os produtos ativos vinculados ao tenant no Sanity CMS.
 */
export async function getProductsByTenant(tenantSlug: string): Promise<Product[]> {
  if (!tenantSlug) return [];
  try {
    const query = `*[_type == "product" && tenant->slug.current == $slug && active == true]{
      _id,
      name,
      description,
      category,
      imageUrl,
      active,
      priceBrlCents,
      loyaltyStampsCost,
      grantsStampOnPurchase,
      stampsAwarded,
      allowPrepaid,
      eligibleForCoupons
    }`;
    const remoteProducts = await sanityClient.fetch<Product[]>(query, { slug: tenantSlug });
    return remoteProducts || [];
  } catch (error) {
    console.error(`[storeService] Erro ao buscar produtos para tenant "${tenantSlug}":`, error);
    return [];
  }
}

/**
 * Consulta campanhas e cupons promocionais ativos para o tenant no Sanity CMS.
 */
export async function getCampaignsByTenant(tenantSlug: string): Promise<Campaign[]> {
  if (!tenantSlug) return [];
  try {
    const query = `*[_type == "campaign" && tenant->slug.current == $slug]{
      _id,
      title,
      slug,
      discountType,
      discountValue,
      startsAt,
      endsAt,
      maxSupply,
      onChainTokenId,
      minStampsRequired
    }`;
    const remoteCampaigns = await sanityClient.fetch<Campaign[]>(query, { slug: tenantSlug });
    return remoteCampaigns || [];
  } catch (error) {
    console.error(`[storeService] Erro ao buscar campanhas para tenant "${tenantSlug}":`, error);
    return [];
  }
}
