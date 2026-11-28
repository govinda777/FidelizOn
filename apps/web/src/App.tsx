import React, { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { baseSepolia } from 'thirdweb/chains';
import { client, DEFAULT_CONTRACT_ADDRESS } from './web3Client';
import { LoyaltyCard } from './components/loyalty/LoyaltyCard';
import { CashierTerminal } from './components/pos/CashierTerminal';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { Tenant } from './types/tenant';
import { listTenants, getTenantBySlug } from './services/storeService';

export const App: React.FC = () => {
  const account = useActiveAccount();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantSlug, setSelectedTenantSlug] = useState<string>('cafeteria-aroma');
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoadingTenants, setIsLoadingTenants] = useState<boolean>(true);

  const [activeRole, setActiveRole] = useState<'all' | 'customer' | 'cashier'>(() => {
    if (typeof window !== 'undefined') {
      const port = window.location?.port;
      const search = window.location?.search || '';
      if (port === '5174' || search.includes('role=caixa')) return 'cashier';
      if (port === '5173' || search.includes('role=cliente')) return 'customer';
    }
    return 'all';
  });

  // 1. Carrega todos os estabelecimentos (Tenants) ativos diretamente do Sanity CMS
  useEffect(() => {
    let isMounted = true;
    setIsLoadingTenants(true);
    listTenants()
      .then((items) => {
        if (isMounted) {
          setTenants(items);
          if (items.length > 0) {
            // Seleciona o primeiro ou o que coincidir com o slug atual
            const match = items.find((t) => t.slug?.current === selectedTenantSlug) || items[0];
            setSelectedTenantSlug(match.slug.current);
            setCurrentTenant(match);
          }
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar lista de tenants no Sanity:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingTenants(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Quando o usuário troca de tenant no select, carrega os dados completos desse tenant
  const handleTenantChange = async (slug: string) => {
    setSelectedTenantSlug(slug);
    const found = tenants.find((t) => t.slug?.current === slug);
    if (found) {
      setCurrentTenant(found);
    } else {
      const fetched = await getTenantBySlug(slug);
      if (fetched) setCurrentTenant(fetched);
    }
  };

  const customerWalletAddress = account?.address || '0x9876543210fedcba9876543210fedcba98765432';
  const tenantContractAddress =
    currentTenant?.web3?.loyaltyContractAddress || DEFAULT_CONTRACT_ADDRESS;

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
                Multi-Tenant Web3
              </span>
            </div>
          </div>

          {/* Seletor Dinâmico de Estabelecimentos (Tenants do Sanity CMS) */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 font-medium">Estabelecimento:</span>
            {isLoadingTenants ? (
              <span className="text-slate-400">Carregando lojas...</span>
            ) : (
              <select
                value={selectedTenantSlug}
                onChange={(e) => handleTenantChange(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {tenants.map((t) => (
                  <option key={t._id} value={t.slug.current}>
                    🏪 {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Botão Oficial de Login Web3 */}
          <div className="flex items-center gap-2">
            <ConnectButton
              client={client}
              chain={baseSepolia}
              appMetadata={{
                name: 'FidelizOn',
                description: 'Plataforma Web3 Multi-Tenant de Fidelidade e Autoatendimento',
                url: 'https://govinda777.github.io/FidelizOn/',
              }}
              connectButton={{
                label: 'Login',
                className: '!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-semibold !rounded-xl !text-xs !py-2 !px-4 shadow-sm',
              }}
            />
          </div>
        </div>

        {/* Faixa Informativa do Smart Contract On-Chain do Tenant */}
        <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Contrato DropERC1155 do Estabelecimento:</span>
          <a
            href={`https://sepolia.basescan.org/address/${tenantContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            {tenantContractAddress.slice(0, 10)}...{tenantContractAddress.slice(-8)} ↗
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

        {/* Card Principal da Loja Selecionada */}
        {currentTenant ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            {/* Header da Loja */}
            <div className="border-b pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 data-testid="tenant-name" className="text-2xl font-bold text-slate-900">
                  {currentTenant.name}
                </h1>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border font-medium">
                  {activeRole === 'cashier'
                    ? 'Role: Operador Caixa (MINTER)'
                    : activeRole === 'customer'
                    ? 'Role: Cliente'
                    : 'Modo Simulador Dual'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {currentTenant.branding?.welcomeMessage || 'Programa de Fidelidade e Autoatendimento'}
              </p>
            </div>

            {/* Cartão Fidelidade do Cliente */}
            {(activeRole === 'all' || activeRole === 'customer') && (
              <LoyaltyCard
                tenant={currentTenant}
                customerWallet={customerWalletAddress}
                isConnected={!!account}
              />
            )}

            {/* Terminal do Caixa / Operador */}
            {(activeRole === 'all' || activeRole === 'cashier') && (
              <CashierTerminal
                tenant={currentTenant}
                defaultCustomerWallet={customerWalletAddress}
              />
            )}

            {/* Catálogo de Produtos e Autoatendimento */}
            {(activeRole === 'all' || activeRole === 'customer') && (
              <ProductCatalog tenantSlug={selectedTenantSlug} />
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border text-slate-500 text-sm">
            Carregando estabelecimento do Sanity CMS...
          </div>
        )}
      </main>
    </div>
  );
};
