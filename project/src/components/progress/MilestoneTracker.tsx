import React from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';

const milestones = [
  {
    id: '1',
    title: 'Program Orientation',
    description: 'Complete welcome workshop and initial assessment',
    status: 'completed',
    dueDate: 'Week 1',
    completion: 100
  },
  {
    id: '2',
    title: 'Teaching Fundamentals',
    description: 'Master core teaching methodologies',
    status: 'completed',
    dueDate: 'Month 1',
    completion: 100
  },
  {
    id: '3',
    title: 'Classroom Management',
    description: 'Develop effective classroom management strategies',
    status: 'in-progress',
    dueDate: 'Month 2',
    completion: 75
  },
  {
    id: '4',
    title: 'Assessment Design',
    description: 'Create comprehensive assessment frameworks',
    status: 'pending',
    dueDate: 'Month 3',
    completion: 0
  },
  {
    id: '5',
    title: 'Technology Integration',
    description: 'Implement digital tools in teaching practice',
    status: 'pending',
    dueDate: 'Month 4',
    completion: 0
  }
];

export function MilestoneTracker() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <div
          key={milestone.id}
          className={`p-4 rounded-lg border-2 ${getStatusColor(milestone.status)}`}
        >
          <div className="flex items-start gap-3">
            {getStatusIcon(milestone.status)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{milestone.title}</h4>
                <span className="text-xs text-slate-600">{milestone.dueDate}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{milestone.description}</p>
              
              {milestone.status === 'in-progress' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-900">{milestone.completion}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.completion}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}