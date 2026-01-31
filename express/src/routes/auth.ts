import { Router } from "express";
import { validate } from "../lib/api/validate";
import { changePasswordSchema, loginSchema } from "../validators/auth.schema";
import authService from "../services/auth.service";
import { TOKEN_EXPIRES_IN } from "../lib/constants";
import { asyncHandler } from "../lib/utils/asyncHandler";
import { createUserSchema } from "../validators/user.schema";
import { auth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const loginData = validate(loginSchema, req.body);
    const { user, accessToken } = await authService.login(loginData);

    // res.setHeader(
    //   "Set-Cookie",
    //   serialize("auth_token", accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //     path: "/",
    //     maxAge: TOKEN_EXPIRES_IN,
    //     // maxAge: 60 * 15, // 15 min
    //   }),
    // );
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_EXPIRES_IN,
    });
    // res.cookie("auth_token", accessToken, {
    //   httpOnly: true,
    //   secure: isProd,
    //   sameSite: isProd ? "none" : "lax",
    //   path: "/",
    //   maxAge: TOKEN_EXPIRES_IN,
    // });

    const { tenant, ...restUser } = user;

    res.status(200).json({ user: restUser, tenant });
  }),
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const registerUserData = validate(createUserSchema, req.body);
    const user = await authService.register(registerUserData);
    res.status(200).json(user);
  }),
);

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

router.get(
  "/me",
  auth(),
  asyncHandler(async (req: AuthRequest, res) => {
    console.log("jafijakjs");
    const user = await authService.getMe({ user: req.user! });
    res.status(200).json(user);
  }),
);

router.post(
  "/change-password",
  auth(),
  asyncHandler(async (req: AuthRequest, res) => {
    const data = validate(changePasswordSchema, req.body);
    const result = await authService.changePassword({ user: req.user! }, data);
    return res.status(200).json(result);
  }),
);

import candidateRouter from "./auth/candidate";
router.use("/candidate", candidateRouter);
export default router;
