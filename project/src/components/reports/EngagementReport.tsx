import React from 'react';
import { Activity, Clock, MessageCircle } from 'lucide-react';

const engagementData = [
  { participant: 'Sarah Mitchell', loginFreq: 24, avgSession: 45, forumPosts: 12, score: 92 },
  { participant: 'Michael Rodriguez', loginFreq: 18, avgSession: 38, forumPosts: 8, score: 78 },
  { participant: 'Jennifer Chen', loginFreq: 32, avgSession: 52, forumPosts: 16, score: 98 },
  { participant: 'David Thompson', loginFreq: 8, avgSession: 22, forumPosts: 2, score: 45 },
  { participant: 'Emily Johnson', loginFreq: 28, avgSession: 48, forumPosts: 14, score: 89 }
];

interface EngagementReportProps {
  dateRange: string;
}

export function EngagementReport({ dateRange }: EngagementReportProps) {
  const averageScore = Math.round(engagementData.reduce((sum, item) => sum + item.score, 0) / engagementData.length);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Participant Engagement Report</h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Activity className="w-4 h-4" />
          Avg Score: {averageScore}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Participant</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Login Frequency</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Avg Session (min)</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Forum Posts</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Engagement Score</th>
            </tr>
          </thead>
          <tbody>
            {engagementData.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-medium text-slate-900">{item.participant}</td>
                <td className="py-4 px-4 text-center">{item.loginFreq} times</td>
                <td className="py-4 px-4 text-center">{item.avgSession} min</td>
                <td className="py-4 px-4 text-center">{item.forumPosts} posts</td>
                <td className="py-4 px-4 text-center">
                  <div className="space-y-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.score >= 80 ? 'bg-green-100 text-green-700' :
                      item.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.score}
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          item.score >= 80 ? 'bg-green-600' :
                          item.score >= 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Active Users</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900">89%</p>
          <p className="text-sm text-blue-700">Logged in this week</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Avg Session Time</h4>
          </div>
          <p className="text-2xl font-bold text-green-900">41 min</p>
          <p className="text-sm text-green-700">Per learning session</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Forum Activity</h4>
          </div>
          <p className="text-2xl font-bold text-purple-900">52</p>
          <p className="text-sm text-purple-700">Posts this week</p>
        </div>
      </div>
    </div>
  );
}