import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Search,
  FolderOpen,
  BookOpen,
  Video,
  FileSpreadsheet,
  Presentation,
  Archive,
  Plus,
  Target,
  Share2
} from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { usePathways } from '../hooks/useMySQL';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  format: string;
  fileSize: string;
  uploadDate: string;
  lastModified: string;
  uploadedBy: string;
  downloadCount: number;
  category: string;
  programId?: string;
  monthNumber?: number;
  componentId?: string;
  tags: string[];
  isPublic: boolean;
  version: string;
  status: string;
}


const resourceTypeIcons = {
  handbook: BookOpen,
  guide: FileText,
  presentation: Presentation,
  form: FileSpreadsheet,
  elearning: Video,
  video: Video,
  document: FileText,
  template: Archive,
  assessment: Target
};

const resourceTypeColors = {
  handbook: 'blue',
  guide: 'green',
  presentation: 'purple',
  form: 'orange',
  elearning: 'pink',
  video: 'red',
  document: 'slate',
  template: 'indigo',
  assessment: 'yellow'
};

const categoryColors = {
  'trainer-resources': 'blue',
  'participant-materials': 'green',
  'assessment-tools': 'purple',
  'templates': 'orange',
  'multimedia': 'pink'
};

export function ResourceLibrary() {
  const { data: pathways } = usePathways();
  const { resources, loading, refetch } = useResources();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'program-flow' | 'category' | 'all'>('program-flow');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document' as const,
    category: 'trainer-resources' as const,
    format: 'pdf' as const,
    tags: '',
    fileSize: '',
    programId: '',
    monthNumber: null as number | null,
    componentId: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Set first pathway as selected when pathways load
  useEffect(() => {
    if (pathways && pathways.length > 0 && !selectedProgram) {
      setSelectedProgram((pathways[0] as any).id);
    }
  }, [pathways, selectedProgram]);

  // Refetch resources when selected pathway changes
  useEffect(() => {
    if (selectedProgram) {
      console.log('🔄 Pathway changed, refetching resources for:', selectedProgram);
      refetch();
    }
  }, [selectedProgram]); // Remove refetch from dependencies to prevent infinite loop
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    type: 'document' as const,
    category: 'trainer-resources' as const,
    tags: '',
    programId: '',
    monthNumber: null as number | null,
    componentId: ''
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      formData.append('category', uploadForm.category);
      formData.append('tags', JSON.stringify(uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : []));
      formData.append('is_public', 'false');
      formData.append('version', '1.0');
      formData.append('status', 'draft');
      
      // Always set the program_id to the selected program
      if (selectedProgram) {
        formData.append('program_id', selectedProgram);
      }
      if (uploadForm.monthNumber) {
        formData.append('month_number', uploadForm.monthNumber.toString());
      }
      if (uploadForm.componentId) {
        formData.append('component_id', uploadForm.componentId);
      }
      
      // Add file if selected
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('format', selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf');
      } else {
        formData.append('format', uploadForm.format);
      }

      console.log('Submitting resource with file:', selectedFile?.name);
      
      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
          setUploadStatus(`Uploading... ${percentComplete}%`);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus('Processing...');
          setUploadProgress(100);
          const result = JSON.parse(xhr.responseText);
          console.log('Resource created successfully:', result);
          
          // Reset form and close modal
          setUploadForm({
            title: '',
            description: '',
            type: 'document',
            category: 'trainer-resources',
            format: 'pdf',
            tags: '',
            fileSize: '',
            programId: '',
            monthNumber: null,
            componentId: ''
          });
          setSelectedFile(null);
          setShowUploadModal(false);
          setUploadProgress(0);
          setUploadStatus('');
          
          // Refresh resources list
          refetch();
          
          alert('Resource created successfully!');
        } else {
          const errorData = JSON.parse(xhr.responseText);
          throw new Error(errorData.error || 'Failed to create resource');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Network error during upload');
      });

      // Start upload
      xhr.open('POST', `${import.meta.env.VITE_API_URL}/resources`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('auth_token')}`);
      xhr.send(formData);
    } catch (error) {
      console.error('Error creating resource:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create resource: ${errorMessage}`);
      setUploadProgress(0);
      setUploadStatus('');
    } finally {
      setUploading(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setEditForm({
      title: resource.title,
      description: resource.description,
      type: resource.type as any,
      category: resource.category as any,
      tags: resource.tags.join(', '),
      programId: resource.programId || '',
      monthNumber: resource.monthNumber || null,
      componentId: resource.componentId || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingResource || !editForm.title || !editForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setUploadStatus('Updating resource...');
      setUploadProgress(50);
      
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        type: editForm.type,
        category: editForm.category,
        tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()) : [],
        program_id: editForm.programId || null,
        month_number: editForm.monthNumber || null,
        component_id: editForm.componentId || null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/resources/${editingResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update resource');
      }

      setUploadProgress(100);
      setUploadStatus('Resource updated successfully!');
      console.log('Resource updated successfully');
      
      // Reset form and close modal
      setEditForm({
        title: '',
        description: '',
        type: 'document',
        category: 'trainer-resources',
        tags: '',
        programId: '',
        monthNumber: null,
        componentId: ''
      });
      setEditingResource(null);
      setShowEditModal(false);
      setUploadProgress(0);
      setUploadStatus('');
      
      // Refresh resources list
      await refetch();
      
      alert('Resource updated successfully!');
    } catch (error) {
      console.error('Error updating resource:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update resource: ${errorMessage}`);
      setUploadProgress(0);
      setUploadStatus('');
    } finally {
      setUploading(false);
    }
  };

  // Create program structure from pathways data
  const program = pathways?.find((p: any) => p.id === selectedProgram) || pathways?.[0];
  
  // Generate dynamic months based on pathway duration
  const generateProgramStructure = (pathway: any) => {
    if (!pathway) return null;
    
    const months = [];
    const monthTitles = [
      'Foundation Building',
      'Skill Development', 
      'Assessment Mastery',
      'Technology Integration',
      'Advanced Pedagogy',
      'Mastery & Certification',
      'Specialized Training',
      'Advanced Implementation',
      'Leadership Development',
      'Capstone Project',
      'Final Assessment',
      'Certification'
    ];
    
    for (let i = 1; i <= pathway.duration; i++) {
      const monthTitle = monthTitles[i - 1] || `Month ${i}`;
      
      // Get learning events for this month from the pathway
      const monthEvents = pathway.events?.filter((event: any) => event.month_index === i) || [];
      
      // Convert events to components
      const components = monthEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        type: event.type
      }));
      
      // If no events, add default components for all months
      if (components.length === 0) {
        const defaultComponents = [
          { id: `orientation-${i}`, title: 'Program Orientation', type: 'workshop' },
          { id: `cefr-assessment-${i}`, title: 'CEFR Assessment', type: 'assessment' },
          { id: `fundamentals-${i}`, title: 'Teaching Fundamentals', type: 'elearning' }
        ];
        components.push(...defaultComponents);
      }
      
      months.push({
        number: i,
        title: monthTitle,
        components: components
      });
    }
    
    return {
      id: pathway.id,
      title: pathway.title,
      months: months
    };
  };
  
  const programStructure = generateProgramStructure(program);
  
  // Debug logging
  console.log('🔍 Resource Library Debug:', {
    selectedProgram,
    programTitle: (program as any)?.title,
    totalResources: resources.length,
    resources: resources.map(r => ({
      id: r.id,
      title: r.title,
      monthNumber: r.monthNumber,
      componentId: r.componentId,
      programId: r.programId,
      matchesProgram: r.programId === selectedProgram
    }))
  });
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesProgram = resource.programId === selectedProgram;
    const matchesMonth = selectedMonth === null || resource.monthNumber === selectedMonth;
    const matchesComponent = selectedComponent === null || resource.componentId === selectedComponent;
    
    // Debug logging for program filtering
    if (!matchesProgram) {
      console.log('🚫 Resource filtered out:', {
        resourceTitle: resource.title,
        resourceProgramId: resource.programId,
        selectedProgram: selectedProgram,
        programIdType: typeof resource.programId,
        selectedProgramType: typeof selectedProgram,
        areEqual: resource.programId === selectedProgram
      });
    }
    
    return matchesSearch && matchesCategory && matchesProgram && matchesMonth && matchesComponent;
  });
  
  // Debug logging for filtered results
  console.log('📊 Filtering Results:', {
    totalResources: resources.length,
    filteredResources: filteredResources.length,
    selectedProgram: selectedProgram,
    filteredResourceTitles: filteredResources.map(r => r.title)
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!programStructure) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No programs available. Create a program first.</p>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    return resourceTypeIcons[type as keyof typeof resourceTypeIcons] || FileText;
  };

  const getResourceColor = (type: string) => {
    return resourceTypeColors[type as keyof typeof resourceTypeColors] || 'slate';
  };

  const renderProgramFlowView = () => (
    <div className="space-y-6">
      {/* Program Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{programStructure.title}</h3>
            <p className="text-blue-100">Complete resource collection organized by program flow</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{filteredResources.length}</div>
            <div className="text-sm text-blue-200">Total Resources</div>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedMonth(null);
            setSelectedComponent(null);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedMonth === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Months
        </button>
        {programStructure.months.map((month) => (
          <button
            key={month.number}
            onClick={() => {
              setSelectedMonth(month.number);
              setSelectedComponent(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedMonth === month.number 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Month {month.number}: {month.title}
          </button>
        ))}
      </div>

      {/* Program Structure */}
      <div className="space-y-6">
        {programStructure.months
          .filter(month => selectedMonth === null || month.number === selectedMonth)
          .map((month) => (
          <div key={month.number} className="bg-white rounded-xl border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-blue-600">{month.number}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Month {month.number}</h4>
                    <p className="font-medium text-slate-900">{programStructure?.title}</p>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {filteredResources.filter(r => r.monthNumber === month.number).length} resources
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {month.components.map((component: any) => {
                  const componentResources = filteredResources.filter(r => {
                    // Check if resource matches this component
                    const matchesMonth = r.monthNumber === month.number || r.monthNumber?.toString() === month.number.toString();
                    const matchesComponent = r.componentId === component.id || 
                                           r.componentId === component.id.split('-')[0] ||
                                           component.id.includes(r.componentId);
                    
                    // Debug logging
                    if (r.monthNumber === month.number || r.monthNumber?.toString() === month.number.toString()) {
                      console.log('🔍 Resource matches month:', {
                        resourceMonth: r.monthNumber,
                        targetMonth: month.number,
                        resourceComponent: r.componentId,
                        targetComponent: component.id,
                        matchesComponent
                      });
                    }
                    
                    return matchesMonth && matchesComponent;
                  });
                  
                  return (
                    <div key={component.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <BookOpen className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900">{component.title}</h5>
                          <p className="text-xs text-slate-500 capitalize">{component.type}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {componentResources.length > 0 ? (
                          componentResources.map((resource) => {
                            const Icon = getResourceIcon(resource.type);
                            const color = getResourceColor(resource.type);
                            
                            return (
                              <div
                                key={resource.id}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                onClick={() => setSelectedResource(resource)}
                              >
                                <div className={`p-1.5 bg-${color}-100 rounded`}>
                                  <Icon className={`w-3 h-3 text-${color}-600`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">{resource.title}</p>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{resource.format.toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{resource.fileSize}</span>
                                    <span>•</span>
                                    <span>Available</span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button className="p-1 text-slate-400 hover:text-blue-600">
                                    <Eye className="w-3 h-3" />
                                  </button>
                                  <button 
                                    className="p-1 text-slate-400 hover:text-green-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Create download link
                                      const downloadUrl = `${import.meta.env.VITE_API_URL}/resources/${resource.id}/download`;
                                      const link = document.createElement('a');
                                      link.href = downloadUrl;
                                      link.download = `${resource.title}.${resource.format}`;
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      
                                      // Download count tracking removed
                                    }}
                                  >
                                    <Download className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-slate-400">
                            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No resources yet</p>
                          </div>
                        )}
                        
                        {/* Always show Add Resource button */}
                        <button 
                          onClick={() => {
                            // Pre-fill the upload form with component details
                            setUploadForm(prev => ({
                              ...prev,
                              monthNumber: month.number,
                              componentId: component.id
                            }));
                            setShowUploadModal(true);
                          }}
                          className="w-full mt-3 p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add Resource</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategoryView = () => (
    <div className="space-y-6">
      {Object.entries(
        filteredResources.reduce((acc, resource) => {
          if (!acc[resource.category]) acc[resource.category] = [];
          acc[resource.category].push(resource);
          return acc;
        }, {} as Record<string, Resource[]>)
      ).map(([category, resources]) => {
        const color = categoryColors[category as keyof typeof categoryColors] || 'slate';
        
        return (
          <div key={category} className="bg-white rounded-xl border border-slate-200">
                    <p className="font-medium text-slate-900">{selectedResource.monthNumber} - {programStructure?.months.find(m => m.number === selectedResource.monthNumber)?.title}</p>
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-${color}-100 rounded-lg`}>
                    <span className="text-slate-500">Component:</span>
                    <p className="font-medium text-slate-900">{selectedResource.componentId}</p>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 capitalize">
                    {category.replace('-', ' ')}
                  </h4>
                  <p className="text-slate-600">{resources.length} resources</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => {
                  const Icon = getResourceIcon(resource.type);
                  const typeColor = getResourceColor(resource.type);
                  
                  return (
                    <div
                      key={resource.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedResource(resource)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 bg-${typeColor}-100 rounded-lg`}>
                          <Icon className={`w-4 h-4 text-${typeColor}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-slate-900 mb-1">{resource.title}</h5>
                          <p className="text-sm text-slate-600 line-clamp-2">{resource.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>{resource.format.toUpperCase()} • {resource.fileSize}</span>
                        <span>v{resource.version}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{resource.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Download className="w-3 h-3" />
                          -
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-slate-400 hover:text-blue-600">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button 
                            className="p-1 text-slate-400 hover:text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Create download link
                              const downloadUrl = `${import.meta.env.VITE_API_URL}/resources/${resource.id}/download`;
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.download = `${resource.title}.${resource.format}`;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Download count tracking removed
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-purple-600">
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAllResourcesView = () => (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">All Resources</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-4 px-6 font-semibold text-slate-900">Resource</th>
              <th className="text-left py-4 px-6 font-semibold text-slate-900">Type</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Program Location</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Downloads</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Status</th>
              <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((resource) => {
              const Icon = getResourceIcon(resource.type);
              const color = getResourceColor(resource.type);
              
              return (
                <tr key={resource.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}>
                        <Icon className={`w-4 h-4 text-${color}-600`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{resource.title}</p>
                        <p className="text-sm text-slate-600">{resource.format.toUpperCase()} • {resource.fileSize}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize bg-${color}-100 text-${color}-700`}>
                      {resource.type}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">Month {resource.monthNumber}</p>
                      <p className="text-slate-600">{resource.componentId}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-1">
                          <Download className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">-</span>
                        </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                      resource.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
                      resource.status === 'draft' ? 'bg-slate-100 text-slate-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedResource(resource)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        onClick={() => {
                          // Create download link
                          const downloadUrl = `${import.meta.env.VITE_API_URL}/resources/${resource.id}/download`;
                          const link = document.createElement('a');
                          link.href = downloadUrl;
                          link.download = `${resource.title}.${resource.format}`;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          
                          // Download count tracking removed
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                        onClick={() => handleEditResource(resource)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resource Library</h2>
          <p className="text-slate-600 mt-1">Manage training materials, guides, and resources</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Resource
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Pathway Selector */}
      {pathways && pathways.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Select Pathway:</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
            >
              {pathways.map((pathway: any) => (
                <option key={pathway.id} value={pathway.id}>
                  {pathway.title} ({pathway.duration} months)
                </option>
              ))}
            </select>
            {program && (
              <div className="text-sm text-slate-600">
                <span className="font-medium">{(program as any).title}</span> - {(program as any).duration} months, {(program as any).total_hours} hours
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('program-flow')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'program-flow' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Program Flow
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'category' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'all' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Resources
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64"
            />
          </div>
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="trainer-resources">Trainer Resources</option>
            <option value="participant-materials">Participant Materials</option>
            <option value="assessment-tools">Assessment Tools</option>
            <option value="templates">Templates</option>
            <option value="multimedia">Multimedia</option>
          </select>
        </div>
      </div>

      {/* Resource Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(categoryColors).map(([category, color]) => {
          const count = filteredResources.filter(r => r.category === category).length;
          return (
            <div key={category} className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 bg-${color}-100 rounded`}>
                  <FolderOpen className={`w-4 h-4 text-${color}-600`} />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm capitalize">
                  {category.replace('-', ' ')}
                </h4>
              </div>
              <p className="text-xl font-bold text-slate-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Content Based on View Mode */}
      {viewMode === 'program-flow' && renderProgramFlowView()}
      {viewMode === 'category' && renderCategoryView()}
      {viewMode === 'all' && renderAllResourcesView()}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Upload Resource</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter resource title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resource Type *</label>
                  <select 
                    required
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="handbook">Handbook</option>
                    <option value="guide">Guide</option>
                    <option value="presentation">Presentation</option>
                    <option value="form">Form</option>
                    <option value="elearning">eLearning Course</option>
                    <option value="video">Video</option>
                    <option value="template">Template</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the resource and its purpose"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Program Month</label>
                  <select 
                    value={uploadForm.monthNumber || ''}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, monthNumber: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select month</option>
                    {programStructure?.months.map((month: any) => (
                      <option key={month.number} value={month.number}>
                        Month {month.number}: {month.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Component</label>
                  <select 
                    value={uploadForm.componentId}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, componentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select component</option>
                    <option value="orientation">Program Orientation</option>
                    <option value="assessment">CEFR Assessment</option>
                    <option value="fundamentals">Teaching Fundamentals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select 
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="trainer-resources">Trainer Resources</option>
                    <option value="participant-materials">Participant Materials</option>
                    <option value="assessment-tools">Assessment Tools</option>
                    <option value="templates">Templates</option>
                    <option value="multimedia">Multimedia</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., grammar, workshop, interactive"
                />
              </div>
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drag and drop your file here, or click to browse</p>
                <p className="text-sm text-slate-500">Supports PDF, PPTX, DOCX, MP4, ZIP files up to 100MB</p>
                
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt,.html"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      // Auto-fill format based on file extension
                      const extension = file.name.split('.').pop()?.toLowerCase();
                      if (extension) {
                        setUploadForm(prev => ({ ...prev, format: extension as any }));
                      }
                    }
                  }}
                />
                
                <label 
                  htmlFor="file-upload"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                >
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </label>
                
                {selectedFile && (
                  <div className="mt-2 text-sm text-slate-600">
                    <p>File: {selectedFile.name}</p>
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    {uploading && (
                      <p className="text-blue-600 font-medium">
                        Uploading {(selectedFile.size / 1024 / 1024).toFixed(2)} MB...
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      disabled={uploading}
                      className="text-red-600 hover:text-red-700 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove file
                    </button>
                  </div>
                )}
              </div>
              
              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadProgress(0);
                    setUploadStatus('');
                  }}
                  disabled={uploading}
                  className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {uploadStatus || 'Creating...'}
                    </>
                  ) : (
                    'Create Resource'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Resource Details</h3>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-${getResourceColor(selectedResource.type)}-100 rounded-lg`}>
                  {React.createElement(getResourceIcon(selectedResource.type), {
                    className: `w-6 h-6 text-${getResourceColor(selectedResource.type)}-600`
                  })}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{selectedResource.title}</h4>
                  <p className="text-slate-600 mb-4">{selectedResource.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <p className="font-medium text-slate-900 capitalize">{selectedResource.type}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Format:</span>
                      <p className="font-medium text-slate-900">{selectedResource.format.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span>
                      <p className="font-medium text-slate-900">{selectedResource.fileSize}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Version:</span>
                      <p className="font-medium text-slate-900">v{selectedResource.version}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Usage Statistics</h5>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Downloads:</strong> Not tracked</p>
                    <p className="text-sm"><strong>Uploaded:</strong> {selectedResource.uploadDate}</p>
                    <p className="text-sm"><strong>Last Modified:</strong> {selectedResource.lastModified}</p>
                    <p className="text-sm"><strong>Uploaded By:</strong> {selectedResource.uploadedBy}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Program Location</h5>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Program:</strong> {programStructure.title}</p>
                    <p className="text-sm"><strong>Month:</strong> {selectedResource.monthNumber} - {programStructure.months.find(m => m.number === selectedResource.monthNumber)?.title}</p>
                    <p className="text-sm"><strong>Component:</strong> {selectedResource.componentId}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-slate-900 mb-2">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={() => {
                    // Create download link
                    const downloadUrl = `${import.meta.env.VITE_API_URL}/resources/${selectedResource.id}/download`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${selectedResource.title}.${selectedResource.format}`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Download count tracking removed
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => handleEditResource(selectedResource)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && editingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Edit Resource</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter resource title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resource Type *</label>
                  <select 
                    required
                    value={editForm.type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="handbook">Handbook</option>
                    <option value="guide">Guide</option>
                    <option value="presentation">Presentation</option>
                    <option value="form">Form</option>
                    <option value="elearning">eLearning Course</option>
                    <option value="video">Video</option>
                    <option value="template">Template</option>
                    <option value="assessment">Assessment</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the resource and its purpose"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Program Month</label>
                  <select 
                    value={editForm.monthNumber || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, monthNumber: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select month</option>
                    {programStructure?.months.map((month: any) => (
                      <option key={month.number} value={month.number}>
                        Month {month.number}: {month.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Component</label>
                  <select 
                    value={editForm.componentId}
                    onChange={(e) => setEditForm(prev => ({ ...prev, componentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select component</option>
                    <option value="orientation">Program Orientation</option>
                    <option value="assessment">CEFR Assessment</option>
                    <option value="fundamentals">Teaching Fundamentals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select 
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="trainer-resources">Trainer Resources</option>
                    <option value="participant-materials">Participant Materials</option>
                    <option value="assessment-tools">Assessment Tools</option>
                    <option value="templates">Templates</option>
                    <option value="multimedia">Multimedia</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., grammar, workshop, interactive"
                />
              </div>
              
              {/* Update Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setUploadProgress(0);
                    setUploadStatus('');
                  }}
                  disabled={uploading}
                  className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {uploadStatus || 'Updating...'}
                    </>
                  ) : (
                    'Update Resource'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}