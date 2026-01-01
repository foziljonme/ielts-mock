import { IsOptional, IsString } from 'class-validator';

export class SearchPassageDto {
  @IsString()
  @IsOptional()
  sectionId: string;
}
