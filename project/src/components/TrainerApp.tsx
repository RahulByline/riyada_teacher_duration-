import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Bell, 
  Menu,
  Route,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Award,
  LogOut,
  Plus,
  Clock,
  Target,
  BookOpen
} from 'lucide-react';
import { PathwayBuilder } from './PathwayBuilder';
import { WorkshopPlanner } from './WorkshopPlanner';
import { ProgressTracker } from './ProgressTracker';
import { Reports } from './Reports';
import { FeedbackSystem } from './FeedbackSystem';
import { CertificateGenerator } from './CertificateGenerator';
import { ResourceLibrary } from './ResourceLibrary';
import { useUser } from '../contexts/UserContext';
import { useBranding } from '../contexts/BrandingContext';
import { usePathway } from '../contexts/PathwayContext';

type TrainerView = 'overview' | 'pathways' | 'workshops' | 'participants' | 'reports' | 'feedback' | 'certificates';

const trainerMenuItems = [
  { id: 'overview', label: 'Training Overview', icon: BarChart3 },
  { id: 'pathways', label: 'Learning Pathways', icon: Route },
  { id: 'workshops', label: 'Workshop Planner', icon: Calendar },
  { id: 'resources', label: 'Resource Library', icon: BookOpen },
  { id: 'participants', label: 'Participant Progress', icon: Users },
  { id: 'feedback', label: 'Feedback & Reviews', icon: MessageSquare },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'reports', label: 'Training Reports', icon: BarChart3 },
];

export function TrainerApp() {
  const { user, signOut } = useUser();
  const { branding } = useBranding();
  const { pathways } = usePathway();
  const [currentView, setCurrentView] = useState<TrainerView>('overview');
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
            <p className="text-green-100">Empower educators and track their learning journey</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{pathways.length}</div>
            <div className="text-sm text-green-200">Active Programs</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Route className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Learning Pathways</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pathways.length}</p>
          <p className="text-sm text-slate-600">Programs created</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Active Participants</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">247</p>
          <p className="text-sm text-slate-600">Currently enrolled</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Workshops</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">12</p>
          <p className="text-sm text-slate-600">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">84%</p>
          <p className="text-sm text-slate-600">Average success</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentView('pathways')}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Create New Pathway</span>
            </button>
            <button 
              onClick={() => setCurrentView('workshops')}
              className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Schedule Workshop</span>
            </button>
            <button 
              onClick={() => setCurrentView('participants')}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">View Progress</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Workshops</h3>
          <div className="space-y-3">
            {[
              { title: 'Advanced Grammar Workshop', date: 'Tomorrow, 9:00 AM', participants: 24 },
              { title: 'Digital Assessment Tools', date: 'March 20, 2:00 PM', participants: 18 },
              { title: 'Classroom Management', date: 'March 22, 10:00 AM', participants: 32 }
            ].map((workshop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{workshop.title}</p>
                  <p className="text-xs text-slate-600">{workshop.date}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {workshop.participants} enrolled
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Sarah M. completed Grammar Module', time: '2 hours ago', type: 'completion' },
              { action: 'New participant enrolled', time: '4 hours ago', type: 'enrollment' },
              { action: 'Workshop feedback received', time: '6 hours ago', type: 'feedback' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${
                  activity.type === 'completion' ? 'bg-green-100' :
                  activity.type === 'enrollment' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'completion' && <Award className="w-3 h-3 text-green-600" />}
                  {activity.type === 'enrollment' && <Users className="w-3 h-3 text-blue-600" />}
                  {activity.type === 'feedback' && <MessageSquare className="w-3 h-3 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'pathways':
        return <PathwayBuilder />;
      case 'workshops':
        return <WorkshopPlanner />;
      case 'resources':
        return <ResourceLibrary />;
      case 'participants':
        return <ProgressTracker />;
      case 'feedback':
        return <FeedbackSystem />;
      case 'certificates':
        return <CertificateGenerator />;
      case 'reports':
        return <Reports />;
      default:
        return renderOverview();
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
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{branding.portalName}</h1>
                <p className="text-sm text-slate-500 hidden sm:block">Trainer Portal</p>
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
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
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
            {/* Trainer Stats */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Training Impact</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Active Programs:</span>
                  <span className="font-bold text-green-900">{pathways.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Total Participants:</span>
                  <span className="font-bold text-green-900">247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Success Rate:</span>
                  <span className="font-bold text-green-900">84%</span>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {trainerMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as TrainerView);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-green-600' : 'text-slate-500 group-hover:text-slate-700'
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