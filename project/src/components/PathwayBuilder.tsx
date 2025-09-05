import { useState } from 'react';
import { Plus, Calendar, Clock, Users, BookOpen, Target, Edit, X } from 'lucide-react';
import { PathwayTimeline } from './pathway/PathwayTimeline';
import { EventLibrary } from './pathway/EventLibrary';
import { usePathway } from '../contexts/PathwayContext';
import { mysqlClient } from '../lib/mysql';

export function PathwayBuilder() {
  const { pathways, selectedPathway, setSelectedPathway, createPathway, updatePathway, deletePathway } = usePathway();
  const [showEventLibrary, setShowEventLibrary] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPathway, setEditingPathway] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPathway, setDeletingPathway] = useState<any>(null);
  
  // Teacher, trainer, and participant management
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [availableTrainers, setAvailableTrainers] = useState<any[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [selectedTrainers, setSelectedTrainers] = useState<{id: string, role: string}[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isCreatingPathway, setIsCreatingPathway] = useState(false);
  const [submissionId, setSubmissionId] = useState(0);
  
  // Edit modal state
  const [editSelectedParticipants, setEditSelectedParticipants] = useState<string[]>([]);
  const [editSelectedTrainers, setEditSelectedTrainers] = useState<{id: string, role: string}[]>([]);

  // Fetch available teachers, trainers, and participants
  const fetchAvailableUsers = async () => {
    try {
      setLoadingUsers(true);
      const [teachersResponse, trainersResponse, participantsResponse] = await Promise.all([
        mysqlClient.getUsersByRole('teacher'),
        mysqlClient.getUsersByRole('trainer'),
        mysqlClient.getUsersByRole('participant')
      ]);
      
      console.log('👥 Fetched teachers:', teachersResponse.users);
      console.log('👨‍💼 Fetched trainers:', trainersResponse.users);
      console.log('👤 Fetched participants:', participantsResponse.users);
      
      setAvailableTeachers(teachersResponse.users || []);
      setAvailableTrainers(trainersResponse.users || []);
      setAvailableParticipants(participantsResponse.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreatePathway = () => {
    setSelectedParticipants([]);
    setSelectedTrainers([]);
    fetchAvailableUsers();
    setShowCreateModal(true);
  };

  // Helper functions for managing selections
  const toggleParticipant = (teacherId: string) => {
    setSelectedParticipants(prev => {
      const newSelection = prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId];
      console.log('🔄 Updated participants:', newSelection);
      return newSelection;
    });
  };

  const toggleTrainer = (trainerId: string, role: string = 'assistant_trainer') => {
    setSelectedTrainers(prev => {
      const existing = prev.find(t => t.id === trainerId);
      const newSelection = existing
        ? prev.filter(t => t.id !== trainerId)
        : [...prev, { id: trainerId, role }];
      console.log('🔄 Updated trainers:', newSelection);
      return newSelection;
    });
  };

  const updateTrainerRole = (trainerId: string, newRole: string) => {
    setSelectedTrainers(prev => 
      prev.map(t => t.id === trainerId ? { ...t, role: newRole } : t)
    );
  };

  // Helper functions for edit modal
  const toggleEditParticipant = (teacherId: string) => {
    setEditSelectedParticipants(prev => {
      const newSelection = prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId];
      console.log('🔄 Updated edit participants:', newSelection);
      return newSelection;
    });
  };

  const toggleEditTrainer = (trainerId: string, role: string = 'assistant_trainer') => {
    setEditSelectedTrainers(prev => {
      const existing = prev.find(t => t.id === trainerId);
      const newSelection = existing
        ? prev.filter(t => t.id !== trainerId)
        : [...prev, { id: trainerId, role }];
      console.log('🔄 Updated edit trainers:', newSelection);
      return newSelection;
    });
  };

  const updateEditTrainerRole = (trainerId: string, newRole: string) => {
    setEditSelectedTrainers(prev => 
      prev.map(t => t.id === trainerId ? { ...t, role: newRole } : t)
    );
  };

  const handleEditPathway = async (pathway: any) => {
    setEditingPathway(pathway);
    
    // Fetch current participants and trainers for this pathway
    try {
      const [participantsResponse, trainersResponse] = await Promise.all([
        mysqlClient.getPathwayParticipants(pathway.id),
        mysqlClient.getPathwayTrainers(pathway.id)
      ]);
      
      // Set current participants
      const currentParticipants = participantsResponse.participants?.map((p: any) => p.teacher_id) || [];
      setEditSelectedParticipants(currentParticipants);
      
      // Set current trainers
      const currentTrainers = trainersResponse.trainers?.map((t: any) => ({ id: t.trainer_id, role: t.role })) || [];
      setEditSelectedTrainers(currentTrainers);
      
      console.log('📋 Current participants:', currentParticipants);
      console.log('👨‍💼 Current trainers:', currentTrainers);
    } catch (error) {
      console.error('Error fetching pathway assignments:', error);
      setEditSelectedParticipants([]);
      setEditSelectedTrainers([]);
    }
    
    // Fetch available users
    fetchAvailableUsers();
    setShowEditModal(true);
  };

  const handleUpdatePathway = async (pathwayData: any) => {
    try {
      console.log('🔍 Updating pathway with data:', pathwayData);
      console.log('👥 Edit selected participants:', editSelectedParticipants);
      console.log('👨‍💼 Edit selected trainers:', editSelectedTrainers);
      
      const pathwayPayload = {
        title: pathwayData.title,
        description: pathwayData.description,
        duration: pathwayData.duration,
        total_hours: pathwayData.totalHours,
        status: pathwayData.status,
        cefr_level: editingPathway.cefr_level,
        participants: editSelectedParticipants,
        trainers: editSelectedTrainers
      };
      
      console.log('📤 Sending pathway update payload:', pathwayPayload);
      
      await updatePathway(editingPathway.id, pathwayPayload);
      
      console.log('✅ Pathway updated successfully!');
      setShowEditModal(false);
      setEditingPathway(null);
      setEditSelectedParticipants([]);
      setEditSelectedTrainers([]);
      
      // Refresh pathways data to show updated participant counts
      console.log('🔄 Refreshing pathways data...');
      // The updatePathway function in PathwayContext should already handle this,
      // but let's make sure by calling refetch if needed
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
    console.log(`🎯 handleSavePathway called #${submissionId} with data:`, pathwayData);
    console.log('🎯 Current isCreatingPathway state:', isCreatingPathway);
    
    // Prevent duplicate submissions (React StrictMode in development)
    if (isCreatingPathway) {
      console.log('⚠️ Pathway creation already in progress, skipping duplicate call');
      return;
    }

    try {
      setIsCreatingPathway(true);
      const timestamp = new Date().toISOString();
      console.log(`🔍 Creating pathway #${submissionId} at ${timestamp} with data:`, pathwayData);
      console.log('👥 Selected participants:', pathwayData.participants);
      console.log('👨‍💼 Selected trainers:', pathwayData.trainers);
      
      const pathwayPayload = {
        title: pathwayData.title || 'New Pathway',
        description: pathwayData.description || 'Description',
        duration: pathwayData.duration || 6,
        total_hours: pathwayData.totalHours || 120,
        cefr_level: pathwayData.cefrLevel || null,
        created_by: 'admin-user-id', // TODO: Get from auth context
        participants: pathwayData.participants || [],
        trainers: pathwayData.trainers || [],
        status: 'draft' as const
      };
      
      console.log('📤 Sending pathway payload:', pathwayPayload);
      
      await createPathway(pathwayPayload);
      
      console.log('✅ Pathway created successfully!');
      setShowCreateModal(false);
      setSelectedParticipants([]);
      setSelectedTrainers([]);
    } catch (error) {
      console.error('❌ Error creating pathway:', error);
      alert('Failed to create pathway. Check console for details.');
    } finally {
      setIsCreatingPathway(false);
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
                {pathway.participant_count || 0} users
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
            
            {pathway.trainer_count? (pathway.trainer_count && pathway.trainer_count > 0) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  {pathway.trainer_count} trainers assigned
                </div>
              </div>
            ) : null}
            

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
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Pathway</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const currentSubmissionId = submissionId + 1;
              setSubmissionId(currentSubmissionId);
              
              console.log(`🚀 FORM SUBMIT EVENT TRIGGERED #${currentSubmissionId}`);
              const formData = new FormData(e.target as HTMLFormElement);
              console.log(`📝 Form submission #${currentSubmissionId} - selectedParticipants:`, selectedParticipants);
              console.log(`📝 Form submission #${currentSubmissionId} - selectedTrainers:`, selectedTrainers);
              console.log(`📝 Form data #${currentSubmissionId} - title:`, formData.get('title'));
              console.log(`📝 Form data #${currentSubmissionId} - description:`, formData.get('description'));
              console.log(`📝 Form data #${currentSubmissionId} - duration:`, formData.get('duration'));
              console.log(`📝 Form data #${currentSubmissionId} - totalHours:`, formData.get('totalHours'));
              console.log(`📝 Form data #${currentSubmissionId} - cefrLevel:`, formData.get('cefrLevel'));
              
              const pathwayData = {
                title: formData.get('title'),
                description: formData.get('description'),
                duration: parseInt(formData.get('duration') as string),
                totalHours: parseInt(formData.get('totalHours') as string),
                cefrLevel: formData.get('cefrLevel'),
                participants: selectedParticipants,
                trainers: selectedTrainers
              };
              
              console.log(`📤 Calling handleSavePathway #${currentSubmissionId} with data:`, pathwayData);
              handleSavePathway(pathwayData);
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">Duration (months) *</label>
                      <input
                        name="duration"
                        type="number"
                        min="1"
                        max="12"
                        defaultValue="6"
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Hours *</label>
                      <input
                        name="totalHours"
                        type="number"
                        min="1"
                        defaultValue="120"
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CEFR Level</label>
                    <select
                      name="cefrLevel"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select CEFR Level</option>
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                      <option value="C2">C2 - Proficient</option>
                    </select>
                  </div>
                </div>

                {/* User Assignment */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">Assign Users to Pathway</h4>
                  
                  {/* Participants (Teachers + Participants) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Participants 
                      <span className="text-xs text-slate-500 ml-1">({selectedParticipants.length} selected)</span>
                    </label>
                    <div className="border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                      {loadingUsers ? (
                        <div className="p-3 text-center text-slate-500">Loading users...</div>
                      ) : (availableTeachers.length === 0 && availableParticipants.length === 0) ? (
                        <div className="p-3 text-center text-slate-500">No users available. Create teachers or participants first.</div>
                      ) : (
                        <>
                          {/* Teachers */}
                          {availableTeachers.map((teacher) => (
                            <div key={teacher.id} className="flex items-center p-2 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                id={`teacher-${teacher.id}`}
                                checked={selectedParticipants.includes(teacher.id)}
                                onChange={() => toggleParticipant(teacher.id)}
                                className="mr-3"
                              />
                              <label htmlFor={`teacher-${teacher.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-sm">{teacher.name}</div>
                                <div className="text-xs text-slate-500">{teacher.email} • Teacher</div>
                              </label>
                            </div>
                          ))}
                          
                          {/* Participants */}
                          {availableParticipants.map((participant) => (
                            <div key={participant.id} className="flex items-center p-2 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                id={`participant-${participant.id}`}
                                checked={selectedParticipants.includes(participant.id)}
                                onChange={() => toggleParticipant(participant.id)}
                                className="mr-3"
                              />
                              <label htmlFor={`participant-${participant.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-sm">{participant.name}</div>
                                <div className="text-xs text-slate-500">{participant.email} • Participant</div>
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trainers */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Trainers 
                      <span className="text-xs text-slate-500 ml-1">({selectedTrainers.length} selected)</span>
                    </label>
                    <div className="border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                      {loadingUsers ? (
                        <div className="p-3 text-center text-slate-500">Loading trainers...</div>
                      ) : availableTrainers.length === 0 ? (
                        <div className="p-3 text-center text-slate-500">No trainers available. Create trainers first.</div>
                      ) : (
                        availableTrainers.map((trainer) => {
                          const isSelected = selectedTrainers.find(t => t.id === trainer.id);
                          return (
                            <div key={trainer.id} className="p-2 hover:bg-slate-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`trainer-${trainer.id}`}
                                  checked={!!isSelected}
                                  onChange={() => toggleTrainer(trainer.id)}
                                  className="mr-3"
                                />
                                <label htmlFor={`trainer-${trainer.id}`} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-sm">{trainer.name}</div>
                                  <div className="text-xs text-slate-500">{trainer.email}</div>
                                </label>
                              </div>
                              {isSelected && (
                                <div className="ml-6 mt-2">
                                  <select
                                    value={isSelected.role}
                                    onChange={(e) => updateTrainerRole(trainer.id, e.target.value)}
                                    className="text-xs px-2 py-1 border border-slate-200 rounded"
                                  >
                                    <option value="lead_trainer">Lead Trainer</option>
                                    <option value="assistant_trainer">Assistant Trainer</option>
                                    <option value="guest_trainer">Guest Trainer</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingPathway}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isCreatingPathway 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCreatingPathway ? 'Creating...' : 'Create Pathway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pathway Modal */}
      {showEditModal && editingPathway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Edit Pathway</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPathway(null);
                  setEditSelectedParticipants([]);
                  setEditSelectedTrainers([]);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              console.log('📝 Edit form submission - editSelectedParticipants:', editSelectedParticipants);
              console.log('📝 Edit form submission - editSelectedTrainers:', editSelectedTrainers);
              handleUpdatePathway({
                title: formData.get('title'),
                description: formData.get('description'),
                duration: parseInt(formData.get('duration') as string),
                totalHours: parseInt(formData.get('totalHours') as string),
                status: formData.get('status'),
                cefrLevel: formData.get('cefrLevel')
              });
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">Duration (months) *</label>
                      <input
                        name="duration"
                        type="number"
                        min="1"
                        max="12"
                        defaultValue={editingPathway.duration}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Hours *</label>
                      <input
                        name="totalHours"
                        type="number"
                        min="1"
                        defaultValue={editingPathway.total_hours}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CEFR Level</label>
                    <select
                      name="cefrLevel"
                      defaultValue={editingPathway.cefr_level || ''}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select CEFR Level</option>
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                      <option value="C2">C2 - Proficient</option>
                    </select>
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

                {/* User Assignment */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">Assign Users to Pathway</h4>
                  
                  {/* Participants (Teachers + Participants) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Participants 
                      <span className="text-xs text-slate-500 ml-1">({editSelectedParticipants.length} selected)</span>
                    </label>
                    <div className="border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                      {loadingUsers ? (
                        <div className="p-3 text-center text-slate-500">Loading users...</div>
                      ) : (availableTeachers.length === 0 && availableParticipants.length === 0) ? (
                        <div className="p-3 text-center text-slate-500">No users available. Create teachers or participants first.</div>
                      ) : (
                        <>
                          {/* Teachers */}
                          {availableTeachers.map((teacher) => (
                            <div key={teacher.id} className="flex items-center p-2 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                id={`edit-teacher-${teacher.id}`}
                                checked={editSelectedParticipants.includes(teacher.id)}
                                onChange={() => toggleEditParticipant(teacher.id)}
                                className="mr-3"
                              />
                              <label htmlFor={`edit-teacher-${teacher.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-sm">{teacher.name}</div>
                                <div className="text-xs text-slate-500">{teacher.email} • Teacher</div>
                              </label>
                            </div>
                          ))}
                          
                          {/* Participants */}
                          {availableParticipants.map((participant) => (
                            <div key={participant.id} className="flex items-center p-2 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                id={`edit-participant-${participant.id}`}
                                checked={editSelectedParticipants.includes(participant.id)}
                                onChange={() => toggleEditParticipant(participant.id)}
                                className="mr-3"
                              />
                              <label htmlFor={`edit-participant-${participant.id}`} className="flex-1 cursor-pointer">
                                <div className="font-medium text-sm">{participant.name}</div>
                                <div className="text-xs text-slate-500">{participant.email} • Participant</div>
                              </label>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trainers */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Trainers 
                      <span className="text-xs text-slate-500 ml-1">({editSelectedTrainers.length} selected)</span>
                    </label>
                    <div className="border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
                      {loadingUsers ? (
                        <div className="p-3 text-center text-slate-500">Loading trainers...</div>
                      ) : availableTrainers.length === 0 ? (
                        <div className="p-3 text-center text-slate-500">No trainers available. Create trainers first.</div>
                      ) : (
                        availableTrainers.map((trainer) => {
                          const isSelected = editSelectedTrainers.find(t => t.id === trainer.id);
                          return (
                            <div key={trainer.id} className="p-2 hover:bg-slate-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`edit-trainer-${trainer.id}`}
                                  checked={!!isSelected}
                                  onChange={() => toggleEditTrainer(trainer.id)}
                                  className="mr-3"
                                />
                                <label htmlFor={`edit-trainer-${trainer.id}`} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-sm">{trainer.name}</div>
                                  <div className="text-xs text-slate-500">{trainer.email}</div>
                                </label>
                              </div>
                              {isSelected && (
                                <div className="ml-6 mt-2">
                                  <select
                                    value={isSelected.role}
                                    onChange={(e) => updateEditTrainerRole(trainer.id, e.target.value)}
                                    className="text-xs px-2 py-1 border border-slate-200 rounded"
                                  >
                                    <option value="lead_trainer">Lead Trainer</option>
                                    <option value="assistant_trainer">Assistant Trainer</option>
                                    <option value="guest_trainer">Guest Trainer</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPathway(null);
                    setEditSelectedParticipants([]);
                    setEditSelectedTrainers([]);
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