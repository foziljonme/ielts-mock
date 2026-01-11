import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
// import { AttemptStatus, ExamScheduleStatus } from 'prisma/generated/enums';
import { TestSection } from 'prisma/generated/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ControlsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly sessionsService: SessionsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async startSession(scheduledTestId: string) {
    // return await this.prismaService.$transaction(async (tx) => {
    //   const startedSession = await this.sessionsService.update(
    //     scheduledTestId,
    //     {
    //       status: ExamScheduleStatus.IN_PROGRESS,
    //     },
    //     tx,
    //   );
    //   const seats = await tx.examSeat.findMany({
    //     where: {
    //       sessionId: scheduledTestId,
    //     },
    //   });
    //   const promises = seats.map((seat) => {
    //     return tx.seatAttempt.upsert({
    //       where: {
    //         seatId: seat.id,
    //       },
    //       create: {
    //         seatId: seat.id,
    //         sessionId: scheduledTestId,
    //         startedAt: new Date(),
    //         status: AttemptStatus.IN_PROGRESS,
    //       },
    //       update: {},
    //     });
    //   });
    //   const seatAttempts = await Promise.all(promises);
    //   this.eventEmitter.emit('controls.session.started', {
    //     scheduledTestId,
    //     seatAttempts,
    //   });
    //   return {
    //     startedSession,
    //     seatAttempts,
    //   };
    // });
  }

  async endSession(scheduledTestId: string) {
    // return await this.prismaService.$transaction(async (tx) => {
    //   const endedSession = await this.sessionsService.update(
    //     scheduledTestId,
    //     {
    //       status: ExamScheduleStatus.COMPLETED,
    //     },
    //     tx,
    //   );
    //   const seats = await tx.examSeat.findMany({
    //     where: {
    //       sessionId: scheduledTestId,
    //     },
    //   });
    //   const promises = seats.map((seat) => {
    //     return tx.seatAttempt.upsert({
    //       where: {
    //         seatId: seat.id,
    //       },
    //       create: {
    //         seatId: seat.id,
    //         sessionId: scheduledTestId,
    //         status: AttemptStatus.SUBMITTED,
    //       },
    //       update: {},
    //     });
    //   });
    //   const seatAttempts = await Promise.all(promises);
    //   this.eventEmitter.emit('controls.session.ended', {
    //     scheduledTestId,
    //     seatAttempts,
    //   });
    //   return {
    //     endedSession,
    //     seatAttempts,
    //   };
    // });
  }

  async startSection(scheduledTestId: string, section: TestSection) {
    // return await this.prismaService.$transaction(async (tx) => {
    //   // This will throw if session is not found
    //   await this.sessionsService.get(scheduledTestId, tx);
    //   const seatAttempts = await tx.seatAttempt.findMany({
    //     where: {
    //       sessionId: scheduledTestId,
    //     },
    //   });
    //   const promises = seatAttempts.map((seatAttempt) => {
    //     return tx.sectionAttempt.upsert({
    //       where: {
    //         seatAttemptId_section: {
    //           seatAttemptId: seatAttempt.id,
    //           section,
    //         },
    //       },
    //       create: {
    //         seatAttemptId: seatAttempt.id,
    //         section,
    //         startedAt: new Date(),
    //         status: AttemptStatus.IN_PROGRESS,
    //       },
    //       update: {},
    //     });
    //   });
    //   const results = await Promise.all(promises);
    //   this.eventEmitter.emit('controls.section.started', {
    //     scheduledTestId,
    //     section,
    //     seatAttempts,
    //   });
    //   return results;
    // });
  }

  async endSection(scheduledTestId: string, section: TestSection) {
    // return await this.prismaService.$transaction(async (tx) => {
    //   // This will throw if session is not found
    //   await this.sessionsService.get(scheduledTestId, tx);
    //   const seatAttempts = await tx.seatAttempt.findMany({
    //     where: {
    //       sessionId: scheduledTestId,
    //     },
    //   });
    //   const promises = seatAttempts.map((seatAttempt) => {
    //     return tx.sectionAttempt.update({
    //       where: {
    //         seatAttemptId_section: {
    //           seatAttemptId: seatAttempt.id,
    //           section,
    //         },
    //       },
    //       data: {
    //         status: AttemptStatus.SUBMITTED,
    //       },
    //     });
    //   });
    //   const results = await Promise.all(promises);
    //   this.eventEmitter.emit('controls.section.finished', {
    //     scheduledTestId,
    //     section,
    //     seatAttempts,
    //     results,
    //   });
    //   return results;
    // });
  }
}
