import { clearAttempts, getAttempts, setAttempts } from "./store";

/** Número de intentos fallidos permitidos antes de bloquear la cuenta. */
export const MAX_LOGIN_ATTEMPTS = 3;
/** Tiempo de bloqueo tras superar los intentos (en minutos). */
export const LOCK_MINUTES = 5;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Si la cuenta está bloqueada devuelve los minutos restantes; si no, null. */
export async function getLockRemainingMinutes(email: string): Promise<number | null> {
  const { lockedUntil } = await getAttempts(email);
  if (lockedUntil && lockedUntil > Date.now()) {
    return Math.ceil((lockedUntil - Date.now()) / 60000);
  }
  return null;
}

/** Registra un intento fallido. Devuelve los intentos restantes (0 = bloqueado). */
export async function registerFailedAttempt(email: string): Promise<number> {
  const current = await getAttempts(email);
  // Si un bloqueo anterior ya expiró, se reinicia el contador
  const base = current.lockedUntil && current.lockedUntil <= Date.now() ? 0 : current.count;
  const count = base + 1;
  const ttl = LOCK_MINUTES * 60;

  if (count >= MAX_LOGIN_ATTEMPTS) {
    await setAttempts(email, { count, lockedUntil: Date.now() + ttl * 1000 }, ttl);
    return 0;
  }
  await setAttempts(email, { count, lockedUntil: null }, ttl);
  return MAX_LOGIN_ATTEMPTS - count;
}

export async function resetAttempts(email: string) {
  await clearAttempts(email);
}
