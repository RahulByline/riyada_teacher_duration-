import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  CheckCircle,
  Download,
  MapPin,
  Award
} from 'lucide-react';
import { mysqlClient } from '../../lib/mysql';
import { useUser } from '../../contexts/UserContext';
import { ParticipantWorkshopView } from './ParticipantWorkshopView';

// Event type configuration matching the parent admin interface
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

interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_hours: number;
  status: string;
  cefr_level: string;
  created_at: string;
  participant_count: number;
  trainer_count: number;
}

interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  status: string;
  pathway_id: string;
  pathway_title: string;
  pathwayParticipantCount: number;
}

interface LearningEvent {
  id: string;
  title: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: string;
  pathway_id: string;
  month_index: number;
  week_index: number;
}

export function ParticipantPathwayView() {
  const { user } = useUser();
  const [assignedPathways, setAssignedPathways] = useState<Pathway[]>([]);
  const [pathwayWorkshops, setPathwayWorkshops] = useState<Workshop[]>([]);
  const [pathwayEvents, setPathwayEvents] = useState<LearningEvent[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'workshops' | 'timeline' | 'resources'>('overview');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // Fetch participant's assigned pathways
  const fetchAssignedPathways = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log('🔍 Fetching pathways for participant:', user.id);
      
      // Get all pathways where this user is a participant
      const response = await mysqlClient.getPathwaysByParticipant(user.id);
      console.log('📋 Assigned pathways response:', response);
      
      if (response.pathways) {
        setAssignedPathways(response.pathways);
        if (response.pathways.length > 0) {
          setSelectedPathway(response.pathways[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching assigned pathways:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch workshops for selected pathway
  const fetchPathwayWorkshops = async (pathwayId: string) => {
    try {
      console.log('🔍 Fetching workshops for pathway:', pathwayId);
      const response = await mysqlClient.getWorkshopsByPathway(pathwayId);
      console.log('📚 Pathway workshops response:', response);
      
      if (response.workshops) {
        setPathwayWorkshops(response.workshops);
      }
    } catch (error) {
      console.error('❌ Error fetching pathway workshops:', error);
    }
  };

  // Fetch learning events for selected pathway
  const fetchPathwayEvents = async (pathwayId: string) => {
    try {
      console.log('🔍 Fetching events for pathway:', pathwayId);
      const response = await mysqlClient.getLearningEventsByPathway(pathwayId);
      console.log('📅 Pathway events response:', response);
      
      if (response.events) {
        setPathwayEvents(response.events);
      }
    } catch (error) {
      console.error('❌ Error fetching pathway events:', error);
    }
  };

  useEffect(() => {
    fetchAssignedPathways();
  }, [user?.id]);

  useEffect(() => {
    if (selectedPathway) {
      fetchPathwayWorkshops(selectedPathway.id);
      fetchPathwayEvents(selectedPathway.id);
    }
  }, [selectedPathway]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Pathway Overview */}
      {selectedPathway && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedPathway.title}</h2>
              <p className="text-blue-100 mb-4">{selectedPathway.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedPathway.duration} months
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {selectedPathway.total_hours} hours
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {selectedPathway.participant_count} participants
                </div>
                {selectedPathway.cefr_level && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    CEFR {selectedPathway.cefr_level}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">68%</div>
              <div className="text-sm text-blue-200">Complete</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Workshops</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pathwayWorkshops.length}</p>
          <p className="text-sm text-slate-600">Total workshops</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Learning Events</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pathwayEvents.length}</p>
          <p className="text-sm text-slate-600">Total events</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {pathwayEvents.filter(e => e.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-600">Events completed</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Upcoming</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {pathwayEvents.filter(e => e.status === 'scheduled' || e.status === 'available').length}
          </p>
          <p className="text-sm text-slate-600">Scheduled events</p>
        </div>
      </div>

      {/* Next Learning Event */}
      {pathwayEvents.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Learning Event</h3>
          {(() => {
            const nextEvent = pathwayEvents
              .filter(e => e.status === 'scheduled' || e.status === 'available')
              .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
            
            if (!nextEvent) {
              return (
                <div className="text-center py-8 text-slate-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No upcoming events scheduled</p>
                </div>
              );
            }


            return (
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    nextEvent.status === 'available' 
                      ? 'bg-green-100' 
                      : 'bg-slate-100'
                  }`}>
                    {(() => {
                      const config = eventTypeConfig[nextEvent.type as keyof typeof eventTypeConfig];
                      const Icon = config.icon;
                      return <Icon className={`w-6 h-6 text-${config.color}-600`} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{nextEvent.title}</h4>
                    <p className="text-sm text-slate-600">
                      {new Date(nextEvent.start_date).toLocaleDateString()} • {nextEvent.duration} hours
                    </p>
                    <p className="text-sm text-slate-500">{getEventTypeLabel(nextEvent.type)}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {nextEvent.status === 'available' ? 'Start' : 'View Details'}
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderWorkshops = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshop Schedule</h3>
        {pathwayWorkshops.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No workshops scheduled for this pathway</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pathwayWorkshops.map((workshop) => (
              <div key={workshop.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    workshop.status === 'completed' ? 'bg-green-100' :
                    workshop.status === 'in-progress' ? 'bg-blue-100' :
                    'bg-slate-100'
                  }`}>
                    <Calendar className={`w-5 h-5 ${
                      workshop.status === 'completed' ? 'text-green-600' :
                      workshop.status === 'in-progress' ? 'text-blue-600' :
                      'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{workshop.title}</h4>
                    <p className="text-sm text-slate-600">
                      {new Date(workshop.date).toLocaleDateString()} • {workshop.duration}
                    </p>
                    {workshop.location && (
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {workshop.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    workshop.status === 'completed' ? 'bg-green-100 text-green-700' :
                    workshop.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {workshop.status}
                  </span>
                  <button 
                    onClick={() => setSelectedWorkshop(workshop)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTimeline = () => {
    console.log('🔍 Rendering timeline with events:', pathwayEvents);

    // Group events by month and week for timeline view
    const groupedEvents = pathwayEvents.reduce((acc, event) => {
      // Use the month_index and week_index that are already stored in the database
      const month = event.month_index || 1;
      const week = event.week_index || 1;
      
      console.log(`📅 Event "${event.title}" - Start Date: ${event.start_date}, Month Index: ${month}, Week Index: ${week}`);
      
      if (!acc[month]) acc[month] = {};
      if (!acc[month][week]) acc[month][week] = [];
      
      acc[month][week].push(event);
      return acc;
    }, {} as Record<number, Record<number, LearningEvent[]>>);

    console.log('📊 Grouped events:', groupedEvents);


    // If no events, show simple list view
    if (pathwayEvents.length === 0) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Learning Timeline</h3>
              <div className="text-sm text-slate-600">
                {selectedPathway && `${selectedPathway.duration} months • ${selectedPathway.total_hours} hours`}
              </div>
            </div>
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No learning events scheduled</p>
            </div>
          </div>
        </div>
      );
    }

    // If we have events but no proper grouping, show simple list
    if (Object.keys(groupedEvents).length === 0) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Learning Timeline</h3>
              <div className="text-sm text-slate-600">
                {selectedPathway && `${selectedPathway.duration} months • ${selectedPathway.total_hours} hours`}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">All Learning Events ({pathwayEvents.length})</h4>
              {pathwayEvents.map((event) => {
                const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                const Icon = config.icon;
                
                return (
                  <div key={event.id} className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded bg-${config.color}-100`}>
                        <Icon className={`w-4 h-4 text-${config.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium text-slate-900">{event.title}</h6>
                        <p className="text-sm text-slate-600">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>{new Date(event.start_date).toLocaleDateString()}</span>
                          <span>{event.duration} hours</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}>
                            {getEventTypeLabel(event.type)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[event.status as keyof typeof statusConfig]}`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Learning Timeline</h3>
            <div className="text-sm text-slate-600">
              {selectedPathway && `${selectedPathway.duration} months • ${selectedPathway.total_hours} hours`}
            </div>
          </div>
          
          <div className="space-y-8">
            {Object.keys(groupedEvents)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map(monthNum => {
                const month = parseInt(monthNum);
                const monthEvents = groupedEvents[month];
                const totalEvents = Object.values(monthEvents).flat().length;
                
                return (
                  <div key={month} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-slate-900">Month {month}</h4>
                      <span className="text-sm text-slate-500">({totalEvents} events)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(week => {
                        const weekEvents = monthEvents[week] || [];
                        
                        return (
                          <div key={week} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-slate-900">Week {week}</h5>
                              <span className="text-xs text-slate-500">({weekEvents.length} events)</span>
                            </div>
                            
                            {weekEvents.length === 0 ? (
                              <div className="text-center py-4 text-slate-400">
                                <p className="text-sm">No events</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {weekEvents.map((event) => {
                                  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                                  const Icon = config.icon;
                                  
                                  return (
                                    <div
                                      key={event.id}
                                      className="bg-white p-3 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
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
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600">{event.duration} hours</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[event.status as keyof typeof statusConfig]}`}>
                                          {event.status}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pathway Resources</h3>
        <div className="text-center py-8 text-slate-500">
          <Download className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>Resources will be available here once linked to the pathway</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your pathways...</p>
        </div>
      </div>
    );
  }

  if (assignedPathways.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pathways Assigned</h3>
        <p className="text-slate-600 mb-4">
          You haven't been assigned to any learning pathways yet.
        </p>
        <p className="text-sm text-slate-500">
          Contact your administrator to get enrolled in a pathway.
        </p>
      </div>
    );
  }

  // If a workshop is selected, show the workshop view
  if (selectedWorkshop) {
    return (
      <ParticipantWorkshopView 
        workshopId={selectedWorkshop.id}
        onBack={() => setSelectedWorkshop(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Pathway Selector */}
      {assignedPathways.length > 1 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Pathway</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedPathways.map((pathway) => (
              <button
                key={pathway.id}
                onClick={() => setSelectedPathway(pathway)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPathway?.id === pathway.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <h4 className="font-semibold text-slate-900 mb-2">{pathway.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{pathway.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{pathway.duration} months</span>
                  <span>{pathway.total_hours} hours</span>
                  <span className="capitalize">{pathway.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'workshops', label: 'Workshops', icon: Calendar },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'resources', label: 'Resources', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'workshops' && renderWorkshops()}
      {activeTab === 'timeline' && renderTimeline()}
      {activeTab === 'resources' && renderResources()}
    </div>
  );
}
