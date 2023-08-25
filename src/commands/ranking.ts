// Run as standalone application in docker compose
// $ docker compose exec backend sh
// # npm run rankings

import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { RedisService } from "src/shared/redis.service";
import { User } from "src/user/user";
import { UserService } from "src/user/user.service";

(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);

    const ambasaddors: User[] = await userService.find({
        is_ambassador: true,
        realations: ['orders', 'orders.order_items']
    })
  
    const redisService = app.get(RedisService);
    const client = redisService.getClient();

    for (let i = 0; i < ambasaddors.length; i++) {
        await client.zadd(
            'rankings',
            ambasaddors[i].revenue,
            ambasaddors[i].name
        );
    }
  
    process.exit();
  })();