// context/SocketProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { WS_BASE_URL } from "../../app/api";
import { useAuth } from "../../features/auth/context/AuthContext";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, type, student, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Build auth payload for socket.io
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Create socket connection
    const socket = io(import.meta.env.VITE_SOCKET_URL || WS_BASE_URL, {
      transports: ["websocket"], // prefer websocket
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token: `Bearer ${token}`,
        type, // "admin" or "student"
        // Optional: send minimal info for server routing
        ...(type === "student" &&
          student && {
            attemptId: student.attempt.id,
            sessionId: student.session.id,
          }),
        ...(type === "admin" &&
          user && {
            userId: user.id,
            tenantId: user.tenantId,
          }),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    // Optional: listen to custom events
    // socket.on("exam-timer-update", (data) => { ... })
    // socket.on("proctor-message", (msg) => { ... })
    socket.on("controls.session.started", (data) => {
      console.log("Session started:", data);
    });

    socket.on("controls.section.started", (data) => {
      console.log("Section started:", data);
    });

    socket.on("controls.section.finished", (data) => {
      console.log("Section completed:", data);
    });

    // Cleanup on unmount or auth change
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, type, student?.attempt.id, user?.id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
