import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('admin/orders')
  async all() {
    return this.orderService.find({
      relations: ['order_items'],
    });
  }
}
