import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { TestSection } from 'prisma/generated/enums';
import { SessionsService } from './sessions/sessions.service';
import { CreateSessionDto } from './sessions/dto/create-session.dto';
import { UpdateSessionDto } from './sessions/dto/update-session.dto';
import { SeatsService } from './seats/seats.service';
import { CreateSeatArrayDto } from './seats/dto/create-seat.dto';
import { UpdateSeatArrayDto } from './seats/dto/update-seat.dto';
import { ControlsService } from './control/controls.service';
import { AttemptsService } from './attempts/attempts.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { get } from 'http';

@Controller('exam')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly sessionsService: SessionsService,
    private readonly seatsService: SeatsService,
    private readonly controlService: ControlsService,
    private readonly attemptsService: AttemptsService,
  ) {}

  @Get('sessions/:sessionId/seats/:seatId')
  async getSeatById(
    @Param('sessionId') sessionId: string,
    @Param('seatId') seatId: string,
  ) {
    return await this.seatsService.get(sessionId, seatId);
  }

  // ======================================================
  // Exam Sessions Start
  // ======================================================
  @Post('sessions')
  async createExamSession(@Body() createSessionDto: CreateSessionDto) {
    return await this.sessionsService.create(createSessionDto);
  }

  // @Get('sessions')
  // async getAllExamSessions() {
  //   return await this.sessionsService.findAll();
  // }

  @Get('sessions/:id')
  async getSessionById(@Param('id') id: string) {
    return await this.sessionsService.get(id);
  }

  @Patch('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return await this.sessionsService.updateWithTx(id, updateSessionDto);
  }

  @Delete('sessions/:id')
  async deleteSchedule(@Param('id') id: string) {
    return await this.sessionsService.delete(id);
  }

  // ======================================================
  // Sessions End
  // ======================================================

  // ======================================================
  // Seats Start
  // ======================================================
  @Post('sessions/:sessionId/seats')
  async createSeat(
    @Param('sessionId') sessionId: string,
    @Body() body: CreateSeatArrayDto,
  ) {
    return await this.seatsService.create(sessionId, body);
  }

  @Get('sessions/:sessionId/seats')
  async getSeatsByScheduleId(@Param('sessionId') sessionId: string) {
    return await this.seatsService.findAll(sessionId);
  }

  @Patch('sessions/:sessionId/seats')
  async updateSeat(
    @Param('sessionId') sessionId: string,
    @Body() body: UpdateSeatArrayDto,
  ) {
    return await this.seatsService.update(sessionId, body);
  }

  // @Get('sessions/:sessionId/seats/print')
  // async printSeats(@Param('sessionId') sessionId: string) {
  //   return await this.seatsService.print(sessionId);
  // }

  // ======================================================
  // Seats End
  // ======================================================

  // ======================================================
  // Control Start
  // ======================================================

  @Post('sessions/:sessionId/start')
  async startSession(@Param('sessionId') sessionId: string) {
    return await this.controlService.startSession(sessionId);
  }

  @Post('sessions/:sessionId/end')
  async endSession(@Param('sessionId') sessionId: string) {
    return await this.controlService.endSession(sessionId);
  }

  @Post('sessions/:sessionId/:section/start')
  async startSection(
    @Param('sessionId') sessionId: string,
    @Param('section') section: TestSection,
  ) {
    section = section.toUpperCase() as TestSection;
    if (!Object.values(TestSection).includes(section)) {
      throw new BadRequestException('Invalid section');
    }

    return await this.controlService.startSection(sessionId, section);
  }

  @Post('sessions/:sessionId/:section/end')
  async endSection(
    @Param('sessionId') sessionId: string,
    @Param('section') section: TestSection,
  ) {
    section = section.toUpperCase() as TestSection;
    if (!Object.values(TestSection).includes(section)) {
      throw new BadRequestException('Invalid section');
    }

    return await this.controlService.endSection(sessionId, section);
  }

  // ======================================================
  // Control End
  // ======================================================

  @Get(':examId/questions')
  async getAllQuestions(@Param('examId') examId: string) {
    return await this.examsService.getAllQuestions(examId);
  }

  @Post('/onboarding')
  @Public()
  async onboarding() {
    return await this.examsService.onboardTestDataForTesting();
  }

  // ======================================================
  // Attempt Start
  // ======================================================

  @Post('/attempts/:seatId/submit/listening')
  async submitListeningSection(
    @Param('seatId') seatId: string,
    @Body()
    body: {
      answers: Record<string, string | string[]>;
    },
  ) {
    return await this.attemptsService.submitSection(
      seatId,
      TestSection.LISTENING,
      body.answers,
    );
  }

  @Get('/attempts/:seatId/details')
  async getAttemptById(@Param('seatId') seatId: string) {
    return await this.attemptsService.getAttemptBySeatId(seatId);
  }

  // ======================================================
  // Attempt End
  // ======================================================
}
