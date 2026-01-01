import { IsOptional, IsString } from 'class-validator';

export class SectionSearchDto {
  @IsString()
  @IsOptional()
  testId?: string;
}
