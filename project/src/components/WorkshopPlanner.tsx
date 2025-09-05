import React, { useState } from 'react';
import { Clock, Users, MapPin, Plus, Calendar, List } from 'lucide-react';

import { ResourceManager } from './workshop/ResourceManager';
import { WorkshopAgendaManager } from './workshop/WorkshopAgendaManager';
import { ResourceLinker } from './ResourceLinker';
import { useWorkshops } from '../hooks/useWorkshops';

export function WorkshopPlanner() {
  const { workshops, loading, createWorkshop } = useWorkshops();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'agenda' | 'resources'>('overview');

  const handleCreateWorkshop = () => {
    setShowCreateModal(true);
  };

  const handleSaveWorkshop = async (workshopData: any) => {
    try {
      await createWorkshop({
        title: workshopData.title,
        date: workshopData.date,
        duration: workshopData.duration,
        expectedParticipants: parseInt(workshopData.participants) || 0,
        actualParticipants: 0,
        location: workshopData.location,
        status: 'draft'
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create workshop:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Workshop Planner</h2>
          <p className="text-slate-600 mt-1">Plan detailed workshop agendas and manage resources</p>
        </div>
        <button 
          onClick={handleCreateWorkshop}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workshop
        </button>
      </div>

      {/* Workshop Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 leading-tight">{workshop.title}</h3>
                {workshop.pathwayTitle && (
                  <p className="text-xs text-slate-500 mt-1">Part of: {workshop.pathwayTitle}</p>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                workshop.status === 'ready' ? 'bg-green-100 text-green-700' :
                workshop.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {workshop.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                {new Date(workshop.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {workshop.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                {workshop.pathwayParticipantCount || 0} participants
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                {workshop.location}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedWorkshop(workshop);
                  setActiveView('agenda');
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <List className="w-4 h-4 inline mr-1" />
                Agenda
              </button>
              <button 
                onClick={() => {
                  setSelectedWorkshop(workshop);
                  setActiveView('overview');
                }}
                className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Workshop Views */}
      {selectedWorkshop && (
        <div className="bg-white rounded-xl border border-slate-200">
          {/* View Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveView('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView('agenda')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'agenda'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Agenda
              </button>

              <button
                onClick={() => setActiveView('resources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeView === 'resources'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Resources
              </button>
            </nav>
          </div>

          {/* View Content */}
          <div className="p-6">
            {activeView === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedWorkshop.title}</h3>
                  {selectedWorkshop.pathwayTitle && (
                    <p className="text-sm text-slate-500 mt-1">Part of: {selectedWorkshop.pathwayTitle}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {new Date(selectedWorkshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Duration: {selectedWorkshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>Participants: {selectedWorkshop.pathwayParticipantCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>Location: {selectedWorkshop.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedWorkshop.status === 'ready' ? 'bg-green-100 text-green-700' :
                        selectedWorkshop.status === 'planning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {selectedWorkshop.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'agenda' && (
              <WorkshopAgendaManager workshop={selectedWorkshop} />
            )}



            {activeView === 'resources' && selectedWorkshop && (
              <div className="space-y-6">
                <ResourceLinker 
                  targetId={selectedWorkshop.id}
                  targetType="workshop"
                  targetName={selectedWorkshop.title}
                />
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">All Resources</h3>
                  <ResourceManager />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Workshop Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Workshop</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSaveWorkshop({
                title: formData.get('title'),
                date: formData.get('date'),
                duration: formData.get('duration'),
                participants: formData.get('participants'),
                location: formData.get('location')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter workshop title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <input
                    name="duration"
                    type="text"
                    placeholder="e.g., 6 hours"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Participants</label>
                  <input
                    name="participants"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g., Training Center A or Online"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}