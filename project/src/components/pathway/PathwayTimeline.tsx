import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus } from 'lucide-react';
import { usePathway } from '../../contexts/PathwayContext';

const initialTimelineData = [
  {
    month: 'Month 1',
    weeks: [
      {
        week: 'Week 1',
        events: [
          {
            id: '1',
            title: 'Orientation Workshop',
            type: 'workshop',
            duration: '8 hours',
            status: 'completed'
          }
        ]
      },
      {
        week: 'Week 2',
        events: [
          {
            id: '2', 
            title: 'Introduction to Modern Teaching',
            type: 'elearning',
            duration: '3 hours',
            status: 'in-progress'
          }
        ]
      },
      {
        week: 'Week 3',
        events: [
          {
            id: '3',
            title: 'Assessment Quiz',
            type: 'assessment', 
            duration: '1 hour',
            status: 'scheduled'
          }
        ]
      },
      {
        week: 'Week 4',
        events: [
          {
            id: '4',
            title: 'Reflection Assignment',
            type: 'assignment',
            duration: '2 hours',
            status: 'scheduled'
          }
        ]
      }
    ]
  },
  {
    month: 'Month 2',
    weeks: [
      {
        week: 'Week 1',
        events: [
          {
            id: '5',
            title: 'Advanced Grammar Workshop',
            type: 'workshop',
            duration: '6 hours',
            status: 'scheduled'
          }
        ]
      },
      {
        week: 'Week 2',
        events: []
      },
      {
        week: 'Week 3',
        events: []
      },
      {
        week: 'Week 4',
        events: []
      }
    ]
  }
];

const eventTypeConfig = {
  workshop: { color: 'blue', icon: Calendar },
  elearning: { color: 'green', icon: Clock },
  assessment: { color: 'purple', icon: Users },
  assignment: { color: 'orange', icon: Clock },
};

const statusConfig = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-slate-100 text-slate-700'
};

export function PathwayTimeline() {
  const [timelineData, setTimelineData] = useState(initialTimelineData);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<{monthIndex: number, weekIndex: number} | null>(null);

  const handleAddEvent = (monthIndex: number, weekIndex: number) => {
    setSelectedWeek({ monthIndex, weekIndex });
    setShowAddEventModal(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (!selectedWeek) return;
    
    const newEvent = {
      id: Date.now().toString(),
      title: eventData.title,
      type: eventData.type,
      duration: eventData.duration,
      status: 'scheduled'
    };

    setTimelineData(prev => {
      const updated = [...prev];
      updated[selectedWeek.monthIndex].weeks[selectedWeek.weekIndex].events.push(newEvent);
      return updated;
    });

    setShowAddEventModal(false);
    setSelectedWeek(null);
  };

  return (
    <>
      <div className="p-6 space-y-8">
        {timelineData.map((month, monthIndex) => (
          <div key={monthIndex} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              {month.month}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {month.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="bg-slate-50 rounded-lg p-4 min-h-32">
                  <h4 className="font-medium text-slate-700 mb-3">{week.week}</h4>
                  
                  <div className="space-y-2">
                    {week.events.map((event) => {
                      const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                      const Icon = config.icon;
                      
                      return (
                        <div
                          key={event.id}
                          className="bg-white p-3 rounded-lg border border-slate-200 cursor-pointer hover:shadow-sm transition-shadow"
                          draggable
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className={`p-1 rounded bg-${config.color}-100`}>
                              <Icon className={`w-3 h-3 text-${config.color}-600`} />
                            </div>
                            <h5 className="text-xs font-medium text-slate-900 leading-tight">
                              {event.title}
                            </h5>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">{event.duration}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[event.status as keyof typeof statusConfig]}`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    
                    <button 
                      onClick={() => handleAddEvent(monthIndex, weekIndex)}
                      className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Add Event</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Learning Event</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSaveEvent({
                title: formData.get('title'),
                type: formData.get('type'),
                duration: formData.get('duration')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="workshop">Workshop</option>
                    <option value="elearning">eLearning</option>
                    <option value="assessment">Assessment</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <input
                    name="duration"
                    type="text"
                    placeholder="e.g., 2 hours, 30 minutes"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEventModal(false);
                    setSelectedWeek(null);
                  }}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}