import { create } from "zustand";
import type { UserRoleTypeForAuthLayout } from "./types";
import { TABS } from "./constants";

interface IAuthStore {
  role: UserRoleTypeForAuthLayout;
  setRole: (role: UserRoleTypeForAuthLayout) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  role: TABS[0],
  setRole: (role: UserRoleTypeForAuthLayout) => set({ role }),
}));
