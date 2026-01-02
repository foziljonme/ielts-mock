import { IsOptional, IsString } from 'class-validator';

export class SearchOptionsDto {
  @IsString()
  @IsOptional()
  questionId?: string;
}
