import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';
@Injectable()
export class CacheService {
  private cacheService: Redis;
  constructor(private readonly configService: ConfigService) {
    this.cacheService = new Redis({
      url: this.configService.get<string>('cache.url'),
      token: this.configService.get<string>('cache.token'),
    });
  }

  async setData<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheService.set(key, value, { ex: ttl });
  }

  async getData<T>(key: string): Promise<T | null> {
    const data: T = await this.cacheService.get(key);
    return data;
  }

  async deleteData(key: string): Promise<void> {
    await this.cacheService.del(key);
  }
}
