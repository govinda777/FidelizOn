import React, { useState } from 'react';
import {
  SEED_TENANT,
  SEED_PRODUCTS,
  SEED_CAMPAIGNS,
  Product,
  Campaign,
} from '../../data/seedStore';
import {
  CustomerLoyaltyState,
  addStamp,
  redeemReward,
  calculateTier,
} from '../../utils/loyalty';
import {
  createDynamicQRPayload,
  validateDynamicQRPayload,
  DynamicQRPayload,
} from '../../utils/security';
import { formatBrl, applyDiscount } from '../../utils/pricing';

export interface CartItem {
  product: Product;
  quantity: number;
  useStamps: boolean;
}

export const SeedStoreIntegrationDemo: React.FC = () => {
  // Controle de Visualização por Papel (Role)
  const [activeRole, setActiveRole] = useState<'all' | 'customer' | 'cashier'>('all');

  // Estado do Cliente
  const [customerWallet] = useState('0x9876543210fedcba9876543210fedcba98765432');
  const [loyaltyState, setLoyaltyState] = useState<CustomerLoyaltyState>({
    currentStamps: 9,
    lifetimeStamps: 19,
    lastStampedAt: 0,
  });

  // Carrinho de Autoatendimento
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  // QR Code Dinâmico gerado pelo cliente
  const [activeQRPayload, setActiveQRPayload] = useState<DynamicQRPayload | null>(null);

  // Estado do Operador no Caixa
  const [usedNonces, setUsedNonces] = useState<Set<string>>(new Set());
  const [operatorMessage, setOperatorMessage] = useState<string>('');

  // Ação 1: Operador marca +1 selo
  const handleOperatorAddStamp = () => {
    try {
      const result = addStamp(
        loyaltyState,
        SEED_TENANT.loyaltyConfig.stampsGoal,
        SEED_TENANT.loyaltyConfig.cooldownSeconds
      );
      setLoyaltyState(result.newState);
      setOperatorMessage(
        result.rewardReady
          ? 'Selo adicionado! Cliente completou a meta de 10 selos!'
          : 'Selo adicionado com sucesso!'
      );
    } catch (err: any) {
      setOperatorMessage(err.message);
    }
  };

  // Ação 2: Cliente gera QR Dinâmico para resgate
  const handleCustomerGenerateRedeemQR = () => {
    try {
      const payload = createDynamicQRPayload(
        SEED_TENANT.slug.current,
        customerWallet,
        'redeem_reward'
      );
      setActiveQRPayload(payload);
    } catch (err: any) {
      setOperatorMessage(err.message);
    }
  };

  // Ação 3: Operador lê o QR Dinâmico e processa o resgate
  const handleOperatorScanRedeemQR = () => {
    if (!activeQRPayload) {
      setOperatorMessage('Nenhum QR Code ativo para escanear.');
      return;
    }

    const validation = validateDynamicQRPayload(
      activeQRPayload,
      SEED_TENANT.slug.current,
      usedNonces
    );

    if (!validation.valid) {
      setOperatorMessage(`Erro na leitura do QR: ${validation.error}`);
      return;
    }

    try {
      const nextLoyalty = redeemReward(
        loyaltyState,
        SEED_TENANT.loyaltyConfig.stampsGoal
      );
      setLoyaltyState(nextLoyalty);
      setUsedNonces(new Set([...usedNonces, activeQRPayload.nonce]));
      setActiveQRPayload(null);
      setOperatorMessage('Prêmio resgatado com sucesso! 10 selos queimados.');
    } catch (err: any) {
      setOperatorMessage(`Erro no resgate: ${err.message}`);
    }
  };

  // Ação 4: Autoatendimento - Adicionar item ao carrinho
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

  // Cálculos do Carrinho
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
    <div data-testid="seed-store-demo" className="p-4 space-y-6">
      {/* Seletor de Papéis (Roles): Caixa vs. Cliente */}
      <div className="bg-slate-100 p-2 rounded-xl flex items-center justify-between text-xs font-medium border border-slate-200">
        <span className="text-slate-500 font-semibold px-2">Perfil:</span>
        <div className="flex gap-1">
          <button
            type="button"
            data-testid="role-tab-customer"
            onClick={() => setActiveRole('customer')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeRole === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            👤 Visão Cliente
          </button>
          <button
            type="button"
            data-testid="role-tab-cashier"
            onClick={() => setActiveRole('cashier')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeRole === 'cashier'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            💼 Visão Caixa (Operador)
          </button>
          <button
            type="button"
            data-testid="role-tab-all"
            onClick={() => setActiveRole('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeRole === 'all'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔄 Ambos
          </button>
        </div>
      </div>

      {/* Header da Loja Modelo */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <h1 data-testid="tenant-name" className="text-2xl font-bold">
            {SEED_TENANT.name}
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
            {activeRole === 'cashier' ? 'Role: Operador Caixa (MINTER)' : activeRole === 'customer' ? 'Role: Cliente' : 'Modo Simulador'}
          </span>
        </div>
        <p className="text-sm text-gray-500">{SEED_TENANT.branding.welcomeMessage}</p>
        <div data-testid="customer-tier" className="mt-2 text-xs font-semibold">
          Nível do Cliente: {calculateTier(loyaltyState.lifetimeStamps)}
        </div>
      </div>

      {/* Cartão Fidelidade do Cliente (Visível para Cliente ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'customer') && (
        <div data-testid="customer-loyalty-card" className="border p-4 rounded-lg bg-emerald-50">
          <div className="flex justify-between items-center mb-1">
            <h2 className="font-semibold text-emerald-800">Meu Cartão Fidelidade</h2>
            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              ROLE: CLIENTE
            </span>
          </div>
          <div data-testid="stamps-count" className="text-3xl font-bold text-emerald-900">
            {loyaltyState.currentStamps}/{SEED_TENANT.loyaltyConfig.stampsGoal} Selos
          </div>
          <div className="text-sm text-emerald-700">
            Total Histórico: {loyaltyState.lifetimeStamps} selos
          </div>
          {loyaltyState.currentStamps >= SEED_TENANT.loyaltyConfig.stampsGoal && (
            <button
              data-testid="customer-btn-redeem"
              onClick={handleCustomerGenerateRedeemQR}
              className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700"
            >
              Gerar QR de Resgate
            </button>
          )}

          {activeQRPayload && (
            <div data-testid="dynamic-qr-display" className="mt-4 p-3 bg-white border border-emerald-300 rounded text-xs shadow-sm">
              <div className="font-semibold text-emerald-800">📱 QR Dinâmico Pronto para Escanear no Caixa</div>
              <div className="text-gray-600">Ação: {activeQRPayload.action}</div>
              <div className="text-gray-400 font-mono text-[10px] break-all">Nonce: {activeQRPayload.nonce}</div>
            </div>
          )}
        </div>
      )}

      {/* Painel do Operador / Caixa (Visível para Caixa ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'cashier') && (
        <div data-testid="operator-panel" className="border p-4 rounded-lg bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-blue-900">Terminal do Caixa / Operador</h2>
            <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">
              ROLE: MINTER / OPERATOR
            </span>
          </div>
          <p className="text-xs text-blue-700 mb-3">
            Funções restritas a operadores autorizados com permissão on-chain para emitir e queimar selos.
          </p>
          <div className="flex gap-2">
            <button
              data-testid="operator-btn-stamp"
              onClick={handleOperatorAddStamp}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm"
            >
              Confirmar +1 Selo (Emitir)
            </button>
            <button
              data-testid="operator-btn-scan-redeem"
              onClick={handleOperatorScanRedeemQR}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm"
            >
              Escanear QR de Resgate (Queimar)
            </button>
          </div>
          {operatorMessage && (
            <div data-testid="operator-message" className="mt-3 p-2 bg-white border border-blue-200 rounded text-sm text-blue-800 font-medium">
              {operatorMessage}
            </div>
          )}
        </div>
      )}

      {/* Autoatendimento & Catálogo (Visível para Cliente ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'customer') && (
        <div data-testid="self-service-catalog" className="space-y-4">
        <h2 className="font-semibold text-lg">Catálogo & Autoatendimento</h2>
        <div className="grid grid-cols-2 gap-2">
          {SEED_PRODUCTS.map((prod) => (
            <div key={prod._id} data-testid={`product-card-${prod._id}`} className="border p-2 rounded">
              <div className="font-medium text-sm">{prod.name}</div>
              <div className="text-xs text-gray-500">{formatBrl(prod.priceBrlCents)}</div>
              <div className="mt-2 flex gap-1">
                <button
                  data-testid={`btn-buy-${prod._id}`}
                  onClick={() => handleAddToCart(prod, false)}
                  className="bg-gray-200 px-2 py-1 text-xs rounded"
                >
                  Comprar R$
                </button>
                {prod.loyaltyStampsCost > 0 && (
                  <button
                    data-testid={`btn-stamps-${prod._id}`}
                    onClick={() => handleAddToCart(prod, true)}
                    className="bg-emerald-100 text-emerald-800 px-2 py-1 text-xs rounded"
                  >
                    Trocar ({prod.loyaltyStampsCost} selos)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cupom Black Friday */}
        <div className="border p-3 rounded bg-amber-50">
          <div className="text-xs font-bold text-amber-800">Campanha Promocional</div>
          <div className="text-sm">{SEED_CAMPAIGNS[0].title}</div>
          <button
            data-testid="apply-coupon-btn"
            onClick={() => setActiveCampaign(SEED_CAMPAIGNS[0])}
            className="mt-2 text-xs bg-amber-600 text-white px-2 py-1 rounded"
          >
            Aplicar Cupom 20% OFF
          </button>
        </div>

        {/* Resumo do Carrinho */}
        <div data-testid="cart-summary" className="border-t pt-2 text-sm">
          <div>Itens no carrinho: {cart.length}</div>
          <div data-testid="cart-total-brl">
            Total a Pagar: {formatBrl(discountCalc.finalAmountCents)}
          </div>
          {discountCalc.discountCents > 0 && (
            <div data-testid="cart-discount-value" className="text-xs text-green-600">
              Desconto Aplicado: {formatBrl(discountCalc.discountCents)}
            </div>
          )}
          {stampsNeeded > 0 && (
            <div data-testid="cart-stamps-needed" className="text-xs text-emerald-700">
              Selos Necessários: {stampsNeeded}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
};
