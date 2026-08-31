import { AuthRequestContext } from "@/modules/auth/auth.types";
import { Request } from "express";
import { ExamSeat } from "../../prisma/generated/client";

export type SeatRequestContext = Request &
  AuthRequestContext & { seat: ExamSeat };
