import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ExamScheduleStatus } from 'prisma/generated/enums';

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

  @IsEnum(ExamScheduleStatus)
  @IsOptional()
  status?: ExamScheduleStatus = ExamScheduleStatus.SCHEDULED;
}
