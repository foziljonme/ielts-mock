import { Request, Response } from "express";
import sectionsService from "./sections.service";
import { TestSection } from "../../../../prisma/generated/enums";
import { asyncHandler } from "@/shared/utils/asyncHandler";

export const startSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId, sectionId } = req.params as {
      sessionId: string;
      sectionId: TestSection;
    };
    const result = await sectionsService.startSection(sessionId, sectionId);
    res.status(200).json(result);
  },
);
