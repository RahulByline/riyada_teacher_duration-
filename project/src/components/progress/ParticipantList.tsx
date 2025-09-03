import React from 'react';
import { User, Award, Clock, TrendingUp } from 'lucide-react';

const participants = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.m@school.edu',
    progress: 85,
    completedHours: 68,
    totalHours: 80,
    status: 'active',
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.r@school.edu', 
    progress: 72,
    completedHours: 58,
    totalHours: 80,
    status: 'active',
    lastActivity: '1 day ago'
  },
  {
    id: '3',
    name: 'Jennifer Chen',
    email: 'jennifer.c@school.edu',
    progress: 95,
    completedHours: 76,
    totalHours: 80,
    status: 'active',
    lastActivity: '3 hours ago'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.t@school.edu',
    progress: 45,
    completedHours: 36,
    totalHours: 80,
    status: 'at-risk',
    lastActivity: '1 week ago'
  },
  {
    id: '5',
    name: 'Emily Johnson',
    email: 'emily.j@school.edu',
    progress: 100,
    completedHours: 80,
    totalHours: 80,
    status: 'completed',
    lastActivity: '2 days ago'
  }
];

interface ParticipantListProps {
  searchQuery: string;
  filter: string;
}

export function ParticipantList({ searchQuery, filter }: ParticipantListProps) {
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || participant.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Participant</th>
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Progress</th>
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Hours</th>
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Status</th>
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Last Activity</th>
            <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((participant) => (
            <tr key={participant.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{participant.name}</p>
                    <p className="text-sm text-slate-600">{participant.email}</p>
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{participant.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${participant.progress}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {participant.completedHours}/{participant.totalHours}h
                  </span>
                </div>
              </td>
              
              <td className="py-4 px-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  participant.status === 'completed' ? 'bg-green-100 text-green-700' :
                  participant.status === 'at-risk' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {participant.status}
                </span>
              </td>
              
              <td className="py-4 px-6">
                <span className="text-sm text-slate-600">{participant.lastActivity}</span>
              </td>
              
              <td className="py-4 px-6">
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}