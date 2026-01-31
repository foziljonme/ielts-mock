import { Router } from "express";
import {
  createSeat,
  listSeats,
} from "@/modules/sessions/seats/seat.controller";
import { auth } from "@/middlewares/auth";

const seatsRouter = Router({ mergeParams: true });

seatsRouter.post("/", auth(), createSeat);

seatsRouter.get("/", auth(), listSeats);

export default seatsRouter;
