// auth/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { candidateLogin, getCandidateMe, getMeAdmin, loginAdmin } from "../api";
import { clearAuthCreds, getAuthCreds, isTokenExpired } from "../utils";
import { AuthType, type ISeat, type IUser } from "../types";
import useExamStore from "../../exams/store";

interface AuthState {
  type: AuthType | null;
  user: IUser | null;
  seat: ISeat | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  handleLogin: (email: string, password: string) => Promise<void>;
  loginCandidate: (accessCode: string, studentId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    type: null,
    user: null,
    seat: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();

  // Helper: clear all auth data
  const clearAuth = () => {
    clearAuthCreds();

    setState({
      type: null,
      user: null,
      seat: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // On mount: validate existing token and fetch fresh profile/session
  useEffect(() => {
    const validateAuth = async () => {
      const { accessToken, authType } = getAuthCreds();

      const tokenExpired = isTokenExpired();

      if (!accessToken || !authType || tokenExpired) {
        clearAuth();
        return;
      }

      try {
        let user: IUser | null = null;
        let seat: ISeat | null = null;
        if (authType === AuthType.ADMIN) {
          user = await getMeAdmin();
        } else if (authType === AuthType.CANDIDATE) {
          seat = await getCandidateMe();
        }

        setState({
          type: authType,
          user: user,
          seat: seat,
          isAuthenticated: true,
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
    const { user } = await loginAdmin({
      email,
      password,
    });

    setState({
      type: AuthType.ADMIN,
      user,
      seat: null,
      isAuthenticated: true,
      isLoading: false,
    });

    navigate("/admin/dashboard");
  };

  const loginCandidate = async (accessCode: string, candidateId: string) => {
    const { seat } = await candidateLogin({ accessCode, candidateId });

    setState({
      type: AuthType.CANDIDATE,
      user: null,
      seat,
      isAuthenticated: true,
      isLoading: false,
    });

    navigate(`/exam/${seat.sessionId}/waiting-room`);
  };

  const logout = () => {
    clearAuth();
    navigate("/auth/candidate/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        handleLogin,
        loginCandidate,
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
