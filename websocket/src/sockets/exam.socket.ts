import { Server, Socket } from "socket.io";

export function registerExamSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("exam:join", ({ examId }) => {
      socket.join(examId);
    });

    socket.on("admin:start", ({ examId }) => {
      if (socket.data.user.role !== "ADMIN") return;
      io.to(examId).emit("exam:started");
    });

    socket.on("student:progress", (payload) => {
      io.to(payload.examId).emit("student:progress", {
        userId: socket.data.user.userId,
        progress: payload.progress,
      });
    });
  });
}
