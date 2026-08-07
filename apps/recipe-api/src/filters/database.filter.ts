import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { PostgresError } from "pg-error-enum";
import { QueryFailedError, TypeORMError } from "typeorm";

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = "Database Error";

    if (exception instanceof QueryFailedError) {
      if (
        exception.driverError?.code === PostgresError.UNIQUE_VIOLATION ||
        exception.driverError?.code === 23505
      ) {
        message = "Duplicate entry";
        statusCode = HttpStatus.CONFLICT;
      }
    }
    // @ts-expect-error
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
