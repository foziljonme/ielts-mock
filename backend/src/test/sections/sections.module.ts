import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { PassagesService } from '../passages/passages.service';
import { AudiosService } from '../audios/audios.service';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService, PassagesService, AudiosService],
})
export class SectionsModule {}
