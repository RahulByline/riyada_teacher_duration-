import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

interface Workshop {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration: string;
  expectedParticipants: number;
  actualParticipants: number;
  pathwayParticipantCount?: number;
  location: string;
  facilitatorId?: string;
  facilitatorName?: string;
  pathwayId?: string;
  pathwayTitle?: string;
  status: 'draft' | 'planning' | 'ready' | 'in-progress' | 'completed' | 'cancelled';
  agenda: any[];
  resources: string[];
  feedbackSummary: any;
  createdBy?: string;
  createdAt: string;
}

export function useWorkshops(pathwayId?: string) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, [pathwayId]);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      
      let result;
      if (pathwayId) {
        result = await mysqlClient.getWorkshopsByPathway(pathwayId);
      } else {
        result = await mysqlClient.getWorkshops();
      }

      const workshops = result.workshops || result.data || [];
      
      const formattedWorkshops: Workshop[] = workshops.map((workshop: any) => ({
        id: workshop.id,
        title: workshop.title,
        description: workshop.description || undefined,
        date: workshop.workshop_date || workshop.date,
        duration: workshop.duration_hours || workshop.duration,
        expectedParticipants: workshop.max_participants || workshop.expected_participants || 0,
        actualParticipants: workshop.actual_participants || 0,
        pathwayParticipantCount: workshop.pathway_participant_count || 0,
        location: workshop.location || '',
        facilitatorId: workshop.facilitator_id || undefined,
        facilitatorName: workshop.facilitator_name || undefined,
        pathwayId: workshop.pathway_id || undefined,
        pathwayTitle: workshop.pathway_title || undefined,
        status: workshop.status || 'draft',
        agenda: workshop.agenda || [],
        resources: workshop.resources || [],
        feedbackSummary: workshop.feedback_summary || {},
        createdBy: workshop.created_by || undefined,
        createdAt: workshop.created_at
      }));

      setWorkshops(formattedWorkshops);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workshops');
      console.error('Error fetching workshops:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkshop = async (workshopData: Omit<Workshop, 'id' | 'actualParticipants' | 'agenda' | 'resources' | 'feedbackSummary' | 'createdBy' | 'createdAt' | 'pathwayId' | 'pathwayTitle'>) => {
    try {
      const workshopPayload = {
        title: workshopData.title,
        description: workshopData.description,
        workshop_date: workshopData.date,
        duration_hours: parseInt(workshopData.duration) || 1,
        max_participants: workshopData.expectedParticipants,
        location: workshopData.location,
        facilitator_id: workshopData.facilitatorId,
        materials_required: [],
        prerequisites: []
      };

      await mysqlClient.createWorkshop(workshopPayload);
      await fetchWorkshops();
    } catch (err) {
      console.error('Error creating workshop:', err);
      throw err;
    }
  };

  const updateWorkshop = async (id: string, updates: Partial<Workshop>) => {
    try {
      const workshopPayload = {
        title: updates.title,
        description: updates.description,
        workshop_date: updates.date,
        duration_hours: updates.duration ? parseInt(updates.duration) : undefined,
        max_participants: updates.expectedParticipants,
        location: updates.location,
        facilitator_id: updates.facilitatorId,
        status: updates.status,
        materials_required: updates.agenda || [],
        prerequisites: updates.resources || []
      };

      await mysqlClient.updateWorkshop(id, workshopPayload);
      await fetchWorkshops();
    } catch (err) {
      console.error('Error updating workshop:', err);
      throw err;
    }
  };

  const deleteWorkshop = async (id: string) => {
    try {
      await mysqlClient.deleteWorkshop(id);
      await fetchWorkshops();
    } catch (err) {
      console.error('Error deleting workshop:', err);
      throw err;
    }
  };

  return {
    workshops,
    loading,
    error,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    refetch: fetchWorkshops
  };
}