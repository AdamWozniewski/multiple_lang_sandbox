import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest()
    const res = ctx.getResponse()
    const metadata = this.reflector.get('roles', context.getHandler());
    return true;
  }
}
