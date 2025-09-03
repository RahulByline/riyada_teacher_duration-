import React, { useState } from 'react';
import { Clock, Plus, GripVertical } from 'lucide-react';

const initialScheduleItems = [
  {
    id: '1',
    time: '09:00 - 09:30',
    title: 'Welcome & Introductions',
    type: 'session',
    facilitator: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    time: '09:30 - 10:30',
    title: 'Digital Assessment Overview',
    type: 'presentation',
    facilitator: 'Dr. Sarah Johnson'
  },
  {
    id: '3',
    time: '10:30 - 10:45',
    title: 'Coffee Break',
    type: 'break',
    facilitator: null
  },
  {
    id: '4',
    time: '10:45 - 12:00',
    title: 'Hands-on Tool Exploration',
    type: 'activity',
    facilitator: 'Michael Chen'
  },
  {
    id: '5',
    time: '12:00 - 13:00',
    title: 'Lunch Break',
    type: 'break',
    facilitator: null
  },
  {
    id: '6',
    time: '13:00 - 14:30',
    title: 'Creating Digital Assessments',
    type: 'workshop',
    facilitator: 'Dr. Sarah Johnson'
  },
  {
    id: '7',
    time: '14:30 - 14:45',
    title: 'Short Break',
    type: 'break',
    facilitator: null
  },
  {
    id: '8',
    time: '14:45 - 16:00',
    title: 'Group Practice & Feedback',
    type: 'activity',
    facilitator: 'Both'
  }
];

const typeConfig = {
  session: { color: 'blue', label: 'Session' },
  presentation: { color: 'green', label: 'Presentation' },
  workshop: { color: 'purple', label: 'Workshop' },
  activity: { color: 'orange', label: 'Activity' },
  break: { color: 'slate', label: 'Break' }
};

interface WorkshopScheduleProps {
  selectedWorkshop?: any;
}

export function WorkshopSchedule({ selectedWorkshop }: WorkshopScheduleProps) {
  const [scheduleItems, setScheduleItems] = useState(initialScheduleItems);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddItem = (itemData: any) => {
    const newItem = {
      id: Date.now().toString(),
      time: itemData.time,
      title: itemData.title,
      type: itemData.type,
      facilitator: itemData.facilitator || null
    };
    setScheduleItems(prev => [...prev, newItem]);
    setShowAddModal(false);
  };

  if (!selectedWorkshop) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>Select a workshop from the list above to plan its schedule</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="space-y-3">
          {scheduleItems.map((item, index) => {
            const config = typeConfig[item.type as keyof typeof typeConfig];
            
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 border-dashed transition-all ${
                  item.type === 'break' 
                    ? 'border-slate-200 bg-slate-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                draggable={item.type !== 'break'}
              >
                <div className="cursor-move">
                  <GripVertical className="w-5 h-5 text-slate-400" />
                </div>
                
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 min-w-fit">
                    <Clock className="w-4 h-4" />
                    {item.time}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${config.color}-100 text-${config.color}-700`}>
                        {config.label}
                      </span>
                      <h4 className="font-medium text-slate-900 truncate">{item.title}</h4>
                    </div>
                    {item.facilitator && (
                      <p className="text-sm text-slate-600">Facilitator: {item.facilitator}</p>
                    )}
                  </div>
                </div>
                
                {item.type !== 'break' && (
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add Schedule Item
          </button>
        </div>
      </div>

      {/* Add Schedule Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Schedule Item</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddItem({
                time: formData.get('time'),
                title: formData.get('title'),
                type: formData.get('type'),
                facilitator: formData.get('facilitator')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                  <input
                    name="time"
                    type="text"
                    required
                    placeholder="e.g., 09:00 - 10:00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter session title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="session">Session</option>
                    <option value="presentation">Presentation</option>
                    <option value="workshop">Workshop</option>
                    <option value="activity">Activity</option>
                    <option value="break">Break</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Facilitator (optional)</label>
                  <input
                    name="facilitator"
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter facilitator name"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}