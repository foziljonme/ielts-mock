import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Async handlerrr");
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.log("errrrr", err);
      return next(err);
    });
  };
