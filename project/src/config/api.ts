// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Workshop Agenda
  WORKSHOP_AGENDA: `${API_BASE_URL}/workshop-agenda`,
  WORKSHOP_AGENDA_BY_WORKSHOP: (workshopId: string) => `${API_BASE_URL}/workshop-agenda/workshop/${workshopId}`,
  WORKSHOP_AGENDA_ITEM: (id: string) => `${API_BASE_URL}/workshop-agenda/${id}`,
  WORKSHOP_AGENDA_ORDER: (id: string) => `${API_BASE_URL}/workshop-agenda/${id}/order`,
  WORKSHOP_AGENDA_REORDER: (workshopId: string) => `${API_BASE_URL}/workshop-agenda/workshop/${workshopId}/reorder`,
  
  // Workshops
  WORKSHOPS: `${API_BASE_URL}/workshops`,
  WORKSHOP_BY_ID: (id: string) => `${API_BASE_URL}/workshops/${id}`,
  WORKSHOPS_BY_PATHWAY: (pathwayId: string) => `${API_BASE_URL}/workshops/pathway/${pathwayId}`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USERS_BY_ROLE: (role: string) => `${API_BASE_URL}/users?role=${role}`,
  
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_PROFILE: `${API_BASE_URL}/auth/profile`,
  AUTH_PASSCODE_LOGIN: `${API_BASE_URL}/auth/passcode-login`,
  
  // Pathways
  PATHWAYS: `${API_BASE_URL}/pathways`,
  PATHWAY_BY_ID: (id: string) => `${API_BASE_URL}/pathways/${id}`,
  
  // Resources
  RESOURCES: `${API_BASE_URL}/resources`,
  RESOURCE_BY_ID: (id: string) => `${API_BASE_URL}/resources/${id}`,
  
  // Progress
  PROGRESS: `${API_BASE_URL}/progress`,
  PROGRESS_BY_PARTICIPANT: (participantId: string) => `${API_BASE_URL}/progress/participant/${participantId}`,
  
  // Assessments
  ASSESSMENTS: `${API_BASE_URL}/assessments`,
  ASSESSMENT_BY_ID: (id: string) => `${API_BASE_URL}/assessments/${id}`,
  
  // Certificates
  CERTIFICATES: `${API_BASE_URL}/certificates`,
  CERTIFICATE_BY_ID: (id: string) => `${API_BASE_URL}/certificates/${id}`,
  
  // Feedback
  FEEDBACK: `${API_BASE_URL}/feedback`,
  FEEDBACK_BY_ID: (id: string) => `${API_BASE_URL}/feedback/${id}`,
  
  // Teacher Nominations
  TEACHER_NOMINATIONS: `${API_BASE_URL}/teacher-nominations`,
  TEACHER_NOMINATION_BY_ID: (id: string) => `${API_BASE_URL}/teacher-nominations/${id}`,
  TEACHER_NOMINATION_STATUS: (id: string) => `${API_BASE_URL}/teacher-nominations/${id}/status`,
  TEACHER_NOMINATION_ENROLL: (id: string) => `${API_BASE_URL}/teacher-nominations/${id}/enroll`,
  
  // Learning Events
  LEARNING_EVENTS: `${API_BASE_URL}/learning-events`,
  LEARNING_EVENT_BY_ID: (id: string) => `${API_BASE_URL}/learning-events/${id}`,
  
  // Participants
  PARTICIPANTS: `${API_BASE_URL}/participants`,
  PARTICIPANT_BY_ID: (id: string) => `${API_BASE_URL}/participants/${id}`,
  
  // Curriculum
  CURRICULUM: `${API_BASE_URL}/curriculum`,
  CURRICULUM_BY_ID: (id: string) => `${API_BASE_URL}/curriculum/${id}`,
  
  // Branding
  BRANDING: `${API_BASE_URL}/branding`,
  BRANDING_BY_ID: (id: string) => `${API_BASE_URL}/branding/${id}`,
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  return url;
};
