import { Prisma } from "../../../../prisma/generated/client";

export class ProgressService {
  constructor() {}

  // async createProgressRecords(tx: Prisma.TransactionClient, sessionId: string) {
  //   const sections = [
  //     TestSection.LISTENING,
  //     TestSection.READING,
  //     TestSection.WRITING,
  //     TestSection.SPEAKING,
  //   ];
  //   const progress = sections.map((section) =>
  //     tx.examSessionProgress.create({
  //       data: {
  //         sessionId,
  //         section,
  //         status: ExamSessionProgressStatus.NOT_STARTED,
  //       },
  //     }),
  //   );

  //   return await Promise.all(progress);
  // }
}

const progressService = new ProgressService();
export default progressService;
