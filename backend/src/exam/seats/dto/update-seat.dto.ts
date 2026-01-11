import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatDto } from './create-seat.dto';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
  @IsString()
  id: string;
}

export class UpdateSeatArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSeatDto)
  seats: UpdateSeatDto[];
}
