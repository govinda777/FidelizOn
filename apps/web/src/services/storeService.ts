import { createClient } from '@sanity/client';
import { SEED_TENANT, SEED_PRODUCTS, SEED_CAMPAIGNS, Tenant, Product, Campaign } from '../data/seedStore';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '8fgufitv';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
});

/**
 * Consulta o estabelecimento (Tenant) pelo slug.
 * Prioriza a consulta remota ao Sanity Content Lake e recorre à loja seed como fallback.
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const targetSlug = slug || 'cafeteria-aroma';
  try {
    const query = `*[_type == "tenant" && slug.current == $slug][0]`;
    const remoteTenant = await sanityClient.fetch<Tenant | null>(query, { slug: targetSlug });
    if (remoteTenant) {
      return remoteTenant;
    }
  } catch (error) {
    console.warn('[storeService] Falha ao consultar Sanity, usando fallback local:', error);
  }

  if (targetSlug === SEED_TENANT.slug.current) {
    return SEED_TENANT;
  }
  return null;
}

/**
 * Consulta produtos ativos do estabelecimento.
 */
export async function getProductsByTenant(tenantSlug: string): Promise<Product[]> {
  const targetSlug = tenantSlug || 'cafeteria-aroma';
  try {
    const query = `*[_type == "product" && tenant->slug.current == $slug && active == true]`;
    const remoteProducts = await sanityClient.fetch<Product[]>(query, { slug: targetSlug });
    if (remoteProducts && remoteProducts.length > 0) {
      return remoteProducts;
    }
  } catch (error) {
    console.warn('[storeService] Falha ao buscar produtos no Sanity, usando fallback local:', error);
  }

  if (targetSlug === SEED_TENANT.slug.current) {
    return SEED_PRODUCTS;
  }
  return [];
}

/**
 * Consulta campanhas e cupons promocionais do estabelecimento.
 */
export async function getCampaignsByTenant(tenantSlug: string): Promise<Campaign[]> {
  const targetSlug = tenantSlug || 'cafeteria-aroma';
  try {
    const query = `*[_type == "campaign" && tenant->slug.current == $slug]`;
    const remoteCampaigns = await sanityClient.fetch<Campaign[]>(query, { slug: targetSlug });
    if (remoteCampaigns && remoteCampaigns.length > 0) {
      return remoteCampaigns;
    }
  } catch (error) {
    console.warn('[storeService] Falha ao buscar campanhas no Sanity, usando fallback local:', error);
  }

  if (targetSlug === SEED_TENANT.slug.current) {
    return SEED_CAMPAIGNS;
  }
  return [];
}
