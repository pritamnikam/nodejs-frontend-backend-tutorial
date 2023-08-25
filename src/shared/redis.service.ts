import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
// import { RedisClient } from 'redis';  // redis@3

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}


    // getClient(): RedisClient {
    getClient() {
        const store: any = this.cacheManager.store;
        return store.getClient();
    }
}