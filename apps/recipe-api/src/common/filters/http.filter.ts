import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Request, Response} from "express";
import {CustomException} from "../exceptions/custom.exception";

@Catch(HttpException)
@Catch(CustomException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const status = exception.getStatus();

    res.status(status).json({
      message: exception.message
    })
  }
}
