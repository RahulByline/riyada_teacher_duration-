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
  ChevronDown
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
  prerequisites?: string[];
  skills: string[];
}

interface ProgramMonth {
  month: string;
  monthNumber: number;
  components: LearningComponent[];
  milestoneTitle: string;
  milestoneDescription: string;
  overallProgress: number;
}

const mockProgramData: ProgramMonth[] = [
  {
    month: 'Month 1',
    monthNumber: 1,
    milestoneTitle: 'Foundation Building',
    milestoneDescription: 'Establish core teaching fundamentals and assessment baseline',
    overallProgress: 100,
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
      },
      {
        id: '4',
        title: 'Reflection Assignment',
        type: 'assignment',
        status: 'completed',
        duration: '3 hours',
        completedDate: '2024-01-30',
        description: 'Personal teaching philosophy development',
        skills: ['Self-Reflection', 'Goal Setting']
      }
    ]
  },
  {
    month: 'Month 2',
    monthNumber: 2,
    milestoneTitle: 'Skill Development',
    milestoneDescription: 'Build core teaching competencies and classroom management skills',
    overallProgress: 75,
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
      },
      {
        id: '8',
        title: 'Mid-Program Checkpoint',
        type: 'checkpoint',
        status: 'upcoming',
        duration: '2 hours',
        dueDate: '2024-02-25',
        description: 'Progress evaluation and pathway adjustment',
        skills: ['Self-Assessment', 'Progress Tracking']
      }
    ]
  },
  {
    month: 'Month 3',
    monthNumber: 3,
    milestoneTitle: 'Assessment Mastery',
    milestoneDescription: 'Develop comprehensive assessment and evaluation skills',
    overallProgress: 25,
    components: [
      {
        id: '9',
        title: 'Assessment Design Workshop',
        type: 'workshop',
        status: 'locked',
        duration: '6 hours',
        description: 'Creating effective student assessments',
        prerequisites: ['6', '7'],
        skills: ['Assessment Design', 'Rubric Creation']
      },
      {
        id: '10',
        title: 'Digital Assessment Tools',
        type: 'elearning',
        status: 'locked',
        duration: '4 hours',
        description: 'Technology-enhanced assessment methods',
        prerequisites: ['9'],
        skills: ['Technology Integration', 'Digital Literacy']
      },
      {
        id: '11',
        title: 'Assessment Portfolio',
        type: 'assignment',
        status: 'locked',
        duration: '8 hours',
        description: 'Comprehensive assessment toolkit creation',
        prerequisites: ['10'],
        skills: ['Portfolio Development', 'Assessment Variety']
      }
    ]
  },
  {
    month: 'Month 4',
    monthNumber: 4,
    milestoneTitle: 'Technology Integration',
    milestoneDescription: 'Master digital tools and blended learning approaches',
    overallProgress: 0,
    components: [
      {
        id: '12',
        title: 'EdTech Fundamentals',
        type: 'workshop',
        status: 'locked',
        duration: '6 hours',
        description: 'Essential educational technology tools',
        skills: ['Technology Integration', 'Digital Pedagogy']
      },
      {
        id: '13',
        title: 'Blended Learning Design',
        type: 'elearning',
        status: 'locked',
        duration: '5 hours',
        description: 'Combining online and offline instruction',
        skills: ['Blended Learning', 'Course Design']
      }
    ]
  },
  {
    month: 'Month 5',
    monthNumber: 5,
    milestoneTitle: 'Advanced Pedagogy',
    milestoneDescription: 'Implement advanced teaching strategies and methodologies',
    overallProgress: 0,
    components: [
      {
        id: '14',
        title: 'Advanced Teaching Methods',
        type: 'workshop',
        status: 'locked',
        duration: '8 hours',
        description: 'Sophisticated pedagogical approaches',
        skills: ['Advanced Pedagogy', 'Teaching Innovation']
      },
      {
        id: '15',
        title: 'Research-Based Practice',
        type: 'elearning',
        status: 'locked',
        duration: '6 hours',
        description: 'Evidence-based teaching strategies',
        skills: ['Research Application', 'Evidence-Based Practice']
      }
    ]
  },
  {
    month: 'Month 6',
    monthNumber: 6,
    milestoneTitle: 'Mastery & Certification',
    milestoneDescription: 'Demonstrate mastery and complete certification requirements',
    overallProgress: 0,
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
      },
      {
        id: '18',
        title: 'Graduation Ceremony',
        type: 'workshop',
        status: 'locked',
        duration: '2 hours',
        description: 'Program completion celebration',
        skills: ['Program Completion', 'Networking']
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

const typeColors = {
  workshop: 'blue',
  elearning: 'green',
  assessment: 'purple',
  assignment: 'orange',
  group: 'pink',
  checkpoint: 'slate'
};

const statusColors = {
  completed: 'green',
  'in-progress': 'blue',
  available: 'yellow',
  locked: 'gray',
  upcoming: 'indigo'
};

export function ProgramOverview() {
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([1, 2]));
  const [selectedComponent, setSelectedComponent] = useState<LearningComponent | null>(null);

  const toggleMonth = (monthNumber: number) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthNumber)) {
      newExpanded.delete(monthNumber);
    } else {
      newExpanded.add(monthNumber);
    }
    setExpandedMonths(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'available':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      case 'upcoming':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const calculateOverallProgress = () => {
    const totalComponents = mockProgramData.reduce((sum, month) => sum + month.components.length, 0);
    const completedComponents = mockProgramData.reduce((sum, month) => 
      sum + month.components.filter(c => c.status === 'completed').length, 0
    );
    return Math.round((completedComponents / totalComponents) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Program Overview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">English Teaching Mastery Program</h2>
            <p className="text-blue-100">6-Month Comprehensive Training Journey</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{calculateOverallProgress()}%</div>
            <div className="text-sm text-blue-200">Overall Progress</div>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-blue-500 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Program Timeline */}
      <div className="space-y-4">
        {mockProgramData.map((month, index) => {
          const isExpanded = expandedMonths.has(month.monthNumber);
          const isCurrentMonth = month.monthNumber === 2; // Mock current month
          
          return (
            <div key={month.monthNumber} className={`bg-white rounded-xl border-2 transition-all ${
              isCurrentMonth ? 'border-blue-500 shadow-lg' : 'border-slate-200'
            }`}>
              {/* Month Header */}
              <div 
                className={`p-6 cursor-pointer ${isCurrentMonth ? 'bg-blue-50' : ''}`}
                onClick={() => toggleMonth(month.monthNumber)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      month.overallProgress === 100 ? 'bg-green-100' :
                      month.overallProgress > 0 ? 'bg-blue-100' :
                      'bg-slate-100'
                    }`}>
                      {month.overallProgress === 100 ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : month.overallProgress > 0 ? (
                        <Play className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-900">{month.month}</h3>
                        {isCurrentMonth && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-semibold text-slate-700">{month.milestoneTitle}</p>
                      <p className="text-sm text-slate-600">{month.milestoneDescription}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{month.overallProgress}%</div>
                      <div className="text-sm text-slate-600">Complete</div>
                    </div>
                    
                    <div className="w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="6"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={month.overallProgress === 100 ? "#10b981" : month.overallProgress > 0 ? "#3b82f6" : "#94a3b8"}
                          strokeWidth="6"
                          strokeDasharray={`${(month.overallProgress / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Month Components */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {month.components.map((component) => {
                      const Icon = typeIcons[component.type];
                      const typeColor = typeColors[component.type];
                      const statusColor = statusColors[component.status];
                      
                      return (
                        <div
                          key={component.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                            component.status === 'completed' ? 'border-green-200 bg-green-50' :
                            component.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                            component.status === 'available' ? 'border-yellow-200 bg-yellow-50' :
                            component.status === 'upcoming' ? 'border-indigo-200 bg-indigo-50' :
                            'border-slate-200 bg-slate-50'
                          }`}
                          onClick={() => setSelectedComponent(component)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-${typeColor}-100 mt-1`}>
                              <Icon className={`w-4 h-4 text-${typeColor}-600`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(component.status)}
                                <h4 className="font-semibold text-slate-900 truncate">{component.title}</h4>
                              </div>
                              
                              <p className="text-sm text-slate-600 mb-2">{component.description}</p>
                              
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{component.duration}</span>
                                {component.completedDate && (
                                  <span>Completed: {component.completedDate}</span>
                                )}
                                {component.dueDate && (
                                  <span>Due: {component.dueDate}</span>
                                )}
                              </div>
                              
                              {component.progress && (
                                <div className="mt-2">
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${component.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-slate-600">{component.progress}% complete</span>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-1 mt-2">
                                {component.skills.slice(0, 2).map((skill, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-1 rounded-full bg-${typeColor}-100 text-${typeColor}-700`}>
                                    {skill}
                                  </span>
                                ))}
                                {component.skills.length > 2 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                    +{component.skills.length - 2} more
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
              )}
            </div>
          );
        })}
      </div>

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedComponent.status)}
                  <h3 className="text-xl font-bold text-slate-900">{selectedComponent.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-700">{selectedComponent.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Duration:</span>
                  <p className="text-slate-900">{selectedComponent.duration}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Type:</span>
                  <p className="text-slate-900 capitalize">{selectedComponent.type}</p>
                </div>
              </div>
              
              {selectedComponent.skills.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-600">Skills Covered:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedComponent.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedComponent.prerequisites && (
                <div>
                  <span className="text-sm font-medium text-slate-600">Prerequisites:</span>
                  <p className="text-slate-700">Complete components: {selectedComponent.prerequisites.join(', ')}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
                {selectedComponent.status === 'available' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Start Activity
                  </button>
                )}
                {selectedComponent.status === 'in-progress' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}