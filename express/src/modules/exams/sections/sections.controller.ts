import { Request, Response } from "express";
import sectionsService from "./sections.service";
import { TestSection } from "../../../../prisma/generated/enums";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { getIO } from "@/realtime/io";

export const startSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId, sectionId } = req.params as {
      examId: string;
      sectionId: string;
    };
    const result = await sectionsService.startSection(examId, sectionId);
    getIO().to(examId).emit("section:started", {
      sectionId,
    });
    res.status(200).json(result);
  },
);
