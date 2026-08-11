// src/server.ts
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { socketAuth } from "./realtime/socketAuth";
import { registerExamSockets } from "./realtime/exam.socket";
import { setIO } from "./realtime/io";

const httpServer = createServer(app); // <-- key change: wrap Express, not a bare server

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  },
  path: "/socket",
});

io.use(socketAuth);
registerExamSockets(io);
setIO(io);

// @ts-expect-error
httpServer.listen(process.env.PORT ?? 3001, "0.0.0.0", () => {
  console.log(`Server (HTTP + WS) running on :${process.env.PORT ?? 3001}`);
});
