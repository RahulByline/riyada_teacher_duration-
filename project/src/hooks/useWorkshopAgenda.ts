import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

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
  created_at: string;
  updated_at: string;
}

export function useWorkshopAgenda(workshopId: string) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workshopId) {
      fetchAgendaItems();
    }
  }, [workshopId]);

  const fetchAgendaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_BY_WORKSHOP(workshopId));
      if (!response.ok) {
        throw new Error('Failed to fetch agenda items');
      }
      
      const data = await response.json();
      const sortedItems = (data.agendaItems || []).sort((a: AgendaItem, b: AgendaItem) => a.order_index - b.order_index);
      setAgendaItems(sortedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agenda items');
      console.error('Error fetching agenda items:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAgendaItem = async (itemData: Omit<AgendaItem, 'id' | 'workshop_id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemData,
          workshop_id: workshopId,
          order_index: agendaItems.length + 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create agenda item');
      }

      await fetchAgendaItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agenda item');
      console.error('Error creating agenda item:', err);
      return false;
    }
  };

  const updateAgendaItem = async (id: string, itemData: Partial<AgendaItem>) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_ITEM(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error('Failed to update agenda item');
      }

      await fetchAgendaItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agenda item');
      console.error('Error updating agenda item:', err);
      return false;
    }
  };

  const deleteAgendaItem = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_ITEM(id), {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete agenda item');
      }

      await fetchAgendaItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agenda item');
      console.error('Error deleting agenda item:', err);
      return false;
    }
  };

  const reorderAgendaItems = async (reorderedItems: { id: string; order_index: number }[]) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_REORDER(workshopId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agendaItems: reorderedItems })
      });

      if (!response.ok) {
        throw new Error('Failed to reorder agenda items');
      }

      await fetchAgendaItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder agenda items');
      console.error('Error reordering agenda items:', err);
      return false;
    }
  };

  const updateItemOrder = async (id: string, orderIndex: number) => {
    try {
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.WORKSHOP_AGENDA_ORDER(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_index: orderIndex })
      });

      if (!response.ok) {
        throw new Error('Failed to update item order');
      }

      await fetchAgendaItems();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item order');
      console.error('Error updating item order:', err);
      return false;
    }
  };

  return {
    agendaItems,
    loading,
    error,
    createAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
    reorderAgendaItems,
    updateItemOrder,
    refresh: fetchAgendaItems
  };
}
