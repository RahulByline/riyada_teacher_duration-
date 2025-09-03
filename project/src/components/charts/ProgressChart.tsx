import React from 'react';

export function ProgressChart() {
  const data = [
    { month: 'Jan', completed: 65, enrolled: 89 },
    { month: 'Feb', completed: 78, enrolled: 94 },
    { month: 'Mar', completed: 84, enrolled: 97 },
    { month: 'Apr', completed: 91, enrolled: 102 },
    { month: 'May', completed: 88, enrolled: 98 },
    { month: 'Jun', completed: 95, enrolled: 105 },
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.enrolled)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
            <span className="text-slate-600">Enrolled</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
              <div 
                className="bg-blue-500 rounded-t flex-1"
                style={{ height: `${(item.completed / maxValue) * 100}%` }}
              ></div>
              <div 
                className="bg-slate-300 rounded-t flex-1"
                style={{ height: `${(item.enrolled / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}