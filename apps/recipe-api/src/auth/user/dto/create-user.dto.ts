import { OmitType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Match } from "../../../decorators/match.decorator";
import { UpdateUserDto } from "./update-user.dto";

export class CreateUserDto extends OmitType(UpdateUserDto, ["id"] as const) {
  @IsString()
  @Match<CreateUserDto>("password")
  confirmPassword: string;
}
