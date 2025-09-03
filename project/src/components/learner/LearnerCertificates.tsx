import React from 'react';
import { Award, Download, Share2, Eye, Calendar } from 'lucide-react';

const mockCertificates = [
  {
    id: '1',
    title: 'Grammar Fundamentals Certificate',
    program: 'English Teaching Mastery Program',
    issueDate: '2024-03-10',
    type: 'completion',
    grade: 'Distinction',
    verificationCode: 'EP-2024-001',
    skills: ['Grammar Teaching', 'Lesson Planning', 'Student Assessment']
  },
  {
    id: '2',
    title: 'Classroom Management Excellence',
    program: 'Teaching Skills Development',
    issueDate: '2024-02-28',
    type: 'achievement',
    grade: 'Merit',
    verificationCode: 'EP-2024-002',
    skills: ['Classroom Management', 'Student Engagement', 'Behavior Management']
  }
];

export function LearnerCertificates() {
  const downloadCertificate = (certificateId: string) => {
    console.log('Downloading certificate:', certificateId);
    // Mock download functionality
  };

  const shareCertificate = (certificateId: string) => {
    console.log('Sharing certificate:', certificateId);
    // Mock share functionality
  };

  const previewCertificate = (certificateId: string) => {
    console.log('Previewing certificate:', certificateId);
    // Mock preview functionality
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">My Certificates</h2>
        <p className="text-slate-600">Your earned certificates and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCertificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{certificate.title}</h3>
                  <p className="text-sm text-slate-600">{certificate.program}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                certificate.grade === 'Distinction' ? 'bg-gold-100 text-gold-700' :
                certificate.grade === 'Merit' ? 'bg-silver-100 text-silver-700' :
                'bg-bronze-100 text-bronze-700'
              }`}>
                {certificate.grade}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                Issued: {new Date(certificate.issueDate).toLocaleDateString()}
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Skills Certified:</p>
                <div className="flex flex-wrap gap-1">
                  {certificate.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Verification Code: {certificate.verificationCode}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => previewCertificate(certificate.id)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button 
                onClick={() => downloadCertificate(certificate.id)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button 
                onClick={() => shareCertificate(certificate.id)}
                className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockCertificates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Certificates Yet</h3>
          <p className="text-slate-600">Complete your learning activities to earn certificates</p>
        </div>
      )}
    </div>
  );
}