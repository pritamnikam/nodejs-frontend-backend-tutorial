import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateOrderDto } from './dtos/create-order.dto';
import { LinkService } from 'src/link/link.service';
import { Link } from 'src/link/link';
import { Order } from './order';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from './order-item';
import { Product } from 'src/product/product';
import { OrderItemService } from './order-item.service';
import { DataSource } from 'typeorm';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly linkService: LinkService,
    private readonly productService: ProductService,
    private readonly orderItemService: OrderItemService,
    private readonly dataSource: DataSource,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  async all() {
    return this.orderService.find({
      relations: ['order_items'],
    });
  }

  @Post('checkout/orders')
  async create(
    @Body()
    body: CreateOrderDto,
  ) {
    const link: Link = await this.linkService.findOne({
      code: body.code,
      relations: ['user'],
    });

    if (!link) {
      throw new BadRequestException('Invalid link!');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = new Order();
      order.user_id = link.user.id;
      order.ambassador_email = link.user.email;
      order.first_name = body.first_name;
      order.last_name = body.last_name;
      order.email = body.email;
      order.address = body.address;
      order.country = body.country;
      order.city = body.city;
      order.zip = body.zip;
      order.code = body.code;

      // const o = await this.orderService.save(order);
      const o = await queryRunner.manager.save(order);
      for (const p of body.products) {
        const product: Product = await this.productService.findOne({
          id: p.product_id,
        });
        const orderItem = new OrderItem();
        orderItem.order = o;
        orderItem.quantity = p.quantity;
        orderItem.product_title = product.title;
        orderItem.price = product.price;
        orderItem.ambassador_revenue = 0.1 * product.price * p.quantity; // 10% revenue
        orderItem.admin_revenue = 0.9 * product.price * p.quantity; // 90% revenue
        // await this.orderItemService.save(orderItem);
        await queryRunner.manager.save(orderItem);
      }

      return o;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
