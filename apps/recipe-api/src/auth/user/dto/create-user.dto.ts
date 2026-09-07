import { OmitType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { Match } from "../../../commons/decorators/match.decorator";
import { UpdateUserDto } from "./update-user.dto";

export class CreateUserDto extends OmitType(UpdateUserDto, ["id"] as const) {
  @IsString()
  @Match<CreateUserDto>("password")
  confirmPassword: string;
}
