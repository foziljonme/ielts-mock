import { IsOptional, IsString } from 'class-validator';

export class SearchAudioDto {
  @IsString()
  @IsOptional()
  sectionId?: string;
}
