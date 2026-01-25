import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./config/env";
import { socketAuth } from "./auth/socketAuth";
import { registerExamSockets } from "./sockets/exam.socket";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: "*", credentials: true },
  path: "/socket",
});

io.use(socketAuth);
registerExamSockets(io);

httpServer.listen(env.port, () => {
  console.log(`WebSocket server running on :${env.port}`);
});
