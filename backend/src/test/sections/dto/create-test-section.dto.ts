import { TestModule } from 'prisma/generated/enums';
import { IsEnum, IsNumber } from 'class-validator';

export class CreateTestSectionDto {
  @IsNumber()
  durationMin: number;

  @IsNumber()
  order: number;

  @IsEnum(TestModule)
  module: TestModule;
}
