import React, { useEffect, useState } from 'react';
import { Product, Campaign, SEED_PRODUCTS, SEED_CAMPAIGNS } from '../../data/seedStore';
import { getProductsByTenant, getCampaignsByTenant } from '../../services/storeService';
import { formatBrl, applyDiscount } from '../../utils/pricing';

export interface CartItem {
  product: Product;
  quantity: number;
  useStamps: boolean;
}

interface ProductCatalogProps {
  tenantSlug: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ tenantSlug }) => {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedCampaigns] = await Promise.all([
          getProductsByTenant(tenantSlug),
          getCampaignsByTenant(tenantSlug),
        ]);
        if (isMounted) {
          if (fetchedProducts && fetchedProducts.length > 0) setProducts(fetchedProducts);
          if (fetchedCampaigns && fetchedCampaigns.length > 0) setCampaigns(fetchedCampaigns);
        }
      } catch (e) {
        console.warn('Usando catálogo local:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  const handleAddToCart = (product: Product, useStamps: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product._id === product._id && item.useStamps === useStamps
      );
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id && item.useStamps === useStamps
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, useStamps }];
    });
  };

  const totalBrlCentsRaw = cart.reduce((acc, item) => {
    return item.useStamps ? acc : acc + item.product.priceBrlCents * item.quantity;
  }, 0);

  const stampsNeeded = cart.reduce((acc, item) => {
    return item.useStamps ? acc + item.product.loyaltyStampsCost * item.quantity : acc;
  }, 0);

  const discountCalc = activeCampaign
    ? applyDiscount(
        totalBrlCentsRaw,
        activeCampaign.discountType,
        activeCampaign.discountValue
      )
    : { finalAmountCents: totalBrlCentsRaw, discountCents: 0 };

  return (
    <div data-testid="self-service-catalog" className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-slate-900">Catálogo & Autoatendimento</h2>
        <span className="text-[11px] text-slate-500 font-medium">
          {isLoading ? 'Sincronizando Sanity CMS...' : '🟢 Conectado ao Sanity Content Lake'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((prod) => (
          <div
            key={prod._id}
            data-testid={`product-card-${prod._id}`}
            className="border border-slate-200 p-3.5 rounded-xl hover:border-slate-300 transition-all bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="font-semibold text-sm text-slate-800">{prod.name}</div>
              <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                {formatBrl(prod.priceBrlCents)}
              </div>
              {prod.description && (
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {prod.description}
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                data-testid={`btn-buy-${prod._id}`}
                onClick={() => handleAddToCart(prod, false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex-1"
              >
                Comprar R$
              </button>
              {prod.loyaltyStampsCost > 0 && (
                <button
                  data-testid={`btn-stamps-${prod._id}`}
                  onClick={() => handleAddToCart(prod, true)}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex-1"
                >
                  Trocar ({prod.loyaltyStampsCost} selos)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Campanhas Promocionais */}
      {campaigns.length > 0 && (
        <div className="border border-amber-200 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Campanha Promocional Sanity CMS
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-1">
            {campaigns[0].title}
          </div>
          <button
            data-testid="apply-coupon-btn"
            onClick={() => setActiveCampaign(campaigns[0])}
            className="mt-2 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
          >
            Aplicar Cupom 20% OFF
          </button>
        </div>
      )}

      {/* Resumo do Carrinho */}
      <div data-testid="cart-summary" className="border-t border-slate-200 pt-3 text-sm space-y-1">
        <div className="text-slate-500">Itens no carrinho: {cart.length}</div>
        <div data-testid="cart-total-brl" className="font-bold text-slate-900 text-base">
          Total a Pagar: {formatBrl(discountCalc.finalAmountCents)}
        </div>
        {discountCalc.discountCents > 0 && (
          <div data-testid="cart-discount-value" className="text-xs text-emerald-600 font-semibold">
            Desconto Aplicado: {formatBrl(discountCalc.discountCents)}
          </div>
        )}
        {stampsNeeded > 0 && (
          <div data-testid="cart-stamps-needed" className="text-xs text-emerald-700 font-semibold">
            Selos Necessários: {stampsNeeded}
          </div>
        )}
      </div>
    </div>
  );
};
