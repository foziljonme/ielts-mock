import { useState, useEffect } from 'react'
import { Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { useAuthStore } from '@/stores/auth.store'
import useExamStore from '@/stores/exam.store'
import { SECTIONS } from '@/lib/constants'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useWebsocket } from '@/hooks/socket/useWebsocket'
import { useRouter } from 'next/router'
import { useSocketStore } from '@/stores/socket.store'
// import useExamStore from "../store";
// import { SECTIONS } from "../constants";

export function CandidateWaitingRoom() {
  const { joinExamRoom } = useWebsocket()
  const { connectionStatus } = useSocketStore()
  const { seat } = useAuthStore()
  const { examSeatInfo, activeSection, completedSections } = useExamStore()
  // const { activeSection, completedSections } = useExamStore();
  // const { examSeatInfo } = useExamStore();
  // const [connectionStatus, setConnectionStatus] = useState<
  //   'connecting' | 'connected' | 'error'
  // >('connecting')
  const [waitingTime, setWaitingTime] = useState(0)
  const [sessionId, setSessionId] = useState<string>('')
  const router = useRouter()

  // Simulate connection to test session and connect student
  useEffect(() => {
    // const connectToSession = async () => {
    //   try {
    //     // In real app, get session ID from access code lookup
    //     const testSessionId = `session-scheduled-${Math.floor(
    //       Date.now() / 10000,
    //     )}`
    //     setSessionId(testSessionId)

    //     // Connect student to session
    //     joinExamRoom(testSessionId)
    //     // const response = await fetch(
    //     //   `https://${projectId}.supabase.co/functions/v1/make-server-9af6c772/sessions/${testSessionId}/connect`,
    //     //   {
    //     //     method: "POST",
    //     //     headers: {
    //     //       "Content-Type": "application/json",
    //     //       Authorization: `Bearer ${publicAnonKey}`,
    //     //     },
    //     //     body: JSON.stringify({
    //     //       studentId: `student-${accessCode}`,
    //     //       accessCode: accessCode,
    //     //     }),
    //     //   }
    //     // );
    //     setConnectionStatus('connected')
    //     // if (response.ok) {
    //     //   setConnectionStatus("connected");
    //     // } else {
    //     //   setConnectionStatus("error");
    //     // }
    //   } catch (error) {
    //     console.error('Error connecting to session:', error)
    //     setConnectionStatus('error')
    //   }
    // }

    joinExamRoom(router.query.examId as string)
    // const timer = setTimeout(connectToSession, 1500)
    // return () => clearTimeout(timer)
  }, [router.query.examId])

  // Poll for section updates from admin
  // useEffect(() => {
  //   if (connectionStatus !== "connected" || !sessionId) return;

  //   // const interval = setInterval(async () => {
  //   //   try {
  //   //     const response = await fetch(
  //   //       `https://${projectId}.supabase.co/functions/v1/make-server-9af6c772/sessions/${sessionId}/poll`,
  //   //       {
  //   //         headers: {
  //   //           Authorization: `Bearer ${publicAnonKey}`,
  //   //         },
  //   //       }
  //   //     );

  //   //     if (response.ok) {
  //   //       const data = await response.json();

  //   //       // If admin has started a section, notify parent component
  //   //       if (data.currentSection && data.currentSection !== currentSection) {
  //   //         console.log(`Admin started section: ${data.currentSection}`);
  //   //         onSectionStart(data.currentSection);
  //   //       }
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error polling for section updates:", error);
  //   //   }
  //   // }, 2000); // Poll every 2 seconds

  //   // return () => clearInterval(interval);
  // }, [connectionStatus, sessionId, currentSection, onSectionStart]);

  // Track waiting time
  useEffect(() => {
    if (connectionStatus === 'connected' && !activeSection) {
      const interval = setInterval(() => {
        setWaitingTime(prev => prev + 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [connectionStatus, activeSection])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main waiting card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {connectionStatus === 'connecting' ? (
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : connectionStatus === 'connected' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              IELTS Mock Test
            </h1>
            <p className="text-gray-600">
              {connectionStatus === 'connecting'
                ? 'Connecting to test session...'
                : connectionStatus === 'connected'
                  ? 'Connected - Waiting for test administrator'
                  : 'Connection error - Please contact support'}
            </p>
          </div>

          {/* Student info */}
          {connectionStatus === 'connected' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Student Name</p>
                  <p className="font-semibold text-gray-900">
                    {seat?.candidateName}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Student ID</p>
                  <code className="font-semibold text-blue-600">
                    {seat?.candidateId}
                  </code>
                </div>
              </div>

              {/* Waiting status */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      Waiting for Test Administrator
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      The test will begin once the administrator starts the
                      first section. Please remain at your workstation and wait
                      for instructions.
                    </p>
                    <div className="flex items-center gap-2 text-yellow-900">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Waiting time: {formatTime(waitingTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section progress */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Test Sections
                </h3>
                <div className="flex gap-3">
                  {SECTIONS.map(section => {
                    const isCompleted = completedSections.has(section.name)
                    const isCurrent = activeSection === section.name

                    return (
                      <div
                        key={section.name}
                        className={`flex-1 rounded-lg border-2 p-4 transition-all ${
                          isCurrent
                            ? 'border-green-500 bg-green-50'
                            : isCompleted
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">
                            {section.label}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                          {isCurrent && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs font-medium text-green-700">
                                Starting
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      Do not close this window or navigate away from this page
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      Ensure your headphones are connected and working properly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      Have a pen and paper ready for notes (if allowed)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      The test will start automatically when the administrator
                      begins the session
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>
                      All sections are timed and will auto-submit when time
                      expires
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Connection error */}
          {connectionStatus === 'error' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Unable to connect to the test session. Please check your access
                code and try again.
              </p>
              <Button variant="outline">Retry Connection</Button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            If you experience any technical difficulties, please raise your hand
            and notify the test administrator
          </p>
        </div>
      </div>
    </div>
  )
}

const CandidateWaitingRoomPage = () => {
  return (
    <ProtectedRoute>
      <CandidateWaitingRoom />
    </ProtectedRoute>
  )
}

export default CandidateWaitingRoomPage
