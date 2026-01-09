import { create } from "zustand";
import type { ScheduledTest, Tenant } from "./types";
import type { Student } from "../../app/types";

interface AdminStore {
  isLoading: boolean;
  tenant: Tenant | null;
  students: Student[];
  results: TestResult[];
  scheduledTests: ScheduledTest[];
  activeTestControl: ScheduledTest | null;

  fetchTenant: (tenantId: string) => void;
  setScheduledTests: (scheduledTests: ScheduledTest[]) => void;
  setActiveTestControl: (activeTestControl: ScheduledTest | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isLoading: true,
  tenant: null,
  scheduledTests: [],
  activeTestControl: null,
  students: [],
  results: [],

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  fetchTenant: (tenantId: string) => {
    set({ isLoading: true });
    try {
    } catch (err) {}
  },
  setScheduledTests: (scheduledTests: ScheduledTest[]) =>
    set({ scheduledTests }),
  setActiveTestControl: (activeTestControl: ScheduledTest | null) =>
    set({ activeTestControl }),
}));
