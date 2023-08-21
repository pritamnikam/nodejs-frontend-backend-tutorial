import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get('admin/products')
  async all() {
    return this.productService.find();
  }

  @UseGuards(AuthGuard)
  @Post('admin/products')
  async create(
    @Body()
    body: ProductCreateDto,
  ) {
    this.productService.save(body);
  }

  @UseGuards(AuthGuard)
  @Get('admin/products/:id')
  async get(
    @Param('id')
    id: number,
  ) {
    const product = await this.productService.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return product;
  }

  @UseGuards(AuthGuard)
  @Put('admin/products/:id')
  async update(
    @Param('id')
    id: number,
    @Body()
    body: ProductCreateDto,
  ) {
    const product = await this.productService.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    await this.productService.update(id, body);
    return await this.productService.findOne({ where: { id } });
  }

  @UseGuards(AuthGuard)
  @Delete('admin/products/:id')
  async delete(
    @Param('id')
    id: number,
  ) {
    const product = await this.productService.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return await this.productService.delete(id);
  }
}
