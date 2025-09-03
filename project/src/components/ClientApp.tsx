import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Bell, 
  Menu,
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  Award,
  Calendar,
  LogOut,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import { Reports } from './Reports';
import { PersonalizedReports } from './PersonalizedReports';
import { TeacherNomination } from './TeacherNomination';
import { useUser } from '../contexts/UserContext';
import { useBranding } from '../contexts/BrandingContext';

type ClientView = 'overview' | 'program-reports' | 'participant-analytics' | 'roi-analysis' | 'executive-summary' | 'teacher-nominations';

const clientMenuItems = [
  { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
  { id: 'teacher-nominations', label: 'Teacher Nominations', icon: Users },
  { id: 'program-reports', label: 'Program Reports', icon: FileText },
  { id: 'participant-analytics', label: 'Participant Analytics', icon: Users },
  { id: 'roi-analysis', label: 'ROI Analysis', icon: TrendingUp },
  { id: 'executive-summary', label: 'Executive Summary', icon: Award },
];

export function ClientApp() {
  const { user, signOut } = useUser();
  const { branding } = useBranding();
  const [currentView, setCurrentView] = useState<ClientView>('overview');
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
      {/* Executive Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Executive Dashboard</h2>
            <p className="text-purple-100">Strategic insights into your training investment</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">$2.4M</div>
            <div className="text-sm text-purple-200">Training Investment</div>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">ROI</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">324%</p>
          <p className="text-sm text-slate-600">Return on Investment</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Participants</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">247</p>
          <p className="text-sm text-slate-600">Trained educators</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">84%</p>
          <p className="text-sm text-slate-600">Program success</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Impact Score</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">4.6/5</p>
          <p className="text-sm text-slate-600">Training effectiveness</p>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Training Impact Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">Student Performance Improvement</p>
                <p className="text-sm text-green-700">Average increase in test scores</p>
              </div>
              <span className="text-2xl font-bold text-green-600">+23%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-900">Teacher Retention Rate</p>
                <p className="text-sm text-blue-700">Reduced turnover after training</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">92%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-900">Classroom Innovation</p>
                <p className="text-sm text-purple-700">New teaching methods adopted</p>
              </div>
              <span className="text-2xl font-bold text-purple-600">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Investment Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: 'Program Development', amount: '$850K', percentage: 35, color: 'blue' },
              { category: 'Trainer Fees', amount: '$720K', percentage: 30, color: 'green' },
              { category: 'Technology Platform', amount: '$480K', percentage: 20, color: 'purple' },
              { category: 'Materials & Resources', amount: '$350K', percentage: 15, color: 'orange' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{item.category}</span>
                  <span className="text-sm font-bold text-slate-900">{item.amount}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`bg-${item.color}-500 h-2 rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Executive Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setCurrentView('executive-summary')}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Download Executive Summary</p>
              <p className="text-sm text-purple-700">Comprehensive overview report</p>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentView('teacher-nominations')}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Nominate Teachers</p>
              <p className="text-sm text-blue-700">Submit teacher nominations for training</p>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentView('roi-analysis')}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">View ROI Analysis</p>
              <p className="text-sm text-green-700">Detailed financial impact</p>
            </div>
          </button>
          
        </div>
      </div>
    </div>
  );

  const renderROIAnalysis = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">ROI Analysis</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Impact</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Total Investment</p>
              <p className="text-2xl font-bold text-slate-900">$2.4M</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Projected Returns</p>
              <p className="text-2xl font-bold text-green-600">$7.8M</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Net Benefit</p>
              <p className="text-2xl font-bold text-green-600">$5.4M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Efficiency Gains</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Teaching Effectiveness</span>
              <span className="font-bold text-green-600">+34%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Student Engagement</span>
              <span className="font-bold text-green-600">+28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Curriculum Delivery</span>
              <span className="font-bold text-green-600">+41%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Assessment Quality</span>
              <span className="font-bold text-green-600">+52%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Savings</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Reduced Turnover</p>
              <p className="text-xl font-bold text-green-600">$1.2M saved</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Improved Retention</p>
              <p className="text-xl font-bold text-green-600">$890K saved</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Efficiency Gains</p>
              <p className="text-xl font-bold text-green-600">$650K saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'teacher-nominations':
        return <TeacherNomination />;
      case 'program-reports':
        return <Reports />;
      case 'participant-analytics':
        return <PersonalizedReports />;
      case 'roi-analysis':
        return renderROIAnalysis();
      case 'executive-summary':
        return renderOverview(); // Could be a specialized executive summary component
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
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{branding.portalName}</h1>
                <p className="text-sm text-slate-500 hidden sm:block">Executive Portal</p>
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
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
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
            {/* Executive Summary */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Investment Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Total Investment:</span>
                  <span className="font-bold text-purple-900">$2.4M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">ROI:</span>
                  <span className="font-bold text-green-600">324%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-700">Participants:</span>
                  <span className="font-bold text-purple-900">247</span>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {clientMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as ClientView);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-purple-600' : 'text-slate-500 group-hover:text-slate-700'
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