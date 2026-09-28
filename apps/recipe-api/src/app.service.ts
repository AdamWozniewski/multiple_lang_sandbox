import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getSample(test: string): Object {
    return {
      test,
    };
  }
}
