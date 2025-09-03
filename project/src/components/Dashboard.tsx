import React from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Award,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { ProgressChart } from './charts/ProgressChart';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { QuickActions } from './dashboard/QuickActions';
import { usePathway } from '../contexts/PathwayContext';

const stats = [
  { label: 'Active Participants', value: '247', change: '+12%', icon: Users, color: 'blue' },
  { label: 'Learning Pathways', value: '18', change: '+3', icon: BookOpen, color: 'green' },
  { label: 'Workshops This Month', value: '8', change: '2 upcoming', icon: Calendar, color: 'orange' },
  { label: 'Completion Rate', value: '84%', change: '+5%', icon: TrendingUp, color: 'purple' },
];

const upcomingEvents = [
  {
    title: 'Advanced Grammar Workshop',
    date: 'Tomorrow, 9:00 AM',
    participants: 24,
    status: 'confirmed'
  },
  {
    title: 'Digital Literacy Training',
    date: 'March 15, 2:00 PM',
    participants: 18,
    status: 'pending'
  },
  {
    title: 'Assessment Strategies Seminar',
    date: 'March 20, 10:00 AM',
    participants: 32,
    status: 'confirmed'
  }
];

export function Dashboard() {
  const { pathways } = usePathway();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-blue-100">Ready to empower English educators today?</p>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-center">
            <div>
              <div className="text-3xl font-bold">{pathways.length}</div>
              <div className="text-sm text-blue-200">Active Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">84%</div>
              <div className="text-sm text-blue-200">Avg. Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Learning Progress Overview</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <ProgressChart />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-600">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{event.participants} participants</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}