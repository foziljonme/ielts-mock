import { Server, Socket } from "socket.io";

export function registerExamSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Connected socket", socket.id);

    socket.on("exam:join", async ({ examId }) => {
      socket.join(examId);
      socket.data.examId = examId;

      const user = socket.data.user;
      const roles = user.roles || [];

      if (roles.includes("CANDIDATE")) {
        socket.to(examId).emit("exam:candidate:joined", {
          candidateId: user.sub,
        });
      } else {
        // Assume Admin/Staff if not CANDIDATE (or check roles explicitely if needed)
        // Fetch all sockets in the room
        const sockets = await io.in(examId).fetchSockets();
        const candidates = sockets
          .filter((s) => {
            const sUser = s.data.user as any;
            return sUser?.roles?.includes("CANDIDATE");
          })
          .map((s) => {
            const sUser = s.data.user as any;
            return {
              candidateId: sUser.sub,
            };
          });

        socket.emit("exam:candidates", candidates);
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

    socket.on("disconnect", () => {
      const examId = socket.data.examId;
      if (examId && socket.data.user?.roles?.includes("CANDIDATE")) {
        socket.to(examId).emit("exam:candidate:left", {
          candidateId: socket.data.user.sub,
        });
      }
    });
  });
}
