import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, QuestionType } from 'prisma/generated/client';
import { CreateOptionsDto } from './dto/create-options.dto';
import { SearchOptionsDto } from './dto/search-options.dto';
import { UpdateOptionsDto } from './dto/update-options.dto';

@Injectable()
export class OptionsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  private async validateOrder(
    questionId: string,
    createOptionDto: CreateOptionsDto | UpdateOptionsDto,
    excludeOptionId?: string,
  ) {
    if (createOptionDto.order && createOptionDto.order < 1) {
      throw new BadRequestException('order must be greater than 0');
    }

    const options = await this.prismaService.questionOption.findMany({
      where: { questionId },
    });

    const isDuplicateOrder = options.some(
      (option) =>
        option.order === createOptionDto.order && option.id !== excludeOptionId,
    );

    if (isDuplicateOrder) {
      throw new BadRequestException('order is already taken');
    }
  }

  async create(
    questionId: string,
    createOptionDto: CreateOptionsDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({
      message: 'Creating option',
      questionId,
      createOptionDto,
    });

    await this.validateOrder(questionId, createOptionDto);
    const option = await tx.questionOption.create({
      data: {
        ...createOptionDto,
        questionId,
      },
    });

    return option;
  }

  async createWithTx(sectionId: string, createOptionDto: CreateOptionsDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.create(sectionId, createOptionDto, tx);
    });
  }

  async findAll(
    searchOptionDto: SearchOptionsDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({ message: 'Finding all options', searchOptionDto });
    const { questionId } = searchOptionDto;
    return await this.prismaService.questionOption.findMany({
      where: { questionId },
    });
  }

  async findAllWithTx(searchOptionDto: SearchOptionsDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.findAll(searchOptionDto, tx);
    });
  }

  async findOne(optionId: string, tx: Prisma.TransactionClient) {
    this.logger.log({ message: 'Finding one option', optionId });
    const result = await tx.questionOption.findUnique({
      where: { id: optionId },
    });

    if (!result) {
      throw new NotFoundException('Option not found');
    }

    return result;
  }

  async findOneWithTx(optionId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.findOne(optionId, tx);
    });
  }

  async update(
    optionId: string,
    updateOptionDto: UpdateOptionsDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({ message: 'Updating option', optionId });
    const currentOption = await tx.questionOption.findUnique({
      where: { id: optionId },
    });

    if (!currentOption) {
      throw new NotFoundException('Option not found');
    }

    await this.validateOrder(
      currentOption.questionId,
      updateOptionDto,
      optionId,
    );

    return await tx.questionOption.update({
      where: { id: optionId },
      data: updateOptionDto,
    });
  }

  async updateWithTx(optionId: string, updateOptionDto: UpdateOptionsDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.update(optionId, updateOptionDto, tx);
    });
  }

  async delete(optionId: string, tx: Prisma.TransactionClient) {
    this.logger.log({ message: 'Deleting option', optionId });
    const deletedSection = await tx.questionOption.delete({
      where: { id: optionId },
    });

    return { success: true, section: deletedSection };
  }

  async deleteWithTx(optionId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.delete(optionId, tx);
    });
  }
}
