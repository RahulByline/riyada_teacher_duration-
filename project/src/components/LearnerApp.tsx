import { useState } from 'react';
import { 
  BookOpen, 
  User, 
  Bell, 
  Menu,
  Home,
  ClipboardCheck,
  MessageSquare,
  Award,
  LogOut
} from 'lucide-react';
import { LearnerDashboard } from './learner/LearnerDashboard';
import { LearnerAssessment } from './learner/LearnerAssessment';
import { LearnerFeedback } from './learner/LearnerFeedback';
import { LearnerCertificates } from './learner/LearnerCertificates';
import { ParticipantPathwayView } from './participant/ParticipantPathwayView';
import { useUser } from '../contexts/UserContext';
import { useBranding } from '../contexts/BrandingContext';

type LearnerView = 'dashboard' | 'pathways' | 'assessment' | 'feedback' | 'certificates';

const learnerMenuItems = [
  { id: 'dashboard', label: 'My Learning', icon: Home },
  { id: 'pathways', label: 'My Pathways', icon: BookOpen },
  { id: 'assessment', label: 'Assessments', icon: ClipboardCheck },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'certificates', label: 'Certificates', icon: Award },
];

export function LearnerApp() {
  const { user, signOut } = useUser();
  const { branding } = useBranding();
  const [currentView, setCurrentView] = useState<LearnerView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out failed:', error);
      }
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <LearnerDashboard />;
      case 'pathways':
        return <ParticipantPathwayView />;
      case 'assessment':
        return <LearnerAssessment />;
      case 'feedback':
        return <LearnerFeedback />;
      case 'certificates':
        return <LearnerCertificates />;
      default:
        return <LearnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{branding.portalName}</h1>
                <p className="text-sm text-slate-500 hidden sm:block">Learner Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 relative transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role || 'participant'}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-16 h-full bg-white border-r border-slate-200 z-50
          transition-transform duration-300 ease-in-out w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Progress Overview */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Current Progress</h3>
              <p className="text-sm text-blue-700 mb-2">English Teaching Mastery Program</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700">Overall Completion</span>
                <span className="text-sm font-bold text-blue-900">68%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>

            <nav className="space-y-2">
              {learnerMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as LearnerView);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 text-slate-500" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}