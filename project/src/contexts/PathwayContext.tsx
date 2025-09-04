import React, { createContext, useContext, useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

interface LearningEvent {
  id: string;
  title: string;
  type: 'workshop' | 'elearning' | 'assessment' | 'assignment' | 'group' | 'checkpoint';
  description: string;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  format: 'online' | 'offline' | 'blended';
  objectives: string[];
  resources: string[];
  dependencies: string[];
}

interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: number; // in months
  total_hours: number; // Changed to match backend schema
  events: LearningEvent[];
  participants: string[];
  status: 'draft' | 'active' | 'completed';
  created_by?: string;
  cefr_level?: string;
  created_at?: string;
  updated_at?: string;
}

interface PathwayContextType {
  pathways: Pathway[];
  selectedPathway: Pathway | null;
  loading: boolean;
  setSelectedPathway: (pathway: Pathway | null) => void;
  createPathway: (pathway: Omit<Pathway, 'id' | 'events' | 'participants'>) => Promise<void>;
  updatePathway: (id: string, pathway: Partial<Pathway>) => Promise<void>;
  deletePathway: (id: string) => Promise<void>;
  addEvent: (pathwayId: string, event: Omit<LearningEvent, 'id'>) => Promise<void>;
  deleteEvent: (pathwayId: string, eventId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export function PathwayProvider({ children }: { children: React.ReactNode }) {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch pathways from backend on component mount
  useEffect(() => {
    refetch();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await mysqlClient.getPathways();
      if (response.pathways) {
        // Transform backend data to match frontend interface
        const transformedPathways = response.pathways.map((pathway: any) => ({
          ...pathway,
          total_hours: pathway.total_hours || 0,
          events: [], // Will be populated separately if needed
          participants: [] // Will be populated separately if needed
        }));
        setPathways(transformedPathways);
      }
    } catch (error) {
      console.error('Error fetching pathways:', error);
      // Keep existing pathways if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const createPathway = async (pathway: Omit<Pathway, 'id' | 'events' | 'participants'>) => {
    try {
      console.log('🔍 PathwayContext: Creating pathway with data:', pathway);
      setLoading(true);
      
      // Transform frontend data to match backend schema
      const backendData = {
        title: pathway.title,
        description: pathway.description,
        duration: pathway.duration,
        total_hours: pathway.total_hours,
        status: pathway.status,
        cefr_level: pathway.cefr_level,
        created_by: '550e8400-e29b-41d4-a716-446655440001' // Use the admin user ID from sample data
      };

      console.log('📤 PathwayContext: Sending to backend:', backendData);

      const response = await mysqlClient.createPathway(backendData);
      
      console.log('📥 PathwayContext: Backend response:', response);
      
      if (response.pathway) {
        // Transform the created pathway to match frontend interface
        const newPathway: Pathway = {
          ...response.pathway,
          total_hours: response.pathway.total_hours || 0,
          events: [],
          participants: []
        };
        
        console.log('✅ PathwayContext: Pathway created successfully:', newPathway);
        
        setPathways(prev => [...prev, newPathway]);
        setSelectedPathway(newPathway);
      } else {
        console.error('❌ PathwayContext: No pathway in response:', response);
      }
    } catch (err) {
      console.error('❌ PathwayContext: Error creating pathway:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePathway = async (id: string, updates: Partial<Pathway>) => {
    try {
      setLoading(true);
      
      // Transform frontend data to match backend schema
      const backendData: any = {};
      if (updates.title) backendData.title = updates.title;
      if (updates.description) backendData.description = updates.description;
      if (updates.duration) backendData.duration = updates.duration;
      if (updates.total_hours) backendData.total_hours = updates.total_hours;
      if (updates.status) backendData.status = updates.status;
      if (updates.cefr_level) backendData.cefr_level = updates.cefr_level;

      await mysqlClient.updatePathway(id, backendData);
      
      // Update local state
      setPathways(prev => prev.map(pathway => 
        pathway.id === id ? { ...pathway, ...updates } : pathway
      ));
      
      // Update selected pathway if it's the one being updated
      if (selectedPathway?.id === id) {
        setSelectedPathway(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error('Error updating pathway:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePathway = async (id: string) => {
    try {
      setLoading(true);
      
      await mysqlClient.deletePathway(id);
      
      // Remove from local state
      setPathways(prev => prev.filter(pathway => pathway.id !== id));
      
      // Clear selection if deleted pathway was selected
      if (selectedPathway?.id === id) {
        setSelectedPathway(null);
      }
    } catch (err) {
      console.error('Error deleting pathway:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (pathwayId: string, event: Omit<LearningEvent, 'id'>) => {
    try {
      setLoading(true);
      
      console.log('🔍 Frontend event data:', event);
      console.log('🔍 Pathway ID:', pathwayId);
      
      // Transform frontend event data to match backend schema
      const backendEventData = {
        pathway_id: pathwayId,
        title: event.title,
        description: event.description,
        type: event.type,
        start_date: event.startDate,
        end_date: event.endDate,
        duration: event.duration,
        format: event.format,
        objectives: event.objectives,
        resources: event.resources,
        dependencies: event.dependencies,
        month_index: (event as any).month_index || 1,
        week_index: (event as any).week_index || 1
      };

      console.log('📤 Sending to backend:', backendEventData);

      const response = await mysqlClient.createLearningEvent(backendEventData);
      
      console.log('📥 Backend response:', response);
      
      // Handle different response structures
      let eventData = null;
      if (response.event) {
        eventData = response.event;
      } else if (response.resource) {
        eventData = response.resource;
      } else if (response.data) {
        eventData = response.data;
      } else if (response) {
        eventData = response;
      }
      
      if (eventData) {
        console.log('✅ Event data received:', eventData);
        console.log('🔍 Event ID check:', { id: eventData.id, idType: typeof eventData.id, idLength: eventData.id?.length });
        
        // Ensure we have a valid ID
        if (!eventData.id || eventData.id === '') {
          console.error('❌ Invalid event ID:', eventData.id);
          throw new Error('Event created without valid ID');
        }
        
        // Transform the created event to match frontend interface
        const newEvent: LearningEvent & { month_index?: number; week_index?: number } = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description || '',
          type: eventData.type,
          startDate: eventData.start_date || eventData.startDate || new Date().toISOString(),
          endDate: eventData.end_date || eventData.endDate || new Date().toISOString(),
          duration: eventData.duration || 2,
          format: eventData.format || 'online',
          objectives: eventData.objectives ? (Array.isArray(eventData.objectives) ? eventData.objectives : JSON.parse(eventData.objectives)) : [],
          resources: eventData.resources ? (Array.isArray(eventData.resources) ? eventData.resources : JSON.parse(eventData.resources)) : [],
          dependencies: eventData.dependencies ? (Array.isArray(eventData.dependencies) ? eventData.dependencies : JSON.parse(eventData.dependencies)) : [],
          status: eventData.status || 'scheduled',
          month_index: eventData.month_index || 1,
          week_index: eventData.week_index || 1
        };
        
        console.log('🔄 Transformed event:', newEvent);
        
        // Update local state
        setPathways(prev => prev.map(pathway => 
          pathway.id === pathwayId 
            ? { ...pathway, events: [...pathway.events, newEvent] }
            : pathway
        ));
        
        // Also update selectedPathway if it's the current pathway
        setSelectedPathway(prev => 
          prev && prev.id === pathwayId 
            ? { ...prev, events: [...prev.events, newEvent] }
            : prev
        );
        
        console.log('✅ Local state updated');
      } else {
        console.error('❌ No event data in response:', response);
        throw new Error('No event data received from backend');
      }
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (pathwayId: string, eventId: string) => {
    try {
      setLoading(true);
      
      // Call backend to delete event
      await mysqlClient.deleteLearningEvent(eventId);
      
      // Update local state
      setPathways(prev => prev.map(pathway => 
        pathway.id === pathwayId 
          ? { ...pathway, events: pathway.events.filter(event => event.id !== eventId) }
          : pathway
      ));
      
      // Also update selectedPathway if it's the current pathway
      setSelectedPathway(prev => 
        prev && prev.id === pathwayId 
          ? { ...prev, events: prev.events.filter(event => event.id !== eventId) }
          : prev
      );
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PathwayContext.Provider value={{
      pathways,
      selectedPathway,
      loading,
      setSelectedPathway,
      createPathway,
      updatePathway,
      deletePathway,
      addEvent,
      deleteEvent,
      refetch
    }}>
      {children}
    </PathwayContext.Provider>
  );
}

export function usePathway() {
  const context = useContext(PathwayContext);
  if (context === undefined) {
    throw new Error('usePathway must be used within a PathwayProvider');
  }
  return context;
}