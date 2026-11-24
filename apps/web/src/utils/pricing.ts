/**
 * Converte valor em centavos para formato moeda BRL (ex: 1500 -> "R$ 15,00")
 */
export function formatBrl(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

/**
 * Aplica desconto percentual ou fixo sobre um valor em centavos
 */
export function applyDiscount(
  amountCents: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): { finalAmountCents: number; discountCents: number } {
  if (amountCents <= 0) {
    return { finalAmountCents: 0, discountCents: 0 };
  }

  let discountCents = 0;

  if (discountType === 'percentage') {
    const cappedPercent = Math.min(Math.max(discountValue, 0), 100);
    discountCents = Math.round((amountCents * cappedPercent) / 100);
  } else if (discountType === 'fixed') {
    discountCents = Math.min(amountCents, Math.max(discountValue, 0));
  }

  const finalAmountCents = Math.max(0, amountCents - discountCents);

  return { finalAmountCents, discountCents };
}
