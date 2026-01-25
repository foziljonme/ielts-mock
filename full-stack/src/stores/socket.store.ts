// stores/useSocketStore.ts
import { ICandidateJoinData } from '@/types/socket.events'
import { create } from 'zustand'

export enum ConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error',
}

type SocketState = {
  connectionStatus: ConnectionStatus
  connectedCandidates: string[]
  setConnectionStatus: (status: ConnectionStatus) => void
  candidateJoined: (candidateJoinData: ICandidateJoinData) => void
  leaveCandidate: (id: string) => void
}

export const useSocketStore = create<SocketState>(set => ({
  connectedCandidates: [],
  connectionStatus: ConnectionStatus.Connecting,
  setConnectionStatus: status => set({ connectionStatus: status }),
  candidateJoined: candidateJoinData => {
    console.log('jopineddddd', candidateJoinData)
    set(s => ({
      connectedCandidates: [
        ...new Set([...s.connectedCandidates, candidateJoinData.candidateId]),
      ],
    }))
  },
  leaveCandidate: id =>
    set(s => ({
      connectedCandidates: s.connectedCandidates.filter(x => x !== id),
    })),
}))
