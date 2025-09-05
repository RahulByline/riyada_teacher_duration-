import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Download,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Video,
  Image,
  Link
} from 'lucide-react';
import { mysqlClient } from '../../lib/mysql';

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
  facilitator_name?: string;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  order_index: number;
  materials_needed?: string;
  notes?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: string;
  file_url: string;
  resource_type: string;
  created_at: string;
}

interface ParticipantWorkshopViewProps {
  workshopId: string;
  onBack: () => void;
}

export function ParticipantWorkshopView({ workshopId, onBack }: ParticipantWorkshopViewProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'resources'>('overview');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch workshop details
  const fetchWorkshop = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching workshop:', workshopId);
      
      const response = await mysqlClient.getWorkshop(workshopId);
      console.log('📚 Workshop response:', response);
      
      if (response.workshop) {
        setWorkshop(response.workshop);
      }
    } catch (error) {
      console.error('❌ Error fetching workshop:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch workshop agenda
  const fetchAgenda = async () => {
    try {
      console.log('🔍 Fetching agenda for workshop:', workshopId);
      
      const response = await mysqlClient.getWorkshopAgenda(workshopId);
      console.log('📋 Agenda response:', response);
      
      if (response.agenda) {
        setAgenda(response.agenda);
      }
    } catch (error) {
      console.error('❌ Error fetching agenda:', error);
    }
  };

  // Fetch workshop resources
  const fetchResources = async () => {
    try {
      console.log('🔍 Fetching resources for workshop:', workshopId);
      
      const response = await mysqlClient.getResourcesByWorkshop(workshopId);
      console.log('📁 Resources response:', response);
      
      if (response.resources) {
        setResources(response.resources);
      }
    } catch (error) {
      console.error('❌ Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchWorkshop();
    fetchAgenda();
    fetchResources();
  }, [workshopId]);

  const toggleExpandedItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4 text-red-600" />;
    if (fileType.includes('video')) return <Video className="w-4 h-4 text-blue-600" />;
    if (fileType.includes('image')) return <Image className="w-4 h-4 text-green-600" />;
    return <Link className="w-4 h-4 text-slate-600" />;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Workshop Header */}
      {workshop && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{workshop.title}</h2>
              <p className="text-blue-100 mb-4">{workshop.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(workshop.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {workshop.duration}
                </div>
                {workshop.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {workshop.location}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {workshop.pathwayParticipantCount} participants
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold capitalize">{workshop.status}</div>
              <div className="text-sm text-blue-200">Status</div>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshop Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Date:</span>
              <span className="font-medium">{workshop ? new Date(workshop.date).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duration:</span>
              <span className="font-medium">{workshop?.duration || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Location:</span>
              <span className="font-medium">{workshop?.location || 'TBD'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${
                workshop?.status === 'completed' ? 'bg-green-100 text-green-700' :
                workshop?.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {workshop?.status || 'N/A'}
              </span>
            </div>
            {workshop?.facilitator_name && (
              <div className="flex justify-between">
                <span className="text-slate-600">Facilitator:</span>
                <span className="font-medium">{workshop.facilitator_name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pathway Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Pathway:</span>
              <span className="font-medium">{workshop?.pathway_title || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Participants:</span>
              <span className="font-medium">{workshop?.pathwayParticipantCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Agenda Items:</span>
              <span className="font-medium">{agenda.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Resources:</span>
              <span className="font-medium">{resources.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Join Workshop
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Materials
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );

  const renderAgenda = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshop Agenda</h3>
        {agenda.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No agenda items available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agenda
              .sort((a, b) => a.order_index - b.order_index)
              .map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-lg">
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleExpandedItem(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="text-sm font-medium text-slate-600">
                            {item.start_time} - {item.end_time}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      </div>
                      <span className="text-sm text-slate-500">{item.duration_minutes} min</span>
                    </div>
                  </div>
                  
                  {expandedItems.has(item.id) && (
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <div className="pt-4 space-y-3">
                        {item.description && (
                          <p className="text-slate-600">{item.description}</p>
                        )}
                        {item.materials_needed && (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Materials Needed:</h5>
                            <p className="text-slate-600">{item.materials_needed}</p>
                          </div>
                        )}
                        {item.notes && (
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Notes:</h5>
                            <p className="text-slate-600">{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshop Resources</h3>
        {resources.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Download className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No resources available for this workshop</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  {getFileIcon(resource.file_type)}
                  <div>
                    <p className="font-medium text-slate-900">{resource.title}</p>
                    <p className="text-sm text-slate-600">
                      {resource.file_type} • {resource.file_size}
                    </p>
                    {resource.description && (
                      <p className="text-xs text-slate-500 mt-1">{resource.description}</p>
                    )}
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Workshop Not Found</h3>
        <p className="text-slate-600 mb-4">
          The requested workshop could not be found.
        </p>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Workshops
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Calendar },
            { id: 'agenda', label: 'Agenda', icon: Clock },
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
      {activeTab === 'agenda' && renderAgenda()}
      {activeTab === 'resources' && renderResources()}
    </div>
  );
}
