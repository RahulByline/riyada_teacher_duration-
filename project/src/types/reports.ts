export interface PersonalizedReport {
  id: string;
  participantId: string;
  participantName: string;
  generationDate: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  overview: {
    totalHours: number;
    completedActivities: number;
    totalActivities: number;
    overallProgress: number;
    cefrLevelStart: string;
    cefrLevelCurrent: string;
    cefrLevelTarget: string;
  };
  impactMeasurement: {
    skillsImprovement: Record<string, number>;
    competencyGains: Record<string, number>;
    behavioralChanges: string[];
    applicationInClassroom: string[];
    studentImpact: string[];
  };
  gapAnalysis: {
    identifiedGaps: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      priority: 'high' | 'medium' | 'low';
      recommendations: string[];
    }>;
    strengthAreas: string[];
    developmentAreas: string[];
  };
  detailedAnalytics: {
    attendanceRate: number;
    engagementScore: number;
    assessmentScores: Array<{
      assessment: string;
      score: number;
      date: string;
    }>;
    timeSpentByActivity: Record<string, number>;
    learningVelocity: number;
    retentionRate: number;
  };
  feedbackSummary: {
    averageRating: number;
    satisfactionScore: number;
    keyFeedback: string[];
    improvementSuggestions: string[];
  };
  recommendations: {
    nextSteps: string[];
    suggestedPathways: string[];
    additionalResources: string[];
    mentoringSuggestions: string[];
  };
}

export interface ImpactMetrics {
  participantId: string;
  preAssessmentScores: Record<string, number>;
  postAssessmentScores: Record<string, number>;
  skillProgressions: Array<{
    skill: string;
    baseline: number;
    current: number;
    target: number;
    improvement: number;
  }>;
  behavioralIndicators: Array<{
    indicator: string;
    baseline: number;
    current: number;
    measurementDate: string;
  }>;
  classroomApplication: Array<{
    technique: string;
    implementationDate: string;
    effectiveness: number;
    studentFeedback: string;
  }>;
}