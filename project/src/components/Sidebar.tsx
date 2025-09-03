import React from 'react';
import { 
  LayoutDashboard, 
  Route, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Target,
  ClipboardCheck,
  X,
  Award,
  FileText,
  MessageSquare,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: 'dashboard' | 'pathways' | 'workshops' | 'progress' | 'reports' | 'cefr' | 'assessment' | 'certificates' | 'personalized-reports' | 'feedback' | 'teacher-management' | 'train-trainers') => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assessment', label: 'Pre-Assessment', icon: ClipboardCheck },
  { id: 'cefr', label: 'CEFR Levels', icon: Target },
  { id: 'pathways', label: 'Learning Pathways', icon: Route },
  { id: 'workshops', label: 'Workshop Planner', icon: Calendar },
  { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
  { id: 'teacher-management', label: 'Teacher Management', icon: Users },
  { id: 'train-trainers', label: 'Train the Trainers', icon: GraduationCap },
  { id: 'resources', label: 'Resource Library', icon: BookOpen },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'personalized-reports', label: 'Detailed Reports', icon: FileText },
  { id: 'feedback', label: 'Feedback System', icon: MessageSquare },
];

export function Sidebar({ isOpen, currentView, onViewChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => onViewChange(currentView as any)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-full bg-white border-r border-slate-200 z-50
        transition-transform duration-300 ease-in-out w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
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
          </nav>
        </div>
      </aside>
    </>
  );
}