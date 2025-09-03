import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Users, BookOpen, Target, Edit, X } from 'lucide-react';
import { PathwayTimeline } from './pathway/PathwayTimeline';
import { EventLibrary } from './pathway/EventLibrary';
import { PathwaySettings } from './pathway/PathwaySettings';
import { usePathway } from '../contexts/PathwayContext';

export function PathwayBuilder() {
  const { pathways, selectedPathway, setSelectedPathway, createPathway, updatePathway, deletePathway } = usePathway();
  const [showEventLibrary, setShowEventLibrary] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPathway, setEditingPathway] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPathway, setDeletingPathway] = useState<any>(null);

  const handleCreatePathway = () => {
    setShowCreateModal(true);
  };

  const handleEditPathway = (pathway: any) => {
    setEditingPathway(pathway);
    setShowEditModal(true);
  };

  const handleUpdatePathway = async (pathwayData: any) => {
    try {
      console.log('🔍 Updating pathway with data:', pathwayData);
      
      const pathwayPayload = {
        title: pathwayData.title,
        description: pathwayData.description,
        duration: pathwayData.duration,
        total_hours: pathwayData.totalHours,
        status: pathwayData.status,
        cefr_level: editingPathway.cefr_level
      };
      
      console.log('📤 Sending pathway update payload:', pathwayPayload);
      
      await updatePathway(editingPathway.id, pathwayPayload);
      
      console.log('✅ Pathway updated successfully!');
      setShowEditModal(false);
      setEditingPathway(null);
    } catch (error) {
      console.error('❌ Error updating pathway:', error);
      alert('Failed to update pathway. Check console for details.');
    }
  };

  const handleDeletePathway = (pathway: any) => {
    setDeletingPathway(pathway);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePathway = async () => {
    try {
      console.log('🗑️ Deleting pathway:', deletingPathway.id);
      
      await deletePathway(deletingPathway.id);
      
      console.log('✅ Pathway deleted successfully!');
      setShowDeleteConfirm(false);
      setDeletingPathway(null);
    } catch (error) {
      console.error('❌ Error deleting pathway:', error);
      alert('Failed to delete pathway. Check console for details.');
    }
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
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditPathway(pathway)}
                  className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePathway(pathway)}
                  className="text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Delete
                </button>
              </div>
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

      {/* Edit Pathway Modal */}
      {showEditModal && editingPathway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Edit Pathway</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPathway(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleUpdatePathway({
                title: formData.get('title'),
                description: formData.get('description'),
                duration: parseInt(formData.get('duration') as string),
                totalHours: parseInt(formData.get('totalHours') as string),
                status: formData.get('status')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    defaultValue={editingPathway.title}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter pathway title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingPathway.description}
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
                      defaultValue={editingPathway.duration}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Total Hours</label>
                    <input
                      name="totalHours"
                      type="number"
                      min="1"
                      defaultValue={editingPathway.total_hours}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={editingPathway.status}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPathway(null);
                  }}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Pathway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingPathway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Pathway</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "<strong>{deletingPathway.title}</strong>"? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingPathway(null);
                  }}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletePathway}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Pathway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pathway Builder Interface */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-slate-900">Pathway Builder</h3>
              {pathways.length > 0 && (
                <select
                  value={selectedPathway?.id || ''}
                  onChange={(e) => {
                    const pathway = pathways.find(p => p.id === e.target.value);
                    setSelectedPathway(pathway || null);
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a pathway to edit</option>
                  {pathways.map((pathway) => (
                    <option key={pathway.id} value={pathway.id}>
                      {pathway.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
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