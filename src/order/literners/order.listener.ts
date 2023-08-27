import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Order } from "../order";
import { RedisService } from "src/shared/redis.service";

@Injectable()
export class OrderListener {

    constructor(
        private readonly redisService: RedisService
    ) {}

    @OnEvent('order.completed')
    async handleOrderCompleted(order: Order) {
        const client = this.redisService.getClient();
        client.zincrby(
            'rankings',
            order.ambassador_revenue,
            order.user.name
        );
    }
}