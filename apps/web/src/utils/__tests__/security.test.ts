import { describe, it, expect } from 'vitest';
import {
  createDynamicQRPayload,
  validateDynamicQRPayload,
  assertStaticQRAcceptable,
  DynamicQRPayload,
} from '../security';

describe('Segurança de QR Code e EIP-712', () => {
  const tenantSlug = 'cafeteria-aroma';
  const customerWallet = '0x1234567890abcdef1234567890abcdef12345678';

  it('deve criar um payload dinâmico com nonce e timestamp recente', () => {
    const payload = createDynamicQRPayload(tenantSlug, customerWallet, 'redeem_reward');
    expect(payload.tenantSlug).toBe(tenantSlug);
    expect(payload.customerWallet).toBe(customerWallet);
    expect(payload.action).toBe('redeem_reward');
    expect(typeof payload.nonce).toBe('string');
    expect(payload.timestamp).toBeGreaterThan(0);
  });

  it('deve validar positivamente um QR code dinâmico dentro da janela de 2 minutos', () => {
    const now = Date.now();
    const payload: DynamicQRPayload = {
      tenantSlug,
      customerWallet,
      action: 'redeem_reward',
      timestamp: now - 30 * 1000, // 30s atrás
      nonce: 'nonce_123',
    };

    const usedNonces = new Set<string>();
    const result = validateDynamicQRPayload(payload, tenantSlug, usedNonces, now);
    expect(result.valid).toBe(true);
  });

  it('deve rejeitar QR code dinâmico expirado (> 2 minutos)', () => {
    const now = Date.now();
    const payload: DynamicQRPayload = {
      tenantSlug,
      customerWallet,
      action: 'redeem_reward',
      timestamp: now - 130 * 1000, // 2min e 10s atrás
      nonce: 'nonce_expired',
    };

    const usedNonces = new Set<string>();
    const result = validateDynamicQRPayload(payload, tenantSlug, usedNonces, now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/expirado/i);
  });

  it('deve impedir replay attack se o nonce já foi consumido', () => {
    const now = Date.now();
    const payload: DynamicQRPayload = {
      tenantSlug,
      customerWallet,
      action: 'redeem_reward',
      timestamp: now - 10 * 1000,
      nonce: 'nonce_already_used',
    };

    const usedNonces = new Set<string>(['nonce_already_used']);
    const result = validateDynamicQRPayload(payload, tenantSlug, usedNonces, now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/já foi utilizado/i);
  });

  it('deve rejeitar QR code gerado para outro estabelecimento', () => {
    const now = Date.now();
    const payload: DynamicQRPayload = {
      tenantSlug: 'outra-loja',
      customerWallet,
      action: 'redeem_reward',
      timestamp: now,
      nonce: 'nonce_outro',
    };

    const usedNonces = new Set<string>();
    const result = validateDynamicQRPayload(payload, tenantSlug, usedNonces, now);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/pertence a outro estabelecimento/i);
  });

  it('Regra de Ouro: deve impedir que QR code estático seja aceito para resgate de prêmio', () => {
    const checkRedeemStatic = assertStaticQRAcceptable(false, 'redeem');
    expect(checkRedeemStatic.allowed).toBe(false);

    const checkStampStatic = assertStaticQRAcceptable(false, 'stamp');
    expect(checkStampStatic.allowed).toBe(true); // Estático PODE receber carimbo
  });
});
