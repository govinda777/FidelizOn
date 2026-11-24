import { describe, it, expect } from 'vitest';
import {
  calculateTier,
  canAddStamp,
  addStamp,
  redeemReward,
  CustomerLoyaltyState,
} from '../loyalty';

describe('Regras de Negócio do Cartão Fidelidade (Loyalty)', () => {
  it('deve calcular corretamente o nível (tier) com base nos selos acumulados na vida', () => {
    expect(calculateTier(0)).toBe('Bronze');
    expect(calculateTier(19)).toBe('Bronze');
    expect(calculateTier(20)).toBe('Prata');
    expect(calculateTier(49)).toBe('Prata');
    expect(calculateTier(50)).toBe('Ouro');
    expect(calculateTier(120)).toBe('Ouro');
  });

  it('deve respeitar a trava de cooldown de 60 segundos entre carimbos', () => {
    const now = 1000000;
    const lastStamped = now - 30 * 1000; // 30 segundos atrás

    const checkBlocked = canAddStamp(lastStamped, 60, now);
    expect(checkBlocked.allowed).toBe(false);
    expect(checkBlocked.remainingSeconds).toBe(30);

    const pastCooldown = now - 61 * 1000; // 61 segundos atrás
    const checkAllowed = canAddStamp(pastCooldown, 60, now);
    expect(checkAllowed.allowed).toBe(true);
    expect(checkAllowed.remainingSeconds).toBe(0);
  });

  it('deve adicionar selo com sucesso e sinalizar quando a meta for atingida', () => {
    const state: CustomerLoyaltyState = {
      currentStamps: 9,
      lifetimeStamps: 9,
      lastStampedAt: 0,
    };

    const result = addStamp(state, 10, 60, 100000);
    expect(result.newState.currentStamps).toBe(10);
    expect(result.newState.lifetimeStamps).toBe(10);
    expect(result.rewardReady).toBe(true);
  });

  it('deve rejeitar adição de selo dentro do período de cooldown', () => {
    const state: CustomerLoyaltyState = {
      currentStamps: 2,
      lifetimeStamps: 2,
      lastStampedAt: 100000,
    };

    // 100000 + 10s = 100000 + 10*1000 = 110000 ms
    expect(() => addStamp(state, 10, 60, 110000)).toThrow(/Aguarde 50s/);
  });

  it('deve queimar selos no resgate sem diminuir o total vitalício (lifetimeStamps)', () => {
    const state: CustomerLoyaltyState = {
      currentStamps: 12,
      lifetimeStamps: 22, // Já era nível Prata
      lastStampedAt: 100000,
    };

    const redeemed = redeemReward(state, 10);
    expect(redeemed.currentStamps).toBe(2);
    expect(redeemed.lifetimeStamps).toBe(22); // Preservado!
    expect(calculateTier(redeemed.lifetimeStamps)).toBe('Prata');
  });

  it('deve impedir resgate se o saldo for menor que a meta', () => {
    const state: CustomerLoyaltyState = {
      currentStamps: 8,
      lifetimeStamps: 8,
    };

    expect(() => redeemReward(state, 10)).toThrow(/Selos insuficientes: você tem 8\/10/);
  });
});
