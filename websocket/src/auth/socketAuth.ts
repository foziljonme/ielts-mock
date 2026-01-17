import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  role: "ADMIN" | "STUDENT";
}

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("No token");

    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    socket.data.user = payload;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
}
