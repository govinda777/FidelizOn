export type LoyaltyTier = 'Bronze' | 'Prata' | 'Ouro';

export interface CustomerLoyaltyState {
  currentStamps: number;
  lifetimeStamps: number;
  lastStampedAt?: number; // timestamp em ms
}

/**
 * Calcula o nível (tier) do cliente com base no total vitalício de selos acumulados
 */
export function calculateTier(lifetimeStamps: number): LoyaltyTier {
  if (lifetimeStamps >= 50) return 'Ouro';
  if (lifetimeStamps >= 20) return 'Prata';
  return 'Bronze';
}

/**
 * Valida se um novo selo pode ser concedido respeitando o cooldown
 */
export function canAddStamp(
  lastStampedAt: number | undefined,
  cooldownSeconds: number = 60,
  now: number = Date.now()
): { allowed: boolean; remainingSeconds: number } {
  if (!lastStampedAt) {
    return { allowed: true, remainingSeconds: 0 };
  }

  const elapsedSeconds = Math.floor((now - lastStampedAt) / 1000);
  if (elapsedSeconds < cooldownSeconds) {
    return {
      allowed: false,
      remainingSeconds: cooldownSeconds - elapsedSeconds,
    };
  }

  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Processa a atribuição de +1 selo
 */
export function addStamp(
  state: CustomerLoyaltyState,
  stampsGoal: number = 10,
  cooldownSeconds: number = 60,
  now: number = Date.now()
): { newState: CustomerLoyaltyState; rewardReady: boolean } {
  const check = canAddStamp(state.lastStampedAt, cooldownSeconds, now);
  if (!check.allowed) {
    throw new Error(`Aguarde ${check.remainingSeconds}s antes de marcar outro selo.`);
  }

  const nextCurrent = state.currentStamps + 1;
  const nextLifetime = state.lifetimeStamps + 1;

  return {
    newState: {
      currentStamps: nextCurrent,
      lifetimeStamps: nextLifetime,
      lastStampedAt: now,
    },
    rewardReady: nextCurrent >= stampsGoal,
  };
}

/**
 * Processa o resgate de um prêmio (queima de selos da meta)
 */
export function redeemReward(
  state: CustomerLoyaltyState,
  stampsGoal: number = 10
): CustomerLoyaltyState {
  if (state.currentStamps < stampsGoal) {
    throw new Error(`Selos insuficientes: você tem ${state.currentStamps}/${stampsGoal}.`);
  }

  return {
    ...state,
    currentStamps: state.currentStamps - stampsGoal,
    // lifetimeStamps NÃO diminui, garantindo preservação de status e nível
  };
}
