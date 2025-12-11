import { redis, initRedis } from "./client";

const TTL = 300; // 5 min

async function ensureRedis() {
  try {
    if (!redis.isOpen) await initRedis();
  }
  catch (err: any) {
    console.warn("Redis init failed (optional for dev):", err?.message ?? err);
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  await ensureRedis();
  if (!redis.isOpen) return null;

  const val = await redis.get(key);
  return val ? (JSON.parse(val) as T) : null;
}

export async function setCached(key: string, data: unknown, ttl = TTL) {
  await ensureRedis();
  if (!redis.isOpen) return;

  await redis.setEx(key, ttl, JSON.stringify(data));
}
