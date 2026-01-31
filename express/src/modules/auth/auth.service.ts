import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "@/shared/utils/errors";
import { ErrorCodes } from "@/shared/utils/errors/codes";
import { CreateUserSchema } from "../users/user.schema";
import {
  ChangePasswordSchema,
  LoginCandidateSchema,
  LoginSchema,
} from "./auth.schema";
import tenantsService from "../tenants/tenants.service";
import {
  CANDIDATE_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  TOKEN_EXPIRES_IN,
} from "@/shared/constants";
import db from "@/config/db";
import { ExamSessionStatus, UserRole } from "../../../prisma/generated/enums";
import { AuthRequestContext, JwtBasePayload } from "./auth.types";

class AuthService {
  constructor() {}

  async register(user: CreateUserSchema) {
    const existingUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new AppError(
        "User already exists",
        400,
        ErrorCodes.USER_ALREADY_EXISTS,
        "User with this email already exists, try to login",
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await db.user.create({
      data: {
        ...user,
        password: hashedPassword,
        roles: user.roles || [UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    });
  }

  async login(loginData: LoginSchema) {
    const { email, password } = loginData;
    return db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError(
          "User not found",
          404,
          ErrorCodes.USER_NOT_FOUND,
          "User with this email not found",
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "Invalid password",
        );
      }
      const tokenPayload: JwtBasePayload = {
        sub: user.id,
        tenantId: user.tenantId || "",
        roles: user.roles,
      };

      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
        expiresIn: TOKEN_EXPIRES_IN,
      });

      const refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });

      const { password: ps, ...rest } = user;

      const tenant = await tenantsService.getTenant(tx, user.tenantId!);

      return {
        user: {
          ...rest,
          tenant,
        },
        accessToken,
        refreshToken,
      };
    });
  }

  async getMe(ctx: AuthRequestContext) {
    return db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: ctx.user.sub },
      });

      if (!user) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "User not found",
        );
      }

      const tenant = await tenantsService.getTenant(tx, user.tenantId!);

      return {
        user: user,
        tenant: tenant,
      };
    });
  }

  async changePassword(ctx: AuthRequestContext, data: ChangePasswordSchema) {
    return db.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: ctx.user.sub },
      });

      if (!user) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "User not found",
        );
      }

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "Invalid password",
        );
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return { message: "Password changed successfully" };
    });
  }

  async loginCandidate(loginData: LoginCandidateSchema) {
    return db.$transaction(async (tx) => {
      const seat = await tx.examSeat.findUnique({
        where: {
          accessCode: loginData.accessCode,
          candidateId: loginData.candidateId,
        },
        include: {
          session: true,
        },
      });

      if (!seat) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "Seat not found",
        );
      }

      if (seat.session.status === ExamSessionStatus.COMPLETED) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "Session already completed",
        );
      }

      if (seat.session.status === ExamSessionStatus.SCHEDULED) {
        throw new AppError(
          "Bad Request",
          400,
          ErrorCodes.BAD_REQUEST,
          "Session is not open for candidates, please contact administrator",
        );
      }

      const tokenPayload: JwtBasePayload = {
        sub: seat.id,
        tenantId: seat.tenantId || "",
        sessionId: seat.sessionId,
        roles: [UserRole.CANDIDATE],
      };

      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
        expiresIn: CANDIDATE_TOKEN_EXPIRES_IN,
      });

      const tenant = await tenantsService.getTenant(tx, seat.tenantId!);

      return {
        seat,
        tenant,
        accessToken,
      };
    });
  }

  async getMeCandidate(ctx: AuthRequestContext) {
    return await db.$transaction(async (tx) => {
      const seat = await tx.examSeat.findUnique({
        where: { id: ctx.user.sub },
      });

      if (!seat) {
        throw new AppError(
          "Unauthorized",
          401,
          ErrorCodes.UNAUTHORIZED,
          "Seat not found",
        );
      }

      const tenant = await tenantsService.getTenant(tx, seat.tenantId!);

      return {
        seat,
        tenant,
      };
    });
  }
}

const authService = new AuthService();

export default authService;
