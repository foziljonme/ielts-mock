'use client'

import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket } from '@/hooks/socket/getSocket'
import { ConnectionStatus, useSocketStore } from '@/stores/socket.store'
import useExamStore from '@/stores/exam.store'

const EVENTS = {
  connect: 'connect',
  disconnect: 'disconnect',
  connectError: 'connect_error',

  candidateJoined: 'exam:candidate:joined',
  examCandidates: 'exam:candidates',
  examCandidateLeft: 'exam:candidate:left',

  sectionStarted: 'section:started',
}

export function useWebsocket() {
  const socketRef = useRef<Socket | null>(null)

  const { fetchCurrentSection } = useExamStore()
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

    socket.on(EVENTS.connect, onConnect)
    socket.on(EVENTS.disconnect, onDisconnect)
    socket.on(EVENTS.connectError, onConnectError)

    socket.on(EVENTS.candidateJoined, candidateJoined)
    socket.on(EVENTS.examCandidates, restoreCandidates)
    socket.on(EVENTS.examCandidateLeft, candidateLeft)

    socket.on(EVENTS.sectionStarted, fetchCurrentSection)

    setConnectionStatus(
      socket.connected
        ? ConnectionStatus.Connected
        : ConnectionStatus.Connecting,
    )

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off(EVENTS.connect, onConnect)
      socket.off(EVENTS.disconnect, onDisconnect)
      socket.off(EVENTS.connectError, onConnectError)

      socket.off(EVENTS.candidateJoined, candidateJoined)
      socket.off(EVENTS.examCandidates, restoreCandidates)
      socket.off(EVENTS.examCandidateLeft, candidateLeft)

      socket.off(EVENTS.sectionStarted, fetchCurrentSection)
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
