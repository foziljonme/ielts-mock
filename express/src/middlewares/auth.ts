import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtBasePayload } from "../lib/auth/types";
import { AppError } from "../lib/errors";
import { ErrorCodes } from "../lib/errors/codes";
import { UserRole } from "../../prisma/generated/client";

export interface AuthRequest extends Request {
  user?: JwtBasePayload;
}

export const auth =
  (options?: { roles?: UserRole[]; candidateCanAccess?: boolean }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token; // Use optional chaining

    if (!token) {
      throw new AppError("Unauthorized", 401, "No token provided");
    }

    let payload: JwtBasePayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtBasePayload;
    } catch {
      throw new AppError(
        "Unauthorized",
        401,
        "Invalid token. Please login again.",
      );
    }

    const { roles, candidateCanAccess = false } = options ?? {};

    if (!candidateCanAccess && payload.roles.includes(UserRole.CANDIDATE)) {
      throw new AppError(
        "Forbidden",
        403,
        ErrorCodes.FORBIDDEN,
        "You are not authorized to access this resource",
      );
    }

    if (roles && !roles.some((role) => payload.roles.includes(role))) {
      throw new AppError(
        "Forbidden",
        403,
        ErrorCodes.FORBIDDEN,
        "You are not authorized to access this resource",
      );
    }

    (req as AuthRequest).user = payload;
    next();
  };
