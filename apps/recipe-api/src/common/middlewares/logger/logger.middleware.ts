import { Injectable, NestMiddleware } from '@nestjs/common';
import {UserService} from "../../../auth/user/user.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {
  }
  async use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const user = await this.userService.findOne({id: 1});
    console.log('logger:', user)
    next();
  }
}
