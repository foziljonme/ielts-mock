import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { OptionsService } from '../options/options.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, OptionsService],
})
export class QuestionsModule {}
