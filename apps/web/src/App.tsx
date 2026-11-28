import React, { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { baseSepolia } from 'thirdweb/chains';
import { client, LOYALTY_CONTRACT_ADDRESS } from './web3Client';
import { LoyaltyCard } from './components/loyalty/LoyaltyCard';
import { CashierTerminal } from './components/pos/CashierTerminal';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { SEED_TENANT, Tenant } from './data/seedStore';
import { getTenantBySlug } from './services/storeService';

export const App: React.FC = () => {
  const account = useActiveAccount();
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>('cafeteria-aroma');
  const [tenant, setTenant] = useState<Tenant>(SEED_TENANT);
  const [activeRole, setActiveRole] = useState<'all' | 'customer' | 'cashier'>(() => {
    if (typeof window !== 'undefined') {
      const port = window.location?.port;
      const search = window.location?.search || '';
      if (port === '5174' || search.includes('role=caixa')) return 'cashier';
      if (port === '5173' || search.includes('role=cliente')) return 'customer';
    }
    return 'all';
  });

  // Carrega dados da loja ativa a partir do Sanity CMS
  useEffect(() => {
    let isMounted = true;
    getTenantBySlug(selectedStoreSlug).then((data) => {
      if (isMounted && data) {
        setTenant(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedStoreSlug]);

  const customerWalletAddress = account?.address || '0x9876543210fedcba9876543210fedcba98765432';

  return (
    <div data-testid="seed-store-demo" className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* Header & Autenticação Web3 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
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

          {/* Seletor de Loja (Tenant Sanity CMS) */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-medium">Loja Ativa:</span>
            <select
              value={selectedStoreSlug}
              onChange={(e) => setSelectedStoreSlug(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="cafeteria-aroma">☕ {tenant.name} (Seed)</option>
            </select>
          </div>

          {/* Botão Oficial de Login Web3 */}
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
                label: 'Login',
                className: '!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-semibold !rounded-xl !text-xs !py-2 !px-4 shadow-sm',
              }}
            />
          </div>
        </div>

        {/* Faixa Informativa do Smart Contract Base Sepolia */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Contrato DropERC1155 (Base Sepolia):</span>
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
              <span className="text-amber-300">Modo Convidado (Faça Login para interagir on-chain)</span>
            )}
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-2xl mx-auto mt-6 px-4 space-y-6">
        {/* Seletor de Perfil (Cliente vs. Caixa) */}
        <div className="bg-white p-2 rounded-xl flex flex-wrap items-center justify-between text-xs font-medium border border-slate-200 shadow-sm gap-2">
          <span className="text-slate-500 font-semibold px-2">Perfil:</span>
          <div className="flex gap-1">
            <button
              type="button"
              data-testid="role-tab-customer"
              onClick={() => setActiveRole('customer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeRole === 'customer'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
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
                  : 'text-slate-600 hover:bg-slate-100'
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
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              🔄 Ambos
            </button>
          </div>
        </div>

        {/* Card Principal da Loja */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          {/* Header da Loja */}
          <div className="border-b pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 data-testid="tenant-name" className="text-2xl font-bold text-slate-900">
                {tenant.name}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border font-medium">
                {activeRole === 'cashier'
                  ? 'Role: Operador Caixa (MINTER)'
                  : activeRole === 'customer'
                  ? 'Role: Cliente'
                  : 'Modo Simulador Dual'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{tenant.branding.welcomeMessage}</p>
          </div>

          {/* Cartão Fidelidade do Cliente (Visível em modo Cliente ou Ambos) */}
          {(activeRole === 'all' || activeRole === 'customer') && (
            <LoyaltyCard
              tenant={tenant}
              customerWallet={customerWalletAddress}
              isConnected={!!account}
            />
          )}

          {/* Terminal do Caixa / Operador (Visível em modo Caixa ou Ambos) */}
          {(activeRole === 'all' || activeRole === 'cashier') && (
            <CashierTerminal
              tenant={tenant}
              defaultCustomerWallet={customerWalletAddress}
            />
          )}

          {/* Catálogo de Produtos e Autoatendimento (Visível em modo Cliente ou Ambos) */}
          {(activeRole === 'all' || activeRole === 'customer') && (
            <ProductCatalog tenantSlug={selectedStoreSlug} />
          )}
        </div>
      </main>
    </div>
  );
};
