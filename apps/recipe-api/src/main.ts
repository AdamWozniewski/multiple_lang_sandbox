import {HttpException, ValidationPipe} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { join } from "path";
import { AppModule } from "./app.module";
import { DatabaseExceptionFilter } from "./common/filters/database.filter";
import {AppGuard} from "./common/guards/app/app.guard";
import {HttpFilter} from "./common/filters/http.filter";
import {WrapperInterceptor} from "./common/interceptors/wrapper/wrapper.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('NEST_PORT');
  app.enableCors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  // Here or in app.module
  // app.useGlobalGuards(new AppGuard());
  app.useGlobalFilters(new HttpFilter())
  app.useGlobalInterceptors(new WrapperInterceptor())

  app.useGlobalFilters(new DatabaseExceptionFilter(configService));
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });
  const config = new DocumentBuilder()
    .setTitle("Image API")
    .setDescription("REST API for uploading and managing images")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  await app.listen(PORT ?? 3001);
}

bootstrap();
