import { IsNumber, IsOptional } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants';

export class PaginatedQueryDto {
  @IsNumber()
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @IsNumber()
  @IsOptional()
  limit: number = DEFAULT_LIMIT;
}
