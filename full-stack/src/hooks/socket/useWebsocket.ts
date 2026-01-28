'use client'

import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket } from '@/hooks/socket/getSocket'
import { ConnectionStatus, useSocketStore } from '@/stores/socket.store'

export function useWebsocket() {
  const socketRef = useRef<Socket | null>(null)

  const {
    setConnectionStatus,
    candidateJoined,
    restoreCandidates,
    candidateLeft,
  } = useSocketStore()

  useEffect(() => {
    const socket = getSocket()
    socketRef.current = socket

    setConnectionStatus(ConnectionStatus.Connecting)

    if (!socket.connected) {
      socket.connect()
    }

    const onConnect = () => setConnectionStatus(ConnectionStatus.Connected)
    const onDisconnect = () => setConnectionStatus(ConnectionStatus.Connecting)
    const onConnectError = () => setConnectionStatus(ConnectionStatus.Error)

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    socket.on('exam:candidate:joined', candidateJoined)
    socket.on('exam:candidates', restoreCandidates)
    socket.on('exam:candidate:left', candidateLeft)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('exam:candidate:joined', candidateJoined)
      socket.off('exam:candidates', restoreCandidates)
      socket.off('exam:candidate:left', candidateLeft)
    }
  }, [setConnectionStatus, candidateJoined])

  function joinExamRoom(examId: string) {
    socketRef.current?.emit('exam:join', { examId })
  }

  function leaveExamRoom(examId: string) {
    socketRef.current?.emit('exam:leave', { examId })
  }

  return { joinExamRoom, leaveExamRoom }
}
