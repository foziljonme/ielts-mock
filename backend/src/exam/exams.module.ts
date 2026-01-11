import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { SessionsService } from './sessions/sessions.service';
import { SeatsService } from './seats/seats.service';
import { ControlsService } from './control/controls.service';
import { ControlsGateway } from './control/controls.gateway';
import { AttemptsService } from './attempts/attempts.service';

@Module({
  controllers: [ExamsController],
  providers: [
    ExamsService,
    SessionsService,
    SeatsService,
    ControlsService,
    ControlsGateway,
    AttemptsService,
  ],
})
export class ExamsModule {}
