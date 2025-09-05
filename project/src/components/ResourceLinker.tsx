import React, { useState, useEffect } from 'react';
import { Plus, Link, Unlink, FileText, Download, Eye, X } from 'lucide-react';
import { mysqlClient } from '../lib/mysql';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  format: string;
  url?: string;
  file_size?: string;
  tags: string[];
  resource_type?: string;
  display_order?: number;
}

interface ResourceLinkerProps {
  targetId: string;
  targetType: 'workshop' | 'agenda' | 'learning-event';
  targetName: string;
  onResourcesUpdate?: () => void;
}

export function ResourceLinker({ targetId, targetType, targetName, onResourcesUpdate }: ResourceLinkerProps) {
  const [linkedResources, setLinkedResources] = useState<Resource[]>([]);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [resourceType, setResourceType] = useState<string>('optional');

  // Fetch linked resources
  const fetchLinkedResources = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (targetType) {
        case 'workshop':
          response = await mysqlClient.getResourcesByWorkshop(targetId);
          break;
        case 'agenda':
          response = await mysqlClient.getResourcesByAgendaItem(targetId);
          break;
        case 'learning-event':
          response = await mysqlClient.getResourcesByLearningEvent(targetId);
          break;
        default:
          return;
      }
      
      setLinkedResources(response.resources || []);
    } catch (error) {
      console.error('Error fetching linked resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available resources for linking
  const fetchAvailableResources = async () => {
    try {
      const response = await mysqlClient.getResources();
      const allResources = response.resources || [];
      
      // Filter out already linked resources
      const linkedResourceIds = linkedResources.map(r => r.id);
      const available = allResources.filter(r => !linkedResourceIds.includes(r.id));
      
      setAvailableResources(available);
    } catch (error) {
      console.error('Error fetching available resources:', error);
    }
  };

  useEffect(() => {
    fetchLinkedResources();
  }, [targetId, targetType]);

  useEffect(() => {
    if (showLinkModal) {
      fetchAvailableResources();
    }
  }, [showLinkModal, linkedResources]);

  const handleLinkResource = async () => {
    if (!selectedResource) return;

    try {
      setLoading(true);
      
      switch (targetType) {
        case 'workshop':
          await mysqlClient.linkResourceToWorkshop(selectedResource, targetId, resourceType);
          break;
        case 'agenda':
          await mysqlClient.linkResourceToAgendaItem(selectedResource, targetId, resourceType);
          break;
        case 'learning-event':
          await mysqlClient.linkResourceToLearningEvent(selectedResource, targetId, resourceType);
          break;
      }
      
      await fetchLinkedResources();
      setShowLinkModal(false);
      setSelectedResource('');
      setResourceType('optional');
      onResourcesUpdate?.();
    } catch (error) {
      console.error('Error linking resource:', error);
      alert('Failed to link resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to unlink this resource?')) return;

    try {
      setLoading(true);
      
      switch (targetType) {
        case 'workshop':
          await mysqlClient.unlinkResourceFromWorkshop(resourceId, targetId);
          break;
        case 'agenda':
          await mysqlClient.unlinkResourceFromAgendaItem(resourceId, targetId);
          break;
        case 'learning-event':
          // Add unlink method for learning events if needed
          break;
      }
      
      await fetchLinkedResources();
      onResourcesUpdate?.();
    } catch (error) {
      console.error('Error unlinking resource:', error);
      alert('Failed to unlink resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'required': return 'bg-red-100 text-red-700';
      case 'optional': return 'bg-blue-100 text-blue-700';
      case 'reference': return 'bg-green-100 text-green-700';
      case 'handout': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'presentation': return '📊';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'worksheet': return '📝';
      case 'handbook': return '📚';
      case 'assessment': return '📋';
      case 'template': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Resources for {targetName}
        </h3>
        <button
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Link Resource
        </button>
      </div>

      {/* Linked Resources List */}
      {loading ? (
        <div className="text-center py-4 text-slate-500">Loading resources...</div>
      ) : linkedResources.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p>No resources linked yet</p>
          <p className="text-sm">Click "Link Resource" to add resources</p>
        </div>
      ) : (
        <div className="space-y-3">
          {linkedResources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{getResourceTypeIcon(resource.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900">{resource.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getResourceTypeColor(resource.resource_type || 'optional')}`}>
                      {resource.resource_type || 'optional'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{resource.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{resource.type}</span>
                    <span>{resource.format}</span>
                    {resource.file_size && <span>{resource.file_size}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {resource.url && (
                  <>
                    <button
                      onClick={() => window.open(resource.url, '_blank')}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      title="View/Download"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={resource.url}
                      download
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </>
                )}
                <button
                  onClick={() => handleUnlinkResource(resource.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Unlink Resource"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Resource Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Link Resource</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Resource
                </label>
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a resource...</option>
                  {availableResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.title} ({resource.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resource Type
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="optional">Optional</option>
                  <option value="required">Required</option>
                  <option value="reference">Reference</option>
                  <option value="handout">Handout</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkResource}
                disabled={!selectedResource || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Linking...' : 'Link Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
