import { useWebsocket } from '@/hooks/socket/useWebsocket'
import useExamStore from '@/stores/exam.store'
import { ConnectionStatus, useSocketStore } from '@/stores/socket.store'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

type LayoutProps = {
  children: ReactNode
}

export function CandidateLayout({ children }: LayoutProps) {
  const router = useRouter()
  const { joinExamRoom } = useWebsocket()
  const { connectionStatus } = useSocketStore()
  const {} = useExamStore()

  useEffect(() => {
    joinExamRoom(router.query.examId as string)
    if (connectionStatus !== ConnectionStatus.Connected) {
    }
  }, [router.query.examId])

  return <>{children}</>
}
