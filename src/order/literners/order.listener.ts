import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Order } from "../order";
import { RedisService } from "src/shared/redis.service";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class OrderListener {

    constructor(
        private readonly redisService: RedisService,
        private readonly mailerService: MailerService
    ) {}

    @OnEvent('order.completed')
    async handleOrderCompleted(order: Order) {
        const client = this.redisService.getClient();
        client.zincrby(
            'rankings',
            order.ambassador_revenue,
            order.user.name
        );

        await this.mailerService.sendMail({
            to: 'admin@admin.com',
            subject: 'Order has been completed',
            html: `Order #${order.id} with total of $${order.total} has been completed.`
        });

        await this.mailerService.sendMail({
            to: order.ambassador_email,
            subject: 'Order has been completed',
            html: `You earned $${order.ambassador_revenue} from the link #${order.code}.`
        });
    }
}