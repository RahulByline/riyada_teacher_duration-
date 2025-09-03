import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Mail, 
  TrendingUp, 
  Target, 
  Award,
  BarChart3,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';
import { PersonalizedReport, ImpactMetrics } from '../types/reports';

const mockReports: PersonalizedReport[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Sarah Mitchell',
    generationDate: '2024-03-15',
    reportPeriod: {
      startDate: '2024-01-15',
      endDate: '2024-03-15'
    },
    overview: {
      totalHours: 68,
      completedActivities: 24,
      totalActivities: 28,
      overallProgress: 85,
      cefrLevelStart: 'B1',
      cefrLevelCurrent: 'B2',
      cefrLevelTarget: 'C1'
    },
    impactMeasurement: {
      skillsImprovement: {
        'Grammar Teaching': 85,
        'Classroom Management': 78,
        'Assessment Design': 92,
        'Technology Integration': 67
      },
      competencyGains: {
        'Pedagogical Knowledge': 80,
        'Content Knowledge': 88,
        'Technological Knowledge': 65
      },
      behavioralChanges: [
        'Increased use of interactive teaching methods',
        'More frequent formative assessments',
        'Better student engagement strategies'
      ],
      applicationInClassroom: [
        'Implemented new grammar teaching techniques',
        'Created digital assessment tools',
        'Improved classroom management strategies'
      ],
      studentImpact: [
        '15% improvement in student engagement',
        '20% increase in assessment scores',
        'Reduced classroom disruptions by 30%'
      ]
    },
    gapAnalysis: {
      identifiedGaps: [
        {
          skill: 'Technology Integration',
          currentLevel: 65,
          targetLevel: 85,
          priority: 'high',
          recommendations: [
            'Complete advanced digital tools workshop',
            'Practice with LMS integration',
            'Attend technology in education seminar'
          ]
        },
        {
          skill: 'Advanced Assessment',
          currentLevel: 70,
          targetLevel: 90,
          priority: 'medium',
          recommendations: [
            'Study rubric design principles',
            'Practice peer assessment techniques'
          ]
        }
      ],
      strengthAreas: ['Grammar Teaching', 'Assessment Design', 'Student Engagement'],
      developmentAreas: ['Technology Integration', 'Advanced Pedagogy', 'Research Methods']
    },
    detailedAnalytics: {
      attendanceRate: 95,
      engagementScore: 88,
      assessmentScores: [
        { assessment: 'Grammar Fundamentals', score: 92, date: '2024-02-01' },
        { assessment: 'Classroom Management', score: 85, date: '2024-02-15' },
        { assessment: 'Assessment Design', score: 94, date: '2024-03-01' }
      ],
      timeSpentByActivity: {
        'Workshops': 32,
        'eLearning': 18,
        'Assignments': 12,
        'Assessments': 6
      },
      learningVelocity: 1.2,
      retentionRate: 89
    },
    feedbackSummary: {
      averageRating: 4.6,
      satisfactionScore: 92,
      keyFeedback: [
        'Excellent practical examples',
        'Great interactive sessions',
        'Would like more technology focus'
      ],
      improvementSuggestions: [
        'More hands-on technology practice',
        'Additional peer collaboration opportunities'
      ]
    },
    recommendations: {
      nextSteps: [
        'Focus on technology integration skills',
        'Complete advanced assessment module',
        'Participate in peer mentoring program'
      ],
      suggestedPathways: [
        'Advanced Digital Pedagogy Track',
        'Assessment Excellence Program',
        'Leadership in Education Pathway'
      ],
      additionalResources: [
        'Digital Teaching Tools Handbook',
        'Assessment Design Masterclass',
        'Educational Technology Conference'
      ],
      mentoringSuggestions: [
        'Pair with technology-focused mentor',
        'Join assessment design study group',
        'Participate in teaching observation program'
      ]
    }
  }
];

export function PersonalizedReports() {
  const [reports, setReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<PersonalizedReport | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const generateReport = (participantId: string) => {
    console.log('Generating personalized report for participant:', participantId);
    // Mock report generation
  };

  const downloadReport = (report: PersonalizedReport) => {
    console.log('Downloading report for:', report.participantName);
    // Mock PDF download
  };

  const emailReport = (report: PersonalizedReport) => {
    console.log('Emailing report to:', report.participantName);
    // Mock email sending
  };

  const viewDetailedReport = (report: PersonalizedReport) => {
    setSelectedReport(report);
    setShowDetailedView(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Personalized Reports</h2>
          <p className="text-slate-600 mt-1">Detailed impact measurement and analytics for each participant</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => generateReport('bulk')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate All Reports
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4" />
            Analytics Dashboard
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Total Reports</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
          <p className="text-sm text-slate-600">Generated this period</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Avg Progress</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">85%</p>
          <p className="text-sm text-slate-600">Across all participants</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Impact Score</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">4.6/5</p>
          <p className="text-sm text-slate-600">Average impact rating</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Skill Gains</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">+23%</p>
          <p className="text-sm text-slate-600">Average improvement</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full"
          />
        </div>
        
        <select 
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        >
          <option value="all">All Periods</option>
          <option value="current">Current Period</option>
          <option value="last-month">Last Month</option>
          <option value="last-quarter">Last Quarter</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Generated Reports</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Participant</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Progress</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">CEFR Level</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Impact Score</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Generated</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{report.participantName}</p>
                        <p className="text-sm text-slate-600">{report.overview.totalHours} hours completed</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="space-y-1">
                      <span className="text-lg font-bold text-slate-900">{report.overview.overallProgress}%</span>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${report.overview.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <span className="text-slate-500">{report.overview.cefrLevelStart}</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-blue-600">{report.overview.cefrLevelCurrent}</span>
                      </div>
                      <p className="text-xs text-slate-500">Target: {report.overview.cefrLevelTarget}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.feedbackSummary.averageRating >= 4.5 ? 'bg-green-100 text-green-700' :
                      report.feedbackSummary.averageRating >= 4.0 ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.feedbackSummary.averageRating}/5
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center text-sm text-slate-600">
                    {new Date(report.generationDate).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => viewDetailedReport(report)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => downloadReport(report)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => emailReport(report)}
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => generateReport(report.participantId)}
                        className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Report Modal */}
      {showDetailedView && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Detailed Report: {selectedReport.participantName}</h3>
                  <p className="text-slate-600">Generated on {new Date(selectedReport.generationDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setShowDetailedView(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Overall Progress</h4>
                  <p className="text-2xl font-bold text-blue-900">{selectedReport.overview.overallProgress}%</p>
                  <p className="text-sm text-blue-700">{selectedReport.overview.completedActivities}/{selectedReport.overview.totalActivities} activities</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">CEFR Progress</h4>
                  <p className="text-lg font-bold text-green-900">
                    {selectedReport.overview.cefrLevelStart} → {selectedReport.overview.cefrLevelCurrent}
                  </p>
                  <p className="text-sm text-green-700">Target: {selectedReport.overview.cefrLevelTarget}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Engagement</h4>
                  <p className="text-2xl font-bold text-purple-900">{selectedReport.detailedAnalytics.engagementScore}%</p>
                  <p className="text-sm text-purple-700">Attendance: {selectedReport.detailedAnalytics.attendanceRate}%</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Satisfaction</h4>
                  <p className="text-2xl font-bold text-orange-900">{selectedReport.feedbackSummary.averageRating}/5</p>
                  <p className="text-sm text-orange-700">{selectedReport.feedbackSummary.satisfactionScore}% satisfied</p>
                </div>
              </div>

              {/* Skills Improvement */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Skills Improvement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedReport.impactMeasurement.skillsImprovement).map(([skill, score]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-700">{skill}</span>
                        <span className="text-sm font-bold text-slate-900">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Gap Analysis & Recommendations</h4>
                <div className="space-y-4">
                  {selectedReport.gapAnalysis.identifiedGaps.map((gap, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-900">{gap.skill}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gap.priority === 'high' ? 'bg-red-100 text-red-700' :
                          gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {gap.priority} priority
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Current: {gap.currentLevel}%</span>
                          <span>Target: {gap.targetLevel}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${gap.currentLevel}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Recommendations:</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {gap.recommendations.map((rec, idx) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Measurement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Classroom Application</h4>
                  <ul className="space-y-2">
                    {selectedReport.impactMeasurement.applicationInClassroom.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Student Impact</h4>
                  <ul className="space-y-2">
                    {selectedReport.impactMeasurement.studentImpact.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Recommended Next Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Immediate Actions</h5>
                    <ul className="space-y-1">
                      {selectedReport.recommendations.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-blue-700">• {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Suggested Pathways</h5>
                    <ul className="space-y-1">
                      {selectedReport.recommendations.suggestedPathways.map((pathway, index) => (
                        <li key={index} className="text-sm text-blue-700">• {pathway}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-4">
              <button
                onClick={() => downloadReport(selectedReport)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
              <button
                onClick={() => emailReport(selectedReport)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}