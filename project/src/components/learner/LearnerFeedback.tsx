import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface FeedbackForm {
  eventTitle: string;
  eventType: 'workshop' | 'elearning' | 'assessment';
  questions: {
    id: string;
    question: string;
    type: 'rating' | 'text' | 'multiple-choice';
    options?: string[];
    required: boolean;
  }[];
}

const mockFeedbackForm: FeedbackForm = {
  eventTitle: 'Advanced Grammar Workshop',
  eventType: 'workshop',
  questions: [
    {
      id: '1',
      question: 'How would you rate this workshop overall?',
      type: 'rating',
      required: true
    },
    {
      id: '2',
      question: 'How relevant was the content to your teaching needs?',
      type: 'rating',
      required: true
    },
    {
      id: '3',
      question: 'Which aspects were most helpful?',
      type: 'multiple-choice',
      options: ['Practical Examples', 'Interactive Activities', 'Resource Materials', 'Group Discussions'],
      required: false
    },
    {
      id: '4',
      question: 'What did you find most valuable about this workshop?',
      type: 'text',
      required: false
    },
    {
      id: '5',
      question: 'What suggestions do you have for improvement?',
      type: 'text',
      required: false
    }
  ]
};

export function LearnerFeedback() {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (questionId: string, rating: number) => {
    setResponses(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setResponses(prev => ({ ...prev, [questionId]: text }));
  };

  const handleMultipleChoiceChange = (questionId: string, option: string) => {
    setResponses(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', responses);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-600">Your feedback has been submitted successfully.</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Another Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Workshop Feedback</h2>
        <p className="text-slate-600">{mockFeedbackForm.eventTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mockFeedbackForm.questions.map((question) => (
          <div key={question.id} className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-slate-900">{question.question}</h3>
              {question.required && <span className="text-red-500 text-sm">*</span>}
            </div>

            {question.type === 'rating' && (
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(question.id, rating)}
                    className="p-1"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        (responses[question.id] || 0) >= rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-slate-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-sm text-slate-600">
                  {responses[question.id] ? `${responses[question.id]}/5` : 'Click to rate'}
                </span>
              </div>
            )}

            {question.type === 'text' && (
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Type your response here..."
                value={responses[question.id] || ''}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
              />
            )}

            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      onChange={(e) => handleMultipleChoiceChange(question.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}