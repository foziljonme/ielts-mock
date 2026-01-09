import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'prisma/generated/enums';

export class SearchDto {
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: {
    createdAt: 'asc' | 'desc';
  };

  @IsString()
  @IsOptional()
  tenantId?: string;
}
