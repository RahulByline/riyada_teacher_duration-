import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'handbook' | 'guide' | 'presentation' | 'form' | 'elearning' | 'video' | 'document' | 'template' | 'assessment';
  format: 'pdf' | 'pptx' | 'docx' | 'mp4' | 'html' | 'zip' | 'xlsx' | 'png' | 'jpg';
  fileUrl?: string;
  fileSize: string;
  uploadDate: string;
  lastModified: string;
  uploadedBy: string;
  downloadCount: number;
  category: 'trainer-resources' | 'participant-materials' | 'assessment-tools' | 'templates' | 'multimedia';
  programId?: string;
  monthNumber?: number;
  componentId?: string;
  tags: string[];
  isPublic: boolean;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
}

export function useResources(programId?: string, monthNumber?: number, componentId?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [programId, monthNumber, componentId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('resources')
        .select(`
          *,
          uploaded_by_user:users!resources_uploaded_by_fkey(name),
          program:pathways(title)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (monthNumber) {
        query = query.eq('month_number', monthNumber);
      }
      if (componentId) {
        query = query.eq('component_id', componentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedResources: Resource[] = (data || []).map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        format: resource.format,
        fileUrl: resource.file_url || undefined,
        fileSize: resource.file_size,
        uploadDate: resource.upload_date.split('T')[0],
        lastModified: resource.last_modified.split('T')[0],
        uploadedBy: (resource.uploaded_by_user as any)?.name || 'Unknown',
        downloadCount: resource.download_count,
        category: resource.category,
        programId: resource.program_id || undefined,
        monthNumber: resource.month_number || undefined,
        componentId: resource.component_id || undefined,
        tags: resource.tags || [],
        isPublic: resource.is_public,
        version: resource.version,
        status: resource.status
      }));

      setResources(formattedResources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (resourceData: Omit<Resource, 'id' | 'uploadDate' | 'lastModified' | 'uploadedBy' | 'downloadCount'>) => {
    try {
      // For now, we'll create without user authentication until we implement it
      const resourcePayload = {
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        url: resourceData.fileUrl,
        file_size: resourceData.fileSize,
        mime_type: resourceData.format,
        tags: resourceData.tags || [],
        created_by: null // Will be set when we implement authentication
      };

      await mysqlClient.createResource(resourcePayload);
      await fetchResources();
    } catch (err) {
      console.error('Error creating resource:', err);
      throw err;
    }
  };

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      const resourcePayload = {
        title: updates.title,
        description: updates.description,
        type: updates.type,
        url: updates.fileUrl,
        file_size: updates.fileSize,
        mime_type: updates.format,
        tags: updates.tags || []
      };

      await mysqlClient.updateResource(id, resourcePayload);
      await fetchResources();
    } catch (err) {
      console.error('Error updating resource:', err);
      throw err;
    }
  };

  const incrementDownloadCount = async (id: string) => {
    try {
      // For now, we'll skip this until we implement download tracking
      // This can be implemented later with a separate downloads table
      console.log('Download count increment not yet implemented');
    } catch (err) {
      console.error('Error incrementing download count:', err);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await mysqlClient.deleteResource(id);
      await fetchResources();
    } catch (err) {
      console.error('Error deleting resource:', err);
      throw err;
    }
  };

  return {
    resources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    incrementDownloadCount,
    refetch: fetchResources
  };
}