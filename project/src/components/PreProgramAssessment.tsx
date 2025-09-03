import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  User, 
  BookOpen, 
  Headphones, 
  FileText, 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Target
} from 'lucide-react';
import { CEFR_LEVELS, CEFRLevel, AssessmentQuestion } from '../types/cefr';

const sampleQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    skill: 'reading',
    level: 'A1',
    question: 'Choose the correct answer: "Hello, my name _____ Sarah."',
    type: 'multiple-choice',
    options: ['is', 'are', 'am', 'be'],
    correctAnswer: 'is',
    points: 1
  },
  {
    id: '2',
    skill: 'listening',
    level: 'A2',
    question: 'Listen to the audio and choose what the person is talking about.',
    type: 'multiple-choice',
    options: ['Weather', 'Food', 'Travel', 'Work'],
    correctAnswer: 'Weather',
    points: 2
  },
  {
    id: '3',
    skill: 'reading',
    level: 'B1',
    question: 'Read the passage and identify the main idea.',
    type: 'multiple-choice',
    options: [
      'The importance of technology in education',
      'Traditional teaching methods',
      'Student motivation techniques',
      'Classroom management strategies'
    ],
    correctAnswer: 'The importance of technology in education',
    points: 3
  }
];

interface PreProgramAssessmentProps {
  participantId: string;
  onComplete: (assessment: any) => void;
  onClose: () => void;
}

export function PreProgramAssessment({ participantId, onComplete, onClose }: PreProgramAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skillBeingTested, setSkillBeingTested] = useState<'listening' | 'reading' | 'speaking' | 'writing'>('reading');
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  const steps = [
    'Introduction',
    'Listening Assessment',
    'Reading Assessment', 
    'Speaking Assessment',
    'Writing Assessment',
    'Results'
  ];

  const skillIcons = {
    listening: Headphones,
    reading: BookOpen,
    speaking: MessageCircle,
    writing: FileText
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateResults = () => {
    // Mock calculation - in real app, this would be more sophisticated
    const skillLevels = {
      listening: 'B1' as CEFRLevel['code'],
      reading: 'B2' as CEFRLevel['code'],
      speaking: 'B1' as CEFRLevel['code'],
      writing: 'A2' as CEFRLevel['code']
    };

    const overallLevel = 'B1' as CEFRLevel['code'];

    const assessment = {
      id: Date.now().toString(),
      participantId,
      assessmentDate: new Date().toISOString(),
      overallLevel,
      skillLevels,
      recommendations: [
        'Focus on writing skills development',
        'Continue building speaking confidence',
        'Maintain current reading level with challenging texts'
      ],
      pathwayAdjustments: [
        'Add extra writing workshops',
        'Include more speaking practice sessions',
        'Provide intermediate-level reading materials'
      ]
    };

    return assessment;
  };

  const renderIntroduction = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Target className="w-10 h-10 text-blue-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Pre-Program Assessment</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          This assessment will help us understand your current English proficiency level according to the 
          Common European Framework of Reference (CEFR). Based on your results, we'll customize your 
          learning pathway to match your needs.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {Object.entries(skillIcons).map(([skill, Icon]) => (
          <div key={skill} className="bg-slate-50 p-4 rounded-lg">
            <Icon className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700 capitalize">{skill}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg max-w-2xl mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">Assessment Details</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Duration: Approximately 30-45 minutes</li>
          <li>• 4 skill areas: Listening, Reading, Speaking, Writing</li>
          <li>• Adaptive questions based on CEFR levels (A1-C2)</li>
          <li>• Results will customize your learning pathway</li>
        </ul>
      </div>

      <button
        onClick={() => {
          setAssessmentStarted(true);
          setCurrentStep(1);
        }}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Start Assessment
      </button>
    </div>
  );

  const renderSkillAssessment = (skill: 'listening' | 'reading' | 'speaking' | 'writing') => {
    const Icon = skillIcons[skill];
    const skillQuestions = sampleQuestions.filter(q => q.skill === skill);
    const currentQ = skillQuestions[currentQuestion] || skillQuestions[0];

    if (!currentQ) {
      return (
        <div className="text-center">
          <p>No questions available for {skill}</p>
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 capitalize">{skill} Assessment</h2>
          <p className="text-slate-600">Question {currentQuestion + 1} of {skillQuestions.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="mb-4">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              Level: {currentQ.level}
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-slate-900 mb-4">{currentQ.question}</h3>

          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQ.id}
                    value={option}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'text' && (
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg"
              rows={4}
              placeholder="Type your answer here..."
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1);
              } else if (currentStep > 1) {
                setCurrentStep(prev => prev - 1);
                setCurrentQuestion(0);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={() => {
              if (currentQuestion < skillQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                setCurrentStep(prev => prev + 1);
                setCurrentQuestion(0);
              }
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const results = calculateResults();
    const overallLevelInfo = CEFR_LEVELS.find(level => level.code === results.overallLevel);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
          <p className="text-slate-600">Here are your CEFR proficiency results</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">Overall Level: {results.overallLevel}</h3>
            <p className="text-lg text-slate-700">{overallLevelInfo?.name}</p>
            <p className="text-sm text-slate-600 mt-2">{overallLevelInfo?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(results.skillLevels).map(([skill, level]) => {
            const Icon = skillIcons[skill as keyof typeof skillIcons];
            return (
              <div key={skill} className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                <Icon className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 capitalize">{skill}</p>
                <p className="text-lg font-bold text-blue-600">{level}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            {results.recommendations.map((rec, index) => (
              <li key={index}>• {rec}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onComplete(results)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Apply Results to Pathway
          </button>
          <button
            onClick={onClose}
            className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 font-medium"
          >
            Review Later
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900">CEFR Assessment</h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              {steps.map((step, index) => (
                <span key={index} className={index <= currentStep ? 'text-blue-600' : ''}>
                  {step}
                </span>
              ))}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {currentStep === 0 && renderIntroduction()}
          {currentStep === 1 && renderSkillAssessment('listening')}
          {currentStep === 2 && renderSkillAssessment('reading')}
          {currentStep === 3 && renderSkillAssessment('speaking')}
          {currentStep === 4 && renderSkillAssessment('writing')}
          {currentStep === 5 && renderResults()}
        </div>
      </div>
    </div>
  );
}