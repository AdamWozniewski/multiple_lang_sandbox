import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {BaseEntity} from "typeorm";

export class FilterQueryDto<ENTITY extends BaseEntity> {
    @IsNumber()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number

    @IsNumber()
    @Min(1)
    @IsOptional()
    offset?: number

    @IsString()
    @IsOptional()
    query?: string

    @IsOptional()
    orderBy?: keyof ENTITY;

    @IsOptional()
    order?: 'ASC' | 'DESC';

    constructor(query: string, offset: number, limit: number, order, orderBy) {
        this.query = query
        this.offset = Number(offset) || 0;
        this.limit = Number(limit) || 10;
        this.order = order
        this.orderBy = orderBy || 'id'

    }

}