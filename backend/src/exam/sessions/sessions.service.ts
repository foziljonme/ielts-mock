import {
  Inject,
  Injectable,
  type LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { UpdateSessionDto } from './dto/update-session.dto';
import { ExamSessionStatus, Prisma } from 'prisma/generated/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Pagination } from 'src/common/Pagination';
import { SearchSessionsDto } from './dto/search-sessions.dto';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const session = await this.prismaService.examSession.create({
      data: {
        ...createSessionDto,
        tenantId: this.contextStorageService.tenantId,
      },
    });

    return session;
  }

  async findAll(tenantId: string, searchSessionsDto: SearchSessionsDto) {
    this.logger.log(`Finding all sessions for tenant ${tenantId}`);

    const { page, limit, status } = searchSessionsDto;

    const whereClause: Prisma.ExamSessionWhereInput = {
      tenantId,
    };

    if (status) {
      whereClause.status = {
        in: [status],
      };
    } else {
      whereClause.status = {
        in: [ExamSessionStatus.SCHEDULED, ExamSessionStatus.IN_PROGRESS],
      };
    }

    const total = await this.prismaService.examSession.count({
      where: whereClause,
    });

    const sessions = await this.prismaService.examSession.findMany({
      where: whereClause,
      include: {
        seats: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const pagination = new Pagination({
      page,
      limit,
      total,
    });

    return { results: sessions, pagination };
  }

  async get(id: string, tx?: Prisma.TransactionClient) {
    if (!tx) {
      tx = this.prismaService;
    }

    const session = await tx.examSession.findUnique({
      where: {
        id,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
    tx: Prisma.TransactionClient,
  ) {
    await this.get(id);

    const session = await tx.examSession.update({
      where: {
        id,
      },
      data: updateSessionDto,
    });

    return session;
  }

  async updateWithTx(id: string, updateSessionDto: UpdateSessionDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.update(id, updateSessionDto, tx);
    });
  }

  async delete(id: string) {
    await this.get(id);

    const session = await this.prismaService.examSession.delete({
      where: {
        id,
      },
    });

    return session;
  }
}
