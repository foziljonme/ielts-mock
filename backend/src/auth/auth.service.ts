import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, JoinByCodeDto } from './dto/login.dto';
import { LoginResponse } from './entities/login.entity';
import {
  ADMIN_TOKEN_EXPIRES_IN,
  SESSION_TOKEN_EXPIRES_IN,
} from 'src/common/constants';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { SessionJwtPayload, JwtPayloadBase } from './entities/token.entity';
import { AttemptStatus, UserRole } from 'prisma/generated/enums';
import { Prisma } from 'prisma/generated/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async register(registerDto: CreateUserDto, roles: UserRole[]) {
    this.logger.log('Registering user');
    const user = await this.usersService.createWithTx(registerDto, roles);

    this.logger.log({ message: 'User registered', user });

    return user;
  }

  async login(loginDto: LoginDto, isPlatformAdmin = false) {
    this.logger.log('Logging in user');

    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User not found, please make sure you are using the correct email and tenant',
      );
    }

    if (isPlatformAdmin) {
      if (!user.roles.includes(UserRole.OWNER)) {
        throw new UnauthorizedException(
          'User is not a platform admin, please make sure you are using the correct email',
        );
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.error({
        message: 'Invalid password',
      });
      throw new UnauthorizedException(
        'Invalid password, please make sure you are using the correct password',
      );
    }

    const payload: JwtPayloadBase = {
      sub: user.id,
      tenantId: user.tenantId!,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        tenantId: user.tenantId,
        roles: user.roles,
      },
      { expiresIn: '7d' },
    );

    this.logger.log('Login successful');
    const { password: userPassword, ...rest } = user;

    return {
      accessToken,
      refreshToken,
      expiresAt: this.getExpiresAt(ADMIN_TOKEN_EXPIRES_IN),
      // user: rest,
    };
  }

  async joinByCode(loginDto: JoinByCodeDto) {
    // 1. Find the seat with this access code in an active schedule
    return await this.prismaService.$transaction(async (tx) => {
      const { accessCode, studentId } = loginDto;
      const seat = await tx.examSeat.findFirst({
        where: {
          accessCode: accessCode,
          assignedStudentId: studentId,
        },
        include: {
          schedule: {
            select: {
              id: true,
              testId: true,
              tenantId: true,
              startTime: true,
              endTime: true,
            },
          },
          attempt: true,
        },
      });

      if (!seat) {
        throw new UnauthorizedException('Invalid or expired access code');
      }

      // 3. Optional: Check if schedule time window is still valid
      const now = new Date();
      if (seat.schedule.endTime && now > seat.schedule.endTime) {
        throw new UnauthorizedException('This test has ended');
      }

      // 4. Create the SeatAttempt
      let seatAttempt = seat.attempt;
      if (!seat.attempt) {
        seatAttempt = await tx.seatAttempt.create({
          data: {
            seatId: seat.id,
            scheduleId: seat.schedule.id,
            status: AttemptStatus.NOT_STARTED,
            startedAt: null,
            submittedAt: null,
          },
        });
      }

      if (!seatAttempt) {
        throw new InternalServerErrorException('Failed to create seat attempt');
      }

      const payload: SessionJwtPayload = {
        sub: seat.id, // subject = attempt ID
        tenantId: seat.schedule.tenantId,
        scheduleInfo: {
          scheduleId: seat.schedule.id,
          testId: seat.schedule.testId,
          seatId: seat.id,
          studentName: seat.assignedStudentName || null,
          studentId: seat.assignedStudentId || null,
        },
        roles: [UserRole.STUDENT],
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: SESSION_TOKEN_EXPIRES_IN,
      });
      const { schedule, attempt, ...rest } = seat;
      const expiresAt = this.getExpiresAt(SESSION_TOKEN_EXPIRES_IN);
      // 6. Return success with token and context
      return {
        success: true,
        accessToken: token,
        subjectId: seat.id,
        expiresAt,
        // seat: rest,
        // schedule,
        // attempt: seatAttempt,
      };
    });
  }

  private getExpiresAt(expiresIn: number) {
    return Date.now() + expiresIn * 1000;
  }

  async getSessionInfo(tokenData: JwtPayloadBase) {
    if (tokenData.roles.includes(UserRole.STUDENT)) {
      console.log('Getting session info for student');
      const seatId = tokenData.sub;
      return await this.prismaService.$transaction(async (tx) => {
        const seat = await tx.examSeat.findFirst({
          where: {
            id: seatId,
          },
        });
        console.log('Seat found', seat);
        if (!seat) {
          throw new InternalServerErrorException('Failed to get session info');
        }
        return {
          subjectId: seat.id,
          authenticated: true,
          type: [UserRole.STUDENT],
          examId: seat.scheduleId,
        };
      });
    } else {
      console.log('Getting session info for user');
      const userId = tokenData.sub;
      const user = await this.getMe(userId);
      return {
        subjectId: userId,
        authenticated: true,
        type: user.roles,
      };
    }
  }

  public async getMe(userId: string) {
    this.logger.log({ message: 'Getting user', userId });
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...rest } = user;

    return {
      ...rest,
    };
  }
}
