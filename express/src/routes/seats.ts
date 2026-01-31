import { Router } from "express";
import { auth } from "../middlewares/auth";
import { createSeat, listSeats } from "@/controllers/seat.controller";

const seatsRouter = Router({ mergeParams: true });

seatsRouter.post("/", auth(), createSeat);

seatsRouter.get("/", auth(), listSeats);

export default seatsRouter;
