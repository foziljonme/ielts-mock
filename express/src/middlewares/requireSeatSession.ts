import { NextFunction, Request, Response } from "express";
import { extractBearerToken, verifyToken } from "./utils";
import db from "@/config/db";
import { SeatRequestContext } from "./types";
import { UnauthorizedError } from "@/shared/utils/errors/Unauthorized";

export async function requireSeatSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = extractBearerToken(req);
  const claims = verifyToken(token); // signature + expiry check only, still requires next step
  if (!claims) throw new UnauthorizedError("Invalid token");

  // Re-check against the DB every request — don't trust a stale claim for state that changes mid-exam
  const seat = await db.examSeat.findUnique({
    where: { id: claims.sub },
  });

  if (!seat) {
    throw new UnauthorizedError(
      "Seat does not exist, please make sure to sign in as candidate to access this resource",
    );
  }

  (req as SeatRequestContext).seat = seat; // every downstream handler reads req.seat.id — never req.params.seatId, never req.body.seatId
  next();
}
