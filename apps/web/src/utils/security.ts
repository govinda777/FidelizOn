export interface DynamicQRPayload {
  tenantSlug: string;
  customerWallet: string;
  action: 'redeem_reward' | 'earn_stamp' | 'debit_prepaid' | 'burn_coupon';
  timestamp: number;
  nonce: string;
  details?: Record<string, any>;
  signature?: string;
}

const MAX_QR_LIFETIME_MS = 2 * 60 * 1000; // 2 minutos (120 segundos)

/**
 * Cria payload para QR Code dinâmico
 */
export function createDynamicQRPayload(
  tenantSlug: string,
  customerWallet: string,
  action: DynamicQRPayload['action'],
  details?: Record<string, any>
): DynamicQRPayload {
  return {
    tenantSlug,
    customerWallet,
    action,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 15),
    details,
  };
}

/**
 * Valida o payload de um QR Code lido pelo operador
 */
export function validateDynamicQRPayload(
  payload: DynamicQRPayload,
  expectedTenantSlug: string,
  usedNonces: Set<string>,
  now: number = Date.now()
): { valid: boolean; error?: string } {
  // 1. Validação de formato básico
  if (!payload.tenantSlug || !payload.customerWallet || !payload.action || !payload.nonce) {
    return { valid: false, error: 'QR Code inválido ou malformado.' };
  }

  // 2. Validação de isolamento do Tenant
  if (payload.tenantSlug !== expectedTenantSlug) {
    return { valid: false, error: `QR Code pertence a outro estabelecimento (${payload.tenantSlug}).` };
  }

  // 3. Validação de expiração (2 minutos)
  const age = now - payload.timestamp;
  if (age < 0 || age > MAX_QR_LIFETIME_MS) {
    return { valid: false, error: 'QR Code expirado. Por favor, gere um novo código na sua tela.' };
  }

  // 4. Prevenção de Replay Attack (nonce já utilizado)
  if (usedNonces.has(payload.nonce)) {
    return { valid: false, error: 'Este QR Code já foi utilizado.' };
  }

  return { valid: true };
}

/**
 * Regra de Ouro: Valida se um QR Code estático está tentando ser usado para ação restrita
 */
export function assertStaticQRAcceptable(
  isDynamic: boolean,
  action: 'stamp' | 'redeem' | 'prepaid_debit'
): { allowed: boolean; error?: string } {
  if (!isDynamic && (action === 'redeem' || action === 'prepaid_debit')) {
    return {
      allowed: false,
      error: 'Operações de resgate ou débito exigem o QR Code Dinâmico gerado no momento do pagamento.',
    };
  }
  return { allowed: true };
}
