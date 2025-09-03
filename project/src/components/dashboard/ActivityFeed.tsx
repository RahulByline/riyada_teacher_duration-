import React from 'react';
import { Users, BookOpen, Award, Calendar } from 'lucide-react';

const activities = [
  {
    type: 'completion',
    icon: Award,
    title: 'Sarah M. completed',
    description: 'Digital Assessment Workshop',
    time: '2 hours ago',
    color: 'green'
  },
  {
    type: 'enrollment',
    icon: Users,
    title: '5 new participants joined',
    description: 'Advanced Grammar Pathway',
    time: '4 hours ago',
    color: 'blue'
  },
  {
    type: 'workshop',
    icon: Calendar,
    title: 'Workshop scheduled',
    description: 'Classroom Management Excellence',
    time: '6 hours ago',
    color: 'orange'
  },
  {
    type: 'milestone',
    icon: BookOpen,
    title: 'Milestone achieved',
    description: 'Month 2 completion: 89%',
    time: '1 day ago',
    color: 'purple'
  },
  {
    type: 'completion',
    icon: Award,
    title: 'Michael R. completed',
    description: 'Teaching Methodology Course',
    time: '1 day ago',
    color: 'green'
  }
];

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-${activity.color}-100 mt-0.5`}>
              <Icon className={`w-4 h-4 text-${activity.color}-600`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {activity.title}
              </p>
              <p className="text-sm text-slate-600">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}