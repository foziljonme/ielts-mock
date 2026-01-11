import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ExamSessionStatus } from 'prisma/generated/enums';

export class CreateSessionDto {
  @IsDate()
  startTime: Date;

  @IsString()
  testId: string;

  @IsString()
  name: string;

  @IsDate()
  @IsOptional()
  endTime?: Date;

  @IsDate()
  examDate: Date;

  @IsEnum(ExamSessionStatus)
  @IsOptional()
  status?: ExamSessionStatus = ExamSessionStatus.SCHEDULED;
}
