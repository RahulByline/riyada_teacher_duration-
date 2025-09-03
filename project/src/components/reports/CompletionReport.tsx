import React from 'react';
import { Award, Book, Target } from 'lucide-react';

const completionData = [
  { pathway: 'English Teaching Mastery', enrolled: 45, completed: 38, inProgress: 6, notStarted: 1, rate: 84 },
  { pathway: 'Digital Literacy for Educators', enrolled: 32, completed: 28, inProgress: 3, notStarted: 1, rate: 88 },
  { pathway: 'Assessment Excellence Program', enrolled: 28, completed: 22, inProgress: 5, notStarted: 1, rate: 79 },
  { pathway: 'Classroom Management Mastery', enrolled: 35, completed: 31, inProgress: 3, notStarted: 1, rate: 89 }
];

interface CompletionReportProps {
  dateRange: string;
}

export function CompletionReport({ dateRange }: CompletionReportProps) {
  const totalEnrolled = completionData.reduce((sum, item) => sum + item.enrolled, 0);
  const totalCompleted = completionData.reduce((sum, item) => sum + item.completed, 0);
  const overallRate = Math.round((totalCompleted / totalEnrolled) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Pathway Completion Report</h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Target className="w-4 h-4" />
          Overall: {overallRate}%
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-semibold text-slate-900">Learning Pathway</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Enrolled</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Completed</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">In Progress</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Not Started</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {completionData.map((item, index) => (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-medium text-slate-900">{item.pathway}</td>
                <td className="py-4 px-4 text-center">{item.enrolled}</td>
                <td className="py-4 px-4 text-center text-green-700 font-medium">{item.completed}</td>
                <td className="py-4 px-4 text-center text-blue-700">{item.inProgress}</td>
                <td className="py-4 px-4 text-center text-slate-500">{item.notStarted}</td>
                <td className="py-4 px-4 text-center">
                  <div className="space-y-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.rate >= 85 ? 'bg-green-100 text-green-700' :
                      item.rate >= 75 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.rate}%
                    </span>
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${item.rate}%` }}
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
            <Book className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Total Enrollments</h4>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalEnrolled}</p>
          <p className="text-sm text-blue-700">Across all pathways</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Completed</h4>
          </div>
          <p className="text-2xl font-bold text-green-900">{totalCompleted}</p>
          <p className="text-sm text-green-700">Successfully finished</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-purple-900">Success Rate</h4>
          </div>
          <p className="text-2xl font-bold text-purple-900">{overallRate}%</p>
          <p className="text-sm text-purple-700">Overall completion rate</p>
        </div>
      </div>
    </div>
  );
}