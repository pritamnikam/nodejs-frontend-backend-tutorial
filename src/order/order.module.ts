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

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    SharedModule,
    LinkModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderItemService],
})
export class OrderModule {}
