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
import { SchedulesService } from './schedules/schedules.service';
import { CreateSessionDto } from './schedules/dto/create-session.dto';
import { UpdateSessionDto } from './schedules/dto/update-session.dto';
import { SeatsService } from './seats/seats.service';
import { CreateSeatArrayDto } from './seats/dto/create-seat.dto';
import { UpdateSeatArrayDto } from './seats/dto/update-seat.dto';
import { ControlsService } from './control/controls.service';
import { AttemptsService } from './attempts/attempts.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly schedulesService: SchedulesService,
    private readonly seatsService: SeatsService,
    private readonly controlService: ControlsService,
    private readonly attemptsService: AttemptsService,
  ) {}

  // ======================================================
  // Schedules Start
  // ======================================================
  @Post('schedules')
  async createExamSchedule(@Body() createSessionDto: CreateSessionDto) {
    return await this.schedulesService.create(createSessionDto);
  }

  @Get('schedules')
  async getAllSchedules() {
    return await this.schedulesService.findAll();
  }

  @Get('schedules/:id')
  async getSessionById(@Param('id') id: string) {
    return await this.schedulesService.get(id);
  }

  @Patch('schedules/:id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return await this.schedulesService.updateWithTx(id, updateSessionDto);
  }

  @Delete('schedules/:id')
  async deleteSchedule(@Param('id') id: string) {
    return await this.schedulesService.delete(id);
  }

  // ======================================================
  // Schedules End
  // ======================================================

  // ======================================================
  // Seats Start
  // ======================================================
  @Post('schedules/:scheduleId/seats')
  async createSeat(
    @Param('scheduleId') scheduleId: string,
    @Body() body: CreateSeatArrayDto,
  ) {
    return await this.seatsService.create(scheduleId, body);
  }

  @Get('schedules/:scheduleId/seats')
  async getSeatsByScheduleId(@Param('scheduleId') scheduleId: string) {
    return await this.seatsService.findAll(scheduleId);
  }

  @Get('schedules/:scheduleId/seats/:id')
  async getSeatById(
    @Param('scheduleId') scheduleId: string,
    @Param('id') id: string,
  ) {
    return await this.seatsService.get(scheduleId, id);
  }

  @Patch('schedules/:scheduleId/seats')
  async updateSeat(
    @Param('scheduleId') scheduleId: string,
    @Body() body: UpdateSeatArrayDto,
  ) {
    return await this.seatsService.update(scheduleId, body);
  }

  // @Get('schedules/:scheduleId/seats/print')
  // async printSeats(@Param('scheduleId') scheduleId: string) {
  //   return await this.seatsService.print(scheduleId);
  // }

  // ======================================================
  // Seats End
  // ======================================================

  // ======================================================
  // Control Start
  // ======================================================

  @Post('schedules/:scheduleId/start')
  async startSession(@Param('scheduleId') scheduleId: string) {
    return await this.controlService.startSession(scheduleId);
  }

  @Post('schedules/:scheduleId/end')
  async endSession(@Param('scheduleId') scheduleId: string) {
    return await this.controlService.endSession(scheduleId);
  }

  @Post('schedules/:scheduleId/:section/start')
  async startSection(
    @Param('scheduleId') scheduleId: string,
    @Param('section') section: TestSection,
  ) {
    section = section.toUpperCase() as TestSection;
    if (!Object.values(TestSection).includes(section)) {
      throw new BadRequestException('Invalid section');
    }

    return await this.controlService.startSection(scheduleId, section);
  }

  @Post('schedules/:scheduleId/:section/end')
  async endSection(
    @Param('scheduleId') scheduleId: string,
    @Param('section') section: TestSection,
  ) {
    section = section.toUpperCase() as TestSection;
    if (!Object.values(TestSection).includes(section)) {
      throw new BadRequestException('Invalid section');
    }

    return await this.controlService.endSection(scheduleId, section);
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
