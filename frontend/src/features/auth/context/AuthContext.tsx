// auth/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { joinByCode, loginAdmin, retrieveSession } from "../api";
import { isTokenExpired } from "../utils";
import { AuthType } from "../types";

interface AuthState {
  type: AuthType | null;
  subjectId: string | null;
  // user: IUser | null;
  // student: IExamSeatSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  handleLogin: (email: string, password: string) => Promise<void>;
  loginSession: (accessCode: string, studentId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    type: null,
    subjectId: null,
    // user: null,
    // student: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();

  // Helper: clear all auth data
  const clearAuth = () => {
    // localStorage.removeItem("authType");
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("tokenExp");

    setState({
      type: null,
      subjectId: null,
      // user: null,
      // student: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // On mount: validate existing token and fetch fresh profile/session
  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const type = localStorage.getItem("authType") as AuthType;

      const tokenExpired = isTokenExpired();

      if (!token || !type || tokenExpired) {
        clearAuth();
        return;
      }

      try {
        const subject = await retrieveSession();

        setState({
          type,
          subjectId: subject.subjectId,
          isAuthenticated: subject.authenticated,
          isLoading: false,
        });
      } catch (err) {
        console.warn("Auth validation failed:", err);
        clearAuth();
      }
    };

    validateAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    await loginAdmin({
      email,
      password,
    });

    const { subjectId } = await retrieveSession();

    setState({
      type: AuthType.ADMIN,
      subjectId,
      isAuthenticated: true,
      isLoading: false,
    });

    navigate("/admin/dashboard");
  };

  const loginSession = async (accessCode: string, studentId: string) => {
    await joinByCode({ accessCode, studentId });
    const { subjectId, examId } = await retrieveSession();

    setState({
      type: AuthType.EXAM,
      subjectId,
      isAuthenticated: true,
      isLoading: false,
    });

    navigate(`/exams/${examId}/waiting-room`);
  };

  const logout = () => {
    clearAuth();
    navigate("/login/student"); // or your join-by-code page
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        handleLogin,
        loginSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
