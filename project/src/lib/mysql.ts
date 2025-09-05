// MySQL Client for Learning Pathway Application
// This replaces the Supabase client with direct API calls to our MySQL backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class MySQLClient {
  private token: string | null = null;

  // Set authentication token
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Get authentication token
  getAuthToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Make authenticated API request
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuth();
        throw new Error('Authentication required');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async signUp(email: string, password: string, name: string, role: string) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async signIn(email: string, password: string) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async signOut() {
    await this.makeRequest('/auth/logout', { method: 'POST' });
    this.clearAuth();
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  // User management
  async getUsers() {
    return this.makeRequest('/users');
  }

  async getUsersByRole(role: string) {
    return this.makeRequest(`/users/role/${role}`);
  }

  async createUser(data: any) {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUser(id: string) {
    return this.makeRequest(`/users/${id}`);
  }

  async updateUser(id: string, data: any) {
    return this.makeRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.makeRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Pathway management
  async getPathways() {
    return this.makeRequest('/pathways');
  }

  async getPathway(id: string) {
    return this.makeRequest(`/pathways/${id}`);
  }

  async createPathway(data: any) {
    const timestamp = new Date().toISOString();
    console.log(`🌐 MySQL Client: createPathway API call at ${timestamp}`, data);
    return this.makeRequest('/pathways', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePathway(id: string, data: any) {
    return this.makeRequest(`/pathways/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePathway(id: string) {
    return this.makeRequest(`/pathways/${id}`, {
      method: 'DELETE',
    });
  }

  // Pathway participants (teachers)
  async getPathwayParticipants(pathwayId: string) {
    return this.makeRequest(`/pathways/${pathwayId}/participants`);
  }

  async addPathwayParticipant(pathwayId: string, teacherId: string) {
    return this.makeRequest(`/pathways/${pathwayId}/participants`, {
      method: 'POST',
      body: JSON.stringify({ teacher_id: teacherId }),
    });
  }

  async removePathwayParticipant(pathwayId: string, participantId: string) {
    return this.makeRequest(`/pathways/${pathwayId}/participants/${participantId}`, {
      method: 'DELETE',
    });
  }

  // Pathway trainers
  async getPathwayTrainers(pathwayId: string) {
    return this.makeRequest(`/pathways/${pathwayId}/trainers`);
  }

  async addPathwayTrainer(pathwayId: string, trainerId: string, role: string = 'assistant_trainer') {
    return this.makeRequest(`/pathways/${pathwayId}/trainers`, {
      method: 'POST',
      body: JSON.stringify({ trainer_id: trainerId, role }),
    });
  }

  async removePathwayTrainer(pathwayId: string, trainerAssignmentId: string) {
    return this.makeRequest(`/pathways/${pathwayId}/trainers/${trainerAssignmentId}`, {
      method: 'DELETE',
    });
  }

  async getPathwaysByParticipant(participantId: string) {
    return this.makeRequest(`/pathways/participant/${participantId}`);
  }

  // Learning events
  async getLearningEvents() {
    return this.makeRequest('/learning-events');
  }

  async getLearningEventsByPathway(pathwayId: string) {
    return this.makeRequest(`/learning-events/pathway/${pathwayId}`);
  }

  async createLearningEvent(data: any) {
    return this.makeRequest('/learning-events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteLearningEvent(eventId: string) {
    return this.makeRequest(`/learning-events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Participants
  async getParticipants() {
    return this.makeRequest('/participants');
  }

  async getParticipantsByPathway(pathwayId: string) {
    return this.makeRequest(`/participants/pathway/${pathwayId}`);
  }

  async enrollParticipant(data: any) {
    return this.makeRequest('/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Assessments
  async getAssessments() {
    return this.makeRequest('/assessments');
  }

  async createAssessment(data: any) {
    return this.makeRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Certificates
  async getCertificates() {
    return this.makeRequest('/certificates');
  }

  async generateCertificate(data: any) {
    return this.makeRequest('/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Feedback
  async getFeedback() {
    return this.makeRequest('/feedback');
  }

  async submitFeedback(data: any) {
    return this.makeRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Branding
  async getBrandingSettings() {
    return this.makeRequest('/branding');
  }

  async updateBrandingSettings(data: any) {
    return this.makeRequest('/branding', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Progress Tracking
  async getProgressTracking() {
    return this.makeRequest('/progress');
  }

  async getProgressByParticipant(participantId: string) {
    return this.makeRequest(`/progress/participant/${participantId}`);
  }

  async getProgressByEvent(eventId: string) {
    return this.makeRequest(`/progress/event/${eventId}`);
  }

  async createProgressTracking(data: any) {
    return this.makeRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProgressTracking(id: string, data: any) {
    return this.makeRequest(`/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProgressTracking(id: string) {
    return this.makeRequest(`/progress/${id}`, {
      method: 'DELETE',
    });
  }

  // Workshops
  async getWorkshops() {
    return this.makeRequest('/workshops');
  }

  async getWorkshopsByPathway(pathwayId: string) {
    return this.makeRequest(`/workshops/pathway/${pathwayId}`);
  }

  async getWorkshop(id: string) {
    return this.makeRequest(`/workshops/${id}`);
  }

  async getWorkshopAgenda(workshopId: string) {
    return this.makeRequest(`/workshops/${workshopId}/agenda`);
  }

  async createWorkshop(data: any) {
    return this.makeRequest('/workshops', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkshop(id: string, data: any) {
    return this.makeRequest(`/workshops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkshop(id: string) {
    return this.makeRequest(`/workshops/${id}`, {
      method: 'DELETE',
    });
  }

  // Resources
  async getResources() {
    return this.makeRequest('/resources');
  }

  async getResourcesByType(type: string) {
    return this.makeRequest(`/resources/type/${type}`);
  }

  async getResource(id: string) {
    return this.makeRequest(`/resources/${id}`);
  }

  async createResource(data: any) {
    return this.makeRequest('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResource(id: string, data: any) {
    return this.makeRequest(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResource(id: string) {
    return this.makeRequest(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  // Resource linking
  async getResourcesByWorkshop(workshopId: string) {
    return this.makeRequest(`/resources/workshop/${workshopId}`);
  }

  async getResourcesByAgendaItem(agendaItemId: string) {
    return this.makeRequest(`/resources/agenda/${agendaItemId}`);
  }

  async getResourcesByLearningEvent(eventId: string) {
    return this.makeRequest(`/resources/learning-event/${eventId}`);
  }

  async getResourcesByPathway(pathwayId: string) {
    return this.makeRequest(`/resources/pathway/${pathwayId}`);
  }

  async linkResourceToWorkshop(resourceId: string, workshopId: string, resourceType: string = 'optional', displayOrder: number = 0) {
    return this.makeRequest('/resources/link/workshop', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, workshop_id: workshopId, resource_type: resourceType, display_order: displayOrder }),
    });
  }

  async linkResourceToAgendaItem(resourceId: string, agendaItemId: string, resourceType: string = 'optional', displayOrder: number = 0) {
    return this.makeRequest('/resources/link/agenda', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, agenda_item_id: agendaItemId, resource_type: resourceType, display_order: displayOrder }),
    });
  }

  async linkResourceToLearningEvent(resourceId: string, learningEventId: string, resourceType: string = 'optional', displayOrder: number = 0) {
    return this.makeRequest('/resources/link/learning-event', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, learning_event_id: learningEventId, resource_type: resourceType, display_order: displayOrder }),
    });
  }

  async unlinkResourceFromWorkshop(resourceId: string, workshopId: string) {
    return this.makeRequest(`/resources/unlink/workshop/${resourceId}/${workshopId}`, {
      method: 'DELETE',
    });
  }

  async unlinkResourceFromAgendaItem(resourceId: string, agendaItemId: string) {
    return this.makeRequest(`/resources/unlink/agenda/${resourceId}/${agendaItemId}`, {
      method: 'DELETE',
    });
  }

  // Curriculum Management
  async getGrades() {
    return this.makeRequest('/curriculum/grades');
  }

  async getGrade(id: string) {
    return this.makeRequest(`/curriculum/grades/${id}`);
  }

  async createGrade(data: any) {
    return this.makeRequest('/curriculum/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGrade(id: string, data: any) {
    return this.makeRequest(`/curriculum/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGrade(id: string) {
    return this.makeRequest(`/curriculum/grades/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubjects() {
    return this.makeRequest('/curriculum/subjects');
  }

  async getUnits() {
    return this.makeRequest('/curriculum/units');
  }

  async getLessons() {
    return this.makeRequest('/curriculum/lessons');
  }

  // Teacher Nominations
  async getTeacherNominations() {
    return this.makeRequest('/teacher-nominations');
  }

  async getTeacherNomination(id: string) {
    return this.makeRequest(`/teacher-nominations/${id}`);
  }

  async createTeacherNomination(data: any) {
    return this.makeRequest('/teacher-nominations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacherNominationStatus(id: string, status: string) {
    return this.makeRequest(`/teacher-nominations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async enrollTeacherInProgram(nominationId: string, pathwayId: string) {
    return this.makeRequest(`/teacher-nominations/${nominationId}/enroll`, {
      method: 'POST',
      body: JSON.stringify({ pathway_id: pathwayId }),
    });
  }

  async getTeacherNominationEnrollments(id: string) {
    return this.makeRequest(`/teacher-nominations/${id}/enrollments`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.json();
    } catch (error) {
      throw new Error('Backend server is not accessible');
    }
  }
}

// Create and export singleton instance
export const mysqlClient = new MySQLClient();

// Export types for compatibility
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'trainer' | 'participant' | 'client'
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'trainer' | 'participant' | 'client'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'trainer' | 'participant' | 'client'
          avatar_url?: string
          updated_at?: string
        }
      }
      pathways: {
        Row: {
          id: string
          title: string
          description: string
          duration: number
          total_hours: number
          status: 'draft' | 'active' | 'completed'
          cefr_level?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          duration: number
          total_hours: number
          status?: 'draft' | 'active' | 'completed'
          cefr_level?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          duration?: number
          total_hours?: number
          status?: 'draft' | 'active' | 'completed'
          cefr_level?: string
          updated_at?: string
        }
      }
      learning_events: {
        Row: {
          id: string
          pathway_id: string
          title: string
          description: string
          type: 'workshop' | 'elearning' | 'assessment' | 'assignment' | 'group' | 'checkpoint'
          start_date: string
          end_date: string
          duration: number
          format: 'online' | 'offline' | 'blended'
          objectives: string[]
          resources: string[]
          dependencies: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pathway_id: string
          title: string
          description: string
          type: 'workshop' | 'elearning' | 'assessment' | 'assignment' | 'group' | 'checkpoint'
          start_date: string
          end_date: string
          duration: number
          format: 'online' | 'offline' | 'blended'
          objectives?: string[]
          resources?: string[]
          dependencies?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pathway_id?: string
          title?: string
          description?: string
          type?: 'workshop' | 'elearning' | 'assessment' | 'assignment' | 'group' | 'checkpoint'
          start_date?: string
          end_date?: string
          duration?: number
          format?: 'online' | 'offline' | 'blended'
          objectives?: string[]
          resources?: string[]
          dependencies?: string[]
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          user_id: string
          pathway_id: string
          enrollment_date: string
          completion_date?: string
          progress: number
          cefr_level_start?: string
          cefr_level_current?: string
          cefr_level_target?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pathway_id: string
          enrollment_date: string
          completion_date?: string
          progress?: number
          cefr_level_start?: string
          cefr_level_current?: string
          cefr_level_target?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          completion_date?: string
          progress?: number
          cefr_level_current?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          participant_id: string
          assessment_date: string
          overall_level: string
          skill_levels: {
            listening: string
            reading: string
            speaking: string
            writing: string
          }
          recommendations: string[]
          pathway_adjustments: string[]
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          assessment_date: string
          overall_level: string
          skill_levels: {
            listening: string
            reading: string
            speaking: string
            writing: string
          }
          recommendations?: string[]
          pathway_adjustments?: string[]
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          participant_id: string
          participant_name: string
          program_title: string
          completion_date: string
          issue_date: string
          certificate_type: 'completion' | 'achievement' | 'participation'
          total_hours: number
          cefr_level?: string
          grade?: string
          skills: string[]
          verification_code: string
          template: 'standard' | 'premium' | 'custom'
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          participant_name: string
          program_title: string
          completion_date: string
          issue_date: string
          certificate_type: 'completion' | 'achievement' | 'participation'
          total_hours: number
          cefr_level?: string
          grade?: string
          skills?: string[]
          verification_code: string
          template?: 'standard' | 'premium' | 'custom'
          created_at?: string
        }
      }
      feedback_responses: {
        Row: {
          id: string
          participant_id: string
          event_id: string
          event_type: 'workshop' | 'elearning' | 'assessment' | 'program'
          submission_date: string
          responses: Record<string, any>
          overall_rating: number
          comments?: string
          anonymous: boolean
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          event_id: string
          event_type: 'workshop' | 'elearning' | 'assessment' | 'program'
          submission_date: string
          responses: Record<string, any>
          recommendations?: string[]
          pathway_adjustments?: string[]
          created_at?: string
        }
      }
      branding_settings: {
        Row: {
          id: string
          portal_name: string
          logo_url?: string
          primary_color: string
          secondary_color: string
          accent_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portal_name?: string
          logo_url?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          created_at?: string
        }
        Update: {
          id?: string
          portal_name?: string
          logo_url?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          updated_at?: string
        }
      }
    }
  }
}

// Export for backward compatibility
export const supabase = mysqlClient;
