import { Request, Response } from "express";
import sectionsService from "./sections.service";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { getIO } from "@/realtime/io";
import { AuthRequest } from "@/middlewares/auth";
import { TestSkill } from "../../../../prisma/generated/enums";

type RequestParamsType = {
  examId: string;
  skill: TestSkill;
};

export const startSectionController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { examId, skill } = req.params as RequestParamsType;
    console.log("sectioins controller", req.params);
    const result = await sectionsService.startSection(
      { user: req.user! },
      examId,
      skill,
    );
    getIO().to(examId).emit("section:started", {
      skill,
      // section: result.section,
    });
    res.status(200).json(result);
  },
);
