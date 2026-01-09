import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { SchedulesService } from './schedules/schedules.service';
import { SeatsService } from './seats/seats.service';
import { ControlsService } from './control/controls.service';
import { ControlsGateway } from './control/controls.gateway';
import { AttemptsService } from './attempts/attempts.service';

@Module({
  controllers: [ExamsController],
  providers: [
    ExamsService,
    SchedulesService,
    SeatsService,
    ControlsService,
    ControlsGateway,
    AttemptsService,
  ],
})
export class ExamsModule {}
