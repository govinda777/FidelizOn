import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
import { DynamicQRCodeModal } from '../loyalty/DynamicQRCodeModal';
import { LOYALTY_CONTRACT_ADDRESS } from '../../web3Client';

export interface CartItem {
  product: Product;
  quantity: number;
  useStamps: boolean;
}

export interface SeedStoreIntegrationDemoProps {
  initialRole?: 'all' | 'customer' | 'cashier';
  connectedAccount?: string;
}

export const SeedStoreIntegrationDemo: React.FC<SeedStoreIntegrationDemoProps> = ({
  initialRole,
  connectedAccount,
}) => {
  // Controle de Visualização por Papel (Role): detecta porta 5174 (caixa), 5173 (cliente) ou prop
  const [activeRole, setActiveRole] = useState<'all' | 'customer' | 'cashier'>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== 'undefined') {
      const port = window.location?.port;
      const search = window.location?.search || '';
      if (port === '5174' || search.includes('role=caixa')) return 'cashier';
      if (port === '5173' || search.includes('role=cliente')) return 'customer';
    }
    return 'all';
  });

  // Endereço da carteira do cliente (prioriza carteira conectada Web3 se houver)
  const customerWallet = connectedAccount || '0x9876543210fedcba9876543210fedcba98765432';

  // Estado dos Selos de Fidelidade
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
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  // Estado do Operador no Caixa
  const [usedNonces, setUsedNonces] = useState<Set<string>>(new Set());
  const [operatorMessage, setOperatorMessage] = useState<string>('');
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [isProcessingOnChain, setIsProcessingOnChain] = useState<boolean>(false);

  // Ação 1: Operador marca +1 selo (com simulação/integração on-chain)
  const handleOperatorAddStamp = async () => {
    try {
      setIsProcessingOnChain(true);
      const result = addStamp(
        loyaltyState,
        SEED_TENANT.loyaltyConfig.stampsGoal,
        SEED_TENANT.loyaltyConfig.cooldownSeconds
      );
      setLoyaltyState(result.newState);

      // Gera hash simulado ou on-chain para rastreabilidade
      const pseudoTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      setLastTxHash(pseudoTxHash);

      setOperatorMessage(
        result.rewardReady
          ? 'Selo adicionado! Cliente completou a meta de 10 selos!'
          : 'Selo adicionado com sucesso!'
      );
    } catch (err: any) {
      setOperatorMessage(err.message);
    } finally {
      setIsProcessingOnChain(false);
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

  // Ação 2.1: Cliente gera QR Dinâmico para identificação no caixa
  const handleCustomerGenerateIdentificationQR = () => {
    try {
      const payload = createDynamicQRPayload(
        SEED_TENANT.slug.current,
        customerWallet,
        'earn_stamp'
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
      setIsQRModalOpen(false);

      const pseudoBurnTx = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      setLastTxHash(pseudoBurnTx);

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
    <div data-testid="seed-store-demo" className="p-4 sm:p-6 space-y-6">
      {/* Seletor de Papéis (Roles): Caixa vs. Cliente */}
      <div className="bg-slate-100 p-2 rounded-xl flex flex-wrap items-center justify-between text-xs font-medium border border-slate-200 gap-2">
        <span className="text-slate-500 font-semibold px-2">Perfil Ativo:</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 data-testid="tenant-name" className="text-2xl font-bold text-slate-900">
            {SEED_TENANT.name}
          </h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border font-medium">
            {activeRole === 'cashier'
              ? 'Role: Operador Caixa (MINTER)'
              : activeRole === 'customer'
              ? 'Role: Cliente'
              : 'Modo Simulador Dual'}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">{SEED_TENANT.branding.welcomeMessage}</p>
        <div className="flex items-center gap-3 mt-2">
          <div data-testid="customer-tier" className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
            Nível: {calculateTier(loyaltyState.lifetimeStamps)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[240px]">
            Carteira: {customerWallet}
          </div>
        </div>
      </div>

      {/* Cartão Fidelidade do Cliente (Visível para Cliente ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'customer') && (
        <div data-testid="customer-loyalty-card" className="border p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>🎟️</span> Meu Cartão Fidelidade Digital
            </h2>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              CLIENTE
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div data-testid="stamps-count" className="text-4xl font-extrabold text-emerald-900 tracking-tight">
                {loyaltyState.currentStamps}/{SEED_TENANT.loyaltyConfig.stampsGoal} Selos
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Total acumulado histórico: <strong>{loyaltyState.lifetimeStamps} selos</strong>
              </div>
            </div>
            {loyaltyState.currentStamps >= SEED_TENANT.loyaltyConfig.stampsGoal ? (
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full animate-pulse">
                🎉 Meta Atingida!
              </span>
            ) : (
              <span className="text-xs text-emerald-800 font-medium">
                Faltam {SEED_TENANT.loyaltyConfig.stampsGoal - loyaltyState.currentStamps} selos
              </span>
            )}
          </div>

          {/* Botões de Ação do Cliente */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleCustomerGenerateIdentificationQR}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              📱 Mostrar QR para Ganhar Selo
            </button>
            {loyaltyState.currentStamps >= SEED_TENANT.loyaltyConfig.stampsGoal && (
              <button
                data-testid="customer-btn-redeem"
                onClick={handleCustomerGenerateRedeemQR}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all animate-bounce"
              >
                🎁 Gerar QR de Resgate
              </button>
            )}
          </div>

          {/* Renderização Real do QR Code Visual */}
          {activeQRPayload && (
            <div data-testid="dynamic-qr-display" className="mt-3 p-4 bg-white border border-emerald-300 rounded-xl text-xs shadow-md">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2 border-2 border-emerald-500/20 rounded-lg bg-white shadow-sm">
                  <QRCodeSVG
                    value={JSON.stringify(activeQRPayload)}
                    size={140}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="space-y-1.5 text-slate-700 text-center sm:text-left">
                  <div className="font-bold text-emerald-900 flex items-center justify-center sm:justify-start gap-1">
                    <span>📱</span> QR Dinâmico Pronto para Escanear no Caixa
                  </div>
                  <div className="text-xs text-slate-600">
                    Ação: <span className="font-semibold text-emerald-800 uppercase">{activeQRPayload.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono break-all">
                    Nonce: {activeQRPayload.nonce}
                  </div>
                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="mt-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline block"
                  >
                    🔍 Abrir em Tela Cheia com Timer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Painel do Operador / Caixa (Visível para Caixa ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'cashier') && (
        <div data-testid="operator-panel" className="border p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-blue-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-blue-950 flex items-center gap-1.5">
              <span>🏪</span> Terminal do Caixa / Operador (PDV)
            </h2>
            <span className="text-[10px] bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full font-bold">
              ROLE: MINTER / OPERATOR
            </span>
          </div>

          <div className="text-xs text-blue-900/80 bg-blue-100/60 p-2.5 rounded-xl border border-blue-200/50">
            <strong>Contrato Vinculado:</strong>{' '}
            <a
              href={`https://sepolia.basescan.org/address/${LOYALTY_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline text-blue-700 hover:text-blue-900"
            >
              {LOYALTY_CONTRACT_ADDRESS} ↗
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              data-testid="operator-btn-stamp"
              disabled={isProcessingOnChain}
              onClick={handleOperatorAddStamp}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              {isProcessingOnChain ? '⏳ Emitindo Selo On-Chain...' : 'Confirmar +1 Selo (Emitir)'}
            </button>
            <button
              data-testid="operator-btn-scan-redeem"
              onClick={handleOperatorScanRedeemQR}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              📸 Escanear QR de Resgate (Queimar)
            </button>
          </div>

          {operatorMessage && (
            <div data-testid="operator-message" className="p-3 bg-white border border-blue-200 rounded-xl text-xs text-blue-900 font-medium shadow-sm">
              {operatorMessage}
            </div>
          )}

          {lastTxHash && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
              <span className="font-semibold">Transação On-Chain Registrada:</span>{' '}
              <a
                href={`https://sepolia.basescan.org/tx/${lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-emerald-700 hover:underline break-all"
              >
                {lastTxHash} ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* Autoatendimento & Catálogo (Visível para Cliente ou Ambos) */}
      {(activeRole === 'all' || activeRole === 'customer') && (
        <div data-testid="self-service-catalog" className="space-y-4 pt-2">
          <h2 className="font-bold text-lg text-slate-900">Catálogo & Autoatendimento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEED_PRODUCTS.map((prod) => (
              <div
                key={prod._id}
                data-testid={`product-card-${prod._id}`}
                className="border border-slate-200 p-3 rounded-xl hover:border-slate-300 transition-all bg-white"
              >
                <div className="font-semibold text-sm text-slate-800">{prod.name}</div>
                <div className="text-xs font-medium text-emerald-600 mt-0.5">
                  {formatBrl(prod.priceBrlCents)}
                </div>
                <div className="mt-3 flex gap-1.5">
                  <button
                    data-testid={`btn-buy-${prod._id}`}
                    onClick={() => handleAddToCart(prod, false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  >
                    Comprar R$
                  </button>
                  {prod.loyaltyStampsCost > 0 && (
                    <button
                      data-testid={`btn-stamps-${prod._id}`}
                      onClick={() => handleAddToCart(prod, true)}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    >
                      Trocar ({prod.loyaltyStampsCost} selos)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cupom Promocional Black Friday */}
          <div className="border border-amber-200 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Campanha Promocional Ativa
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-1">
              {SEED_CAMPAIGNS[0].title}
            </div>
            <button
              data-testid="apply-coupon-btn"
              onClick={() => setActiveCampaign(SEED_CAMPAIGNS[0])}
              className="mt-2 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              Aplicar Cupom 20% OFF
            </button>
          </div>

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
      )}

      {/* Modal do QR Code em Tela Cheia com Timer */}
      {isQRModalOpen && activeQRPayload && (
        <DynamicQRCodeModal
          payload={activeQRPayload}
          tenantName={SEED_TENANT.name}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}
    </div>
  );
};
