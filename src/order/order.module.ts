import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item';
import { Order } from './order';
import { OrderItemService } from './order-item.service';
import { SharedModule } from 'src/shared/shared.module';
import { LinkModule } from 'src/link/link.module';
import { ProductModule } from 'src/product/product.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { StripeModule } from 'nestjs-stripe';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule,
    LinkModule,
    ProductModule,
    // StripeModule.forRoot({
    //   apiKey: 'my_secret_key',
    //   apiVersion: '2020-08-27',
    // }),
    MailerModule.forRoot({
      transport: {
        host: 'docker.for.mac.localhost',
        port: 1025,
      },
      defaults: {
        from:'"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService],
})
export class OrderModule {}
