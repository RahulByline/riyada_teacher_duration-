import React from 'react';

export function PathwaySettings() {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Pathway Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pathway Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            placeholder="Enter pathway title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
            rows={3}
            placeholder="Enter pathway description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duration (Months)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              placeholder="6"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Hours
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              placeholder="120"
            />
          </div>
        </div>
      </div>
    </div>
  );
}