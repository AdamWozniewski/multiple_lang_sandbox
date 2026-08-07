import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import type { CreateProductsDto } from './dto/create-products.dto';
import type { UpdateProductsDto } from './dto/update-products.dto';
import type { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  // private productService: ProductsService;
  constructor(private productService: ProductsService) {
    this.productService = productService
  }
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post()
  createProduct(@Body() product: CreateProductsDto) {
    // const company = this.companyService.getOneById(product.dishId);
    this.productService.createProduct(product);
  }

  @Put()
  updateOne(@Body() product: UpdateProductsDto) {
    this.productService.update(product);
  }

  @Delete(':productId')
  deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    this.productService.remove(productId);
  }
}
