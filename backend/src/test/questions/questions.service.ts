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
import { CreateQuestionDto } from './dto/create-question.dto';
import { SearchQuestionDto } from './dto/search-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  private validateQuestionType(
    createQuestionDto: CreateQuestionDto | UpdateQuestionDto,
  ) {
    if (
      (
        [
          QuestionType.FORM_COMPLETION,
          QuestionType.NOTE_COMPLETION,
          QuestionType.FLOW_CHART_COMPLETION,
          QuestionType.TABLE_COMPLETION,
          QuestionType.SUMMARY_COMPLETION,
          QuestionType.SENTENCE_COMPLETION,
          QuestionType.SHORT_ANSWER,
        ] as any
      ).includes(createQuestionDto.type) &&
      !createQuestionDto.maxWords
    ) {
      throw new BadRequestException(
        'maxWords is required for this question type',
      );
    }
  }

  private async validateOrder(
    sectionId: string,
    createQuestionDto: CreateQuestionDto | UpdateQuestionDto,
    excludeQuestionId?: string,
  ) {
    if (createQuestionDto.order && createQuestionDto.order < 1) {
      throw new BadRequestException('order must be greater than 0');
    }

    const questions = await this.prismaService.question.findMany({
      where: { sectionId },
    });

    const isDuplicateOrder = questions.some(
      (question) =>
        question.order === createQuestionDto.order &&
        question.id !== excludeQuestionId,
    );

    if (isDuplicateOrder) {
      throw new BadRequestException('order is already taken');
    }
  }

  async create(
    sectionId: string,
    createQuestionDto: CreateQuestionDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({
      message: 'Creating question',
      sectionId,
      createQuestionDto,
    });

    this.validateQuestionType(createQuestionDto);
    await this.validateOrder(sectionId, createQuestionDto);
    const question = await tx.question.create({
      data: { ...createQuestionDto, sectionId },
    });

    return question;
  }

  async createWithTx(sectionId: string, createQuestionDto: CreateQuestionDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.create(sectionId, createQuestionDto, tx);
    });
  }

  async findAll(
    searchQuestionDto: SearchQuestionDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({ message: 'Finding all questions', searchQuestionDto });
    const { sectionId } = searchQuestionDto;
    return await this.prismaService.question.findMany({ where: { sectionId } });
  }

  async findAllWithTx(searchQuestionDto: SearchQuestionDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.findAll(searchQuestionDto, tx);
    });
  }

  async findOne(questionId: string, tx: Prisma.TransactionClient) {
    this.logger.log({ message: 'Finding one question', questionId });
    const result = await tx.question.findUnique({
      where: { id: questionId },
    });

    if (!result) {
      throw new NotFoundException('Question not found');
    }

    return result;
  }

  async findOneWithTx(questionId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.findOne(questionId, tx);
    });
  }

  async update(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log({ message: 'Updating question', questionId });
    const currentQuestion = await tx.question.findUnique({
      where: { id: questionId },
    });

    if (!currentQuestion) {
      throw new NotFoundException('Question not found');
    }

    this.validateQuestionType(updateQuestionDto);

    await this.validateOrder(
      currentQuestion.sectionId,
      updateQuestionDto,
      questionId,
    );

    return await tx.question.update({
      where: { id: questionId },
      data: updateQuestionDto,
    });
  }

  async updateWithTx(questionId: string, updateQuestionDto: UpdateQuestionDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.update(questionId, updateQuestionDto, tx);
    });
  }

  async delete(questionId: string, tx: Prisma.TransactionClient) {
    this.logger.log({ message: 'Deleting question', questionId });
    const deletedSection = await tx.question.delete({
      where: { id: questionId },
    });

    return { success: true, section: deletedSection };
  }

  async deleteWithTx(questionId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.delete(questionId, tx);
    });
  }
}
