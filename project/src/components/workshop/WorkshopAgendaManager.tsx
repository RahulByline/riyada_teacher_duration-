import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Calendar, 
  Edit3, 
  Trash2, 
  GripVertical,
  User,
  FileText,
  Coffee,
  Activity,
  Presentation,
  Users as GroupIcon,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { ResourceLinker } from '../ResourceLinker';

interface AgendaItem {
  id: string;
  workshop_id: string;
  title: string;
  description?: string;
  activity_type: 'session' | 'presentation' | 'break' | 'activity' | 'workshop' | 'group_work' | 'assessment' | 'feedback';
  start_time: string;
  end_time: string;
  duration_minutes?: number;
  facilitator_id?: string;
  facilitator_name?: string;
  order_index: number;
  materials_needed?: any;
  notes?: string;
}

interface Workshop {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration: string;
  location?: string;
  expectedParticipants: number;
  pathwayParticipantCount?: number;
  facilitator_id?: string;
  facilitator_name?: string;
  pathway_id?: string;
  pathway_title?: string;
  status: string;
}

interface Facilitator {
  id: string;
  name: string;
  role: string;
}

const activityTypeIcons = {
  session: <FileText className="w-4 h-4" />,
  presentation: <Presentation className="w-4 h-4" />,
  break: <Coffee className="w-4 h-4" />,
  activity: <Activity className="w-4 h-4" />,
  workshop: <GroupIcon className="w-4 h-4" />,
  group_work: <GroupIcon className="w-4 h-4" />,
  assessment: <Target className="w-4 h-4" />,
  feedback: <MessageSquare className="w-4 h-4" />
};

const activityTypeColors = {
  session: 'bg-blue-100 text-blue-700',
  presentation: 'bg-purple-100 text-purple-700',
  break: 'bg-green-100 text-green-700',
  activity: 'bg-orange-100 text-orange-700',
  workshop: 'bg-indigo-100 text-indigo-700',
  group_work: 'bg-pink-100 text-pink-700',
  assessment: 'bg-red-100 text-red-700',
  feedback: 'bg-teal-100 text-teal-700'
};

export function WorkshopAgendaManager({ workshop }: { workshop: Workshop }) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAgendaItems();
    fetchFacilitators();
  }, [workshop.id]);

  const fetchAgendaItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_BY_WORKSHOP(workshop.id));
      if (response.ok) {
        const data = await response.json();
        setAgendaItems(data.agendaItems.sort((a: AgendaItem, b: AgendaItem) => a.order_index - b.order_index));
      }
    } catch (error) {
      console.error('Error fetching agenda items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilitators = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS_BY_ROLE('trainer'));
      if (response.ok) {
        const data = await response.json();
        setFacilitators(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching facilitators:', error);
    }
  };

  const handleAddAgendaItem = async (itemData: Omit<AgendaItem, 'id' | 'workshop_id'>) => {
    try {
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemData,
          workshop_id: workshop.id,
          order_index: agendaItems.length + 1
        })
      });

      if (response.ok) {
        await fetchAgendaItems();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding agenda item:', error);
    }
  };

  const handleUpdateAgendaItem = async (id: string, itemData: Partial<AgendaItem>) => {
    try {
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_ITEM(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchAgendaItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating agenda item:', error);
    }
  };

  const handleDeleteAgendaItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agenda item?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_ITEM(id), {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchAgendaItems();
      }
    } catch (error) {
      console.error('Error deleting agenda item:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    console.log('Drag started for item:', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    console.log('Drop event triggered:', { draggedItem, targetItemId });
    
    if (!draggedItem || draggedItem === targetItemId) {
      console.log('Invalid drop: same item or no dragged item');
      return;
    }

    const draggedIndex = agendaItems.findIndex(item => item.id === draggedItem);
    const targetIndex = agendaItems.findIndex(item => item.id === targetItemId);

    console.log('Indices:', { draggedIndex, targetIndex, totalItems: agendaItems.length });

    if (draggedIndex === -1 || targetIndex === -1) {
      console.log('Invalid indices found');
      return;
    }

    // Create new array with reordered items
    const newAgendaItems = [...agendaItems];
    const [draggedItemData] = newAgendaItems.splice(draggedIndex, 1);
    newAgendaItems.splice(targetIndex, 0, draggedItemData);

    // Update order indices for all items
    const reorderedItems = newAgendaItems.map((item, index) => ({
      id: item.id,
      order_index: index + 1
    }));

    try {
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_REORDER(workshop.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendaItems: reorderedItems })
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setAgendaItems(newAgendaItems);
        console.log('Agenda items reordered successfully');
      } else {
        console.error('Failed to reorder agenda items');
        // Revert to original order if API call failed
        await fetchAgendaItems();
      }
    } catch (error) {
      console.error('Error reordering agenda items:', error);
      // Revert to original order if API call failed
      await fetchAgendaItems();
    }

    setDraggedItem(null);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleExpandedItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
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
          <h2 className="text-2xl font-bold text-slate-900">Workshop Agenda</h2>
          <p className="text-slate-600 mt-1">{workshop.title}</p>
          {workshop.pathway_title && (
            <p className="text-sm text-slate-500 mt-1">Part of: {workshop.pathway_title}</p>
          )}
        </div>
                 <div className="flex gap-2">
           <button 
             onClick={() => setShowAddModal(true)}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
           >
             <Plus className="w-4 h-4" />
             Add Agenda Item
           </button>
           
           {/* Test reordering button for debugging */}
          
         </div>
      </div>

      {/* Workshop Info Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">
              {workshop.date ? new Date(workshop.date).toLocaleDateString() : 'Date not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{workshop.duration || 'Duration not set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{workshop.pathwayParticipantCount || 0} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">{workshop.location || 'Location not set'}</span>
          </div>
        </div>
      </div>

             {/* Agenda Items */}
       <div className="space-y-3">
         {agendaItems.length === 0 ? (
           <div className="text-center py-12 text-slate-500">
             <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
             <p>No agenda items yet. Add your first session to get started!</p>
           </div>
         ) : (
           <>
             {agendaItems.map((item, index) => (
                         <div
               key={item.id}
               draggable
               onDragStart={(e) => handleDragStart(e, item.id)}
               onDragOver={handleDragOver}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDrop={(e) => handleDrop(e, item.id)}
               className={`bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all cursor-move ${
                 draggedItem === item.id ? 'opacity-50' : ''
               } drag-over:border-blue-400 drag-over:bg-blue-50`}
             >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-400" />
                
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 min-w-[120px]">
                    <Clock className="w-4 h-4" />
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${activityTypeColors[item.activity_type]}`}>
                    {activityTypeIcons[item.activity_type]}
                    {item.activity_type}
                  </span>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    )}
                  </div>
                  
                  {item.facilitator_name && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      {item.facilitator_name}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpandedItem(item.id)}
                    className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Toggle Resources"
                  >
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAgendaItem(item.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Expandable Resources Section */}
              {expandedItems.has(item.id) && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <ResourceLinker 
                    targetId={item.id}
                    targetType="agenda"
                    targetName={item.title}
                  />
                </div>
              )}
            </div>
             ))}
             
                           {/* Add Item Button */}
              <div className="text-center py-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Another Item</span>
                </button>
              </div>
           </>
         )}
       </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <AgendaItemModal
          item={editingItem}
          facilitators={facilitators}
          onSave={editingItem ? 
            (data) => handleUpdateAgendaItem(editingItem.id, data) :
            handleAddAgendaItem
          }
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// Agenda Item Modal Component
function AgendaItemModal({ 
  item, 
  facilitators, 
  onSave, 
  onClose 
}: { 
  item?: AgendaItem | null; 
  facilitators: Facilitator[]; 
  onSave: (data: any) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    activity_type: item?.activity_type || 'session',
    start_time: item?.start_time || '09:00:00',
    end_time: item?.end_time || '09:30:00',
    facilitator_id: item?.facilitator_id || '',
    materials_needed: item?.materials_needed || [],
    notes: item?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          {item ? 'Edit Agenda Item' : 'Add Agenda Item'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Activity Type *
              </label>
              <select
                value={formData.activity_type}
                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="session">Session</option>
                <option value="presentation">Presentation</option>
                <option value="break">Break</option>
                <option value="activity">Activity</option>
                <option value="workshop">Workshop</option>
                <option value="group_work">Group Work</option>
                <option value="assessment">Assessment</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Facilitator
            </label>
            <select
              value={formData.facilitator_id}
              onChange={(e) => setFormData({ ...formData, facilitator_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No facilitator assigned</option>
              {facilitators.map((facilitator) => (
                <option key={facilitator.id} value={facilitator.id}>
                  {facilitator.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
