import { create } from "zustand";
import type { SectionName } from "./types";
import type { ISeat } from "../auth/types";

interface IExamStore {
  examSeatInfo: ISeat | null;
  activeSection: SectionName | null;
  completedSections: Set<SectionName>;

  setExamSeatInfo: (seat: ISeat) => void;
  startSection: (section: SectionName) => void;
  completeSection: (section: SectionName) => void;
}

const useExamStore = create<IExamStore>((set) => ({
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<SectionName>(),

  setExamSeatInfo: (seat: ISeat) => set({ examSeatInfo: seat }),
  startSection: (section: SectionName) => set({ activeSection: section }),
  completeSection: (section: SectionName) =>
    set((state) => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
}));

export default useExamStore;
