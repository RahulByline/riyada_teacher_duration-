import React, { useState } from 'react';
import { Download, Calendar, BarChart3, Users, TrendingUp } from 'lucide-react';
import { AttendanceReport } from './reports/AttendanceReport';
import { CompletionReport } from './reports/CompletionReport';
import { EngagementReport } from './reports/EngagementReport';

const reportTypes = [
  { id: 'attendance', label: 'Attendance Report', icon: Users, description: 'Track workshop and session attendance' },
  { id: 'completion', label: 'Completion Report', icon: TrendingUp, description: 'Monitor course and pathway completion rates' },
  { id: 'engagement', label: 'Engagement Report', icon: BarChart3, description: 'Analyze participant engagement patterns' },
];

export function Reports() {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState('30');

  const renderReport = () => {
    switch (selectedReport) {
      case 'attendance':
        return <AttendanceReport dateRange={dateRange} />;
      case 'completion':
        return <CompletionReport dateRange={dateRange} />;
      case 'engagement':
        return <EngagementReport dateRange={dateRange} />;
      default:
        return <AttendanceReport dateRange={dateRange} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
          <p className="text-slate-600 mt-1">Generate comprehensive reports and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 text-left border-2 rounded-xl transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isSelected ? 'text-blue-600' : 'text-slate-600'
                  }`} />
                </div>
                <h3 className={`font-semibold ${
                  isSelected ? 'text-blue-900' : 'text-slate-900'
                }`}>
                  {report.label}
                </h3>
              </div>
              <p className={`text-sm ${
                isSelected ? 'text-blue-700' : 'text-slate-600'
              }`}>
                {report.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-slate-200">
        {renderReport()}
      </div>
    </div>
  );
}