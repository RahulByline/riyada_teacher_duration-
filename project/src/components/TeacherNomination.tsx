import React, { useState } from 'react';
import { 
  Plus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar,
  Save,
  X,
  Edit3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useTeacherNominations } from '../hooks/useTeacherNominations';


export function TeacherNomination() {
  const { nominations: teachers, loading, createNomination } = useTeacherNominations();
  const [showNominationForm, setShowNominationForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleNominate = async (teacherData: any) => {
    try {
      await createNomination(teacherData);
      setShowNominationForm(false);
    } catch (error) {
      console.error('Failed to nominate teacher:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleNominateWrapper = (teacherData: any) => {
    setShowNominationForm(false);
    handleNominate(teacherData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'enrolled': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'enrolled': return <GraduationCap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teacher Nominations</h2>
          <p className="text-slate-600 mt-1">Nominate teachers for professional development programs</p>
        </div>
        <button 
          onClick={() => setShowNominationForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nominate Teacher
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'pending').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Approved</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'approved').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Enrolled</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'enrolled').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Nominated Teachers</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Teacher</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">School & Position</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Experience</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">CEFR Level</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-sm text-slate-600">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{teacher.school}</p>
                    <p className="text-sm text-slate-600">{teacher.position} • {teacher.department}</p>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className="text-slate-900 font-medium">{teacher.yearsExperience} years</span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    {teacher.cefrLevel ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                        {teacher.cefrLevel}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not assessed</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(teacher.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(teacher.status)}`}>
                        {teacher.status}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDetails(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
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

      {/* Nomination Form Modal */}
      {showNominationForm && (
        <NominationForm 
          onSubmit={handleNominateWrapper}
          onClose={() => setShowNominationForm(false)}
        />
      )}

      {/* Teacher Details Modal */}
      {showDetails && selectedTeacher && (
        <TeacherDetailsModal 
          teacher={selectedTeacher}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}

function NominationForm({ onSubmit, onClose }: { onSubmit: (data: any) => Promise<void>; onClose: () => void }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    school: '',
    yearsExperience: '',
    qualifications: '',
    subjects: '',
    cefrLevel: '',
    trainingNeeds: '',
    availability: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({
        ...formData,
        yearsExperience: parseInt(formData.yearsExperience) || 0,
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q),
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
        trainingNeeds: formData.trainingNeeds.split(',').map(t => t.trim()).filter(t => t)
      });
    } catch (error) {
      console.error('Failed to submit nomination:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Nominate Teacher</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">School/Institution *</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={formData.yearsExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Qualifications (comma-separated)</label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
              placeholder="B.A. English, M.Ed. TESOL, CELTA"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subjects Taught (comma-separated)</label>
            <input
              type="text"
              value={formData.subjects}
              onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
              placeholder="English Literature, ESL, Creative Writing"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Current CEFR Level (if known)</label>
            <select
              value={formData.cefrLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, cefrLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select CEFR Level</option>
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Training Needs (comma-separated)</label>
            <input
              type="text"
              value={formData.trainingNeeds}
              onChange={(e) => setFormData(prev => ({ ...prev, trainingNeeds: e.target.value }))}
              placeholder="Digital Assessment, Classroom Management, Technology Integration"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Summer Break">Summer Break</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Any additional information about the teacher..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Nominate Teacher
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeacherDetailsModal({ teacher, onClose }: { teacher: Teacher; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Teacher Details</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">{teacher.firstName} {teacher.lastName}</h4>
              <p className="text-slate-600">{teacher.position} at {teacher.school}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Contact Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{teacher.school}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Professional Details</h5>
              <div className="space-y-2 text-sm">
                <div><strong>Department:</strong> {teacher.department}</div>
                <div><strong>Experience:</strong> {teacher.yearsExperience} years</div>
                <div><strong>CEFR Level:</strong> {teacher.cefrLevel || 'Not assessed'}</div>
                <div><strong>Availability:</strong> {teacher.availability}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-slate-900 mb-2">Qualifications</h5>
            <div className="flex flex-wrap gap-2">
              {teacher.qualifications.map((qual, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {qual}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-slate-900 mb-2">Subjects Taught</h5>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-slate-900 mb-2">Training Needs</h5>
            <div className="flex flex-wrap gap-2">
              {teacher.trainingNeeds.map((need, index) => (
                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  {need}
                </span>
              ))}
            </div>
          </div>
          
          {teacher.notes && (
            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Notes</h5>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{teacher.notes}</p>
            </div>
          )}
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h5 className="font-semibold text-slate-900 mb-2">Nomination Details</h5>
            <div className="text-sm text-slate-600 space-y-1">
              <div><strong>Nominated by:</strong> {teacher.nominatedBy}</div>
              <div><strong>Nomination Date:</strong> {teacher.nominationDate}</div>
              <div><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  teacher.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  teacher.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  teacher.status === 'enrolled' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {teacher.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}