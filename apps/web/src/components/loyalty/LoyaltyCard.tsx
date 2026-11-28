import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReadContract } from 'thirdweb/react';
import { balanceOf } from 'thirdweb/extensions/erc1155';
import { loyaltyContract } from '../../web3Client';
import { calculateTier } from '../../utils/loyalty';
import { createDynamicQRPayload, DynamicQRPayload } from '../../utils/security';
import { DynamicQRCodeModal } from './DynamicQRCodeModal';
import { Tenant } from '../../data/seedStore';

interface LoyaltyCardProps {
  tenant: Tenant;
  customerWallet: string;
  isConnected: boolean;
  localStampsFallback?: number;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  tenant,
  customerWallet,
  isConnected,
  localStampsFallback = 9,
}) => {
  // Consulta de Saldo On-Chain Real no Contrato DropERC1155 (Token ID 0: Selos)
  const { data: onChainBalance, isLoading: isReadingBalance } = useReadContract(
    balanceOf,
    {
      contract: loyaltyContract,
      owner: customerWallet,
      tokenId: 0n,
    }
  );

  const stampsCount = isConnected && onChainBalance !== undefined
    ? Number(onChainBalance)
    : localStampsFallback;

  const stampsGoal = tenant.loyaltyConfig.stampsGoal || 10;
  const isGoalReached = stampsCount >= stampsGoal;

  const [activeQRPayload, setActiveQRPayload] = useState<DynamicQRPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQR = (action: 'earn_stamp' | 'redeem_reward') => {
    const payload = createDynamicQRPayload(tenant.slug.current, customerWallet, action);
    setActiveQRPayload(payload);
  };

  return (
    <div data-testid="customer-loyalty-card" className="border border-emerald-200 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-emerald-950 flex items-center gap-1.5">
          <span>🎟️</span> Cartão Fidelidade Digital
        </h2>
        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          CLIENTE
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div data-testid="stamps-count" className="text-4xl font-extrabold text-emerald-900 tracking-tight">
            {stampsCount}/{stampsGoal} Selos
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1.5">
            {isConnected ? (
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Saldo On-Chain na Base Sepolia {isReadingBalance && '(atualizando...)'}
              </span>
            ) : (
              <span>Modo Simulação (Conecte sua carteira para ver saldo on-chain)</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div data-testid="customer-tier" className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 inline-block">
            Nível: {calculateTier(stampsCount * 2)}
          </div>
          {isGoalReached && (
            <div className="text-[11px] font-bold text-emerald-800 mt-1">
              🎉 Recompensa Disponível!
            </div>
          )}
        </div>
      </div>

      {/* Grid Visual de Selos */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-2">
        {Array.from({ length: stampsGoal }).map((_, idx) => {
          const isStamped = idx < stampsCount;
          return (
            <div
              key={idx}
              className={`h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                isStamped
                  ? 'bg-emerald-600 text-white shadow-sm scale-105'
                  : 'bg-white/80 border border-emerald-200 text-emerald-300'
              }`}
            >
              {isStamped ? '☕' : idx + 1}
            </div>
          );
        })}
      </div>

      {/* Ações do Cliente */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => handleGenerateQR('earn_stamp')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
        >
          <span>📱</span> Mostrar QR para Ganhar Selo
        </button>

        {isGoalReached && (
          <button
            data-testid="customer-btn-redeem"
            onClick={() => handleGenerateQR('redeem_reward')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all animate-bounce flex items-center gap-1.5"
          >
            <span>🎁</span> Gerar QR de Resgate do Café
          </button>
        )}
      </div>

      {/* Exibição do QR Code Ativo */}
      {activeQRPayload && (
        <div data-testid="dynamic-qr-display" className="mt-3 p-4 bg-white border border-emerald-300 rounded-xl text-xs shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 border-2 border-emerald-500/20 rounded-lg bg-white shadow-sm">
              <QRCodeSVG
                value={JSON.stringify(activeQRPayload)}
                size={130}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-1 text-slate-700 text-center sm:text-left flex-1">
              <div className="font-bold text-emerald-900 flex items-center justify-center sm:justify-start gap-1">
                <span>📱</span> QR Dinâmico Pronto para Escanear
              </div>
              <div className="text-xs text-slate-600">
                Ação: <span className="font-semibold text-emerald-800 uppercase">{activeQRPayload.action}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono break-all">
                Nonce: {activeQRPayload.nonce}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline block"
              >
                🔍 Expandir com Cronômetro de 60s
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && activeQRPayload && (
        <DynamicQRCodeModal
          payload={activeQRPayload}
          tenantName={tenant.name}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
