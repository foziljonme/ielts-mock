import { Module } from '@nestjs/common';
import { PassagesService } from '../passages/passages.service';
import { PassagesController } from './passages.controller';

@Module({
  controllers: [PassagesController],
  providers: [PassagesService],
})
export class PassagesModule {}
