import { IsOptional, IsString } from 'class-validator';

export class SearchQuestionDto {
  @IsString()
  @IsOptional()
  sectionId?: string;
}
