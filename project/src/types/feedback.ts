export interface FeedbackQuestion {
  id: string;
  type: 'rating' | 'multiple-choice' | 'text' | 'scale' | 'yes-no';
  category: 'content' | 'delivery' | 'engagement' | 'relevance' | 'overall';
  question: string;
  options?: string[];
  required: boolean;
  scale?: {
    min: number;
    max: number;
    labels: string[];
  };
}

export interface FeedbackResponse {
  id: string;
  participantId: string;
  eventId: string;
  eventType: 'workshop' | 'elearning' | 'assessment' | 'program';
  submissionDate: string;
  responses: Record<string, any>;
  overallRating: number;
  comments?: string;
  anonymous: boolean;
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  eventType: 'workshop' | 'elearning' | 'assessment' | 'program';
  questions: FeedbackQuestion[];
  settings: {
    anonymous: boolean;
    required: boolean;
    autoSend: boolean;
    reminderEnabled: boolean;
  };
}

export interface FeedbackAnalytics {
  eventId: string;
  totalResponses: number;
  responseRate: number;
  averageRating: number;
  categoryScores: Record<string, number>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keyInsights: string[];
  recommendations: string[];
}