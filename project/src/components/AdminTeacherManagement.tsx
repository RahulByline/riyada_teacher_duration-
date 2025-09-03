import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  X, 
  Eye, 
  Edit3,
  GraduationCap,
  Calendar,
  Award,
  TrendingUp,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useTeacherNominations } from '../hooks/useTeacherNominations';
import { usePathways } from '../hooks/useMySQL';


export function AdminTeacherManagement() {
  const { nominations: teachers, loading, updateNominationStatus, enrollInProgram } = useTeacherNominations();
  const { data: pathways, loading: pathwaysLoading } = usePathways();
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const availablePrograms = pathways.map(p => ({ id: p.id, title: p.title }));

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (teacherId: string) => {
    try {
      await updateNominationStatus(teacherId, 'approved');
    } catch (error) {
      console.error('Failed to approve teacher:', error);
    }
  };

  const handleReject = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to reject this nomination?')) {
      try {
        await updateNominationStatus(teacherId, 'rejected');
      } catch (error) {
        console.error('Failed to reject teacher:', error);
      }
    }
  };

  const handleEnroll = async (teacherId: string, programIds: string[]) => {
    try {
      // Enroll in each selected program
      for (const programId of programIds) {
        await enrollInProgram(teacherId, programId);
      }
      setShowEnrollModal(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Failed to enroll teacher:', error);
    }
  };

  if (loading || pathwaysLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'enrolled': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teacher Management</h2>
          <p className="text-slate-600 mt-1">Manage nominated teachers and program enrollments</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Pending Approval</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'pending').length}
          </p>
          <p className="text-sm text-slate-600">Awaiting review</p>
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
          <p className="text-sm text-slate-600">Ready for enrollment</p>
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
          <p className="text-sm text-slate-600">In training programs</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {teachers.filter(t => t.status === 'completed').length}
          </p>
          <p className="text-sm text-slate-600">Graduated teachers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="enrolled">Enrolled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Teachers Table */}
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
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Programs</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(teacher.status)}`}>
                      {teacher.status}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm text-slate-600">
                      {teacher.enrolledPrograms?.length || 0} programs
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {teacher.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(teacher.id)}
                            className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(teacher.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {(teacher.status === 'approved' || teacher.status === 'enrolled') && (
                        <button 
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEnrollModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Enroll in Program"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && selectedTeacher && (
        <EnrollmentModal 
          teacher={selectedTeacher}
          availablePrograms={availablePrograms}
          onEnroll={handleEnroll}
          onClose={() => {
            setShowEnrollModal(false);
            setSelectedTeacher(null);
          }}
        />
      )}

      {/* Teacher Details Modal */}
      {showDetailsModal && selectedTeacher && (
        <TeacherDetailsModal 
          teacher={selectedTeacher}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTeacher(null);
          }}
        />
      )}
    </div>
  );
}

function EnrollmentModal({ 
  teacher, 
  availablePrograms, 
  onEnroll, 
  onClose 
}: { 
  teacher: any; 
  availablePrograms: { id: string; title: string }[]; 
  onEnroll: (teacherId: string, programs: string[]) => void;
  onClose: () => void;
}) {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(p => p !== programId)
        : [...prev, programId]
    );
  };

  const handleSubmit = () => {
    if (selectedPrograms.length > 0) {
      onEnroll(teacher.id, selectedPrograms);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Enroll Teacher in Programs</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{teacher.firstName} {teacher.lastName}</h4>
              <p className="text-sm text-slate-600">{teacher.position} at {teacher.school}</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-slate-900 mb-3">Select Training Programs</h5>
            <div className="space-y-3">
              {availablePrograms.map((program) => {
                const isEnrolled = teacher.enrolledPrograms?.includes(program.title);
                const isSelected = selectedPrograms.includes(program.id);
                
                return (
                  <label 
                    key={program.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      isEnrolled 
                        ? 'border-green-200 bg-green-50 cursor-not-allowed' 
                        : isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleProgramToggle(program.id)}
                      disabled={isEnrolled}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${isEnrolled ? 'text-green-700' : 'text-slate-900'}`}>
                        {program.title}
                      </span>
                      {isEnrolled && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Already Enrolled
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedPrograms.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enroll in {selectedPrograms.length} Program{selectedPrograms.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
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
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
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

          {teacher.enrolledPrograms && teacher.enrolledPrograms.length > 0 && (
            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Enrolled Programs</h5>
              <div className="flex flex-wrap gap-2">
                {teacher.enrolledPrograms.map((program, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {program}
                  </span>
                ))}
              </div>
            </div>
          )}
          
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