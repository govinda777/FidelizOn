import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeedStoreIntegrationDemo } from '../../components/demo/SeedStoreIntegrationDemo';

describe('Teste de Isolamento de Portas e Papéis (Cliente na 5173 vs. Caixa na 5174)', () => {
  it('deve isolar a interface do Cliente quando inicializada com role "customer" (Porta 5173)', () => {
    render(<SeedStoreIntegrationDemo initialRole="customer" />);

    // Deve exibir o Cartão Fidelidade do Cliente e Catálogo
    expect(screen.getByTestId('customer-loyalty-card')).toBeInTheDocument();
    expect(screen.getByTestId('stamps-count')).toHaveTextContent('9/10 Selos');
    expect(screen.getByTestId('self-service-catalog')).toBeInTheDocument();

    // NÃO deve exibir o painel do Operador de Caixa
    expect(screen.queryByTestId('operator-panel')).not.toBeInTheDocument();
  });

  it('deve isolar a interface do Caixa quando inicializada com role "cashier" (Porta 5174)', () => {
    render(<SeedStoreIntegrationDemo initialRole="cashier" />);

    // Deve exibir o Painel do Operador com permissões MINTER
    expect(screen.getByTestId('operator-panel')).toBeInTheDocument();
    expect(screen.getByText(/ROLE: MINTER \/ OPERATOR/i)).toBeInTheDocument();
    expect(screen.getByTestId('operator-btn-stamp')).toBeInTheDocument();
    expect(screen.getByTestId('operator-btn-scan-redeem')).toBeInTheDocument();

    // NÃO deve exibir o cartão fidelidade do cliente ou catálogo de autoatendimento
    expect(screen.queryByTestId('customer-loyalty-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('self-service-catalog')).not.toBeInTheDocument();
  });

  it('deve permitir alternar interativamente entre a visão de Cliente e Caixa pelo seletor de perfil', () => {
    render(<SeedStoreIntegrationDemo initialRole="customer" />);

    // Inicialmente apenas Cliente
    expect(screen.getByTestId('customer-loyalty-card')).toBeInTheDocument();
    expect(screen.queryByTestId('operator-panel')).not.toBeInTheDocument();

    // Clica para alternar para Visão Caixa
    fireEvent.click(screen.getByTestId('role-tab-cashier'));
    expect(screen.getByTestId('operator-panel')).toBeInTheDocument();
    expect(screen.queryByTestId('customer-loyalty-card')).not.toBeInTheDocument();

    // Clica para alternar para Modo Ambos (Simulador Dev)
    fireEvent.click(screen.getByTestId('role-tab-all'));
    expect(screen.getByTestId('customer-loyalty-card')).toBeInTheDocument();
    expect(screen.getByTestId('operator-panel')).toBeInTheDocument();
  });

  it('deve simular o fluxo dual de comunicação: cliente gera QR dinâmico e caixa processa resgate', () => {
    // Renderiza em modo completo para validação do ciclo compartilhado
    render(<SeedStoreIntegrationDemo initialRole="all" />);

    // 1. Caixa adiciona o 10º selo
    fireEvent.click(screen.getByTestId('operator-btn-stamp'));
    expect(screen.getByTestId('stamps-count')).toHaveTextContent('10/10 Selos');

    // 2. Cliente gera QR Dinâmico com nonce de uso único
    fireEvent.click(screen.getByTestId('customer-btn-redeem'));
    expect(screen.getByTestId('dynamic-qr-display')).toBeInTheDocument();
    expect(screen.getByText(/QR Dinâmico Pronto para Escanear no Caixa/i)).toBeInTheDocument();

    // 3. Operador do Caixa escaneia e efetua queima on-chain dos selos
    fireEvent.click(screen.getByTestId('operator-btn-scan-redeem'));
    expect(screen.getByTestId('stamps-count')).toHaveTextContent('0/10 Selos');
    expect(screen.getByTestId('operator-message')).toHaveTextContent(/Prêmio resgatado com sucesso/i);
    expect(screen.queryByTestId('dynamic-qr-display')).not.toBeInTheDocument();
  });
});
