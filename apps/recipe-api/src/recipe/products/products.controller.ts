import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/auth/jwt.guard";
import { FilterBy } from "../../common/decorators/filter-by.decorator";
import type { FilterQueryDto } from "../../common/dto/FilterQueryDto";
import type { CreateProductsDto } from "./dto/create-products.dto";
import type { UpdateProductsDto } from "./dto/update-products.dto";
import type { Products } from "./product.entity";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private productService: ProductsService) {
    this.productService = productService;
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

  @Delete(":productId")
  async deleteProduct(@Param("productId", ParseIntPipe) productId: number) {
    await this.productService.remove(productId);
  }
}
