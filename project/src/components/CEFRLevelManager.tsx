import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Filter,
  Search,
  Plus,
  Edit3,
  Shuffle
} from 'lucide-react';
import { CEFR_LEVELS, CEFRLevel } from '../types/cefr';
import { usePathway } from '../contexts/PathwayContext';

interface CEFRLevelManagerProps {
  onCreatePathway: (level: CEFRLevel['category']) => void;
}

export function CEFRLevelManager({ onCreatePathway }: CEFRLevelManagerProps) {
  const { pathways } = usePathway();
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const levelStats = {
    Beginner: { participants: 45, pathways: 3, completion: 78 },
    Intermediate: { participants: 67, pathways: 4, completion: 84 },
    Advanced: { participants: 23, pathways: 2, completion: 91 }
  };

  const filteredLevels = CEFR_LEVELS.filter(level => {
    const matchesSearch = level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         level.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || level.category === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getCategoryColor = (category: CEFRLevel['category']) => {
    switch (category) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'blue';
      case 'Advanced': return 'purple';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">CEFR Level Management</h2>
          <p className="text-slate-600 mt-1">Manage pathways by Common European Framework levels</p>
        </div>
        <button 
          onClick={() => onCreatePathway('Beginner')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Level-Based Pathway
        </button>
      </div>

      {/* Level Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(levelStats).map(([level, stats]) => {
          const color = getCategoryColor(level as CEFRLevel['category']);
          return (
            <div key={level} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${color}-100`}>
                  <Target className={`w-6 h-6 text-${color}-600`} />
                </div>
                <span className="text-sm text-green-600 font-medium">+{stats.completion}%</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{level} Level</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-medium">{stats.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pathways:</span>
                    <span className="font-medium">{stats.pathways}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Completion:</span>
                    <span className="font-medium">{stats.completion}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search CEFR levels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full"
          />
        </div>
        
        <select 
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value as any)}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner (A1-A2)</option>
          <option value="Intermediate">Intermediate (B1-B2)</option>
          <option value="Advanced">Advanced (C1-C2)</option>
        </select>
      </div>

      {/* CEFR Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLevels.map((level) => {
          const color = getCategoryColor(level.category);
          const relatedPathways = pathways.filter(p => 
            p.title.toLowerCase().includes(level.category.toLowerCase())
          );
          
          return (
            <div key={level.code} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${color}-100`}>
                    <span className={`text-lg font-bold text-${color}-600`}>{level.code}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{level.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
                      {level.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4">{level.description}</p>

              {/* Skills Overview */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-slate-700">Key Skills:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="font-medium">Reading:</span>
                    <p className="text-slate-600 mt-1 line-clamp-2">{level.skills.reading}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="font-medium">Speaking:</span>
                    <p className="text-slate-600 mt-1 line-clamp-2">{level.skills.speaking}</p>
                  </div>
                </div>
              </div>

              {/* Related Pathways */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Related Pathways:</span>
                  <span className="font-medium text-slate-900">{relatedPathways.length}</span>
                </div>
                {relatedPathways.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {relatedPathways.slice(0, 2).map(pathway => (
                      <div key={pathway.id} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                        {pathway.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => onCreatePathway(level.category)}
                  className={`flex-1 bg-${color}-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-${color}-700 transition-colors flex items-center justify-center gap-1`}
                >
                  <Plus className="w-3 h-3" />
                  Create Pathway
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg">
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pathway Customization Panel */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Level-Based Pathway Customization</h3>
          <p className="text-slate-600 mt-1">Customize learning components for different proficiency levels</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
              const color = getCategoryColor(level as CEFRLevel['category']);
              return (
                <div key={level} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-${color}-100`}>
                      <BookOpen className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <h4 className="font-semibold text-slate-900">{level} Components</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      'Foundation Workshops',
                      'Grammar Essentials',
                      'Vocabulary Building',
                      'Speaking Practice',
                      'Assessment Tasks'
                    ].map((component, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-700">{component}</span>
                        <div className="flex gap-1">
                          <button className="p-1 text-slate-400 hover:text-blue-600">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-green-600">
                            <Shuffle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full p-2 border-2 border-dashed border-${color}-200 text-${color}-600 rounded-lg hover:bg-${color}-50 transition-colors text-sm`}>
                    + Add Component
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}