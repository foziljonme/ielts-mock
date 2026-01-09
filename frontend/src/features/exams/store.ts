import { create } from "zustand";
import type { SectionName } from "./types";
import type { IExamSeatSession } from "../auth/types";

interface IExamStore {
  examSeatInfo: IExamSeatSession | null;
  activeSection: SectionName | null;
  completedSections: Set<SectionName>;

  fetchExamSeatInfo: () => Promise<void>;
  startSection: (section: SectionName) => void;
  completeSection: (section: SectionName) => void;
}

const useExamStore = create<IExamStore>((set) => ({
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<SectionName>(),

  fetchExamSeatInfo: async () => {
    const data = "";
  },
  startSection: (section: SectionName) => set({ activeSection: section }),
  completeSection: (section: SectionName) =>
    set((state) => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
}));

export default useExamStore;
