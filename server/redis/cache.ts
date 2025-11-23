import { redis, initRedis } from "./client";

const TTL = 300; // 5 min

async function ensureRedis() {
  if (!redis.isOpen) await initRedis();
}

export async function getCached<T>(key: string): Promise<T | null> {
  await ensureRedis();
  const val = await redis.get(key);
  return val ? (JSON.parse(val) as T) : null;
}

export async function setCached(key: string, data: unknown, ttl = TTL) {
  await ensureRedis();
  await redis.setEx(key, ttl, JSON.stringify(data));
}
