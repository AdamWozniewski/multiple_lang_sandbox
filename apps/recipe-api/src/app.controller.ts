import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { AppService } from "./app.service";
import {TransformerPipe} from "./common/pipes/transformer/transformer.pipe";
import {AppGuard} from "./common/guards/app/app.guard";
import {AdminDecorator} from "./common/decorators/admin.decorator";
import {CustomException} from "./common/exceptions/custom.exception";
import {WrapperInterceptor} from "./common/interceptors/wrapper/wrapper.interceptor";

@Controller()
@UsePipes(TransformerPipe)
@UseInterceptors(WrapperInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user')
  @UseGuards(AppGuard)
  // @SetMetadata('roles', ['admin'])
  @AdminDecorator()
  getSample(@Query('name') name: string) {
    // throw new CustomException()
    return { name }
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("")
  getUSer() {
    return this.appService.getSample();
  }
}
