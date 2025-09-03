export interface CEFRLevel {
  code: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  name: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  skills: {
    listening: string;
    reading: string;
    speaking: string;
    writing: string;
  };
}

export interface CEFRAssessment {
  id: string;
  participantId: string;
  assessmentDate: string;
  overallLevel: CEFRLevel['code'];
  skillLevels: {
    listening: CEFRLevel['code'];
    reading: CEFRLevel['code'];
    speaking: CEFRLevel['code'];
    writing: CEFRLevel['code'];
  };
  recommendations: string[];
  pathwayAdjustments: string[];
}

export interface AssessmentQuestion {
  id: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  level: CEFRLevel['code'];
  question: string;
  type: 'multiple-choice' | 'text' | 'audio' | 'speaking';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export const CEFR_LEVELS: CEFRLevel[] = [
  {
    code: 'A1',
    name: 'Breakthrough',
    category: 'Beginner',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
    skills: {
      listening: 'Can understand familiar words and very basic phrases concerning myself, my family and immediate concrete surroundings.',
      reading: 'Can understand familiar names, words and very simple sentences.',
      speaking: 'Can interact in a simple way provided the other person talks slowly and clearly.',
      writing: 'Can write a short, simple postcard, for example sending holiday greetings.'
    }
  },
  {
    code: 'A2',
    name: 'Waystage',
    category: 'Beginner',
    description: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.',
    skills: {
      listening: 'Can understand phrases and highest frequency vocabulary related to areas of most immediate personal relevance.',
      reading: 'Can read very short, simple texts. Can find specific, predictable information in simple everyday material.',
      speaking: 'Can communicate in simple and routine tasks requiring a simple and direct exchange of information.',
      writing: 'Can write short, simple notes and messages relating to matters in areas of immediate needs.'
    }
  },
  {
    code: 'B1',
    name: 'Threshold',
    category: 'Intermediate',
    description: 'Can understand the main points of clear standard input on familiar matters regularly encountered.',
    skills: {
      listening: 'Can understand the main points of clear standard speech on familiar matters regularly encountered in work, school, leisure, etc.',
      reading: 'Can understand texts that consist mainly of high frequency everyday or job-related language.',
      speaking: 'Can deal with most situations likely to arise whilst travelling in an area where the language is spoken.',
      writing: 'Can write simple connected text on topics which are familiar or of personal interest.'
    }
  },
  {
    code: 'B2',
    name: 'Vantage',
    category: 'Intermediate',
    description: 'Can understand the main ideas of complex text on both concrete and abstract topics.',
    skills: {
      listening: 'Can understand extended speech and lectures and follow even complex lines of argument provided the topic is reasonably familiar.',
      reading: 'Can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints.',
      speaking: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.',
      writing: 'Can write clear, detailed text on a wide range of subjects related to my interests.'
    }
  },
  {
    code: 'C1',
    name: 'Effective Operational Proficiency',
    category: 'Advanced',
    description: 'Can understand a wide range of demanding, longer texts, and recognise implicit meaning.',
    skills: {
      listening: 'Can understand extended speech even when it is not clearly structured and when relationships are only implied.',
      reading: 'Can understand long and complex factual and literary texts, appreciating distinctions of style.',
      speaking: 'Can express ideas fluently and spontaneously without much obvious searching for expressions.',
      writing: 'Can express myself in clear, well-structured text, expressing points of view at some length.'
    }
  },
  {
    code: 'C2',
    name: 'Mastery',
    category: 'Advanced',
    description: 'Can understand with ease virtually everything heard or read.',
    skills: {
      listening: 'Can easily understand virtually everything heard, even when delivered at fast native speed.',
      reading: 'Can read with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts.',
      speaking: 'Can take part effortlessly in any conversation or discussion and have a good familiarity with idiomatic expressions.',
      writing: 'Can write clear, smoothly-flowing text in an appropriate style.'
    }
  }
];