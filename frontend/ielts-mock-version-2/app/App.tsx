import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { StaffLoginPage } from './components/StaffLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { SectionSelection } from './components/SectionSelection';
import { TestInterface } from './components/TestInterface';
import { TestCompletion } from './components/TestCompletion';
import { Button } from './components/ui/button';
import { TestSection } from './types';
import { LogOut, House, Users, Monitor } from 'lucide-react';

type View = 'student-login' | 'admin-login' | 'staff-login' | 'section-selection' | 'test' | 'completion' | 'admin' | 'staff';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('student-login');
  const [accessCode, setAccessCode] = useState('');
  const [selectedSection, setSelectedSection] = useState<TestSection | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});

  const handleStudentLogin = (code: string) => {
    setAccessCode(code);
    setCurrentView('section-selection');
  };

  const handleAdminLogin = (email: string, password: string) => {
    // In a real app, validate credentials with backend
    console.log('Admin login:', email);
    setCurrentView('admin');
  };

  const handleStaffLogin = (email: string, password: string) => {
    // In a real app, validate credentials with backend
    console.log('Staff login:', email);
    setCurrentView('staff');
  };

  const handleSectionSelect = (section: TestSection) => {
    setSelectedSection(section);
    setCurrentView('test');
  };

  const handleTestComplete = (answers: Record<string, string>) => {
    setTestAnswers(answers);
    setCurrentView('completion');
  };

  const handleTimeUp = () => {
    // Auto-submit when time runs out
    console.log('Time is up! Auto-submitting test...');
  };

  const handleStudentLogout = () => {
    setAccessCode('');
    setSelectedSection(null);
    setTestAnswers({});
    setCurrentView('student-login');
  };

  const handleAdminLogout = () => {
    setCurrentView('admin-login');
  };

  const handleStaffLogout = () => {
    setCurrentView('staff-login');
  };

  // Demo mode selector
  const DemoModeSelector = () => (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        size="sm"
        variant={currentView === 'admin-login' || currentView === 'admin' ? 'default' : 'outline'}
        onClick={() => setCurrentView('admin-login')}
        className="shadow-lg"
      >
        <Users className="w-4 h-4 mr-2" />
        Admin
      </Button>
      <Button
        size="sm"
        variant={currentView === 'staff-login' || currentView === 'staff' ? 'default' : 'outline'}
        onClick={() => setCurrentView('staff-login')}
        className="shadow-lg"
      >
        <Monitor className="w-4 h-4 mr-2" />
        Staff
      </Button>
      <Button
        size="sm"
        variant={currentView === 'student-login' ? 'default' : 'outline'}
        onClick={() => setCurrentView('student-login')}
        className="shadow-lg"
      >
        <House className="w-4 h-4 mr-2" />
        Student
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo mode selector - only show when not in test */}
      {currentView !== 'test' && <DemoModeSelector />}

      {/* Logout button for student in test flow */}
      {(currentView === 'section-selection' || currentView === 'completion') && (
        <div className="fixed top-4 left-4 z-50">
          <Button size="sm" variant="outline" onClick={handleStudentLogout} className="shadow-lg">
            <LogOut className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </div>
      )}

      {/* Render current view */}
      {currentView === 'student-login' && <LoginPage onLogin={handleStudentLogin} />}
      
      {currentView === 'admin-login' && <AdminLoginPage onLogin={handleAdminLogin} />}
      
      {currentView === 'staff-login' && <StaffLoginPage onLogin={handleStaffLogin} />}
      
      {currentView === 'section-selection' && (
        <SectionSelection onSelectSection={handleSectionSelect} />
      )}
      
      {currentView === 'test' && selectedSection && (
        <TestInterface
          section={selectedSection}
          onComplete={handleTestComplete}
          onTimeUp={handleTimeUp}
        />
      )}
      
      {currentView === 'completion' && (
        <TestCompletion
          studentName="Test Taker"
          answers={testAnswers}
        />
      )}
      
      {currentView === 'admin' && <AdminDashboard onLogout={handleAdminLogout} />}
      
      {currentView === 'staff' && <StaffDashboard onLogout={handleStaffLogout} />}
    </div>
  );
}