import React, { useState } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { baseSepolia } from 'thirdweb/chains';
import { client, LOYALTY_CONTRACT_ADDRESS } from './web3Client';
import { SeedStoreIntegrationDemo } from './components/demo/SeedStoreIntegrationDemo';
import { SEED_TENANT } from './data/seedStore';

export const App: React.FC = () => {
  const account = useActiveAccount();
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>('cafeteria-aroma');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12">
      {/* Barra de Navegação e Autenticação Web3 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Marca */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                FidelizOn
              </span>
              <span className="ml-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Web3 Loyalty
              </span>
            </div>
          </div>

          {/* Seletor de Loja (Tenant) */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-medium">Loja Seed:</span>
            <select
              value={selectedStoreSlug}
              onChange={(e) => setSelectedStoreSlug(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="cafeteria-aroma">☕ {SEED_TENANT.name} (Seed)</option>
            </select>
          </div>

          {/* Botão Oficial de Conexão Web3 / Login */}
          <div className="flex items-center gap-2">
            <ConnectButton
              client={client}
              chain={baseSepolia}
              appMetadata={{
                name: 'FidelizOn',
                description: 'Plataforma Web3 de Fidelidade e Autoatendimento B2B2C',
                url: 'https://govinda777.github.io/FidelizOn/',
              }}
              connectButton={{
                label: 'Conectar Carteira',
                className: '!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-semibold !rounded-xl !text-xs !py-2 !px-3',
              }}
            />
          </div>
        </div>

        {/* Faixa do Contrato On-Chain Base Sepolia */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Smart Contract On-Chain (Base Sepolia):</span>
          <a
            href={`https://sepolia.basescan.org/address/${LOYALTY_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            {LOYALTY_CONTRACT_ADDRESS.slice(0, 10)}...{LOYALTY_CONTRACT_ADDRESS.slice(-8)} ↗
          </a>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            {account ? (
              <span className="text-emerald-300 font-medium">
                Conectado: {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
            ) : (
              <span className="text-amber-300">Modo Convidado / Conecte para salvar on-chain</span>
            )}
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl mx-auto mt-6 px-4">
        {!account && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 text-slate-800 text-xs shadow-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1">
              <span>👋</span> Bem-vindo à Loja Modelo {SEED_TENANT.name}!
            </div>
            <p className="text-slate-600 mb-2">
              Você pode explorar livremente o catálogo e a simulação de selos abaixo. Para gravar seus selos diretamente na blockchain Base Sepolia, clique em <strong>Conectar Carteira</strong> no topo.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <SeedStoreIntegrationDemo connectedAccount={account?.address} />
        </div>
      </main>
    </div>
  );
};
