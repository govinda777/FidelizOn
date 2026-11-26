import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { DynamicQRPayload } from '../../utils/security';

interface DynamicQRCodeModalProps {
  payload: DynamicQRPayload;
  onClose: () => void;
  tenantName: string;
}

export const DynamicQRCodeModal: React.FC<DynamicQRCodeModalProps> = ({
  payload,
  onClose,
  tenantName,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);

  useEffect(() => {
    const expiresAt = payload.timestamp + 60 * 1000;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [payload]);

  const rawPayload = JSON.stringify(payload);
  const isExpired = secondsRemaining === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
        >
          ✕
        </button>

        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-800 mb-2">
          {payload.action === 'redeem_reward' ? '🎁 Resgate de Prêmio' : '☕ Acúmulo de Selo'}
        </span>

        <h3 className="text-lg font-bold text-slate-900">{tenantName}</h3>
        <p className="text-xs text-slate-500 mb-4">
          Apresente este QR Code no caixa para validação da transação
        </p>

        {/* Renderização Real do QR Code SVG */}
        <div className="mx-auto flex w-fit items-center justify-center rounded-xl border-4 border-emerald-500/20 bg-white p-4 shadow-inner">
          {isExpired ? (
            <div className="flex flex-col items-center justify-center w-48 h-48 text-rose-600">
              <span className="text-4xl mb-2">⚠️</span>
              <p className="font-semibold text-sm">QR Code Expirado</p>
              <p className="text-[11px] text-slate-500 mt-1">Gere um novo código para segurança</p>
            </div>
          ) : (
            <QRCodeSVG
              value={rawPayload}
              size={192}
              level="H"
              includeMargin={false}
              className="rounded"
            />
          )}
        </div>

        {/* Cronômetro Regressivo */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-slate-500">Validade do código:</span>
            <span className={isExpired ? 'text-rose-600' : 'text-emerald-700'}>
              {secondsRemaining}s
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                secondsRemaining > 15 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${(secondsRemaining / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Informações de Segurança Anti-Fraude */}
        <div className="mt-4 bg-slate-50 rounded-lg p-2.5 text-left text-[11px] text-slate-600 font-mono space-y-1">
          <div className="truncate">
            <strong className="text-slate-700">Cliente:</strong> {payload.customerWallet}
          </div>
          <div className="truncate">
            <strong className="text-slate-700">Nonce Único:</strong> {payload.nonce}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
