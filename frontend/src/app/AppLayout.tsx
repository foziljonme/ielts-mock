import { Link, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  UserCircle,
  Building2,
  Database,
} from "lucide-react";
import { LOGIN_PATH } from "../features/auth/constants";

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case "teacher":
        return [
          { icon: Home, label: "Dashboard", path: "teacher/dashboard" },
          { icon: Users, label: "My Students", path: "teacher/students" },
          { icon: BookOpen, label: "My Groups", path: "teacher/groups" },
          { icon: BarChart3, label: "Grades", path: "teacher/grades" },
          { icon: UserCircle, label: "Profile", path: "teacher/profile" },
        ];
      case "student":
        return [
          { icon: Home, label: "Dashboard", path: "student/dashboard" },
          { icon: BarChart3, label: "My Grades", path: "student/grades" },
          { icon: BookOpen, label: "My Group", path: "student/groups" },
          { icon: UserCircle, label: "Profile", path: "student/profile" },
        ];
      case "tenant_admin":
        return [
          { icon: Home, label: "Dashboard", path: "tenant/dashboard" },
          { icon: Users, label: "Students", path: "tenant/students" },
          { icon: GraduationCap, label: "Teachers", path: "tenant/teachers" },
          { icon: BookOpen, label: "Groups", path: "tenant/groups" },
          { icon: BarChart3, label: "Grades", path: "tenant/grades" },
          { icon: Settings, label: "Settings", path: "tenant/settings" },
        ];
      case "OWNER":
        return [
          { icon: Home, label: "Dashboard", path: "saas/dashboard" },
          { icon: Building2, label: "Tenants", path: "saas/tenants" },
          { icon: Database, label: "Analytics", path: "saas/analytics" },
          { icon: Settings, label: "Settings", path: "saas/settings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl text-blue-600">IELTS CRM</h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.tenantName || "Admin Panel"}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {/* {user?.role?.replace("_", " ")} */}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to={LOGIN_PATH} />;
}

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <PrivateRoute>
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
            {/* <Routes>
              <Route path="/dashboard" element={getDashboard()} />
              <Route path="/students" element={<StudentsManager />} />
              <Route path="/teachers" element={<TeachersManager />} />
              <Route path="/groups" element={<GroupsManager />} />
              <Route path="/grades" element={<GradesManager />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/tenants" element={<div>Tenants Management</div>} />
              <Route path="/analytics" element={<div>Analytics</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes> */}
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
