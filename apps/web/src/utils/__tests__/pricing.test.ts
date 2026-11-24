import { describe, it, expect } from 'vitest';
import { formatBrl, applyDiscount } from '../pricing';

describe('Cálculos Financeiros e Cupons (Pricing)', () => {
  it('deve formatar centavos em Real BRL adequadamente', () => {
    expect(formatBrl(750)).toMatch(/7,50/);
    expect(formatBrl(3500)).toMatch(/35,00/);
    expect(formatBrl(0)).toMatch(/0,00/);
  });

  it('deve calcular desconto percentual corretamente', () => {
    // 20% de R$ 35,00 (3500 cents) = R$ 7,00 (700 cents) -> final R$ 28,00 (2800 cents)
    const result = applyDiscount(3500, 'percentage', 20);
    expect(result.discountCents).toBe(700);
    expect(result.finalAmountCents).toBe(2800);
  });

  it('deve calcular desconto de valor fixo corretamente', () => {
    // R$ 10,00 (1000 cents) de desconto em R$ 16,50 (1650 cents) -> final R$ 6,50 (650 cents)
    const result = applyDiscount(1650, 'fixed', 1000);
    expect(result.discountCents).toBe(1000);
    expect(result.finalAmountCents).toBe(650);
  });

  it('não deve permitir que o desconto exceda o valor total', () => {
    const result = applyDiscount(500, 'fixed', 1000);
    expect(result.discountCents).toBe(500);
    expect(result.finalAmountCents).toBe(0);
  });
});
