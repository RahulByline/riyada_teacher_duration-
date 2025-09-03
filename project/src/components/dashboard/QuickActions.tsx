import React from 'react';
import { Plus, Calendar, Users, BookOpen, BarChart3, Settings } from 'lucide-react';

const actions = [
  { icon: Plus, label: 'Create Pathway', color: 'blue', action: 'create-pathway' },
  { icon: Calendar, label: 'Schedule Workshop', color: 'green', action: 'schedule-workshop' },
  { icon: Users, label: 'Manage Participants', color: 'purple', action: 'manage-participants' },
  { icon: BookOpen, label: 'Add Resources', color: 'orange', action: 'add-resources' },
  { icon: BarChart3, label: 'View Reports', color: 'pink', action: 'view-reports' },
  { icon: Settings, label: 'Settings', color: 'slate', action: 'settings' },
];

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const handleActionClick = (action: string) => {
    if (onAction) {
      onAction(action);
    } else {
      // Default actions
      switch (action) {
        case 'create-pathway':
          console.log('Creating new pathway...');
          break;
        case 'schedule-workshop':
          console.log('Scheduling workshop...');
          break;
        case 'manage-participants':
          console.log('Managing participants...');
          break;
        case 'add-resources':
          console.log('Adding resources...');
          break;
        case 'view-reports':
          console.log('Viewing reports...');
          break;
        case 'settings':
          console.log('Opening settings...');
          break;
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={() => handleActionClick(action.action)}
            className={`p-3 text-left border-2 border-slate-200 rounded-lg hover:border-${action.color}-200 hover:bg-${action.color}-50 transition-all group`}
          >
            <div className={`p-2 bg-${action.color}-100 rounded-lg inline-flex mb-2 group-hover:bg-${action.color}-200 transition-colors`}>
              <Icon className={`w-4 h-4 text-${action.color}-600`} />
            </div>
            <p className="text-sm font-medium text-slate-900">{action.label}</p>
          </button>
        );
      })}
    </div>
  );
}