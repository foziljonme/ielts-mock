import { ISeat } from '@/types/seats'
import { create } from 'zustand'
import { TestSection } from '../../prisma/generated/enums'

interface IExamStore {
  examSeatInfo: ISeat | null
  activeSection: TestSection | null
  completedSections: Set<TestSection>

  setExamSeatInfo: (seat: ISeat) => void
  startSection: (section: TestSection) => void
  completeSection: (section: TestSection) => void
}

const useExamStore = create<IExamStore>(set => ({
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<TestSection>(),

  setExamSeatInfo: (seat: ISeat) => set({ examSeatInfo: seat }),
  startSection: (section: TestSection) => set({ activeSection: section }),
  completeSection: (section: TestSection) =>
    set(state => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
}))

export default useExamStore
