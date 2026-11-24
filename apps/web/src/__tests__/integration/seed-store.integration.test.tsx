import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeedStoreIntegrationDemo } from '../../components/demo/SeedStoreIntegrationDemo';
import { SEED_TENANT } from '../../data/seedStore';

describe('Teste Integrado da Loja Modelo Seed (Cafeteria Aroma)', () => {
  it('deve renderizar a loja modelo com identidade visual e catálogo completo', () => {
    render(<SeedStoreIntegrationDemo />);

    expect(screen.getByTestId('tenant-name')).toHaveTextContent(SEED_TENANT.name);
    expect(screen.getByTestId('stamps-count')).toHaveTextContent('9/10 Selos');
    expect(screen.getByTestId('customer-tier')).toHaveTextContent('Bronze'); // 19 selos vitalícios
  });

  it('deve completar a meta (10/10) quando o operador confirmar +1 selo', () => {
    render(<SeedStoreIntegrationDemo />);

    const btnStamp = screen.getByTestId('operator-btn-stamp');
    fireEvent.click(btnStamp);

    expect(screen.getByTestId('stamps-count')).toHaveTextContent('10/10 Selos');
    expect(screen.getByTestId('operator-message')).toHaveTextContent(/completou a meta/i);
    expect(screen.getByTestId('customer-btn-redeem')).toBeInTheDocument();
  });

  it('deve realizar fluxo completo de resgate seguro com QR Dinâmico e queima de selos', () => {
    render(<SeedStoreIntegrationDemo />);

    // 1. Marca selo para completar 10
    fireEvent.click(screen.getByTestId('operator-btn-stamp'));

    // 2. Cliente gera QR Dinâmico
    fireEvent.click(screen.getByTestId('customer-btn-redeem'));
    expect(screen.getByTestId('dynamic-qr-display')).toBeInTheDocument();

    // 3. Operador escaneia o QR Dinâmico
    fireEvent.click(screen.getByTestId('operator-btn-scan-redeem'));

    // 4. Saldo atual queima 10 selos (0/10), mas lifetimeStamps agora é 20 (Promovido a Prata!)
    expect(screen.getByTestId('stamps-count')).toHaveTextContent('0/10 Selos');
    expect(screen.getByTestId('customer-tier')).toHaveTextContent('Prata');
    expect(screen.getByTestId('operator-message')).toHaveTextContent(/Prêmio resgatado com sucesso/i);
  });

  it('deve calcular autoatendimento com produtos em R$, troca por selos e cupom Black Friday', () => {
    render(<SeedStoreIntegrationDemo />);

    // Adiciona Café Especial (prod_3) em R$ 35,00
    fireEvent.click(screen.getByTestId('btn-buy-prod_3'));
    expect(screen.getByTestId('cart-total-brl')).toHaveTextContent('R$ 35,00');

    // Adiciona Cookie (prod_5) trocando por 3 selos
    fireEvent.click(screen.getByTestId('btn-stamps-prod_5'));
    expect(screen.getByTestId('cart-stamps-needed')).toHaveTextContent('Selos Necessários: 3');

    // Aplica cupom Black Friday 20% OFF sobre os R$ 35,00 (desconto de R$ 7,00 -> final R$ 28,00)
    fireEvent.click(screen.getByTestId('apply-coupon-btn'));
    expect(screen.getByTestId('cart-discount-value')).toHaveTextContent('R$ 7,00');
    expect(screen.getByTestId('cart-total-brl')).toHaveTextContent('R$ 28,00');
  });
});
