import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';
import type { Database } from '../lib/mysql';

type Tables = Database['public']['Tables'];

// Generic hook for Supabase operations
export function useSupabase<T extends keyof Tables>(
  tableName: T,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [tableName, options]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let result;
      
      // Map table names to MySQL client methods
      switch (tableName) {
        case 'pathways':
          result = await mysqlClient.getPathways();
          break;
        case 'users':
          result = await mysqlClient.getUsers();
          break;
        case 'workshops':
          result = await mysqlClient.getWorkshops();
          break;
        case 'resources':
          result = await mysqlClient.getResources();
          break;
        case 'progress_tracking':
          result = await mysqlClient.getProgressTracking();
          break;
        case 'participants':
          result = await mysqlClient.getParticipants();
          break;
        case 'learning_events':
          result = await mysqlClient.getLearningEvents();
          break;
        case 'certificates':
          result = await mysqlClient.getCertificates();
          break;
        case 'feedback_responses':
          result = await mysqlClient.getFeedback();
          break;
        default:
          throw new Error(`Table ${tableName} not supported`);
      }
      
      // Extract data from response
      const data = result[tableName] || result.data || result || [];
      setData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const insert = async (values: Tables[T]['Insert']) => {
    try {
      let result;
      
      // Map table names to MySQL client methods
      switch (tableName) {
        case 'pathways':
          result = await mysqlClient.createPathway(values);
          break;
        case 'workshops':
          result = await mysqlClient.createWorkshop(values);
          break;
        case 'resources':
          result = await mysqlClient.createResource(values);
          break;
        case 'progress_tracking':
          result = await mysqlClient.createProgressTracking(values);
          break;
        default:
          throw new Error(`Table ${tableName} not supported for insert`);
      }
      
      // Refresh data
      await fetchData();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Insert failed');
      throw err;
    }
  };

  const update = async (id: string, values: any) => {
    try {
      let result;
      
      // Map table names to MySQL client methods
      switch (tableName) {
        case 'pathways':
          result = await mysqlClient.updatePathway(id, values);
          break;
        case 'workshops':
          result = await mysqlClient.updateWorkshop(id, values);
          break;
        case 'resources':
          result = await mysqlClient.updateResource(id, values);
          break;
        case 'progress_tracking':
          result = await mysqlClient.updateProgressTracking(id, values);
          break;
        default:
          throw new Error(`Table ${tableName} not supported for update`);
      }
      
      // Refresh data
      await fetchData();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      // Map table names to MySQL client methods
      switch (tableName) {
        case 'pathways':
          await mysqlClient.deletePathway(id);
          break;
        case 'workshops':
          await mysqlClient.deleteWorkshop(id);
          break;
        case 'resources':
          await mysqlClient.deleteResource(id);
          break;
        case 'progress_tracking':
          await mysqlClient.deleteProgressTracking(id);
          break;
        default:
          throw new Error(`Table ${tableName} not supported for delete`);
      }
      
      // Refresh data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove
  };
}

// Specific hooks for common operations
export function usePathways() {
  return useSupabase('pathways', {
    orderBy: { column: 'created_at', ascending: false }
  });
}

export function useParticipants(pathwayId?: string) {
  return useSupabase('participants', {
    filter: pathwayId ? { pathway_id: pathwayId } : undefined,
    orderBy: { column: 'enrollment_date', ascending: false }
  });
}

export function useLearningEvents(pathwayId?: string) {
  return useSupabase('learning_events', {
    filter: pathwayId ? { pathway_id: pathwayId } : undefined,
    orderBy: { column: 'start_date', ascending: true }
  });
}

export function useCertificates() {
  return useSupabase('certificates', {
    orderBy: { column: 'issue_date', ascending: false }
  });
}

export function useFeedbackResponses(eventId?: string) {
  return useSupabase('feedback_responses', {
    filter: eventId ? { event_id: eventId } : undefined,
    orderBy: { column: 'submission_date', ascending: false }
  });
}