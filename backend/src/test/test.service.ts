import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}
  async create(createTestDto: CreateTestDto) {
    this.logger.log('Creating test');
    const test = await this.prismaService.test.create({
      data: createTestDto,
    });
    return test;
  }

  async findAll() {
    this.logger.log('Finding all tests');
    return await this.prismaService.test.findMany();
  }

  async findOne(id: string) {
    this.logger.log('Finding test');
    return await this.prismaService.test.findUnique({
      where: { id },
      include: {
        attempts: true,
        examSessions: true,
        sections: {
          include: {
            passages: true,
            listeningAudio: true,
          },
        },
        tenant: true,
      },
    });
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    this.logger.log('Updating test');
    return await this.prismaService.test.update({
      where: { id },
      data: updateTestDto,
    });
  }

  async delete(id: string) {
    this.logger.log('Deleting test');
    return await this.prismaService.test.delete({ where: { id } });
  }
}
