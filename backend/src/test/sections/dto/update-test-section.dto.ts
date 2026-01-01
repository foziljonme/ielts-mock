import { PartialType } from '@nestjs/mapped-types';
import { CreateTestSectionDto } from './create-test-section.dto';

export class UpdateTestSectionDto extends PartialType(CreateTestSectionDto) {}
