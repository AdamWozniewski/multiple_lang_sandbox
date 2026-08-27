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
import {ProductsService} from "./products.service";
import {CreateProductsDto} from "./dto/create-products.dto";
import {UpdateProductsDto} from "./dto/update-products.dto";

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
  async createProduct(@Body() product: CreateProductsDto) {
    // const company = this.companyService.getOneById(product.dishId);
    await this.productService.createProduct(product);
  }

  @Put()
  async updateOne(@Body() product: UpdateProductsDto) {
    await this.productService.update(product);
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    await this.productService.remove(productId);
  }
}
