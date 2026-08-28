import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { PostgresError } from "pg-error-enum";
import { QueryFailedError, TypeORMError } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = "Database Error";

    if (
      exception instanceof QueryFailedError &&
      (exception.driverError?.code === PostgresError.UNIQUE_VIOLATION ||
        exception.driverError?.code === 23505)
    ) {
      message = "Duplicate entry";
      statusCode = HttpStatus.CONFLICT;
    }

    if (this.configService.get("NODE_ENV") === "development") {
      return response.status(statusCode).json({
        statusCode,
        stack: exception.stack,
        message: exception.message,
      });
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
