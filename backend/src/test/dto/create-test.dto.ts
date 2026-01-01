import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateTestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
