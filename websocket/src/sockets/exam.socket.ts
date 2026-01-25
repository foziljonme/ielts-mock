import { Server, Socket } from "socket.io";

export function registerExamSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Connected socket", socket.id);
    socket.on("exam:join", ({ examId }) => {
      console.log("jopineddddd", socket.data.user);
      socket.join(examId);

      if (socket.data.user.roles.includes("CANDIDATE")) {
        socket.to(examId).emit("exam:candidate:joined", {
          candidateId: socket.data.user.sub,
          status: "JOINED",
        });
      }
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
