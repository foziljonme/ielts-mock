import { JwtPayload } from "../auth/socketAuth";

declare module "socket.io" {
  interface Socket {
    data: {
      user: JwtPayload;
      examId?: string;
    };
  }
}
