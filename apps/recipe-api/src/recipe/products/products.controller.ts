import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put, UseGuards,
} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {CreateProductsDto} from "./dto/create-products.dto";
import {UpdateProductsDto} from "./dto/update-products.dto";
import {JwtAuthGuard} from "../../auth/auth/jwt.guard";
import {FilterBy} from "../../commons/decorators/filter-by.decorator";
import {Products} from "./product.entity";
import {FilterQueryDto} from "../../commons/dto/FilterQueryDto";

@Controller('products')
export class ProductsController {
  // private productService: ProductsService;
  constructor(private productService: ProductsService) {
    this.productService = productService
  }
  @Get()
  findAll(@FilterBy<Products>() filters: FilterQueryDto<Products>) {
    return this.productService.findAll(filters);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() product: CreateProductsDto) {
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
