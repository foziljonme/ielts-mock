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

    const onConnect = () => {
      console.log('connected!')
      setConnectionStatus(ConnectionStatus.Connected)
    }

    const onDisconnect = () => {
      console.log('disconnected')
      setConnectionStatus(ConnectionStatus.Connecting)
    }

    const onConnectError = (error: Error) => {
      console.log('connection error', error)
      setConnectionStatus(ConnectionStatus.Error)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    socket.on('exam:candidate:joined', candidateJoined)
    socket.on('exam:candidates', restoreCandidates)
    socket.on('exam:candidate:left', candidateLeft)

    setConnectionStatus(
      socket.connected
        ? ConnectionStatus.Connected
        : ConnectionStatus.Connecting,
    )

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)

      socket.off('exam:candidate:joined', candidateJoined)
      socket.off('exam:candidates', restoreCandidates)
      socket.off('exam:candidate:left', candidateLeft)
    }
  }, [setConnectionStatus, candidateJoined, restoreCandidates, candidateLeft])

  function joinExamRoom(examId: string) {
    socketRef.current?.emit('exam:join', { examId })
  }

  function leaveExamRoom(examId: string) {
    socketRef.current?.emit('exam:leave', { examId })
    socketRef.current?.disconnect()
  }

  return { joinExamRoom, leaveExamRoom }
}
