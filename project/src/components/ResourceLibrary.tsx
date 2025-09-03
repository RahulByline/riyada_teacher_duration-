import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Trash2,
  Search,
  Filter,
  FolderOpen,
  BookOpen,
  Video,
  Image,
  FileSpreadsheet,
  Presentation,
  Archive,
  Link,
  Plus,
  Calendar,
  Users,
  Target,
  Clock,
  Star,
  Tag,
  Share2
} from 'lucide-react';
import { useResources } from '../hooks/useResources';
import { usePathways } from '../hooks/useMySQL';


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
  const { resources, loading, createResource, updateResource, deleteResource, incrementDownloadCount } = useResources();
  const [selectedProgram, setSelectedProgram] = useState('english-mastery');
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      
      const resourceData = {
        title: uploadForm.title,
        description: uploadForm.description,
        type: uploadForm.type,
        format: uploadForm.format,
        category: uploadForm.category,
        fileSize: uploadForm.fileSize || '0 KB',
        tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : [],
        isPublic: false,
        version: '1.0',
        programId: uploadForm.programId || undefined,
        monthNumber: uploadForm.monthNumber || undefined,
        componentId: uploadForm.componentId || undefined
      };

      console.log('Submitting resource:', resourceData);
      
      await createResource(resourceData);
      
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
      setShowUploadModal(false);
      
      alert('Resource created successfully!');
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  // Create program structure from pathways data
  const program = pathways.find(p => p.id === selectedProgram) || pathways[0];
  const programStructure = program ? {
    id: program.id,
    title: program.title,
    months: [
      {
        number: 1,
        title: 'Foundation Building',
        components: [
          { id: 'orientation', title: 'Program Orientation', type: 'workshop' },
          { id: 'assessment', title: 'Initial CEFR Assessment', type: 'assessment' },
          { id: 'fundamentals', title: 'Teaching Fundamentals', type: 'elearning' }
        ]
      },
      {
        number: 2,
        title: 'Skill Development',
        components: [
          { id: 'grammar-workshop', title: 'Grammar Teaching Workshop', type: 'workshop' },
          { id: 'classroom-management', title: 'Classroom Management', type: 'elearning' },
          { id: 'peer-observation', title: 'Peer Observation', type: 'group' }
        ]
      },
      {
        number: 3,
        title: 'Assessment Mastery',
        components: [
          { id: 'assessment-design', title: 'Assessment Design Workshop', type: 'workshop' },
          { id: 'digital-tools', title: 'Digital Assessment Tools', type: 'elearning' }
        ]
      },
      {
        number: 4,
        title: 'Technology Integration',
        components: [
          { id: 'edtech', title: 'EdTech Fundamentals', type: 'workshop' }
        ]
      },
      {
        number: 5,
        title: 'Advanced Pedagogy',
        components: [
          { id: 'advanced-methods', title: 'Advanced Teaching Methods', type: 'workshop' }
        ]
      },
      {
        number: 6,
        title: 'Mastery & Certification',
        components: [
          { id: 'final-assessment', title: 'Final Assessment', type: 'assessment' },
          { id: 'capstone', title: 'Capstone Project', type: 'assignment' }
        ]
      }
    ]
  } : null;
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesProgram = resource.programId === selectedProgram;
    const matchesMonth = selectedMonth === null || resource.monthNumber === selectedMonth;
    const matchesComponent = selectedComponent === null || resource.componentId === selectedComponent;
    
    return matchesSearch && matchesCategory && matchesProgram && matchesMonth && matchesComponent;
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
            <div className="text-2xl font-bold">{resources.length}</div>
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
                  {resources.filter(r => r.monthNumber === month.number).length} resources
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {month.components.map((component) => {
                  const componentResources = resources.filter(r => 
                    r.monthNumber === month.number && r.componentId === component.id
                  );
                  
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
                                    <span>{resource.downloadCount} downloads</span>
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
                                      incrementDownloadCount(resource.id);
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
                            <button 
                              onClick={() => setShowUploadModal(true)}
                              className="text-blue-600 text-xs hover:text-blue-700 mt-1"
                            >
                              Add resources
                            </button>
                          </div>
                        )}
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
                        <span>{resource.format.toUpperCase()} • {resource.size}</span>
                        <span>v{resource.version}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map((tag, index) => (
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
                          {resource.downloadCount}
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-slate-400 hover:text-blue-600">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-green-600">
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
                        <p className="text-sm text-slate-600">{resource.format.toUpperCase()} • {resource.size}</p>
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
                      <span className="text-sm font-medium text-slate-900">{resource.downloadCount}</span>
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
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
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
          const count = resources.filter(r => r.category === category).length;
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
                    {program.months.map(month => (
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
                <button 
                  type="button"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Creating...' : 'Create Resource'}
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
                    <p className="text-sm"><strong>Downloads:</strong> {selectedResource.downloadCount}</p>
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
                  {selectedResource.tags.map((tag, index) => (
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
                  onClick={() => incrementDownloadCount(selectedResource.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}