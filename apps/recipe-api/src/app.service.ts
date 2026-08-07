import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  getSample(): Object {
    return {
      test: "test",
    };
  }
}
