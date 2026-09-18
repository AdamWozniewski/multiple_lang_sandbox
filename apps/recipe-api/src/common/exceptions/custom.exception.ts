import {HttpException, HttpStatus} from "@nestjs/common";

export class CustomException extends HttpException {
    constructor(message: string = 'Custom Exception') {
        super(message, HttpStatus.FORBIDDEN);
    }
}