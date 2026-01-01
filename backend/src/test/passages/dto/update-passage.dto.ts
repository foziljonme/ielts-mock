import { CreatePassageDto } from './create-passage.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePassageDto extends PartialType(CreatePassageDto) {}
