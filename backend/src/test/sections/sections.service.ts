import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestSectionDto } from './dto/create-test-section.dto';
import { UpdateTestSectionDto } from './dto/update-test-section.dto';
import { SectionSearchDto } from './dto/search-section-dto';
import { Prisma } from 'prisma/generated/client';

@Injectable()
export class SectionsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}
  async create(
    testId: string,
    createTestSectionDto: CreateTestSectionDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log('Creating test section');
    const allExistingSections = await tx.testSection.findMany({
      where: { testId },
    });

    const currentSectionExists = allExistingSections.find(
      (section) => section.module === createTestSectionDto.module,
    );

    // check if section already exists
    if (currentSectionExists) {
      throw new BadRequestException(
        `Section ${createTestSectionDto.module} already exists for this test, consider updating it instead: testId/sectionId=${currentSectionExists.testId}/${currentSectionExists.id}`,
      );
    }

    // check if there is no section with the same order
    const sectionWithSameOrder = allExistingSections.find(
      (section) => section.order === createTestSectionDto.order,
    );

    if (sectionWithSameOrder) {
      throw new BadRequestException(
        `Section with order ${createTestSectionDto.order} already exists for this test.`,
      );
    }

    const testSection = await tx.testSection.create({
      data: {
        ...createTestSectionDto,
        testId,
      },
    });

    return testSection;
  }

  async createWithTx(
    testId: string,
    createTestSectionDto: CreateTestSectionDto,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.create(testId, createTestSectionDto, tx);
    });
  }

  async findAll(sectionSearchDto: SectionSearchDto) {
    const { testId } = sectionSearchDto;
    return await this.prismaService.testSection.findMany({ where: { testId } });
  }

  async findOne(sectionId: string) {
    const result = await this.prismaService.testSection.findUnique({
      where: { id: sectionId },
    });

    if (!result) {
      throw new NotFoundException('Section not found');
    }

    return result;
  }

  async update(
    sectionId: string,
    updateTestSectionDto: UpdateTestSectionDto,
    tx: Prisma.TransactionClient,
  ) {
    return await tx.testSection.update({
      where: { id: sectionId },
      data: updateTestSectionDto,
    });
  }

  async updateWithTx(
    sectionId: string,
    updateTestSectionDto: UpdateTestSectionDto,
  ) {
    // This will throw 404 if section is not found
    await this.findOne(sectionId);
    return await this.prismaService.$transaction(async (tx) => {
      return await this.update(sectionId, updateTestSectionDto, tx);
    });
  }

  async delete(sectionId: string) {
    // This will throw 404 if section is not found
    await this.findOne(sectionId);
    const deletedSection = await this.prismaService.testSection.delete({
      where: { id: sectionId },
    });

    return { success: true, section: deletedSection };
  }
}
