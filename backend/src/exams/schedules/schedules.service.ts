import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from 'src/config/contextStorage.service';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Prisma } from 'prisma/generated/client';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(ContextStorageServiceKey)
    private readonly contextStorageService: ContextStorageService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const session = await this.prismaService.examSchedule.create({
      data: {
        ...createSessionDto,
        tenantId: this.contextStorageService.tenantId,
      },
    });

    return session;
  }

  async findAll() {
    const sessions = await this.prismaService.examSchedule.findMany({
      where: {
        tenantId: this.contextStorageService.tenantId,
      },
    });

    return sessions;
  }

  async get(id: string, tx?: Prisma.TransactionClient) {
    if (!tx) {
      tx = this.prismaService;
    }

    const session = await tx.examSchedule.findUnique({
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

    const session = await tx.examSchedule.update({
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

    const session = await this.prismaService.examSchedule.delete({
      where: {
        id,
      },
    });

    return session;
  }
}
