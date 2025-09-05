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
      
      // Use MySQL client to fetch resources
      const result = await mysqlClient.getResources();
      
      if (result.error) throw new Error(result.error);

      const formattedResources: Resource[] = (result.resources || []).map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description || '',
        type: resource.type,
        format: resource.format,
        fileUrl: resource.file_url || undefined,
        fileSize: resource.file_size || '0 KB',
        uploadDate: resource.created_at ? resource.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: resource.updated_at ? resource.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
        uploadedBy: resource.uploaded_by_name || 'Unknown',
        downloadCount: 0,
        category: resource.category || 'trainer-resources',
        programId: resource.program_id || undefined,
        monthNumber: resource.month_number || undefined,
        componentId: resource.component_id || undefined,
        tags: Array.isArray(resource.tags) ? resource.tags : (resource.tags ? JSON.parse(resource.tags) : []),
        isPublic: Boolean(resource.is_public),
        version: resource.version || '1.0',
        status: resource.status || 'draft'
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
      console.log('Creating resource with data:', resourceData);
      
      const resourcePayload = {
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        format: resourceData.format,
        category: resourceData.category,
        file_size: resourceData.fileSize,
        tags: resourceData.tags || [],
        status: 'draft',
        is_public: resourceData.isPublic || false,
        version: resourceData.version || '1.0',
        program_id: resourceData.programId || null,
        month_number: resourceData.monthNumber || null,
        component_id: resourceData.componentId || null
      };

      console.log('Sending payload to backend:', resourcePayload);
      
      const result = await mysqlClient.createResource(resourcePayload);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log('Resource created successfully:', result);
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
    refetch: fetchResources
  };
}