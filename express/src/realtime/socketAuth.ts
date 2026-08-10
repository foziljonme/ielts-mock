import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
const cookie = require("cookie");

export interface JwtPayload {
  userId?: string;
  sub: string;
  role?: string;
  roles?: string[];
  [key: string]: any;
}

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    console.log(
      "socket.handshake.headers.cookie",
      socket.handshake.headers.cookie,
    );
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("No auth cookie"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies["auth_token"]; // 👈 your cookie name

    if (!token) {
      return next(new Error("Missing auth token"));
    }

    if (!process.env.jwtSecret) {
      return next(new Error("JWT secret not set"));
    }
    // const user = await verifyJwt(token);
    const payload = jwt.verify(token, process.env.jwtSecret) as JwtPayload;

    socket.data.user = payload; // attach user to socket
    console.log("Authenticated user");
    next();
  } catch (err) {
    console.log("err", err);
    next(new Error("Unauthorized"));
  }
}
