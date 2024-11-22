import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @Type(() => Date)
  time_start: Date;

  @IsNotEmpty()
  @Type(() => Date)
  time_end: Date;

  @IsNotEmpty()
  @IsNumber()
  id_employee: number;

  @IsNotEmpty()
  @IsNumber()
  id_manager: number;

  @IsNotEmpty()
  @IsNumber()
  id_request_type: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ApproveRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  note: string;
}

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  status?: string;
}
