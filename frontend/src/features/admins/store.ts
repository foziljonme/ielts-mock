import { create } from "zustand";
import type { IExamSession, ITenantStats, ITenant } from "./types";
import { apiClient } from "../../app/api";
import type { IPagination } from "../../shared/types";

interface AdminStore {
  isLoading: boolean;
  tenant: ITenant | null;
  examSessions: IExamSession[];
  tenantStats: ITenantStats | null;
  totalExamSessions: number;
  activeTestControl: IExamSession | null;

  fetchExamSessions: () => Promise<void>;
  fetchTenantStats: () => Promise<void>;
  setActiveTestControl: (activeTestControl: IExamSession | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchTenant: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isLoading: true,
  tenant: null,
  examSessions: [],
  tenantStats: null,
  totalExamSessions: 0,
  activeTestControl: null,

  fetchTenant: async () => {
    try {
      const response = await apiClient.get<ITenant>("/tenant/current");
      set({ tenant: response.data });
    } catch (error) {
      console.error("Failed to fetch tenant:", error);
    }
  },
  fetchExamSessions: async () => {
    try {
      const response = await apiClient
        .get<IPagination<IExamSession>>("/admin/sessions")
        .then((res) => res.data);
      set({ examSessions: response.results });
    } catch (error) {
      console.error("Failed to fetch exam sessions:", error);
    }
  },
  fetchTenantStats: async () => {
    try {
      const response = await apiClient.get<ITenantStats>("/admin/stats");
      set({ tenantStats: response.data });
    } catch (error) {
      console.error("Failed to fetch exam session stats:", error);
    }
  },
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setActiveTestControl: (activeTestControl: IExamSession | null) =>
    set({ activeTestControl }),
}));
