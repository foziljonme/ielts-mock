import { Module } from '@nestjs/common';
import { DemosService } from './demos.service';
import { DemosController } from './demos.controller';

@Module({
  controllers: [DemosController],
  providers: [DemosService],
})
export class DemosModule {}
