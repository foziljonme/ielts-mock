import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
const cookie = require("cookie");

export interface JwtPayload {
  userId?: string;
  sub: string;
  role?: string;
  roles?: string[];
  [key: string]: any;
}

// export function socketAuth(socket: Socket, next: (err?: Error) => void) {
//   try {
//     const token = socket.handshake.auth.token;
//     console.log("tokentokentokentoken", token);
//     if (!token) throw new Error("No token");

//     const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
//     socket.data.user = payload;

//     next();
//   } catch {
//     next(new Error("Unauthorized"));
//   }
// }

export async function socketAuth(socket: Socket, next: (err?: Error) => void) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("No auth cookie"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies["auth_token"]; // 👈 your cookie name

    if (!token) {
      return next(new Error("Missing auth token"));
    }

    // const user = await verifyJwt(token);
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

    socket.data.user = payload; // attach user to socket
    console.log("Authenticated user");
    next();
  } catch (err) {
    console.log("err", err);
    next(new Error("Unauthorized"));
  }
}
