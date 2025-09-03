import React from 'react';

export function ProgressCharts() {
  const progressData = [
    { label: 'Completed', value: 65, color: 'bg-green-500' },
    { label: 'In Progress', value: 25, color: 'bg-blue-500' },
    { label: 'Not Started', value: 10, color: 'bg-slate-300' }
  ];

  const total = progressData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${(progressData[0].value / total) * 314} 314`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={`${(progressData[1].value / total) * 314} 314`}
              strokeDashoffset={`-${(progressData[0].value / total) * 314}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{progressData[0].value}%</div>
              <div className="text-xs text-slate-600">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {progressData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-slate-600">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}