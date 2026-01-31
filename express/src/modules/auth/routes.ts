import { Router } from "express";
import {
  changePassword,
  getMe,
  getMeCandidate,
  login,
  loginCandidate,
  logout,
  register,
} from "@/modules/auth/auth.ctonroller";
import { auth } from "@/middlewares/auth";

const router = Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.get("/me", auth(), getMe);

router.post("/change-password", auth(), changePassword);

router.post("/candidate/login", loginCandidate);

router.get("/candidate/me", auth({ candidateCanAccess: true }), getMeCandidate);

export default router;
