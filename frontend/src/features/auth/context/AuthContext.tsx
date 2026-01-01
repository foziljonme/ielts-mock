import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { authenticate, getMe } from "../api";
import { useAuthStore } from "../store";

type UserRole = "teacher" | "student" | "tenant_admin" | "OWNER";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
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
    firstName: "Sarah",
    lastName: "Johnson",
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
    firstName: "Michael",
    lastName: "Chen",
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
    firstName: "Emma",
    lastName: "Thompson",
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
    firstName: "David",
    lastName: "Wilson",
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
    switch (selectedRole.value) {
      case "student":
        return "/student/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "admin":
        return "/tenant/dashboard";
      case "OWNER":
        return "/saas/dashboard";
      default:
        return "/student/dashboard";
    }
  }, [selectedRole]);

  const login = async (email: string, password: string) => {
    try {
      await authenticate({ email, password });
      const user = await getMe();
      console.log(user);
      setUser({ ...user, role: selectedRole.value });
    } catch (error) {
      console.error("Login failed:", error);
    }
    // Remove after mock users are removed
    const foundUser = mockUsers.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      console.log({ foundUser });
      localStorage.setItem("user", JSON.stringify(foundUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      tenantId: role !== "OWNER" ? "t1" : undefined,
      tenantName: role !== "OWNER" ? "IELTS Excellence Center" : undefined,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
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
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, resetPassword, redirectUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};
