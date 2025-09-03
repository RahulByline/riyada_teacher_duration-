import React, { useState } from 'react';
import { Plus, Calendar, Clock, Users, BookOpen, Target } from 'lucide-react';
import { PathwayTimeline } from './pathway/PathwayTimeline';
import { EventLibrary } from './pathway/EventLibrary';
import { PathwaySettings } from './pathway/PathwaySettings';
import { usePathway } from '../contexts/PathwayContext';

export function PathwayBuilder() {
  const { pathways, selectedPathway, setSelectedPathway, createPathway } = usePathway();
  const [showEventLibrary, setShowEventLibrary] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePathway = () => {
    setShowCreateModal(true);
  };

  const handleSavePathway = async (pathwayData: any) => {
    try {
      console.log('🔍 Creating pathway with data:', pathwayData);
      
      const pathwayPayload = {
        title: pathwayData.title || 'New Pathway',
        description: pathwayData.description || 'Description',
        duration: pathwayData.duration || 6,
        total_hours: pathwayData.totalHours || 120,
        events: [],
        participants: [],
        status: 'draft' as const
      };
      
      console.log('📤 Sending pathway payload:', pathwayPayload);
      
      await createPathway(pathwayPayload);
      
      console.log('✅ Pathway created successfully!');
      setShowCreateModal(false);
    } catch (error) {
      console.error('❌ Error creating pathway:', error);
      alert('Failed to create pathway. Check console for details.');
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Learning Pathways</h2>
          <p className="text-slate-600 mt-1">Design and manage comprehensive teacher training programs</p>
        </div>
        <button 
          onClick={handleCreatePathway}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Pathway
        </button>
      </div>

      {/* Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pathways.map((pathway) => (
          <div key={pathway.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{pathway.title}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                pathway.status === 'active' ? 'bg-green-100 text-green-700' :
                pathway.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {pathway.status}
              </span>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              {pathway.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                {pathway.duration} months
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                {pathway.participants.length} participants
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Target className="w-4 h-4" />
                {pathway.events.length} events
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {pathway.total_hours} hours
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: '68%'}}></div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">68% Complete</span>
              <button 
                onClick={() => setSelectedPathway(pathway)}
                className="text-blue-600 font-medium hover:text-blue-700"
              >
                Edit Pathway
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Pathway Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Pathway</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSavePathway({
                title: formData.get('title'),
                description: formData.get('description'),
                duration: parseInt(formData.get('duration') as string),
                totalHours: parseInt(formData.get('totalHours') as string)
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
                    placeholder="Enter pathway title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter pathway description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration (months)</label>
                    <input
                      name="duration"
                      type="number"
                      min="1"
                      max="12"
                      defaultValue="6"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Total Hours</label>
                    <input
                      name="totalHours"
                      type="number"
                      min="1"
                      defaultValue="120"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
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
                  Create Pathway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pathway Builder Interface */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Pathway Builder</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowEventLibrary(!showEventLibrary)}
                className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Event Library
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className={`flex-1 ${showEventLibrary ? 'border-r border-slate-200' : ''}`}>
            <PathwayTimeline />
          </div>
          
          {showEventLibrary && (
            <div className="w-80">
              <EventLibrary />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}