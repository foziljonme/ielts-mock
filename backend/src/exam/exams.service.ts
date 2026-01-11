import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { TestSection } from 'prisma/generated/enums';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class ExamsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly answersDir = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'answers',
  );
  private readonly testsDir = path.join(__dirname, '..', '..', 'data', 'tests');

  private async loadAnswers(testId: string): Promise<any> {
    const filePath = path.join(this.answersDir, `answers-${testId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async submitSection(
    user: any,
    seatAttemptId: string,
    module: TestSection,
    answers: Record<string, string | string[]>,
  ) {
    // return await this.prismaService.$transaction(async (tx) => {
    //   const seatAttempt = await tx.seatAttempt.findUnique({
    //     where: { id: seatAttemptId },
    //     include: {
    //       sections: {
    //         where: { section: module },
    //       },
    //     },
    //   });
    //   if (!seatAttempt) {
    //     throw new NotFoundException('Attempt not found');
    //   }
    //   if (seatAttempt.status === AttemptStatus.SUBMITTED) {
    //     throw new BadRequestException('Test already submitted');
    //   }
    //   const sectionAttempt = seatAttempt.sections.find(
    //     (section) => section.section === module,
    //   );
    //   if (!sectionAttempt) {
    //     throw new NotFoundException('Section not found');
    //   }
    //   // Check time: Prevent overtime submission
    //   // if (sectionAttempt.expiresAt && new Date() > sectionAttempt.expiresAt) {
    //   //   throw new BadRequestException(
    //   //     'Submission time expired for this section',
    //   //   );
    //   // }
    //   // Save answers
    //   const upsertPromises = Object.entries(answers).map(
    //     async ([questionId, value]) => {
    //       const questionAttempt = await tx.questionAttempt.findUnique({
    //         where: {
    //           sectionAttemptId_questionId: {
    //             // sectionAttemptId: sectionAttempt.id,
    //             sectionAttemptId: 'sectionAttempt.id',
    //             questionId,
    //           },
    //         },
    //       });
    //       if (!questionAttempt) return;
    //       const stringValue = Array.isArray(value)
    //         ? JSON.stringify(value)
    //         : value;
    //       const wordCount =
    //         typeof value === 'string'
    //           ? value.trim().split(/\s+/).length
    //           : undefined;
    //       await tx.answer.upsert({
    //         where: { questionAttemptId: questionAttempt.id },
    //         update: {
    //           value: stringValue,
    //           wordCount,
    //           updatedAt: new Date(),
    //         },
    //         create: {
    //           questionAttemptId: questionAttempt.id,
    //           value: stringValue,
    //           wordCount,
    //         },
    //       });
    //     },
    //   );
    //   await Promise.all(upsertPromises);
    //   // Update section status
    //   await tx.sectionAttempt.update({
    //     where: { id: sectionAttempt.id },
    //     data: { status: AttemptStatus.SUBMITTED },
    //   });
    //   // Optional: Score if not Writing (Writing needs manual grading)
    //   let scoreResult;
    //   // if (module !== 'writing') {
    //   //   const answersData = await this.loadAnswers(seatAttempt.testId);
    //   //   scoreResult = this.calculateScore(answersData, answers);
    //   // }
    //   // Check if all sections submitted → mark full attempt submitted
    //   const allSections = await this.prismaService.sectionAttempt.findMany({
    //     where: { seatAttemptId },
    //   });
    //   if (allSections.every((s) => s.status === AttemptStatus.SUBMITTED)) {
    //     await this.prismaService.seatAttempt.update({
    //       where: { id: seatAttemptId },
    //       data: {
    //         status: AttemptStatus.SUBMITTED,
    //         submittedAt: new Date(),
    //       },
    //     });
    //   }
    //   return {
    //     success: true,
    //     message: 'Section submitted successfully',
    //     score: scoreResult,
    //   };
    // });
  }

  async onboardTestDataForTesting() {
    return await this.prismaService.$transaction(async (tx) => {
      const tenantPayload = {
        name: 'Test Tenant',
        subdomain: 'test-tenant',
      };

      const tenant = await tx.tenant.upsert({
        where: { subdomain: tenantPayload.subdomain },
        create: tenantPayload,
        update: tenantPayload,
      });

      const tenantSeatUsagePayload = {
        tenantId: tenant.id,
        usedSeats: 0,
      };

      const tenantSeatUsage = await tx.tenantSeatUsage.upsert({
        where: { tenantId: tenant.id },
        create: tenantSeatUsagePayload,
        update: {},
      });

      const generateAccessCode = () => {
        const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let accessCode = '';
        for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          accessCode += characters.charAt(randomIndex);
        }
        return accessCode;
      };

      // answer <- questionAttempt <- sectionAttempt <- seatAttempt <- ExamSeat and ExamSeassion <-

      const examSessionPayload = {
        name: 'Test Exam Session',
        tenantId: tenant.id,
        testId: 'cambridge-16-test-1',
        startTime: new Date(),
        examDate: new Date(),
      };

      const accessCode = 'IELTS-TEST-' + generateAccessCode();

      const examSession = await tx.examSession.create({
        data: examSessionPayload,
      });

      const examSeat = await tx.examSeat.create({
        data: {
          candidateContact: 'helloworld@test.com',
          sessionId: examSession.id,
          seatNumber: 1,
          label: 'Computer 1',
          accessCode,
          candidateName: 'John Doe',
          candidateId: '123456',
        },
      });

      // const sectionAttempt = await tx.sectionAttempt.create({
      //   data: {
      //     seatAttemptId: examSeat.id,
      //     section: TestSection.LISTENING,
      //     status: AttemptStatus.IN_PROGRESS,
      //   },
      // });

      return {
        tenant,
        examSession,
        examSeat,
        // seatAttempt,
        // sectionAttempt,
      };
    });
  }

  async getAllQuestions(examId: string) {
    const exam = await this.prismaService.examSession.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const listening = await this.getJsonQuestionsFile(exam.testId, 'listening');
    const reading = await this.getJsonQuestionsFile(exam.testId, 'reading');

    return { listening, reading, hello: 'hello' };
  }

  async getJsonQuestionsFile(
    testId: string,
    section: 'listening' | 'reading' | 'writing' | 'speaking',
  ) {
    this.logger.log('Getting ' + section + ' from json');
    const fullPath = path.join(this.testsDir, testId, `${section}.json`);
    console.log(fullPath);

    try {
      const questions = await fs.readFile(fullPath, 'utf-8');
      return JSON.parse(questions);
    } catch (error) {
      this.logger.error('Error reading ' + section + ' from json', error);
      return null;
    }
  }
}
