import React, { useState } from 'react';
import { CheckCircle, Clock, Star, ArrowRight, BookOpen, Target } from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
}

const mockQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    question: 'Which sentence is grammatically correct?',
    options: [
      'She have been teaching for 5 years.',
      'She has been teaching for 5 years.',
      'She had been teaching for 5 years.',
      'She having been teaching for 5 years.'
    ],
    correctAnswer: 'She has been teaching for 5 years.',
    skill: 'reading'
  },
  {
    id: '2',
    question: 'What is the best way to engage students in a grammar lesson?',
    options: [
      'Lecture for the entire class period',
      'Use interactive activities and real-world examples',
      'Give them worksheets to complete silently',
      'Show them grammar rules on the board'
    ],
    correctAnswer: 'Use interactive activities and real-world examples',
    skill: 'reading'
  }
];

export function LearnerAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [mockQuestions[currentQuestion].id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    mockQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / mockQuestions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
          <p className="text-slate-600">Here are your results</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-2">{score}%</div>
            <p className="text-lg text-slate-700">Overall Score</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Skill Breakdown</h3>
          <div className="space-y-3">
            {['Grammar', 'Teaching Methods', 'Classroom Management', 'Assessment'].map((skill, index) => (
              <div key={skill} className="flex justify-between items-center">
                <span className="text-slate-700">{skill}</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (4 - index * 0.5) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Recommendations</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Focus on advanced grammar concepts</li>
            <li>• Practice interactive teaching methods</li>
            <li>• Develop classroom management strategies</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Continue to Learning Path
          </button>
        </div>
      </div>
    );
  }

  const question = mockQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Skills Assessment</h2>
          <p className="text-slate-600">Question {currentQuestion + 1} of {mockQuestions.length}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="mb-4">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">
            {question.skill}
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name={question.id}
                value={option}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={!answers[question.id]}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === mockQuestions.length - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}