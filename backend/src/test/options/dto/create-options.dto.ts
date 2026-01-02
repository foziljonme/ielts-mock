import { IsInt, IsString } from 'class-validator';

export class CreateOptionsDto {
  @IsString()
  label: string;

  @IsString()
  text: string;

  @IsInt()
  order: number;
}
