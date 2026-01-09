import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Square, Clock, Users, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { ScheduledTest } from '../types';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { TestSessionDemo } from './TestSessionDemo';

type SectionName = 'listening' | 'reading' | 'writing' | 'speaking';

interface TestSession {
  id: string;
  scheduledTest: ScheduledTest;
  currentSection: SectionName | null;
  sectionStartTime: number | null;
  connectedStudents: Set<string>;
  completedStudents: Map<SectionName, Set<string>>;
}

interface AdminTestControlProps {
  scheduledTest: ScheduledTest;
  onBack: () => void;
}

export function AdminTestControl({ scheduledTest, onBack }: AdminTestControlProps) {
  const [session, setSession] = useState<TestSession>({
    id: `session-${scheduledTest.id}`,
    scheduledTest,
    currentSection: null,
    sectionStartTime: null,
    connectedStudents: new Set(),
    completedStudents: new Map([
      ['listening', new Set()],
      ['reading', new Set()],
      ['writing', new Set()],
      ['speaking', new Set()],
    ]),
  });
  const [showHelp, setShowHelp] = useState(false);

  const sections: { name: SectionName; label: string; duration: number }[] = [
    { name: 'listening', label: 'Listening', duration: 30 },
    { name: 'reading', label: 'Reading', duration: 60 },
    { name: 'writing', label: 'Writing', duration: 60 },
    { name: 'speaking', label: 'Speaking', duration: 15 },
  ];

  // Poll for session updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9af6c772/sessions/${session.id}/poll`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setSession(prev => ({
            ...prev,
            connectedStudents: new Set(data.connectedStudents || []),
          }));
        }
      } catch (error) {
        console.error('Error polling session:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [session.id]);

  const handleStartSection = async (sectionName: SectionName) => {
    const now = Date.now();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9af6c772/sessions/${session.id}/start-section`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ section: sectionName, startTime: now }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start section');
      }

      const data = await response.json();
      console.log(`Section ${sectionName} started successfully:`, data);
      
      setSession(prev => ({
        ...prev,
        currentSection: sectionName,
        sectionStartTime: now,
      }));
    } catch (error) {
      console.error('Error starting section:', error);
      alert('Failed to start section. Please try again.');
    }
  };

  const handleStopSection = async () => {
    if (!session.currentSection) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9af6c772/sessions/${session.id}/stop-section`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ section: session.currentSection }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to stop section');
      }

      const data = await response.json();
      console.log(`Section ${session.currentSection} stopped successfully:`, data);
      
      setSession(prev => ({
        ...prev,
        currentSection: null,
        sectionStartTime: null,
      }));
    } catch (error) {
      console.error('Error stopping section:', error);
      alert('Failed to stop section. Please try again.');
    }
  };

  const isSectionCompleted = (sectionName: SectionName) => {
    return session.completedStudents.get(sectionName)?.size === scheduledTest.students.length;
  };

  const getSectionStatus = (sectionName: SectionName) => {
    if (session.currentSection === sectionName) return 'in-progress';
    if (isSectionCompleted(sectionName)) return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showHelp && <TestSessionDemo onClose={() => setShowHelp(false)} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Control Panel</h1>
              <p className="text-gray-600">
                Test Date: {new Date(scheduledTest.testDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowHelp(true)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                How It Works
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Current Session Status */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Connected Students</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {session.connectedStudents.size} / {scheduledTest.students.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Current Section</p>
                  <p className="text-2xl font-bold text-green-900 mt-1 capitalize">
                    {session.currentSection || 'None'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Attempts</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    {scheduledTest.attemptsAllocated}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => {
              const status = getSectionStatus(section.name);
              const isActive = session.currentSection === section.name;

              return (
                <div
                  key={section.name}
                  className={`border-2 rounded-lg p-6 transition-all ${
                    isActive
                      ? 'border-green-500 bg-green-50'
                      : status === 'completed'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {section.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Duration: {section.duration} minutes
                      </p>
                    </div>
                    {status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                    {isActive && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-green-700">Active</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isActive ? (
                      <Button
                        onClick={handleStopSection}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop Section
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartSection(section.name)}
                        disabled={session.currentSection !== null || status === 'completed'}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Section
                      </Button>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Student Progress</span>
                      <span>
                        {session.completedStudents.get(section.name)?.size || 0} /{' '}
                        {scheduledTest.students.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            ((session.completedStudents.get(section.name)?.size || 0) /
                              scheduledTest.students.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connected Students List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Status</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Seat
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Access Code
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Connection Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {scheduledTest.students.map((student) => {
                  const isConnected = session.connectedStudents.has(student.id);
                  const completedSections = Array.from(session.completedStudents.entries())
                    .filter(([_, students]) => students.has(student.id))
                    .map(([section, _]) => section);

                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {student.assignedSeat || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{student.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {student.accessCode}
                      </td>
                      <td className="py-3 px-4">
                        {isConnected ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-green-700">Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            <span className="text-sm text-gray-500">Waiting</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {sections.map((section) => (
                            <div
                              key={section.name}
                              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                                completedSections.includes(section.name)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                              title={section.label}
                            >
                              {section.label[0]}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions Panel */}
        {session.currentSection === null && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Instructions</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Ensure all students are connected before starting a section</li>
                  <li>• Sections must be started in order: Listening → Reading → Writing → Speaking</li>
                  <li>• Once a section is started, all students will begin simultaneously</li>
                  <li>• The timer will automatically submit when time expires</li>
                  <li>• You can manually stop a section if needed</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}