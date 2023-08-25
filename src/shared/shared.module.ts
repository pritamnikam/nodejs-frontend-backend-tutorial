import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST ?? 'redis',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
      },
    }),
  ],
  providers: [RedisService],
  exports: [JwtModule, CacheModule],
})
export class SharedModule {}
