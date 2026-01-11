import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExamSessionStatus } from 'prisma/generated/enums';

@Injectable()
export class AdminService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async getStats(tenantId: string) {
    const stats = await this.prismaService.examSession.groupBy({
      where: {
        tenantId,
      },
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const tenant = await this.prismaService.tenant.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        tenantSeatUsage: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const counts = Object.fromEntries(
      stats.map((s) => [s.status, s._count.id]),
    );

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

    const result = {
      sessions: {
        total,
        scheduled: counts[ExamSessionStatus.SCHEDULED] || 0,
        inProgress: counts[ExamSessionStatus.IN_PROGRESS] || 0,
        completed: counts[ExamSessionStatus.COMPLETED] || 0,
      },
      seats: {
        used: tenant?.tenantSeatUsage?.usedSeats || 0,
        total: tenant.seatQuota,
        available: tenant.seatQuota - (tenant?.tenantSeatUsage?.usedSeats || 0),
      },
    };
    console.log(result);
    return result;
  }
}
