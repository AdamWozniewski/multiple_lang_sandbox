import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import {JwtStrategy} from "../../auth/auth/jwt.strategy";
import {CreateIngredientsDto} from "./dto/create-ingredients.dto";
import {JwtAuthGuard} from "../../auth/auth/jwt.guard";
import {AuthGuard} from "@nestjs/passport";

@Controller('ingredients')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.ingredientService.findOne(req.user.id, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Req() req, @Body() ingredient: CreateIngredientsDto) {
    return this.ingredientService.create(req.user.id, ingredient)
  }
}
