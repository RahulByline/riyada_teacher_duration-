import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PathwayBuilder } from './components/PathwayBuilder';
import { WorkshopPlanner } from './components/WorkshopPlanner';
import { ProgressTracker } from './components/ProgressTracker';
import { Reports } from './components/Reports';
import { PreProgramAssessment } from './components/PreProgramAssessment';
import { CEFRLevelManager } from './components/CEFRLevelManager';
import { CertificateGenerator } from './components/CertificateGenerator';
import { PersonalizedReports } from './components/PersonalizedReports';
import { FeedbackSystem } from './components/FeedbackSystem';
import { TeacherManagement } from './components/TeacherManagement';
import { TrainTheTrainersProgram } from './components/TrainTheTrainersProgram';
import { ResourceLibrary } from './components/ResourceLibrary';
import { LearnerApp } from './components/LearnerApp';
import { TrainerApp } from './components/TrainerApp';
import { ClientApp } from './components/ClientApp';
import { LoginScreen } from './components/LoginScreen';
import { UserProvider, useUser } from './contexts/UserContext';
import { PathwayProvider } from './contexts/PathwayContext';
import { BrandingProvider } from './contexts/BrandingContext';

type ViewType = 'dashboard' | 'pathways' | 'workshops' | 'progress' | 'reports' | 'cefr' | 'assessment' | 'certificates' | 'personalized-reports' | 'feedback' | 'teacher-management' | 'train-trainers' | 'resources';

function App() {
  return (
    <UserProvider>
      <BrandingProvider>
        <PathwayProvider>
          <AppContent />
        </PathwayProvider>
      </BrandingProvider>
    </UserProvider>
  );
}

function AppContent() {
  const { user, loading, isAuthenticated } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  // If user is a participant, show learner interface
  if (user.role === 'participant') {
    return <LearnerApp />;
  }

  // If user is a trainer, show trainer interface
  if (user.role === 'trainer') {
    return <TrainerApp />;
  }

  // If user is a client, show limited view with reports only
  if (user.role === 'client') {
    return <ClientApp />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Pre-Program Assessment</h2>
                <p className="text-slate-600 mt-1">Assess participant proficiency levels before program enrollment</p>
              </div>
              <button 
                onClick={() => setShowAssessment(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Assessment
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Assessments</h3>
              <div className="text-center text-slate-500 py-8">
                <p>No assessments completed yet. Click "Start New Assessment" to begin.</p>
              </div>
            </div>
          </div>
        );
      case 'cefr':
        return <CEFRLevelManager onCreatePathway={(level) => {
          setCurrentView('pathways');
        }} />;
      case 'pathways':
        return <PathwayBuilder />;
      case 'workshops':
        return <WorkshopPlanner />;
      case 'progress':
        return <ProgressTracker />;
      case 'reports':
        return <Reports />;
      case 'certificates':
        return <CertificateGenerator />;
      case 'personalized-reports':
        return <PersonalizedReports />;
      case 'feedback':
        return <FeedbackSystem />;
      case 'teacher-management':
        return <TeacherManagement />;
      case 'train-trainers':
        return <TrainTheTrainersProgram />;
      case 'resources':
        return <ResourceLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        currentView={currentView}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
        />
        
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            {renderView()}
          </div>
        </main>
      </div>
      
      {showAssessment && (
        <PreProgramAssessment
          participantId="current-user"
          onComplete={(assessment) => {
            console.log('Assessment completed:', assessment);
            setShowAssessment(false);
          }}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </div>
  );
}

export default App;