import { Router } from "express";
import { auth } from "../middlewares/auth";
import {
  getUserById,
  listUsers,
  updateUser,
  deleteUser,
} from "@/controllers/user.controller";

const router = Router();

router.get("/", auth(), listUsers);

router.get("/:userId", auth(), getUserById);

router.patch("/:userId", auth(), updateUser);

router.delete("/:userId", auth(), deleteUser);

export default router;
