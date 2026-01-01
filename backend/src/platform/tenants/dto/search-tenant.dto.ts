import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SearchTenantDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsString()
  @IsOptional()
  name?: string;
}
