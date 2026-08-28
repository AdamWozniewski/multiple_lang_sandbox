import {Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import {JwtStrategy} from "../../auth/auth/jwt.strategy";
import {CreateIngredientsDto} from "./dto/create-ingredients.dto";
import {JwtAuthGuard} from "../../auth/auth/jwt.guard";

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.ingredientService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Req() req, @Body() ingredient: CreateIngredientsDto) {
    return this.ingredientService.create(req.user.id, ingredient)
  }
}
