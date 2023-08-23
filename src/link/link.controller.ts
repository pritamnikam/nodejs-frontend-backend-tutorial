import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Link } from './link';
import { Order } from 'src/order/order';

@Controller()
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('admin/users/:id/links')
  async all(
    @Param('id')
    id: number,
  ) {
    return this.linkService.find({
      user: id,
      relations: ['orders'],
    });
  }

  @UseGuards(AuthGuard)
  @Post('ambassador/links')
  async create(
    @Body('products')
    products: number[],

    @Req()
    request: Request,
  ) {
    const user = await this.authService.user(request);
    await this.linkService.save({
      code: Math.random().toString(63).substring(6),
      user,
      products: products.map((id) => ({ id })),
    });
  }

  @UseGuards(AuthGuard)
  @Get('ambassador/stats')
  async stats(
    @Req()
    request: Request,
  ) {
    const user = await this.authService.user(request);
    const links: Link[] = await this.linkService.find({
      user,
      relations: ['orders'],
    });

    return links.map((link) => {
      const completedOrders: Order[] = link.orders.filter((o) => o.complete);
      return {
        code: link.code,
        count: completedOrders.length,
        revenue: completedOrders.reduce((s, o) => s + o.ambassador_revenue, 0),
      };
    });
  }
}
