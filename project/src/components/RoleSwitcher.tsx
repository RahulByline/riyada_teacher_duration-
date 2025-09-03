import React, { useState } from 'react';
import { Users, ChevronDown, User, Shield, GraduationCap, Building, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const roleConfig = {
  admin: {
    label: 'Administrator',
    icon: Shield,
    color: 'red',
    description: 'Full system access and management'
  },
  trainer: {
    label: 'Trainer',
    icon: GraduationCap,
    color: 'blue',
    description: 'Manage pathways and participants'
  },
  participant: {
    label: 'Participant',
    icon: User,
    color: 'green',
    description: 'Learning and progress tracking'
  },
  client: {
    label: 'Client',
    icon: Building,
    color: 'purple',
    description: 'View reports and analytics'
  }
};

export function RoleSwitcher() {
  const { user, updateUserRole, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!user) return null;

  const currentRoleConfig = roleConfig[user.role];
  const CurrentIcon = currentRoleConfig.icon;

  const handleRoleSwitch = async (newRole: 'admin' | 'trainer' | 'participant' | 'client') => {
    if (newRole === user.role) {
      setIsOpen(false);
      return;
    }

    try {
      setSwitching(true);
      await updateUserRole(newRole);
      setIsOpen(false);
      // Force a page refresh to ensure all components update properly
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch role:', error);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading || switching}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {switching ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
        ) : (
          <CurrentIcon className={`w-4 h-4 text-${currentRoleConfig.color}-600`} />
        )}
        <span className="font-medium text-slate-700">{currentRoleConfig.label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                Switch Role
              </div>
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                const isActive = user.role === role;
                
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role as any)}
                    disabled={switching}
                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isActive 
                        ? `bg-${config.color}-50 text-${config.color}-700` 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${
                      isActive ? `text-${config.color}-600` : 'text-slate-500'
                    }`} />
                    <div>
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-slate-500">{config.description}</div>
                    </div>
                    {isActive && (
                      <div className="ml-auto">
                        <div className={`w-2 h-2 rounded-full bg-${config.color}-500`}></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}