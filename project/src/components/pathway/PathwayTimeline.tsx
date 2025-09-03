import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Trash2 } from 'lucide-react';
import { usePathway } from '../../contexts/PathwayContext';
import type { LearningEvent } from '../../types/cefr';

// Generate timeline structure based on pathway duration
const generateTimelineStructure = (duration: number) => {
  const timeline = [];
  for (let month = 1; month <= duration; month++) {
    const weeks = [];
    for (let week = 1; week <= 4; week++) {
      weeks.push({
        week: `Week ${week}`,
        events: []
      });
    }
    timeline.push({
      month: `Month ${month}`,
      weeks
    });
  }
  return timeline;
};

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
  const { selectedPathway, addEvent, deleteEvent } = usePathway();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<{monthIndex: number, weekIndex: number} | null>(null);

  // Generate timeline structure based on selected pathway duration
  const timelineData = selectedPathway ? generateTimelineStructure(selectedPathway.duration) : [];

  // Distribute events across the timeline (simple distribution for now)
  useEffect(() => {
    if (selectedPathway && selectedPathway.events.length > 0) {
      // This is a simple distribution - you can make it more sophisticated
      const eventsPerWeek = Math.ceil(selectedPathway.events.length / (selectedPathway.duration * 4));
      let eventIndex = 0;
      
      timelineData.forEach((month, monthIndex) => {
        month.weeks.forEach((week, weekIndex) => {
          if (eventIndex < selectedPathway.events.length) {
            const event = selectedPathway.events[eventIndex];
            week.events.push({
              id: event.id,
              title: event.title,
              type: event.type,
              duration: `${event.duration} hours`,
              status: event.status || 'scheduled'
            });
            eventIndex++;
          }
        });
      });
    }
  }, [selectedPathway, timelineData]);

  const handleAddEvent = (monthIndex: number, weekIndex: number) => {
    if (!selectedPathway) {
      alert('Please select a pathway first');
      return;
    }
    setSelectedWeek({ monthIndex, weekIndex });
    setShowAddEventModal(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    if (!selectedPathway || !selectedWeek) return;
    
    try {
      const newEvent = {
        title: eventData.title,
        type: eventData.type,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        duration: parseInt(eventData.duration) || 2,
        format: 'online', // Default to online format
        objectives: eventData.description ? [eventData.description] : [], // Convert to array
        resources: [],
        dependencies: []
      };

      await addEvent(selectedPathway.id, newEvent);
      
      setShowAddEventModal(false);
      setSelectedWeek(null);
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Check console for details.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!selectedPathway) return;
    
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(selectedPathway.id, eventId);
        // The context will automatically update the pathway events
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Check console for details.');
      }
    }
  };

  if (!selectedPathway) {
    return (
      <div className="p-6 text-center">
        <div className="bg-slate-50 rounded-lg p-8">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pathway Selected</h3>
          <p className="text-slate-600 mb-4">
            Please select a pathway from the pathway list to view and edit its timeline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{selectedPathway.title} Timeline</h2>
            <p className="text-slate-600">{selectedPathway.duration} months • {selectedPathway.total_hours} hours</p>
          </div>
        </div>
        
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
                          className="bg-white p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2 flex-1">
                              <div className={`p-1 rounded bg-${config.color}-100`}>
                                <Icon className={`w-3 h-3 text-${config.color}-600`} />
                              </div>
                              <h5 className="text-xs font-medium text-slate-900 leading-tight">
                                {event.title}
                              </h5>
                            </div>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                              title="Delete event"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration (hours)</label>
                  <input
                    name="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter event description and objectives"
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