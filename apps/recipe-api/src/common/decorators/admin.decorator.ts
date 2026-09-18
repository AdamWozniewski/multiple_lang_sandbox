import {SetMetadata} from "@nestjs/common";

export const AdminDecorator = () => SetMetadata('roles', ['admin'])