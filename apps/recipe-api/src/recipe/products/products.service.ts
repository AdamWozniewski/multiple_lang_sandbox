import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Products } from './product.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {CompaniesService} from "../companies/companies.service";
import {CreateProductsDto} from "./dto/create-products.dto";
import {UpdateProductsDto} from "./dto/update-products.dto";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(forwardRef(() => CompaniesService)) private companyService: CompaniesService,
    @InjectRepository(Products) private productRepository: Repository<Products>
  ) {
    this.companyService = companyService;
  }

  async getOneById(id: number): Promise<Products> {
    const product = await this.productRepository.findOne({
      where: {
        id
      }
    });
    if (!product) {
      throw new HttpException(`Nie ma takiej Ingredients`, 404);
    }
    return product;
  }

  async findAll(): Promise<Products[]> {
    return this.productRepository.find();
  }

  async createProduct(product: CreateProductsDto) {
    const newProduct = this.productRepository.create(product);
    // newProduct.dish = await this.companyService.getOneById(product.dishId);
    return newProduct.save();
  }

  async update(product: UpdateProductsDto): Promise<UpdateResult> {
    await this.getOneById(product.id);
    return this.productRepository.update(product.id, product);
  }

  async remove(productId: number): Promise<Products> {
    const productToRemove = await this.getOneById(productId);
    return this.productRepository.remove(productToRemove);
  }
}
