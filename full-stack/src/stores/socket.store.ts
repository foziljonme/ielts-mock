// stores/useSocketStore.ts
import { ICandidateJoinData, ICandidateLeaveData } from '@/types/socket.events'
import { create } from 'zustand'

export enum ConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error',
}

type SocketState = {
  connectionStatus: ConnectionStatus
  connectedCandidates: Set<string>
  setConnectionStatus: (status: ConnectionStatus) => void
  candidateJoined: (candidateJoinData: ICandidateJoinData) => void
  restoreCandidates: (candidates: ICandidateJoinData[]) => void
  candidateLeft: (candidateLeaveData: ICandidateLeaveData) => void
}

export const useSocketStore = create<SocketState>(set => ({
  connectedCandidates: new Set<string>(),
  connectionStatus: ConnectionStatus.Connecting,
  setConnectionStatus: status => set({ connectionStatus: status }),
  candidateJoined: candidateJoinData => {
    set(s => {
      const currentConnectedCandidates = s.connectedCandidates
      currentConnectedCandidates.add(candidateJoinData.candidateId)
      return {
        connectedCandidates: currentConnectedCandidates,
      }
    })
  },
  restoreCandidates: candidates => {
    set(s => {
      const currentConnectedCandidates = new Set<string>()
      candidates.forEach(candidate => {
        currentConnectedCandidates.add(candidate.candidateId)
      })
      return {
        connectedCandidates: currentConnectedCandidates,
      }
    })
  },
  candidateLeft: candidateLeaveData =>
    set(s => {
      const currentConnectedCandidates = s.connectedCandidates
      currentConnectedCandidates.delete(candidateLeaveData.candidateId)

      return {
        connectedCandidates: currentConnectedCandidates,
      }
    }),
}))
