import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  BarChart3, 
  Send, 
  Eye,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Settings
} from 'lucide-react';
import { FeedbackTemplate, FeedbackResponse, FeedbackAnalytics } from '../types/feedback';

const mockFeedbackTemplates: FeedbackTemplate[] = [
  {
    id: '1',
    name: 'Workshop Feedback',
    eventType: 'workshop',
    questions: [
      {
        id: '1',
        type: 'rating',
        category: 'overall',
        question: 'How would you rate this workshop overall?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] }
      },
      {
        id: '2',
        type: 'rating',
        category: 'content',
        question: 'How relevant was the content to your teaching needs?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Not Relevant', 'Slightly Relevant', 'Moderately Relevant', 'Very Relevant', 'Extremely Relevant'] }
      },
      {
        id: '3',
        type: 'rating',
        category: 'delivery',
        question: 'How effective was the facilitator?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'] }
      },
      {
        id: '4',
        type: 'text',
        category: 'overall',
        question: 'What did you find most valuable about this workshop?',
        required: false
      },
      {
        id: '5',
        type: 'text',
        category: 'overall',
        question: 'What suggestions do you have for improvement?',
        required: false
      }
    ],
    settings: {
      anonymous: true,
      required: true,
      autoSend: true,
      reminderEnabled: true
    }
  },
  {
    id: '2',
    name: 'eLearning Module Feedback',
    eventType: 'elearning',
    questions: [
      {
        id: '1',
        type: 'rating',
        category: 'content',
        question: 'How clear and understandable was the content?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Very Unclear', 'Unclear', 'Neutral', 'Clear', 'Very Clear'] }
      },
      {
        id: '2',
        type: 'rating',
        category: 'engagement',
        question: 'How engaging was the learning experience?',
        required: true,
        scale: { min: 1, max: 5, labels: ['Not Engaging', 'Slightly Engaging', 'Moderately Engaging', 'Very Engaging', 'Extremely Engaging'] }
      },
      {
        id: '3',
        type: 'multiple-choice',
        category: 'relevance',
        question: 'Which aspects were most helpful?',
        options: ['Video Content', 'Interactive Exercises', 'Reading Materials', 'Quizzes', 'Case Studies'],
        required: false
      }
    ],
    settings: {
      anonymous: true,
      required: false,
      autoSend: true,
      reminderEnabled: false
    }
  }
];

const mockFeedbackResponses: FeedbackResponse[] = [
  {
    id: '1',
    participantId: '1',
    eventId: 'workshop-1',
    eventType: 'workshop',
    submissionDate: '2024-03-15',
    responses: {
      '1': 5,
      '2': 4,
      '3': 5,
      '4': 'The practical examples were excellent and directly applicable to my classroom.',
      '5': 'More time for hands-on practice would be beneficial.'
    },
    overallRating: 4.7,
    comments: 'Great workshop overall!',
    anonymous: true
  },
  {
    id: '2',
    participantId: '2',
    eventId: 'workshop-1',
    eventType: 'workshop',
    submissionDate: '2024-03-15',
    responses: {
      '1': 4,
      '2': 5,
      '3': 4,
      '4': 'The interactive activities were very engaging.',
      '5': 'Could use more technology integration examples.'
    },
    overallRating: 4.3,
    comments: 'Very informative session.',
    anonymous: true
  }
];

const mockAnalytics: FeedbackAnalytics = {
  eventId: 'workshop-1',
  totalResponses: 24,
  responseRate: 85.7,
  averageRating: 4.5,
  categoryScores: {
    overall: 4.5,
    content: 4.3,
    delivery: 4.7,
    engagement: 4.2,
    relevance: 4.6
  },
  sentimentAnalysis: {
    positive: 78,
    neutral: 18,
    negative: 4
  },
  keyInsights: [
    'Participants highly value practical examples',
    'Facilitator effectiveness rated very highly',
    'Content relevance is strong',
    'Request for more hands-on practice time'
  ],
  recommendations: [
    'Increase hands-on practice sessions',
    'Add more technology integration examples',
    'Maintain current facilitator approach',
    'Continue focus on practical applications'
  ]
};

export function FeedbackSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'analytics' | 'templates'>('overview');
  const [selectedEvent, setSelectedEvent] = useState('workshop-1');
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [templates, setTemplates] = useState(mockFeedbackTemplates);
  const [responses, setResponses] = useState(mockFeedbackResponses);

  const createTemplate = (templateData: any) => {
    const newTemplate: FeedbackTemplate = {
      id: Date.now().toString(),
      name: templateData.name,
      eventType: templateData.eventType,
      questions: [],
      settings: {
        anonymous: templateData.anonymous || false,
        required: templateData.required || false,
        autoSend: templateData.autoSend || false,
        reminderEnabled: templateData.reminderEnabled || false
      }
    };
    setTemplates(prev => [...prev, newTemplate]);
    setShowCreateTemplate(false);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Total Responses</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockAnalytics.totalResponses}</p>
          <p className="text-sm text-slate-600">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Response Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockAnalytics.responseRate}%</p>
          <p className="text-sm text-slate-600">Average across events</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Avg Rating</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockAnalytics.averageRating}/5</p>
          <p className="text-sm text-slate-600">Overall satisfaction</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Sentiment</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockAnalytics.sentimentAnalysis.positive}%</p>
          <p className="text-sm text-slate-600">Positive feedback</p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Feedback Categories</h3>
        <div className="space-y-4">
          {Object.entries(mockAnalytics.categoryScores).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-700 capitalize">{category}</span>
                <span className="text-sm font-bold text-slate-900">{score}/5</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    score >= 4.5 ? 'bg-green-500' : 
                    score >= 4.0 ? 'bg-blue-500' : 
                    score >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
          <ul className="space-y-2">
            {mockAnalytics.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {mockAnalytics.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderResponses = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Feedback Responses</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Event</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Rating</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Submitted</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Type</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">Workshop: Digital Assessment</p>
                      <p className="text-sm text-slate-600">Event ID: {response.eventId}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${
                            star <= response.overallRating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{response.overallRating}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center text-sm text-slate-600">
                    {new Date(response.submissionDate).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      response.eventType === 'workshop' ? 'bg-blue-100 text-blue-700' :
                      response.eventType === 'elearning' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {response.eventType}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Feedback Templates</h3>
        <button 
          onClick={() => setShowCreateTemplate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900">{template.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                template.eventType === 'workshop' ? 'bg-blue-100 text-blue-700' :
                template.eventType === 'elearning' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {template.eventType}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-600">{template.questions.length} questions</p>
              <div className="flex flex-wrap gap-2">
                {template.settings.anonymous && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">Anonymous</span>
                )}
                {template.settings.required && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">Required</span>
                )}
                {template.settings.autoSend && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">Auto-send</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                Edit
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {showCreateTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Feedback Template</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              createTemplate({
                name: formData.get('name'),
                eventType: formData.get('eventType'),
                anonymous: formData.get('anonymous') === 'on',
                required: formData.get('required') === 'on',
                autoSend: formData.get('autoSend') === 'on',
                reminderEnabled: formData.get('reminderEnabled') === 'on'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Template Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Type</label>
                  <select
                    name="eventType"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="workshop">Workshop</option>
                    <option value="elearning">eLearning</option>
                    <option value="assessment">Assessment</option>
                    <option value="program">Program</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input name="anonymous" type="checkbox" className="mr-2" />
                    <span className="text-sm text-slate-700">Anonymous responses</span>
                  </label>
                  <label className="flex items-center">
                    <input name="required" type="checkbox" className="mr-2" />
                    <span className="text-sm text-slate-700">Required feedback</span>
                  </label>
                  <label className="flex items-center">
                    <input name="autoSend" type="checkbox" className="mr-2" />
                    <span className="text-sm text-slate-700">Auto-send after event</span>
                  </label>
                  <label className="flex items-center">
                    <input name="reminderEnabled" type="checkbox" className="mr-2" />
                    <span className="text-sm text-slate-700">Send reminders</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateTemplate(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Feedback System</h2>
          <p className="text-slate-600 mt-1">Collect and analyze feedback from all learning touchpoints</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg"
          >
            <option value="workshop-1">Digital Assessment Workshop</option>
            <option value="elearning-1">Grammar Fundamentals Module</option>
            <option value="program-1">Teaching Mastery Program</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'responses', label: 'Responses', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'templates', label: 'Templates', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'responses' && renderResponses()}
      {activeTab === 'analytics' && renderOverview()} {/* Reusing overview for now */}
      {activeTab === 'templates' && renderTemplates()}
    </div>
  );
}