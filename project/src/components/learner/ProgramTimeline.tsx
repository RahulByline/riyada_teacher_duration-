import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Lock, 
  Calendar,
  BookOpen,
  Users,
  Target,
  Award,
  TrendingUp,
  ChevronRight,
  Star,
  MapPin,
  Zap,
  Trophy,
  Lightbulb
} from 'lucide-react';

interface LearningComponent {
  id: string;
  title: string;
  type: 'workshop' | 'elearning' | 'assessment' | 'assignment' | 'group' | 'checkpoint';
  status: 'completed' | 'in-progress' | 'available' | 'locked' | 'upcoming';
  duration: string;
  progress?: number;
  dueDate?: string;
  completedDate?: string;
  description: string;
  skills: string[];
}

interface ProgramMonth {
  month: string;
  monthNumber: number;
  components: LearningComponent[];
  milestoneTitle: string;
  milestoneDescription: string;
  overallProgress: number;
  milestoneIcon: React.ComponentType<any>;
  color: string;
}

const mockProgramData: ProgramMonth[] = [
  {
    month: 'Month 1',
    monthNumber: 1,
    milestoneTitle: 'Foundation Building',
    milestoneDescription: 'Establish core teaching fundamentals',
    overallProgress: 100,
    milestoneIcon: Lightbulb,
    color: 'emerald',
    components: [
      {
        id: '1',
        title: 'Program Orientation',
        type: 'workshop',
        status: 'completed',
        duration: '4 hours',
        completedDate: '2024-01-15',
        description: 'Welcome session and program overview',
        skills: ['Program Understanding', 'Goal Setting']
      },
      {
        id: '2',
        title: 'Initial CEFR Assessment',
        type: 'assessment',
        status: 'completed',
        duration: '2 hours',
        completedDate: '2024-01-18',
        description: 'Baseline proficiency evaluation',
        skills: ['Self-Assessment', 'CEFR Understanding']
      },
      {
        id: '3',
        title: 'Teaching Fundamentals',
        type: 'elearning',
        status: 'completed',
        duration: '6 hours',
        completedDate: '2024-01-25',
        description: 'Core principles of effective teaching',
        skills: ['Pedagogical Knowledge', 'Teaching Methods']
      }
    ]
  },
  {
    month: 'Month 2',
    monthNumber: 2,
    milestoneTitle: 'Skill Development',
    milestoneDescription: 'Build core teaching competencies',
    overallProgress: 75,
    milestoneIcon: Zap,
    color: 'blue',
    components: [
      {
        id: '5',
        title: 'Grammar Teaching Workshop',
        type: 'workshop',
        status: 'completed',
        duration: '8 hours',
        completedDate: '2024-02-05',
        description: 'Advanced grammar instruction techniques',
        skills: ['Grammar Teaching', 'Interactive Methods']
      },
      {
        id: '6',
        title: 'Classroom Management',
        type: 'elearning',
        status: 'in-progress',
        duration: '5 hours',
        progress: 60,
        description: 'Effective classroom control strategies',
        skills: ['Classroom Management', 'Student Engagement']
      },
      {
        id: '7',
        title: 'Peer Observation',
        type: 'group',
        status: 'available',
        duration: '4 hours',
        dueDate: '2024-02-20',
        description: 'Collaborative teaching observation session',
        skills: ['Peer Learning', 'Observation Skills']
      }
    ]
  },
  {
    month: 'Month 3',
    monthNumber: 3,
    milestoneTitle: 'Assessment Mastery',
    milestoneDescription: 'Develop evaluation expertise',
    overallProgress: 25,
    milestoneIcon: Target,
    color: 'purple',
    components: [
      {
        id: '9',
        title: 'Assessment Design Workshop',
        type: 'workshop',
        status: 'locked',
        duration: '6 hours',
        description: 'Creating effective student assessments',
        skills: ['Assessment Design', 'Rubric Creation']
      },
      {
        id: '10',
        title: 'Digital Assessment Tools',
        type: 'elearning',
        status: 'locked',
        duration: '4 hours',
        description: 'Technology-enhanced assessment methods',
        skills: ['Technology Integration', 'Digital Literacy']
      }
    ]
  },
  {
    month: 'Month 4',
    monthNumber: 4,
    milestoneTitle: 'Technology Integration',
    milestoneDescription: 'Master digital teaching tools',
    overallProgress: 0,
    milestoneIcon: BookOpen,
    color: 'orange',
    components: [
      {
        id: '12',
        title: 'EdTech Fundamentals',
        type: 'workshop',
        status: 'locked',
        duration: '6 hours',
        description: 'Essential educational technology tools',
        skills: ['Technology Integration', 'Digital Pedagogy']
      }
    ]
  },
  {
    month: 'Month 5',
    monthNumber: 5,
    milestoneTitle: 'Advanced Pedagogy',
    milestoneDescription: 'Implement advanced strategies',
    overallProgress: 0,
    milestoneIcon: TrendingUp,
    color: 'pink',
    components: [
      {
        id: '14',
        title: 'Advanced Teaching Methods',
        type: 'workshop',
        status: 'locked',
        duration: '8 hours',
        description: 'Sophisticated pedagogical approaches',
        skills: ['Advanced Pedagogy', 'Teaching Innovation']
      }
    ]
  },
  {
    month: 'Month 6',
    monthNumber: 6,
    milestoneTitle: 'Mastery & Certification',
    milestoneDescription: 'Achieve teaching excellence',
    overallProgress: 0,
    milestoneIcon: Trophy,
    color: 'yellow',
    components: [
      {
        id: '16',
        title: 'Final Assessment',
        type: 'assessment',
        status: 'locked',
        duration: '3 hours',
        description: 'Comprehensive skills evaluation',
        skills: ['Comprehensive Assessment', 'Skill Demonstration']
      },
      {
        id: '17',
        title: 'Capstone Project',
        type: 'assignment',
        status: 'locked',
        duration: '12 hours',
        description: 'Final project showcasing all learned skills',
        skills: ['Project Management', 'Skill Integration']
      }
    ]
  }
];

const typeIcons = {
  workshop: Calendar,
  elearning: BookOpen,
  assessment: Target,
  assignment: BookOpen,
  group: Users,
  checkpoint: TrendingUp
};

export function ProgramTimeline() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-white" />;
      case 'in-progress':
        return <Play className="w-6 h-6 text-white" />;
      case 'available':
        return <Clock className="w-6 h-6 text-white" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-white opacity-60" />;
      case 'upcoming':
        return <Calendar className="w-6 h-6 text-white opacity-60" />;
      default:
        return <Clock className="w-6 h-6 text-white opacity-60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'in-progress': return 'from-blue-500 to-blue-600';
      case 'available': return 'from-yellow-500 to-orange-500';
      case 'locked': return 'from-slate-400 to-slate-500';
      case 'upcoming': return 'from-indigo-400 to-indigo-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Program Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full">
          <Trophy className="w-6 h-6" />
          <span className="font-bold text-lg">English Teaching Mastery Journey</span>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          A comprehensive 6-month transformation program designed to elevate your teaching excellence
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 h-full rounded-full"></div>

        {/* Timeline Months */}
        <div className="space-y-16">
          {mockProgramData.map((month, index) => {
            const MilestoneIcon = month.milestoneIcon;
            const isEven = index % 2 === 0;
            const isSelected = selectedMonth === month.monthNumber;
            
            return (
              <div key={month.monthNumber} className="relative">
                {/* Milestone Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                  <button
                    onClick={() => setSelectedMonth(isSelected ? null : month.monthNumber)}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br from-${month.color}-500 to-${month.color}-600 
                      flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 
                      hover:scale-110 ${isSelected ? 'ring-4 ring-blue-200 scale-110' : ''}`}
                  >
                    <MilestoneIcon className="w-8 h-8 text-white" />
                  </button>
                  
                  {/* Progress Ring */}
                  <div className="absolute inset-0 -m-1">
                    <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 72 72">
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="36"
                        cy="36"
                        r="32"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeDasharray={`${(month.overallProgress / 100) * 201} 201`}
                        strokeLinecap="round"
                        className="drop-shadow-sm"
                      />
                    </svg>
                  </div>
                </div>

                {/* Month Content */}
                <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${isEven ? 'pr-16' : 'pl-16'}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 
                      hover:shadow-xl transition-all duration-300 cursor-pointer
                      ${isSelected ? 'ring-2 ring-blue-300 shadow-xl' : ''}`}
                      onClick={() => setSelectedMonth(isSelected ? null : month.monthNumber)}
                    >
                      {/* Month Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{month.month}</h3>
                          <p className="text-lg font-semibold text-slate-700">{month.milestoneTitle}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">{month.overallProgress}%</div>
                          <div className="text-sm text-slate-500">Complete</div>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4">{month.milestoneDescription}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r from-${month.color}-500 to-${month.color}-600 h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${month.overallProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Component Preview */}
                      <div className="space-y-2">
                        {month.components.slice(0, 3).map((component) => {
                          const Icon = typeIcons[component.type];
                          return (
                            <div 
                              key={component.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                              onMouseEnter={() => setHoveredComponent(component.id)}
                              onMouseLeave={() => setHoveredComponent(null)}
                            >
                              <div className={`p-1.5 rounded-lg bg-${month.color}-100`}>
                                <Icon className={`w-4 h-4 text-${month.color}-600`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{component.title}</p>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(component.status)}
                                  <span className="text-xs text-slate-500">{component.duration}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {month.components.length > 3 && (
                          <div className="text-center">
                            <span className="text-xs text-slate-500">
                              +{month.components.length - 3} more activities
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expand Indicator */}
                      <div className="flex justify-center mt-4">
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                          isSelected ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isSelected && (
                  <div className="mt-6 animate-in slide-in-from-top duration-300">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                        <h4 className="text-lg font-bold text-slate-900 mb-4">
                          {month.milestoneTitle} - Detailed Activities
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {month.components.map((component) => {
                            const Icon = typeIcons[component.type];
                            const isHovered = hoveredComponent === component.id;
                            
                            return (
                              <div
                                key={component.id}
                                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                  ${component.status === 'completed' ? 'border-green-200 bg-green-50 hover:bg-green-100' :
                                    component.status === 'in-progress' ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' :
                                    component.status === 'available' ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100' :
                                    'border-slate-200 bg-slate-50 hover:bg-slate-100'
                                  }
                                  ${isHovered ? 'shadow-lg scale-105' : 'shadow-sm'}
                                `}
                                onMouseEnter={() => setHoveredComponent(component.id)}
                                onMouseLeave={() => setHoveredComponent(null)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg bg-${month.color}-100 mt-1`}>
                                    <Icon className={`w-5 h-5 text-${month.color}-600`} />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getStatusIcon(component.status)}
                                      <h5 className="font-semibold text-slate-900">{component.title}</h5>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 mb-3">{component.description}</p>
                                    
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                      <span>{component.duration}</span>
                                      {component.completedDate && (
                                        <span>Completed: {component.completedDate}</span>
                                      )}
                                      {component.dueDate && (
                                        <span>Due: {component.dueDate}</span>
                                      )}
                                    </div>
                                    
                                    {component.progress && (
                                      <div className="mb-2">
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${component.progress}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-slate-600">{component.progress}% complete</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex flex-wrap gap-1">
                                      {component.skills.slice(0, 2).map((skill, idx) => (
                                        <span key={idx} className={`text-xs px-2 py-1 rounded-full bg-${month.color}-100 text-${month.color}-700`}>
                                          {skill}
                                        </span>
                                      ))}
                                      {component.skills.length > 2 && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                          +{component.skills.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Connection Line to Next Month */}
                {index < mockProgramData.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-16 w-1 h-16 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievement Badges */}
        <div className="mt-16 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-xl">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Teaching Excellence Certificate</h3>
            <p className="text-yellow-100">Awarded upon successful completion of all 6 months</p>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-200 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Progress Summary */}
      <div className="fixed bottom-6 right-6 bg-white rounded-xl p-4 shadow-lg border border-slate-200 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeDasharray={`${(68 / 100) * 126} 126`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">68%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Overall Progress</p>
            <p className="text-xs text-slate-600">2 of 6 months completed</p>
          </div>
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-900 mb-4">Activity Types</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(typeIcons).map(([type, Icon]) => (
            <div key={type} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-900 mb-4">Progress Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'completed', label: 'Completed', color: 'green', count: 4 },
            { status: 'in-progress', label: 'In Progress', color: 'blue', count: 1 },
            { status: 'available', label: 'Available', color: 'yellow', count: 1 },
            { status: 'upcoming', label: 'Upcoming', color: 'indigo', count: 2 },
            { status: 'locked', label: 'Locked', color: 'slate', count: 10 }
          ].map((item) => (
            <div key={item.status} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getStatusColor(item.status)}`}></div>
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.count} activities</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}