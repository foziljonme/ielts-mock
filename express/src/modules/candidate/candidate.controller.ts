import { SeatRequestContext } from "@/middlewares/types";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { Request, Response } from "express";
import candidateService from "./candidate.service";

export const getCurrentSectionController = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await candidateService.getCurrentSection(
      (req as SeatRequestContext).seat,
    );

    res.status(200).json(response);
  },
);

export const saveResponseController = asyncHandler(
  async (req: Request, res: Response) => {
    const { questionId } = req.params as { questionId: string };
    console.log("req.bodys", req.body);
    const { value } = req.body;
    const response = await candidateService.saveResponse(
      (req as SeatRequestContext).seat.id,
      questionId,
      value,
    );
    res.status(200).json(response);
  },
);

export const restoreResponsesController = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await candidateService.restoreSection(
      (req as SeatRequestContext).seat,
    );

    res.status(200).json(response);
  },
);
