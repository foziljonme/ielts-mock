import { IsNumber, IsString } from 'class-validator';

export class CreatePassageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  order: number;
}
