import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "../../auth/auth/jwt.guard";
import { JwtStrategy } from "../../auth/auth/jwt.strategy";
import type { CreateIngredientsDto } from "./dto/create-ingredients.dto";
import { IngredientsService } from "./ingredients.service";

@Controller("ingredients")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard("jwt"))
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @Get(":id")
  async findOne(@Req() req, @Param("id", new ParseIntPipe()) id: number) {
    return await this.ingredientService.findOne(req.user.id, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOne(@Req() req, @Body() ingredient: CreateIngredientsDto) {
    return this.ingredientService.create(req.user.id, ingredient);
  }
}
