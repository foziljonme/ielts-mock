import { Server, Socket } from "socket.io";

function isCandidate(socket: Socket) {
  const user = socket.data.user;
  const roles = user.roles || [];

  return roles.includes("CANDIDATE");
}

export function registerExamSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("Connected socket", socket.id);

    socket.on("exam:join", async ({ examId }) => {
      console.log("joined", socket.data.user);
      socket.join(examId);
      socket.data.examId = examId;

      const user = socket.data.user;

      if (isCandidate(socket)) {
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

    socket.on("exam:leave", async ({ examId }) => {
      const user = socket.data.user;
      console.log("left", user);
      if (isCandidate(socket)) {
        io.to(examId).emit("exam:candidate:left", {
          candidateId: user.sub,
        });
      } else {
        io.to(examId).emit("exam:admin:left", {
          adminId: user.sub,
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
