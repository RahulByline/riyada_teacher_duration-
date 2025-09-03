import React, { useState } from 'react';
import { Clock, Users, MapPin, Plus, Calendar } from 'lucide-react';
import { WorkshopSchedule } from './workshop/WorkshopSchedule';
import { ResourceManager } from './workshop/ResourceManager';
import { useWorkshops } from '../hooks/useWorkshops';

export function WorkshopPlanner() {
  const { workshops, loading, createWorkshop } = useWorkshops();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
              <h3 className="font-semibold text-slate-900 leading-tight">{workshop.title}</h3>
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
                {workshop.expectedParticipants} participants
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                {workshop.location}
              </div>
            </div>

            <button 
              onClick={() => setSelectedWorkshop(workshop)}
              className="w-full bg-slate-50 text-slate-700 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium"
            >
              Plan Workshop
            </button>
          </div>
        ))}
      </div>

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
      {/* Workshop Planning Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Workshop Schedule {selectedWorkshop && `- ${selectedWorkshop.title}`}
              </h3>
              <p className="text-slate-600 mt-1">
                {selectedWorkshop ? 'Drag and drop to organize your workshop agenda' : 'Select a workshop to plan its schedule'}
              </p>
            </div>
            <WorkshopSchedule selectedWorkshop={selectedWorkshop} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Workshop Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Hours" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  <input type="number" placeholder="Minutes" className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Break Duration</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lunch Break</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  <option>60 minutes</option>
                  <option>45 minutes</option>
                  <option>90 minutes</option>
                </select>
              </div>
            </div>
          </div>

          <ResourceManager />
        </div>
      </div>
    </div>
  );
}