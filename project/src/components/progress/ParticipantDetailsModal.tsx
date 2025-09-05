import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Clock, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Star,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ParticipantDetailsModalProps {
  participant: {
    id: string;
    name: string;
    email: string;
    progress: number;
    completedHours: number;
    totalHours: number;
    status: string;
    lastActivity: string;
    phone: string;
    school: string;
    position: string;
    experience: string;
    cefrLevel: string;
    enrollmentDate: string;
    completedModules: string[];
    currentModule: string;
    achievements: string[];
    notes: string;
  };
  onClose: () => void;
}

export function ParticipantDetailsModal({ participant, onClose }: ParticipantDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'at-risk':
        return 'bg-red-100 text-red-700';
      case 'active':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'at-risk':
        return <AlertCircle className="w-4 h-4" />;
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">Participant Details</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-slate-900 mb-2">{participant.name}</h4>
              <p className="text-slate-600 mb-4">{participant.position} at {participant.school}</p>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(participant.status)}`}>
                  {getStatusIcon(participant.status)}
                  {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                </span>
                <span className="text-sm text-slate-600">Last active: {participant.lastActivity}</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-slate-50 rounded-lg p-6">
            <h5 className="text-lg font-semibold text-slate-900 mb-4">Progress Overview</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{participant.progress}%</div>
                <div className="text-sm text-slate-600">Overall Progress</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${participant.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{participant.completedHours}h</div>
                <div className="text-sm text-slate-600">Completed Hours</div>
                <div className="text-xs text-slate-500">of {participant.totalHours} total hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{participant.completedModules.length}</div>
                <div className="text-sm text-slate-600">Completed Modules</div>
                <div className="text-xs text-slate-500">out of 5 total modules</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{participant.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{participant.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{participant.school}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold text-slate-900 mb-4">Professional Details</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">{participant.experience} experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">CEFR Level: {participant.cefrLevel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-700">Enrolled: {new Date(participant.enrollmentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div>
            <h5 className="text-lg font-semibold text-slate-900 mb-4">Learning Progress</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium text-slate-700 mb-3">Completed Modules</h6>
                <div className="space-y-2">
                  {participant.completedModules.map((module, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">{module}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="font-medium text-slate-700 mb-3">Current Module</h6>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700">{participant.currentModule}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {participant.achievements.length > 0 && (
            <div>
              <h5 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h5>
              <div className="flex flex-wrap gap-2">
                {participant.achievements.map((achievement, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h5 className="text-lg font-semibold text-slate-900 mb-4">Notes</h5>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700">{participant.notes}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-white transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
