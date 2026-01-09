import { Button } from "../../../shared/ui/button";
import { Info, Play, Users, Monitor } from "lucide-react";

export function TestSessionDemo({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-8 h-8" />
              <h2 className="text-2xl font-bold">
                Lab-Based Test Session Flow
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-gray-700 mb-4">
              The IELTS lab-based test system ensures all students start
              sections simultaneously, replicating the real exam environment
              where the administrator controls the flow.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Admin Flow */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-blue-900">Admin / Staff Flow</h4>
              </div>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="text-gray-700">
                    Schedule a test session and assign students with access
                    codes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="text-gray-700">
                    Click "Start Test" to open the Test Control Panel
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="text-gray-700">
                    Monitor student connections in real-time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-gray-700">
                    Click "Start Section" for Listening → Reading → Writing →
                    Speaking
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  <span className="text-gray-700">
                    All connected students begin that section simultaneously
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    6
                  </span>
                  <span className="text-gray-700">
                    Monitor progress and manually stop if needed
                  </span>
                </li>
              </ol>
            </div>

            {/* Student Flow */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-green-900">Student Flow</h4>
              </div>
              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="text-gray-700">
                    Login with provided access code
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="text-gray-700">
                    See "Waiting Room" screen with connection status
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="text-gray-700">
                    Wait for administrator to start the first section
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-gray-700">
                    When admin starts a section, see instruction screen (10 sec
                    countdown)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  <span className="text-gray-700">
                    Test begins automatically for all students at the same time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    6
                  </span>
                  <span className="text-gray-700">
                    Complete section → return to waiting room for next section
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* Real-Time Synchronization */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-8 border-2 border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Real-Time Synchronization
            </h4>
            <p className="text-gray-700 mb-4">
              The system uses backend polling to ensure students and
              administrators stay synchronized:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Students poll every 2 seconds</strong> to check if
                  admin has started a section
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>
                  <strong>Admin polls every 2 seconds</strong> to see which
                  students are connected
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>
                  All state is stored in the backend KV store for consistency
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>
                  When admin clicks "Start Section", it updates the backend
                  immediately
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-0.5">•</span>
                <span>
                  Students detect the change on next poll and transition to
                  instructions screen
                </span>
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-3">Key Features</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  📊 Live Student Monitoring
                </h5>
                <p className="text-sm text-gray-600">
                  See which students are connected and their progress through
                  each section
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  ⏱️ Synchronized Timers
                </h5>
                <p className="text-sm text-gray-600">
                  All students get the exact same time for each section
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  🔄 Auto-Submit
                </h5>
                <p className="text-sm text-gray-600">
                  Tests automatically submit when time expires
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  👥 Section-by-Section Control
                </h5>
                <p className="text-sm text-gray-600">
                  Start each section independently in the correct order
                </p>
              </div>
            </div>
          </div>

          {/* Demo Instructions */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h4 className="font-bold text-yellow-900 mb-3">Try It Out!</h4>
            <p className="text-gray-700 mb-3">
              To see the synchronized test flow in action:
            </p>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>
                1. Switch to <strong>Admin</strong> mode → Schedule a test →
                Click "Start Test" (Play button)
              </li>
              <li>
                2. Open a new browser tab and switch to <strong>Student</strong>{" "}
                mode → Enter an access code
              </li>
              <li>
                3. In the Admin tab, click "Start Section" for any section
              </li>
              <li>
                4. Watch the Student tab automatically transition to the
                instruction screen!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
