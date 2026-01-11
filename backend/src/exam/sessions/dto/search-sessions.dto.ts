import { IsEnum, IsOptional } from 'class-validator';
import { ExamSessionStatus } from 'prisma/generated/enums';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

export class SearchSessionsDto extends PaginatedQueryDto {
  @IsOptional()
  @IsEnum(ExamSessionStatus)
  status?: ExamSessionStatus;
}
