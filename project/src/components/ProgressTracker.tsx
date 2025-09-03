import React, { useState } from 'react';
import { Users, TrendingUp, Award, Clock, Filter, Search } from 'lucide-react';
import { ParticipantList } from './progress/ParticipantList';
import { ProgressCharts } from './progress/ProgressCharts';
import { MilestoneTracker } from './progress/MilestoneTracker';

const overviewStats = [
  { label: 'Total Participants', value: '247', change: '+5.2%', icon: Users, color: 'blue' },
  { label: 'Average Progress', value: '68%', change: '+8.1%', icon: TrendingUp, color: 'green' },
  { label: 'Completed Milestones', value: '1,247', change: '+12.3%', icon: Award, color: 'purple' },
  { label: 'Hours Completed', value: '4,892', change: '+15.7%', icon: Clock, color: 'orange' },
];

export function ProgressTracker() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Progress Tracker</h2>
          <p className="text-slate-600 mt-1">Monitor participant progress and engagement</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64"
            />
          </div>
          
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">All Participants</option>
            <option value="active">Active</option>
            <option value="at-risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Charts and Milestone Tracker */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Progress Analytics</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          <ProgressCharts />
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Milestone Progress</h3>
          <MilestoneTracker />
        </div>
      </div>

      {/* Participant List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Participant Details</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              Export Data
            </button>
          </div>
        </div>
        <ParticipantList searchQuery={searchQuery} filter={selectedFilter} />
      </div>
    </div>
  );
}