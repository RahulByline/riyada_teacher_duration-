import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen,
  Award,
  TrendingUp,
  Plus,
  Edit3,
  Eye,
  CheckCircle,
  Play,
  User,
  Star,
  MessageSquare
} from 'lucide-react';

interface TrainerCandidate {
  id: string;
  name: string;
  email: string;
  currentRole: string;
  experience: number;
  specializations: string[];
  cefrLevel: string;
  status: 'candidate' | 'enrolled' | 'in-training' | 'certified' | 'active-trainer';
  enrollmentDate?: string;
  completionDate?: string;
  certificationLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  trainingProgress: number;
  mentorshipHours: number;
  workshopsDelivered: number;
  participantRating: number;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'theory' | 'practical' | 'mentorship' | 'assessment';
  prerequisites: string[];
  objectives: string[];
  status: 'available' | 'in-progress' | 'completed';
  completionRate: number;
}

const mockTrainerCandidates: TrainerCandidate[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@university.edu',
    currentRole: 'Senior English Teacher',
    experience: 12,
    specializations: ['Grammar Teaching', 'Assessment Design', 'Curriculum Development'],
    cefrLevel: 'C2',
    status: 'certified',
    enrollmentDate: '2024-01-15',
    completionDate: '2024-03-15',
    certificationLevel: 'gold',
    trainingProgress: 100,
    mentorshipHours: 45,
    workshopsDelivered: 8,
    participantRating: 4.8
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@institute.edu',
    currentRole: 'ESL Coordinator',
    experience: 8,
    specializations: ['Digital Literacy', 'Technology Integration', 'Online Teaching'],
    cefrLevel: 'C1',
    status: 'in-training',
    enrollmentDate: '2024-02-01',
    trainingProgress: 75,
    mentorshipHours: 32,
    workshopsDelivered: 3,
    participantRating: 4.5
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.edu',
    currentRole: 'Language Arts Teacher',
    experience: 6,
    specializations: ['Classroom Management', 'Student Engagement'],
    cefrLevel: 'B2',
    status: 'enrolled',
    enrollmentDate: '2024-03-01',
    trainingProgress: 25,
    mentorshipHours: 8,
    workshopsDelivered: 0,
    participantRating: 0
  }
];

const trainingModules: TrainingModule[] = [
  {
    id: '1',
    title: 'Adult Learning Principles',
    description: 'Understanding how adults learn and applying andragogy principles',
    duration: '8 hours',
    type: 'theory',
    prerequisites: [],
    objectives: [
      'Understand adult learning characteristics',
      'Apply andragogy principles in training design',
      'Create learner-centered experiences'
    ],
    status: 'available',
    completionRate: 85
  },
  {
    id: '2',
    title: 'Training Design & Curriculum Development',
    description: 'Systematic approach to designing effective training programs',
    duration: '12 hours',
    type: 'theory',
    prerequisites: ['1'],
    objectives: [
      'Design learning objectives',
      'Structure training content',
      'Create assessment strategies'
    ],
    status: 'available',
    completionRate: 78
  },
  {
    id: '3',
    title: 'Facilitation Skills & Techniques',
    description: 'Master the art of facilitating engaging training sessions',
    duration: '16 hours',
    type: 'practical',
    prerequisites: ['1', '2'],
    objectives: [
      'Develop facilitation presence',
      'Manage group dynamics',
      'Handle difficult situations'
    ],
    status: 'available',
    completionRate: 72
  },
  {
    id: '4',
    title: 'Technology-Enhanced Training',
    description: 'Leverage technology for effective training delivery',
    duration: '10 hours',
    type: 'practical',
    prerequisites: ['2'],
    objectives: [
      'Use digital training tools',
      'Design online learning experiences',
      'Blend synchronous and asynchronous learning'
    ],
    status: 'available',
    completionRate: 68
  },
  {
    id: '5',
    title: 'Mentorship & Coaching',
    description: 'Develop skills to mentor and coach other educators',
    duration: '20 hours',
    type: 'mentorship',
    prerequisites: ['3'],
    objectives: [
      'Understand coaching principles',
      'Provide effective feedback',
      'Support professional development'
    ],
    status: 'available',
    completionRate: 65
  },
  {
    id: '6',
    title: 'Trainer Certification Assessment',
    description: 'Comprehensive assessment for trainer certification',
    duration: '4 hours',
    type: 'assessment',
    prerequisites: ['1', '2', '3', '4', '5'],
    objectives: [
      'Demonstrate training competencies',
      'Deliver a complete training session',
      'Receive certification'
    ],
    status: 'available',
    completionRate: 45
  }
];

export function TrainTheTrainersProgram() {
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'curriculum' | 'certification'>('overview');
  const [candidates, setCandidates] = useState<TrainerCandidate[]>(mockTrainerCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<TrainerCandidate | null>(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Program Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Train the Trainers Program</h2>
            <p className="text-indigo-100">Develop expert trainers to scale educational excellence</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{candidates.filter(c => c.status === 'certified').length}</div>
            <div className="text-sm text-indigo-200">Certified Trainers</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Active Candidates</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{candidates.length}</p>
          <p className="text-sm text-slate-600">In training pipeline</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Certified Trainers</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {candidates.filter(c => c.status === 'certified').length}
          </p>
          <p className="text-sm text-slate-600">Ready to deliver training</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">89%</p>
          <p className="text-sm text-slate-600">Certification completion</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Avg Rating</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">4.7/5</p>
          <p className="text-sm text-slate-600">Trainer effectiveness</p>
        </div>
      </div>

      {/* Program Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Program Benefits</h3>
          <div className="space-y-3">
            {[
              'Scale training delivery capacity',
              'Ensure consistent quality across programs',
              'Develop internal expertise',
              'Reduce dependency on external trainers',
              'Create career advancement opportunities',
              'Build a community of practice'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Certification Levels</h3>
          <div className="space-y-4">
            {[
              { level: 'Bronze', requirements: 'Complete core modules', color: 'orange' },
              { level: 'Silver', requirements: 'Deliver 5 training sessions', color: 'gray' },
              { level: 'Gold', requirements: '20+ mentorship hours', color: 'yellow' },
              { level: 'Platinum', requirements: 'Train other trainers', color: 'purple' }
            ].map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-${cert.color}-500`}></div>
                  <div>
                    <p className="font-medium text-slate-900">{cert.level} Certification</p>
                    <p className="text-sm text-slate-600">{cert.requirements}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {candidates.filter(c => c.certificationLevel === cert.level.toLowerCase()).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Trainer Candidates</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Candidate</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Experience</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Progress</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Rating</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{candidate.name}</p>
                        <p className="text-sm text-slate-600">{candidate.currentRole}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{candidate.experience} years</p>
                    <p className="text-sm text-slate-600">CEFR: {candidate.cefrLevel}</p>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-slate-900">{candidate.trainingProgress}%</span>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${candidate.trainingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      candidate.status === 'certified' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'in-training' ? 'bg-blue-100 text-blue-700' :
                      candidate.status === 'enrolled' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {candidate.status.replace('-', ' ')}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{candidate.participantRating || 'N/A'}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setShowCandidateModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Training Curriculum</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainingModules.map((module) => {
          const Icon = module.type === 'theory' ? BookOpen :
                     module.type === 'practical' ? Play :
                     module.type === 'mentorship' ? Users :
                     Target;
          
          return (
            <div key={module.id} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  module.type === 'theory' ? 'bg-blue-100' :
                  module.type === 'practical' ? 'bg-green-100' :
                  module.type === 'mentorship' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    module.type === 'theory' ? 'text-blue-600' :
                    module.type === 'practical' ? 'text-green-600' :
                    module.type === 'mentorship' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{module.title}</h4>
                    <span className="text-sm text-slate-600">{module.duration}</span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-700 mb-1">Learning Objectives:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {module.objectives.map((objective, index) => (
                        <li key={index}>• {objective}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">Completion Rate:</span>
                      <span className="text-xs font-medium text-slate-900">{module.completionRate}%</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      module.type === 'theory' ? 'bg-blue-100 text-blue-700' :
                      module.type === 'practical' ? 'bg-green-100 text-green-700' :
                      module.type === 'mentorship' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {module.type}
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

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Program Overview', icon: GraduationCap },
            { id: 'candidates', label: 'Trainer Candidates', icon: Users },
            { id: 'curriculum', label: 'Training Curriculum', icon: BookOpen },
            { id: 'certification', label: 'Certification', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'candidates' && renderCandidates()}
      {activeTab === 'curriculum' && renderCurriculum()}
      {activeTab === 'certification' && renderOverview()} {/* Reusing overview for now */}

      {/* Candidate Details Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Trainer Candidate Details</h3>
                <button 
                  onClick={() => setShowCandidateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h4>
                  <p className="text-slate-600">{selectedCandidate.currentRole}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Professional Details</h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Experience:</strong> {selectedCandidate.experience} years</div>
                    <div><strong>CEFR Level:</strong> {selectedCandidate.cefrLevel}</div>
                    <div><strong>Training Progress:</strong> {selectedCandidate.trainingProgress}%</div>
                    {selectedCandidate.certificationLevel && (
                      <div><strong>Certification:</strong> {selectedCandidate.certificationLevel} level</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Training Metrics</h5>
                  <div className="space-y-2 text-sm">
                    <div><strong>Mentorship Hours:</strong> {selectedCandidate.mentorshipHours}</div>
                    <div><strong>Workshops Delivered:</strong> {selectedCandidate.workshopsDelivered}</div>
                    <div><strong>Participant Rating:</strong> {selectedCandidate.participantRating}/5</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-slate-900 mb-2">Specializations</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}