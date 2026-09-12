import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    try {
      await this.redis.connect();
    } catch (err) {
      this.logger.warn(`Redis connection skipped/pending: ${err.message}`);
    }
  }

  /**
   * Acquire a distributed lock with TTL (in milliseconds)
   */
  async acquireLock(key: string, ttlMs = 5000): Promise<string | null> {
    const lockId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    try {
      const result = await this.redis.set(`lock:${key}`, lockId, 'PX', ttlMs, 'NX');
      return result === 'OK' ? lockId : null;
    } catch (e) {
      this.logger.error(`Error acquiring Redis lock for ${key}: ${e.message}`);
      return null;
    }
  }

  /**
   * Release a distributed lock securely with Lua script (only if lockId matches)
   */
  async releaseLock(key: string, lockId: string): Promise<boolean> {
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    try {
      const result = await this.redis.eval(luaScript, 1, `lock:${key}`, lockId);
      return result === 1;
    } catch (e) {
      this.logger.error(`Error releasing Redis lock for ${key}: ${e.message}`);
      return false;
    }
  }

  getClient(): Redis {
    return this.redis;
  }
}
