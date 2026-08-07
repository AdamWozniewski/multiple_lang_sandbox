import { OmitType, PickType } from "@nestjs/mapped-types";
import { UpdateUserDto } from "./update-user.dto";

export class LoginUserDto extends PickType(UpdateUserDto, [
  "email",
  "password",
] as const) {}
