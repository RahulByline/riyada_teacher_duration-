import React from 'react';
import { Calendar, Users, TrendingUp, Target } from 'lucide-react';
import { CEFR_LEVELS } from '../../types/cefr';

const attendanceData = [
  { workshop: 'Digital Assessment Strategies', date: '2024-03-01', registered: 28, attended: 26, rate: 93, cefrLevel: 'B2' },
  { workshop: 'Classroom Management Excellence', date: '2024-02-28', registered: 35, attended: 33, rate: 94, cefrLevel: 'B1' },
  { workshop: 'Grammar Teaching Innovations', date: '2024-02-25', registered: 22, attended: 20, rate: 91, cefrLevel: 'A2' },
  { workshop: 'Technology Integration Workshop', date: '2024-02-20', registered: 30, attended: 25, rate: 83, cefrLevel: 'C1' },
  { workshop: 'Assessment Design Fundamentals', date: '2024-02-15', registered: 24, attended: 22, rate: 92, cefrLevel: 'B2' }
];

interface AttendanceReportProps {
  dateRange: string;
}

export function AttendanceReport({ dateRange }: AttendanceReportProps) {
  const averageRate = Math.round(attendanceData.reduce((sum, item) => sum + item.rate, 0) / attendanceData.length);
  
  const cefrDistribution = attendanceData.reduce((acc, item) => {
    acc[item.cefrLevel] = (acc[item.cefrLevel] || 0) + item.attended;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Workshop Attendance Report</h3>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last {dateRange} days
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Avg: {averageRate}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Workshop</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">CEFR Level</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Registered</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Attended</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Rate</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-medium text-slate-900">{item.workshop}</td>
                <td className="py-4 px-4 text-slate-600">{item.date}</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {item.cefrLevel}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">{item.registered}</td>
                <td className="py-4 px-4 text-center">{item.attended}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.rate >= 90 ? 'bg-green-100 text-green-700' :
                    item.rate >= 80 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Total Participants</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900">139</p>
          <p className="text-sm text-blue-700">Registered across all workshops</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Average Attendance</h4>
          </div>
          <p className="text-2xl font-bold text-green-900">{averageRate}%</p>
          <p className="text-sm text-green-700">Across all workshops</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Workshops Held</h4>
          </div>
          <p className="text-2xl font-bold text-purple-900">5</p>
          <p className="text-sm text-purple-700">In the last {dateRange} days</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">CEFR Distribution</h4>
          </div>
          <div className="space-y-1">
            {Object.entries(cefrDistribution).map(([level, count]) => (
              <div key={level} className="flex justify-between text-sm">
                <span className="text-orange-700">{level}:</span>
                <span className="font-medium text-orange-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}