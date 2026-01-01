import {
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePassageDto } from './dto/create-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';
import { Prisma } from 'prisma/generated/client';
import { SearchPassageDto } from './dto/search-passage.dto';

@Injectable()
export class PassagesService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    sectionId: string,
    createPassageDto: CreatePassageDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log('Creating passage');
    const passage = await tx.passage.create({
      data: {
        ...createPassageDto,
        sectionId,
      },
    });

    return passage;
  }

  async createWithTx(sectionId: string, createPassageDto: CreatePassageDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.create(sectionId, createPassageDto, tx);
    });
  }

  async findAll(searchPassageDto: SearchPassageDto) {
    const { sectionId } = searchPassageDto;
    return await this.prismaService.passage.findMany({ where: { sectionId } });
  }

  async findOne(passageId: string) {
    const result = await this.prismaService.passage.findUnique({
      where: { id: passageId },
    });

    if (!result) {
      throw new NotFoundException('Passage not found');
    }

    return result;
  }

  async update(passageId: string, updatePassageDto: UpdatePassageDto) {
    return await this.prismaService.passage.update({
      where: { id: passageId },
      data: updatePassageDto,
    });
  }

  async delete(passageId: string) {
    const deletedSection = await this.prismaService.passage.delete({
      where: { id: passageId },
    });

    return { success: true, section: deletedSection };
  }
}
