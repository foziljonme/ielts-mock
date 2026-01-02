import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { QuestionType } from 'prisma/generated/enums';

export class CreateQuestionDto {
  @IsInt()
  order: number;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  prompt: string;

  @IsInt()
  @IsOptional()
  maxWords?: number;
}
