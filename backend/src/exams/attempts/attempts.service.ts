import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AttemptStatus, TestSection } from 'prisma/generated/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttemptsService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async submitSection(
    seatId: string,
    section: TestSection,
    userAnswers: Record<string, string | string[]>,
  ) {
    // 1. Validate attempt exists and belongs to student
    this.logger.log('Submitting ' + section + ' section');
    return await this.prismaService.$transaction(async (tx) => {
      const seatAttempt = await tx.seatAttempt.findUnique({
        where: { id: seatId },
        include: {
          sections: {
            where: { section: section },
          },
        },
      });

      if (!seatAttempt) {
        throw new NotFoundException('Attempt not found');
      }

      if (seatAttempt.status === AttemptStatus.SUBMITTED) {
        throw new ForbiddenException('Entire test already submitted');
      }

      const sectionAttempt = seatAttempt.sections[0];

      if (!sectionAttempt) {
        throw new BadRequestException(`Section "${section}" not started yet`);
      }

      if (sectionAttempt.status === AttemptStatus.SUBMITTED) {
        throw new BadRequestException(`Section "${section}" already submitted`);
      }

      // Optional: Prevent submission after admin has ended section
      // (You can add a flag like adminEnded: true if needed)
      // For now: allow submission anytime during active section

      // 2. Save all answers (upsert)
      const savePromises = Object.entries(userAnswers).map(
        async ([questionId, value]) => {
          // Find or create QuestionAttempt
          const questionAttempt = await tx.questionAttempt.findUnique({
            where: {
              sectionAttemptId_questionId: {
                sectionAttemptId: sectionAttempt.id,
                questionId,
              },
            },
          });

          let qaId: string;
          if (questionAttempt) {
            qaId = questionAttempt.id;
          } else {
            const newQa = await tx.questionAttempt.create({
              data: {
                sectionAttemptId: sectionAttempt.id,
                questionId,
                visitedAt: new Date(),
              },
            });
            qaId = newQa.id;
          }

          // Convert value to string for storage
          const stringValue = Array.isArray(value)
            ? JSON.stringify(value)
            : value.toString();
          const wordCount =
            typeof value === 'string' ? value.trim().split(/\s+/).length : null;

          // Upsert Answer
          return tx.answer.upsert({
            where: { questionAttemptId: qaId },
            update: {
              value: stringValue,
              wordCount,
              updatedAt: new Date(),
            },
            create: {
              questionAttemptId: qaId,
              value: stringValue,
              wordCount,
            },
          });
        },
      );

      await Promise.all(savePromises);

      // 3. Mark section as submitted by student
      await this.prismaService.sectionAttempt.update({
        where: { id: sectionAttempt.id },
        data: {
          status: AttemptStatus.SUBMITTED,
        },
      });

      // 4. Response
      const isEarlySubmit = sectionAttempt.remainingSec! > 300; // example: more than 5 min left

      return {
        success: true,
        message: isEarlySubmit
          ? `You have submitted the ${section} section early. You can review your answers (read-only) until the proctor starts the next section.`
          : `You have submitted the ${section} section. Waiting for the proctor to start the next section...`,
        submittedAt: new Date().toISOString(),
        section,
        readOnly: true, // Frontend should switch to read-only mode
        waitingForNext: true,
      };
    });
  }

  async getAttemptBySeatId(seatId: string) {
    const seat = await this.prismaService.examSeat.findUnique({
      where: { id: seatId },
      include: {
        schedule: {
          include: {
            attempts: {
              include: {
                sections: {
                  include: {
                    seatAttempt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return seat;
  }
}
