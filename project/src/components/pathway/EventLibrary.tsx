import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Users, BookOpen, Target, CheckSquare } from 'lucide-react';

const eventTemplates = [
  {
    id: '1',
    title: 'Welcome Orientation',
    type: 'workshop',
    duration: '4 hours',
    category: 'introduction',
    description: 'Introduction workshop for new participants'
  },
  {
    id: '2', 
    title: 'Grammar Fundamentals',
    type: 'elearning',
    duration: '2 hours',
    category: 'content',
    description: 'Online module covering basic grammar concepts'
  },
  {
    id: '3',
    title: 'Knowledge Check',
    type: 'assessment', 
    duration: '30 minutes',
    category: 'evaluation',
    description: 'Quick assessment to test understanding'
  },
  {
    id: '4',
    title: 'Lesson Planning Assignment',
    type: 'assignment',
    duration: '3 hours',
    category: 'practice',
    description: 'Create a comprehensive lesson plan'
  },
  {
    id: '5',
    title: 'Peer Review Activity',
    type: 'group',
    duration: '1.5 hours', 
    category: 'collaboration',
    description: 'Collaborative peer feedback session'
  },
  {
    id: '6',
    title: 'Progress Checkpoint',
    type: 'checkpoint',
    duration: '1 hour',
    category: 'evaluation',
    description: 'Mid-pathway progress evaluation'
  }
];

const eventIcons = {
  workshop: Calendar,
  elearning: BookOpen,
  assessment: CheckSquare,
  assignment: Target,
  group: Users,
  checkpoint: Clock
};

const eventColors = {
  workshop: 'blue',
  elearning: 'green', 
  assessment: 'purple',
  assignment: 'orange',
  group: 'pink',
  checkpoint: 'slate'
};

export function EventLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = eventTemplates.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Event Library</h3>
        <Filter className="w-5 h-5 text-slate-400" />
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="all">All Categories</option>
          <option value="introduction">Introduction</option>
          <option value="content">Content</option>
          <option value="practice">Practice</option>
          <option value="evaluation">Evaluation</option>
          <option value="collaboration">Collaboration</option>
        </select>
      </div>

      {/* Event Templates */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredEvents.map((event) => {
          const Icon = eventIcons[event.type as keyof typeof eventIcons];
          const color = eventColors[event.type as keyof typeof eventColors];
          
          return (
            <div
              key={event.id}
              className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(event));
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${color}-100 mt-0.5`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">{event.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{event.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">{event.duration}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700 capitalize`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}