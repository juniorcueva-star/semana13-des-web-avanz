import { Redis } from "@upstash/redis";

/**
 * Almacenamiento de usuarios e intentos fallidos.
 * - En Vercel: Upstash Redis (variables KV_REST_API_URL / KV_REST_API_TOKEN
 *   o UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 * - En local sin esas variables: memoria del servidor (se pierde al reiniciar).
 */

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type LoginAttempts = {
  count: number;
  lockedUntil: number | null; // timestamp en ms
};

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Memoria compartida entre recargas en desarrollo
const g = globalThis as unknown as {
  __users?: Map<string, StoredUser>;
  __attempts?: Map<string, LoginAttempts>;
};
const memUsers = (g.__users ??= new Map());
const memAttempts = (g.__attempts ??= new Map());

const userKey = (email: string) => `user:${email}`;
const attemptsKey = (email: string) => `login-attempts:${email}`;

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  if (redis) return (await redis.get<StoredUser>(userKey(email))) ?? null;
  return memUsers.get(email) ?? null;
}

/** Crea el usuario solo si no existe. Devuelve false si el email ya está registrado. */
export async function createUser(user: StoredUser): Promise<boolean> {
  if (redis) {
    const res = await redis.set(userKey(user.email), user, { nx: true });
    return res === "OK";
  }
  if (memUsers.has(user.email)) return false;
  memUsers.set(user.email, user);
  return true;
}

export async function getAttempts(email: string): Promise<LoginAttempts> {
  const empty = { count: 0, lockedUntil: null };
  if (redis) return (await redis.get<LoginAttempts>(attemptsKey(email))) ?? empty;
  return memAttempts.get(email) ?? empty;
}

export async function setAttempts(email: string, data: LoginAttempts, ttlSeconds: number) {
  if (redis) {
    await redis.set(attemptsKey(email), data, { ex: ttlSeconds });
    return;
  }
  memAttempts.set(email, data);
}

export async function clearAttempts(email: string) {
  if (redis) {
    await redis.del(attemptsKey(email));
    return;
  }
  memAttempts.delete(email);
}
