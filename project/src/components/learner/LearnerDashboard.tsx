import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Download,
  MessageSquare,
  Target,
  Map
} from 'lucide-react';
import { mysqlClient } from '../../lib/mysql';
import { useUser } from '../../contexts/UserContext';

interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_hours: number;
  status: string;
  cefr_level?: string;
  participant_count: number;
  trainer_count: number;
  events: any[];
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
}

interface LearningEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  duration: number;
  month_index: number;
  week_index: number;
  status: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  format: string;
  file_size: string;
  url: string;
  created_at: string;
}

const mockLearnerData = {
  name: 'Sarah Mitchell',
  currentPathway: 'English Teaching Mastery Program',
  overallProgress: 68,
  cefrLevel: 'B2',
  targetLevel: 'C1',
  completedHours: 82,
  totalHours: 120,
  nextEvent: {
    title: 'Advanced Grammar Workshop',
    date: 'Tomorrow, 9:00 AM',
    type: 'workshop',
    duration: '4 hours'
  },
  recentAchievements: [
    { title: 'Grammar Fundamentals Completed', date: '2 days ago', points: 50 },
    { title: 'Assessment Excellence', date: '1 week ago', points: 75 },
    { title: 'Perfect Attendance', date: '2 weeks ago', points: 25 }
  ],
  upcomingEvents: [
    { title: 'Digital Assessment Tools', date: 'March 20', type: 'elearning', status: 'available' },
    { title: 'Classroom Management Quiz', date: 'March 22', type: 'assessment', status: 'locked' },
    { title: 'Peer Review Session', date: 'March 25', type: 'group', status: 'scheduled' }
  ]
};

export function LearnerDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'program-map' | 'progress' | 'schedule' | 'resources'>('overview');
  const [timelineView, setTimelineView] = useState<'infographic' | 'detailed'>('infographic');
  
  // Real data state
  const [assignedPathways, setAssignedPathways] = useState<Pathway[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [pathwayWorkshops, setPathwayWorkshops] = useState<Workshop[]>([]);
  const [pathwayEvents, setPathwayEvents] = useState<LearningEvent[]>([]);
  const [pathwayResources, setPathwayResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assigned pathways for the current user
  const fetchAssignedPathways = async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔍 Fetching assigned pathways for user:', user.id);
      const response = await mysqlClient.getPathwaysByParticipant(user.id);
      console.log('📚 Assigned pathways response:', response);
      
      if (response.pathways) {
        setAssignedPathways(response.pathways);
        // Auto-select the first pathway if available
        if (response.pathways.length > 0 && !selectedPathway) {
          setSelectedPathway(response.pathways[0]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching assigned pathways:', error);
    }
  };

  // Fetch workshops for selected pathway
  const fetchPathwayWorkshops = async (pathwayId: string) => {
    try {
      console.log('🔍 Fetching workshops for pathway:', pathwayId);
      const response = await mysqlClient.getWorkshopsByPathway(pathwayId);
      console.log('📚 Pathway workshops response:', response);
      
      if (response.workshops) {
        const mappedWorkshops = response.workshops.map((workshop: any) => ({
          id: workshop.id,
          title: workshop.title,
          description: workshop.description || '',
          date: workshop.workshop_date || workshop.date,
          duration: workshop.duration_hours || workshop.duration,
          location: workshop.location || '',
          status: workshop.status || 'draft',
          pathway_id: workshop.pathway_id,
          pathway_title: workshop.pathway_title,
        }));
        setPathwayWorkshops(mappedWorkshops);
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

  // Fetch resources for selected pathway
  const fetchPathwayResources = async (pathwayId: string) => {
    try {
      console.log('🔍 Fetching resources for pathway:', pathwayId);
      const response = await mysqlClient.getResourcesByPathway(pathwayId);
      console.log('📁 Pathway resources response:', response);
      
      if (response.resources) {
        setPathwayResources(response.resources);
      }
    } catch (error) {
      console.error('❌ Error fetching pathway resources:', error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchAssignedPathways();
  }, [user?.id]);

  // Load pathway-specific data when pathway is selected
  useEffect(() => {
    if (selectedPathway) {
      fetchPathwayWorkshops(selectedPathway.id);
      fetchPathwayEvents(selectedPathway.id);
      fetchPathwayResources(selectedPathway.id);
      setLoading(false);
    }
  }, [selectedPathway]);

  // Calculate progress and stats from real data
  const calculateProgress = () => {
    if (!selectedPathway) return { overallProgress: 0, completedHours: 0, totalHours: 0 };
    
    // Simple progress calculation - can be enhanced with actual completion tracking
    const totalEvents = pathwayEvents.length;
    const completedEvents = pathwayEvents.filter(event => event.status === 'completed').length;
    const overallProgress = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
    
    const completedHours = Math.round((overallProgress / 100) * selectedPathway.total_hours);
    
    return {
      overallProgress,
      completedHours,
      totalHours: selectedPathway.total_hours
    };
  };

  const getNextEvent = () => {
    if (pathwayEvents.length === 0) return null;
    
    const upcomingEvents = pathwayEvents
      .filter(event => new Date(event.start_date) > new Date())
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
    return upcomingEvents[0] || null;
  };

  const progress = calculateProgress();
  const nextEvent = getNextEvent();

  // Event type configuration for timeline
  const eventTypeConfig = {
    workshop: { icon: Calendar, color: 'blue', label: 'Workshop' },
    elearning: { icon: BookOpen, color: 'green', label: 'eLearning' },
    assessment: { icon: CheckCircle, color: 'purple', label: 'Assessment' },
    group: { icon: MessageSquare, color: 'orange', label: 'Group Work' },
    assignment: { icon: Target, color: 'red', label: 'Assignment' },
    default: { icon: Clock, color: 'gray', label: 'Event' }
  };

  const getEventTypeLabel = (type: string) => {
    return eventTypeConfig[type as keyof typeof eventTypeConfig]?.label || eventTypeConfig.default.label;
  };

  const statusConfig = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-700'
  };

  const renderTimelineView = () => {
    if (!selectedPathway) {
      return (
        <div className="text-center py-12">
          <Map className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pathway Selected</h3>
          <p className="text-slate-600">Please select a pathway to view the timeline.</p>
        </div>
      );
    }

    // Sort all events chronologically by start_date
    const sortedEvents = [...pathwayEvents].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    return (
      <div className="space-y-8">
        {/* Pathway Overview */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{selectedPathway.title}</h3>
              <p className="text-slate-600">{selectedPathway.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progress.overallProgress}%</div>
              <div className="text-sm text-slate-600">Complete</div>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Events Scheduled</h3>
              <p className="text-slate-600">No learning events have been scheduled for this pathway yet.</p>
            </div>
          ) : (
            <div className="relative max-w-4xl mx-auto">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-slate-300 h-full rounded-full"></div>
              
              {/* Timeline Events */}
              <div className="space-y-12">
                {sortedEvents.map((event, index) => {
                  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig] || eventTypeConfig.default;
                  const Icon = config.icon;
                  const isLeft = index % 2 === 0;
                  const eventDate = new Date(event.start_date);
                  const monthName = eventDate.toLocaleDateString('en-US', { month: 'long' });
                  const year = eventDate.getFullYear();
                  
                  return (
                    <div key={event.id} className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                      {/* Timeline Node */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                      
                      {/* Event Card */}
                      <div className={`w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                          {/* Event Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg bg-${config.color}-100 flex-shrink-0`}>
                              <Icon className={`w-6 h-6 text-${config.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-slate-900 mb-1">{event.title}</h4>
                              <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                            </div>
                          </div>
                          
                          {/* Event Details */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{eventDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{event.duration} hours</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-700`}>
                                {getEventTypeLabel(event.type)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[event.status as keyof typeof statusConfig]}`}>
                                {event.status}
                              </span>
                            </div>
                          </div>
                          
                          {/* Month/Year Badge */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="font-medium">{monthName} {year}</span>
                              <span>•</span>
                              <span>Month {event.month_index || 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Timeline Start/End Markers */}
              {sortedEvents.length > 0 && (
                <>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-6 h-6 bg-slate-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!selectedPathway) {
      return (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pathway Selected</h3>
          <p className="text-slate-600">Please select a pathway to view the detailed overview.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Pathway Details */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pathway Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Duration</h4>
              <p className="text-slate-600">{selectedPathway.duration} months</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Total Hours</h4>
              <p className="text-slate-600">{selectedPathway.total_hours} hours</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">CEFR Level</h4>
              <p className="text-slate-600">{selectedPathway.cefr_level || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Events Summary */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Events Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(
              pathwayEvents.reduce((acc, event) => {
                acc[event.type] = (acc[event.type] || 0) + 1;
                return acc;
              }, {} as { [key: string]: number })
            ).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <div className="text-sm text-slate-600 capitalize">{getEventTypeLabel(type)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshops */}
        {pathwayWorkshops.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshops</h3>
            <div className="space-y-3">
              {pathwayWorkshops.map((workshop) => (
                <div key={workshop.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">{workshop.title}</h4>
                    <p className="text-sm text-slate-600">
                      {new Date(workshop.date).toLocaleDateString()} • {workshop.duration} hours • {workshop.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[workshop.status as keyof typeof statusConfig]}`}>
                    {workshop.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Learner'}!</h2>
            <p className="text-blue-100">
              {selectedPathway 
                ? `Continue your learning journey in ${selectedPathway.title}` 
                : 'Select a pathway to begin your learning journey'
              }
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{progress.overallProgress}%</div>
            <div className="text-sm text-blue-200">Complete</div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">CEFR Level</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{selectedPathway?.cefr_level || 'N/A'}</p>
          <p className="text-sm text-slate-600">Current Level</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Hours Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{progress.completedHours}</p>
          <p className="text-sm text-slate-600">of {progress.totalHours} total</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Events Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {pathwayEvents.filter(event => event.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-600">of {pathwayEvents.length} total</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Next Event</h3>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {nextEvent ? nextEvent.title : 'No upcoming events'}
          </p>
          <p className="text-sm text-slate-600">
            {nextEvent ? new Date(nextEvent.start_date).toLocaleDateString() : 'All caught up!'}
          </p>
        </div>
      </div>

      {/* Next Event Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Up Next</h3>
        {nextEvent ? (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{nextEvent.title}</h4>
                <p className="text-sm text-slate-600">
                  {new Date(nextEvent.start_date).toLocaleDateString()} • {nextEvent.duration} hours
                </p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Join Event
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No upcoming events scheduled</p>
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {mockLearnerData.recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{achievement.title}</p>
                  <p className="text-sm text-slate-600">{achievement.date}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-yellow-600">+{achievement.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgramMap = () => (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Program Map</h2>
          <p className="text-slate-600">Your complete learning journey visualization</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setTimelineView('infographic')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timelineView === 'infographic' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setTimelineView('detailed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timelineView === 'detailed' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed View
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {timelineView === 'infographic' ? renderTimelineView() : renderDetailedView()}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Overall Completion</span>
            <span className="font-bold text-slate-900">{mockLearnerData.overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${mockLearnerData.overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Skill Development</h3>
        <div className="space-y-4">
          {[
            { skill: 'Grammar Teaching', progress: 85, level: 'Advanced' },
            { skill: 'Classroom Management', progress: 72, level: 'Intermediate' },
            { skill: 'Assessment Design', progress: 90, level: 'Advanced' },
            { skill: 'Technology Integration', progress: 45, level: 'Beginner' }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.level === 'Advanced' ? 'bg-green-100 text-green-700' :
                    item.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.level}
                  </span>
                  <span className="font-bold text-slate-900">{item.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.level === 'Advanced' ? 'bg-green-500' :
                    item.level === 'Intermediate' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CEFR Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">CEFR Level Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">B1</div>
            <div className="text-sm text-slate-600">Starting Level</div>
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">B2</div>
            <div className="text-sm text-slate-600">Current Level</div>
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-slate-300 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">C1</div>
            <div className="text-sm text-slate-600">Target Level</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Learning Events</h3>
        <div className="space-y-4">
          {mockLearnerData.upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  event.type === 'workshop' ? 'bg-blue-100' :
                  event.type === 'elearning' ? 'bg-green-100' :
                  event.type === 'assessment' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {event.type === 'workshop' && <Calendar className="w-5 h-5 text-blue-600" />}
                  {event.type === 'elearning' && <BookOpen className="w-5 h-5 text-green-600" />}
                  {event.type === 'assessment' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                  {event.type === 'group' && <MessageSquare className="w-5 h-5 text-orange-600" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  event.status === 'available' ? 'bg-green-100 text-green-700' :
                  event.status === 'locked' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {event.status}
                </span>
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    event.status === 'available' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={event.status !== 'available'}
                >
                  {event.status === 'available' ? 'Start' : 'Locked'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Resources</h3>
        {pathwayResources.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Download className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No resources available for this pathway</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathwayResources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{resource.title}</p>
                    <p className="text-sm text-slate-600">{resource.type} • {resource.file_size}</p>
                    {resource.description && (
                      <p className="text-xs text-slate-500 mt-1">{resource.description}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `${import.meta.env.VITE_API_URL}/resources/${resource.id}/download`;
                    link.download = `${resource.title}.${resource.format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">My Certificates</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Grammar Fundamentals Certificate</p>
                <p className="text-sm text-slate-600">Issued: March 10, 2024</p>
              </div>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (assignedPathways.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pathways Assigned</h3>
        <p className="text-slate-600">You haven't been assigned to any learning pathways yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pathway Selector */}
      {assignedPathways.length > 1 && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Current Pathway:</label>
            <select
              value={selectedPathway?.id || ''}
              onChange={(e) => {
                const pathway = assignedPathways.find(p => p.id === e.target.value);
                if (pathway) {
                  setSelectedPathway(pathway);
                }
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {assignedPathways.map((pathway) => (
                <option key={pathway.id} value={pathway.id}>
                  {pathway.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'program-map', label: 'Program Map', icon: Map },
            { id: 'progress', label: 'My Progress', icon: TrendingUp },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
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
      {activeTab === 'program-map' && renderProgramMap()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'resources' && renderResources()}
    </div>
  );
}