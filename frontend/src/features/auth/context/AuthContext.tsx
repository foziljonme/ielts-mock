import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { useAuthStore } from "../store";

type UserRole = "teacher" | "student" | "tenant_admin" | "OWNER";

interface AuthContextType {
  user: User | null;
  sessionLogin: (accessCode: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  redirectUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "teacher@demo.com",
    role: "teacher",
    tenantId: "t1",
    tenantName: "IELTS Excellence Center",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "student@demo.com",
    role: "student",
    tenantId: "t1",
    tenantName: "IELTS Excellence Center",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "admin@demo.com",
    role: "tenant_admin",
    tenantId: "t1",
    tenantName: "IELTS Excellence Center",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "saas@demo.com",
    role: "OWNER",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { role: selectedRole } = useAuthStore((state) => state);

  const redirectUrl = useMemo(() => {
    return "/test/cambridge-16-test-1/section-selection";
  }, [selectedRole]);

  const sessionLogin = async (accessCode: string) => {
    console.log({ accessCode });
    setUser({
      id: "1",
      name: "Sarah Johnson",
      email: "teacher@demo.com",
      role: "teacher",
      tenantId: "t1",
      tenantName: "IELTS Excellence Center",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    });
  };

  const adminLogin = async (email: string, password: string) => {
    console.log({ email, password });
    setUser({
      id: "1",
      name: "Sarah Johnson",
      email: "teacher@demo.com",
      role: "teacher",
      tenantId: "t1",
      tenantName: "IELTS Excellence Center",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    // In a real app, this would send a password reset email
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionLogin,
        adminLogin,
        logout,
        resetPassword,
        redirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
