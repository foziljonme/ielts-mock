import type { ReactNode } from "react";
import { useAuthStore } from "../store";
import { TABS } from "../constants";

export default function Wrapper({ children }: { children: ReactNode }) {
  const setRole = useAuthStore((state) => state.setRole);
  const selectedRole = useAuthStore((state) => state.role);

  const UserRoleCard = ({ role }: { role: (typeof TABS)[number] }) => {
    const isSelected = role.value === selectedRole.value;
    return (
      <button
        className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer flex-1 ${
          isSelected ? "border-blue-600" : "border-gray-100"
        }`}
        onClick={() => setRole(role)}
      >
        <div>
          <role.icon
            className={`w-8 h-8 text-blue-600 m-auto ${
              isSelected ? "text-blue-600" : "text-gray-400"
            }`}
          />
        </div>
        <p>{role.label}</p>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-3xl text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your IELTS CRM account</p>
        </div>
        <div className="flex justify-between gap-4 pb-4">
          {TABS.map((tab) => (
            <UserRoleCard key={tab.value} role={tab} />
          ))}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
