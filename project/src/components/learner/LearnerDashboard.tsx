import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Play,
  Download,
  MessageSquare,
  Target,
  Star,
  Map
} from 'lucide-react';
import { ProgramOverview } from './ProgramOverview';
import { ProgramTimeline } from './ProgramTimeline';

const mockLearnerData = {
  name: 'Sarah Mitchell',
  currentPathway: 'English Teaching Mastery Program',
  overallProgress: 68,
  cefrLevel: 'B2',
  targetLevel: 'C1',
  completedHours: 82,
  totalHours: 120,
  nextEvent: {
    title: 'Advanced Grammar Workshop',
    date: 'Tomorrow, 9:00 AM',
    type: 'workshop',
    duration: '4 hours'
  },
  recentAchievements: [
    { title: 'Grammar Fundamentals Completed', date: '2 days ago', points: 50 },
    { title: 'Assessment Excellence', date: '1 week ago', points: 75 },
    { title: 'Perfect Attendance', date: '2 weeks ago', points: 25 }
  ],
  upcomingEvents: [
    { title: 'Digital Assessment Tools', date: 'March 20', type: 'elearning', status: 'available' },
    { title: 'Classroom Management Quiz', date: 'March 22', type: 'assessment', status: 'locked' },
    { title: 'Peer Review Session', date: 'March 25', type: 'group', status: 'scheduled' }
  ]
};

export function LearnerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'program-map' | 'progress' | 'schedule' | 'resources'>('overview');
  const [timelineView, setTimelineView] = useState<'infographic' | 'detailed'>('infographic');

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {mockLearnerData.name}!</h2>
            <p className="text-blue-100">Continue your learning journey in {mockLearnerData.currentPathway}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{mockLearnerData.overallProgress}%</div>
            <div className="text-sm text-blue-200">Complete</div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">CEFR Level</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockLearnerData.cefrLevel}</p>
          <p className="text-sm text-slate-600">Target: {mockLearnerData.targetLevel}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Hours Completed</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockLearnerData.completedHours}</p>
          <p className="text-sm text-slate-600">of {mockLearnerData.totalHours} total</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Achievements</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{mockLearnerData.recentAchievements.length}</p>
          <p className="text-sm text-slate-600">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Next Event</h3>
          </div>
          <p className="text-sm font-bold text-slate-900">{mockLearnerData.nextEvent.title}</p>
          <p className="text-sm text-slate-600">{mockLearnerData.nextEvent.date}</p>
        </div>
      </div>

      {/* Next Event Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Up Next</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{mockLearnerData.nextEvent.title}</h4>
              <p className="text-sm text-slate-600">{mockLearnerData.nextEvent.date} • {mockLearnerData.nextEvent.duration}</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Join Event
          </button>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {mockLearnerData.recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{achievement.title}</p>
                  <p className="text-sm text-slate-600">{achievement.date}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-yellow-600">+{achievement.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProgramMap = () => (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Program Map</h2>
          <p className="text-slate-600">Your complete learning journey visualization</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setTimelineView('infographic')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timelineView === 'infographic' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setTimelineView('detailed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timelineView === 'detailed' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed View
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {timelineView === 'infographic' ? <ProgramTimeline /> : <ProgramOverview />}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-700">Overall Completion</span>
            <span className="font-bold text-slate-900">{mockLearnerData.overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${mockLearnerData.overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Skill Development</h3>
        <div className="space-y-4">
          {[
            { skill: 'Grammar Teaching', progress: 85, level: 'Advanced' },
            { skill: 'Classroom Management', progress: 72, level: 'Intermediate' },
            { skill: 'Assessment Design', progress: 90, level: 'Advanced' },
            { skill: 'Technology Integration', progress: 45, level: 'Beginner' }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">{item.skill}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.level === 'Advanced' ? 'bg-green-100 text-green-700' :
                    item.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.level}
                  </span>
                  <span className="font-bold text-slate-900">{item.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.level === 'Advanced' ? 'bg-green-500' :
                    item.level === 'Intermediate' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CEFR Progress */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">CEFR Level Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">B1</div>
            <div className="text-sm text-slate-600">Starting Level</div>
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">B2</div>
            <div className="text-sm text-slate-600">Current Level</div>
          </div>
          <div className="flex-1 mx-4">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-slate-300 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">C1</div>
            <div className="text-sm text-slate-600">Target Level</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Learning Events</h3>
        <div className="space-y-4">
          {mockLearnerData.upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  event.type === 'workshop' ? 'bg-blue-100' :
                  event.type === 'elearning' ? 'bg-green-100' :
                  event.type === 'assessment' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {event.type === 'workshop' && <Calendar className="w-5 h-5 text-blue-600" />}
                  {event.type === 'elearning' && <BookOpen className="w-5 h-5 text-green-600" />}
                  {event.type === 'assessment' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                  {event.type === 'group' && <MessageSquare className="w-5 h-5 text-orange-600" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{event.title}</h4>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  event.status === 'available' ? 'bg-green-100 text-green-700' :
                  event.status === 'locked' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {event.status}
                </span>
                <button 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    event.status === 'available' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={event.status !== 'available'}
                >
                  {event.status === 'available' ? 'Start' : 'Locked'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Grammar Teaching Handbook', type: 'PDF', size: '2.4 MB', downloaded: true },
            { title: 'Assessment Design Templates', type: 'ZIP', size: '5.1 MB', downloaded: false },
            { title: 'Classroom Management Guide', type: 'PDF', size: '1.8 MB', downloaded: true },
            { title: 'Technology Tools Checklist', type: 'DOC', size: '892 KB', downloaded: false }
          ].map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{resource.title}</p>
                  <p className="text-sm text-slate-600">{resource.type} • {resource.size}</p>
                </div>
              </div>
              <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                resource.downloaded 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {resource.downloaded ? 'Downloaded' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">My Certificates</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Grammar Fundamentals Certificate</p>
                <p className="text-sm text-slate-600">Issued: March 10, 2024</p>
              </div>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'program-map', label: 'Program Map', icon: Map },
            { id: 'progress', label: 'My Progress', icon: TrendingUp },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'resources', label: 'Resources', icon: Download }
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
      {activeTab === 'program-map' && renderProgramMap()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'resources' && renderResources()}
    </div>
  );
}