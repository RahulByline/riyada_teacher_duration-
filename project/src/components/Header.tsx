import React from 'react';
import { Menu, Bell, User, GraduationCap, Edit3, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useBranding } from '../contexts/BrandingContext';
import { RoleSwitcher } from './RoleSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
  currentView: string;
}

export function Header({ onMenuClick, currentView }: HeaderProps) {
  const { user, signOut } = useUser();
  const { branding, updateBranding } = useBranding();
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(branding.portalName);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'assessment': return 'Pre-Program Assessment';
      case 'cefr': return 'CEFR Level Management';
      case 'pathways': return 'Learning Pathways';
      case 'workshops': return 'Workshop Planner';
      case 'progress': return 'Progress Tracker';
      case 'reports': return 'Reports & Analytics';
      default: return 'Dashboard';
    }
  };

  const handleNameSave = () => {
    updateBranding({ portalName: tempName });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(branding.portalName);
    setIsEditingName(false);
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Sign out failed:', error);
      }
    }
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="flex items-center gap-3 group">
            <div className={`p-2 rounded-lg`} style={{ backgroundColor: branding.primaryColor }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-xl font-bold text-slate-900 bg-transparent border-b border-blue-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave();
                        if (e.key === 'Escape') handleNameCancel();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleNameSave}
                      className="text-green-600 hover:text-green-700"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleNameCancel}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{branding.portalName}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 hidden sm:block">{getViewTitle()}</p>
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
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            
            <RoleSwitcher />
            
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}