import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  User, 
  Calendar,
  Save,
  X,
  Edit3,
  Eye,
  Clock,
  Shield
} from 'lucide-react';
import { mysqlClient } from '../lib/mysql';

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    password: '',
    confirmPassword: ''
  });

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Fetch both teachers and trainers
      const [teachersResponse, trainersResponse] = await Promise.all([
        mysqlClient.getUsersByRole('teacher'),
        mysqlClient.getUsersByRole('trainer')
      ]);
      
      const allUsers = [
        ...(teachersResponse.users || []),
        ...(trainersResponse.users || [])
      ];
      
      setTeachers(allUsers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await mysqlClient.createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      });

      if (response.user) {
        setTeachers(prev => [response.user, ...prev]);
        setShowCreateForm(false);
        resetForm();
        alert('Teacher created successfully!');
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert('Failed to create teacher. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'teacher',
      password: '',
      confirmPassword: ''
    });
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      password: '',
      confirmPassword: ''
    });
    setShowCreateForm(true);
  };

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTeacher) return;

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await mysqlClient.updateUser(editingTeacher.id, updateData);

      if (response.user) {
        setTeachers(prev => prev.map(teacher => 
          teacher.id === editingTeacher.id ? response.user : teacher
        ));
        setShowCreateForm(false);
        setEditingTeacher(null);
        resetForm();
        alert('Teacher updated successfully!');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Failed to update teacher. Please try again.');
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    try {
      await mysqlClient.deleteUser(teacherId);
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      alert('Teacher deleted successfully!');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Teacher Management</h2>
          <p className="text-slate-600 mt-1">Create and manage teacher and trainer accounts for the training portal</p>
        </div>
        <button 
          onClick={() => {
            setEditingTeacher(null);
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Teacher
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{teacher.name}</h3>
                  <p className="text-sm text-slate-600">{teacher.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setShowDetails(true);
                  }}
                  className="p-1 text-slate-400 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditTeacher(teacher)}
                  className="p-1 text-slate-400 hover:text-orange-600"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{teacher.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(teacher.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Teacher Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingTeacher ? 'Edit User' : 'Create New User'}
                </h3>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTeacher(null);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={editingTeacher ? handleUpdateTeacher : handleCreateTeacher} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter teacher's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="teacher">Teacher</option>
                  <option value="trainer">Trainer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password {editingTeacher ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingTeacher}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password {editingTeacher ? '(leave blank to keep current)' : '*'}</label>
                <input
                  type="password"
                  required={!editingTeacher}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTeacher(null);
                    resetForm();
                  }}
                  className="px-6 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingTeacher ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Details Modal */}
      {showDetails && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">User Details</h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{selectedTeacher.name}</h4>
                  <p className="text-slate-600">{selectedTeacher.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Role</p>
                    <p className="font-medium text-slate-900 capitalize">{selectedTeacher.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="font-medium text-slate-900">
                      {new Date(selectedTeacher.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <p className="font-medium text-slate-900">
                      {new Date(selectedTeacher.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
