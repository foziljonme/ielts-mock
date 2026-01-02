import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { PassagesService } from '../passages/passages.service';
import { AudiosService } from '../audios/audios.service';
import { QuestionsService } from '../questions/questions.service';

@Module({
  controllers: [SectionsController],
  providers: [
    SectionsService,
    PassagesService,
    AudiosService,
    QuestionsService,
  ],
})
export class SectionsModule {}
