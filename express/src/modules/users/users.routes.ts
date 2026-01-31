import { Router } from "express";
import {
  getUserById,
  listUsers,
  updateUser,
  deleteUser,
} from "@/modules/users/user.controller";
import { auth } from "@/middlewares/auth";

const router = Router();

router.get("/", auth(), listUsers);

router.get("/:userId", auth(), getUserById);

router.patch("/:userId", auth(), updateUser);

router.delete("/:userId", auth(), deleteUser);

export default router;
