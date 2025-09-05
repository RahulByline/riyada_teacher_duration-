import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Trash2, RefreshCw } from 'lucide-react';
import { usePathway } from '../../contexts/PathwayContext';

// Define timeline structure types
interface TimelineEvent {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: string;
}

// Extended event interface with placement information
interface EventWithPlacement {
  id: string;
  title: string;
  type: string;
  duration: number;
  format: string;
  month_index?: number;
  week_index?: number;
}

interface TimelineWeek {
  week: string;
  events: TimelineEvent[];
}

interface TimelineMonth {
  month: string;
  weeks: TimelineWeek[];
}

// Generate timeline structure based on pathway duration
const generateTimelineStructure = (duration: number): TimelineMonth[] => {
  const timeline: TimelineMonth[] = [];
  for (let month = 1; month <= duration; month++) {
    const weeks: TimelineWeek[] = [];
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
  workshop: { color: 'blue', icon: Calendar, label: 'Workshop' },
  elearning: { color: 'green', icon: Clock, label: 'eLearning' },
  assessment: { color: 'purple', icon: Users, label: 'Assessment' },
  assignment: { color: 'orange', icon: Clock, label: 'Assignment' },
  group: { color: 'indigo', icon: Users, label: 'Group Work' },
  checkpoint: { color: 'red', icon: Calendar, label: 'Checkpoint' },
};

// Function to get event type display name
const getEventTypeLabel = (type: string): string => {
  return eventTypeConfig[type as keyof typeof eventTypeConfig]?.label || type.charAt(0).toUpperCase() + type.slice(1);
};

const statusConfig = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-slate-100 text-slate-700'
};

export function PathwayTimeline() {
  const { selectedPathway, addEvent, deleteEvent, refreshPathwayEvents } = usePathway();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<{monthIndex: number, weekIndex: number} | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [timelineData, setTimelineData] = useState<TimelineMonth[]>([]);

  // Log render information
  console.log('🎯 PathwayTimeline render:', { 
    selectedPathway: selectedPathway?.title, 
    eventsCount: selectedPathway?.events?.length || 0,
    timelineDataLength: timelineData.length
  });

  // Distribute events across the timeline (simple distribution for now)
  useEffect(() => {
    console.log('🔄 Timeline useEffect triggered:', { 
      hasPathway: !!selectedPathway, 
      eventsCount: selectedPathway?.events?.length || 0,
      events: selectedPathway?.events || []
    });
    
    if (selectedPathway && selectedPathway.events.length > 0) {
      // Generate timeline structure based on selected pathway duration
      const timelineData = generateTimelineStructure(selectedPathway.duration);
      
      // Distribute events based on their placement information from database
      selectedPathway.events.forEach((event) => {
        // Use placement info if available, otherwise default to Month 1, Week 1
        const eventWithPlacement = event as EventWithPlacement;
        const monthIndex = eventWithPlacement.month_index ? eventWithPlacement.month_index - 1 : 0; // Convert to 0-based indexing
        const weekIndex = eventWithPlacement.week_index ? eventWithPlacement.week_index - 1 : 0;     // Convert to 0-based indexing
        
        if (timelineData[monthIndex] && timelineData[monthIndex].weeks[weekIndex]) {
          timelineData[monthIndex].weeks[weekIndex].events.push({
            id: event.id,
            title: event.title,
            type: event.type,
            duration: `${event.duration} hours`,
            status: 'scheduled'
          });
          console.log(`✅ Event "${event.title}" placed in Month ${monthIndex + 1}, Week ${weekIndex + 1}`);
        } else {
          console.log(`⚠️ Invalid placement for event "${event.title}": Month ${monthIndex + 1}, Week ${weekIndex + 1}`);
        }
      });
      
      console.log('✅ Events distributed to timeline:', timelineData);
      
      // Update the timeline data state
      setTimelineData(timelineData);
    } else {
      console.log('ℹ️ No events to distribute or no pathway selected');
      // Generate empty timeline structure
      const timelineData = selectedPathway ? generateTimelineStructure(selectedPathway.duration) : [];
      setTimelineData(timelineData);
    }
  }, [selectedPathway]);

  const handleAddEvent = (monthIndex: number, weekIndex: number) => {
    if (!selectedPathway) {
      alert('Please select a pathway first');
      return;
    }
    setSelectedWeek({ monthIndex, weekIndex });
    setShowAddEventModal(true);
  };

  const handleSaveEvent = async (eventData: {
    title: FormDataEntryValue | null;
    type: FormDataEntryValue | null;
    duration: FormDataEntryValue | null;
    description: FormDataEntryValue | null;
    location?: FormDataEntryValue | null;
  }) => {
    if (!selectedPathway || !selectedWeek) return;
    
    try {
      const eventType = String(eventData.type || 'workshop');
      const newEvent = {
        title: String(eventData.title || ''),
        description: String(eventData.description || ''),
        type: eventType as "workshop" | "elearning" | "assessment" | "assignment" | "group" | "checkpoint",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        duration: parseInt(String(eventData.duration || '2')) || 2,
        format: 'online' as const, // Default to online format
        objectives: eventData.description ? [String(eventData.description)] : [], // Convert to array
        resources: [],
        dependencies: [],
        // Add location for workshop events
        ...(eventType === 'workshop' && { location: String(eventData.location || 'TBD') })
      };

      // Add placement information to the event
      const eventWithPlacement = {
        ...newEvent,
        month_index: selectedWeek!.monthIndex + 1, // Convert to 1-based indexing
        week_index: selectedWeek!.weekIndex + 1    // Convert to 1-based indexing
      };
      
      await addEvent(selectedPathway.id, eventWithPlacement);
      
      setShowAddEventModal(false);
      setSelectedWeek(null);
      setSelectedEventType('');
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

  const handleRefreshEvents = async () => {
    if (!selectedPathway) return;
    
    try {
      await refreshPathwayEvents(selectedPathway.id);
      console.log('✅ Events refreshed successfully');
    } catch (error) {
      console.error('Error refreshing events:', error);
      alert('Failed to refresh events. Check console for details.');
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
          <button
            onClick={handleRefreshEvents}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Refresh events from database"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh Events</span>
          </button>
        </div>
        
        {/* Debug info */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Timeline Data Length: {timelineData.length}</p>
          <p>Month 1 Week 1 Events: {timelineData[0]?.weeks[0]?.events?.length || 0}</p>
          <p>Selected Pathway Events: {selectedPathway?.events?.length || 0}</p>
          <p>First Event: {selectedPathway?.events[0]?.title || 'None'}</p>
        </div>
        
        {timelineData.map((month, monthIndex) => (
          <div key={monthIndex} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 pb-2 border-b border-slate-200">
              {month.month}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {month.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="bg-slate-50 rounded-lg p-4 min-h-32">
                  <h4 className="font-medium text-slate-700 mb-3">
                    {week.week} 
                    <span className="text-xs text-slate-500 ml-2">({week.events.length} events)</span>
                  </h4>
                  
                  <div className="space-y-2">
                    {week.events.length > 0 ? (
                      week.events.map((event) => {
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
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-medium text-slate-900 leading-tight">
                                    {event.title}
                                  </h5>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}>
                                      {getEventTypeLabel(event.type)}
                                    </span>
                                  </div>
                                </div>
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
                      })
                    ) : (
                      <div className="text-xs text-slate-400 text-center py-2">No events</div>
                    )}
                    
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
                duration: formData.get('duration'),
                description: formData.get('description'),
                location: formData.get('location')
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
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="workshop">{getEventTypeLabel('workshop')}</option>
                    <option value="elearning">{getEventTypeLabel('elearning')}</option>
                    <option value="assessment">{getEventTypeLabel('assessment')}</option>
                    <option value="assignment">{getEventTypeLabel('assignment')}</option>
                    <option value="group">{getEventTypeLabel('group')}</option>
                    <option value="checkpoint">{getEventTypeLabel('checkpoint')}</option>
                  </select>
                </div>
                {selectedEventType === 'workshop' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input
                      name="location"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Conference Room A, Online, TBD"
                    />
                  </div>
                )}
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
                    rows={3}
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
                    setSelectedEventType('');
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