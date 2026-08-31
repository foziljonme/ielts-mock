import { JwtBasePayload } from "@/modules/auth/auth.types";
import { Request } from "express";
import jwt from "jsonwebtoken";

export function extractBearerToken(req: Request) {
  return req.cookies?.auth_token;
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtBasePayload;
}
