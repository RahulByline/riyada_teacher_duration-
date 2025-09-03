import React from 'react';
import { Upload, FileText, Video, Image, Link } from 'lucide-react';

const resources = [
  { type: 'document', name: 'Workshop Slides.pptx', size: '2.4 MB', icon: FileText },
  { type: 'video', name: 'Introduction Video.mp4', size: '15.2 MB', icon: Video },
  { type: 'image', name: 'Activity Handout.pdf', size: '892 KB', icon: Image },
  { type: 'link', name: 'External Tool Link', size: 'Link', icon: Link }
];

export function ResourceManager() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Resources</h3>
      
      <div className="space-y-3 mb-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{resource.name}</p>
                <p className="text-xs text-slate-600">{resource.size}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Resources
      </button>
    </div>
  );
}