import { validate } from "@/shared/utils/validate";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import authService from "@/modules/auth/auth.service";
import {
  changePasswordSchema,
  loginCandidateSchema,
  loginSchema,
} from "@/modules/auth/auth.schema";
import {
  CANDIDATE_TOKEN_EXPIRES_IN,
  TOKEN_EXPIRES_IN,
} from "@/shared/constants";
import { AuthRequest } from "@/middlewares/auth";
import { createUserSchema } from "@/modules/users/user.schema";

export const register = asyncHandler(async (req, res) => {
  const registerUserData = validate(createUserSchema, req.body);
  const user = await authService.register(registerUserData);
  res.status(200).json(user);
});

export const login = asyncHandler(async (req, res) => {
  const loginData = validate(loginSchema, req.body);
  const { user, accessToken } = await authService.login(loginData);

  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRES_IN,
  });

  const { tenant, ...restUser } = user;

  res.status(200).json({ user: restUser, tenant });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

export const getMe = asyncHandler(async (req: AuthRequest, res) => {
  const user = await authService.getMe({ user: req.user! });
  res.status(200).json(user);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res) => {
  const data = validate(changePasswordSchema, req.body);
  const result = await authService.changePassword({ user: req.user! }, data);
  return res.status(200).json(result);
});

export const loginCandidate = asyncHandler(async (req, res) => {
  const loginData = validate(loginCandidateSchema, req.body);
  const result = await authService.loginCandidate(loginData);
  const { accessToken, ...rest } = result;

  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CANDIDATE_TOKEN_EXPIRES_IN,
  });

  res.status(200).json(rest);
});

export const getMeCandidate = asyncHandler(async (req: AuthRequest, res) => {
  const result = await authService.getMeCandidate({ user: req.user! });
  return res.status(200).json(result);
});
