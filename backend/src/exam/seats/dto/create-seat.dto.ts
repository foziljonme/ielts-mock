import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateSeatDto {
  @IsString()
  @IsOptional()
  candidateId?: string;

  @IsString()
  candidateName: string;

  @IsNumber()
  seatNumber: number;

  @IsString()
  label: string;
}

export class CreateSeatArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}
