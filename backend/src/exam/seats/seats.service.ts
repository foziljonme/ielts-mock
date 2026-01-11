import {
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateSeatArrayDto, CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatArrayDto } from './dto/update-seat.dto';
import { Prisma } from 'prisma/generated/browser';

@Injectable()
export class SeatsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  private generateAccessCode(length: number = 10) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let accessCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      accessCode += characters.charAt(randomIndex);
    }
    return accessCode;
  }

  async create(sessionId: string, createSeatDto: CreateSeatArrayDto) {
    this.logger.log('Creating seat');

    return await this.prismaService.$transaction(async (tx) => {
      const promises = createSeatDto.seats.map(async (seat) => {
        let { candidateId, ...rest } = seat;

        if (!candidateId) {
          candidateId = Math.floor(Math.random() * 1000000).toString();
        }

        const newSeat = await this.prismaService.examSeat.create({
          data: {
            candidateContact: 'helloworld@test.com',
            accessCode: this.generateAccessCode(),
            candidateId,
            ...rest,
            sessionId,
          },
        });

        return newSeat;
      });

      const seats = await Promise.all(promises);

      return seats;
    });
  }

  async findAll(sessionId: string) {
    const seats = await this.prismaService.examSeat.findMany({
      where: {
        sessionId,
      },
    });

    return seats;
  }

  async get(sessionId: string, id: string) {
    const seatResponse = await this.prismaService.examSeat.findUnique({
      where: {
        id,
        sessionId,
      },
      include: {
        session: true,
      },
    });

    if (!seatResponse) {
      throw new NotFoundException('Seat not found');
    }
    const { session, ...seat } = seatResponse;
    return { ...seat, testId: session.testId };
  }

  async update(sessionId: string, updateSeatDto: UpdateSeatArrayDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const promises = updateSeatDto.seats.map(async (seatData) => {
        const { id, ...rest } = seatData;
        const updatedSeat = await this.prismaService.examSeat.update({
          where: {
            id,
            sessionId,
          },
          data: rest,
        });

        return updatedSeat;
      });

      const seats = await Promise.all(promises);

      return seats;
    });
  }

  public static SanitizeSeatData(seat: Prisma.ExamSeatGetPayload<{}>) {
    const { accessCode, candidateId, ...rest } = seat;

    return rest;
  }
}
