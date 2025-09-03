import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Mail, 
  Printer, 
  Search, 
  Filter,
  Calendar,
  User,
  CheckCircle,
  Settings,
  Eye
} from 'lucide-react';
import { Certificate, CertificateTemplate } from '../types/certificates';

const mockCertificates: Certificate[] = [
  {
    id: '1',
    participantId: '1',
    participantName: 'Sarah Mitchell',
    programTitle: 'English Teaching Mastery Program',
    completionDate: '2024-03-15',
    issueDate: '2024-03-16',
    certificateType: 'completion',
    totalHours: 120,
    cefrLevel: 'B2',
    grade: 'Distinction',
    skills: ['Grammar Teaching', 'Assessment Design', 'Classroom Management'],
    signatory: {
      name: 'Dr. Sarah Johnson',
      title: 'Program Director',
      organization: 'EduPathways Institute'
    },
    verificationCode: 'EP-2024-001',
    template: 'premium'
  },
  {
    id: '2',
    participantId: '2',
    participantName: 'Michael Rodriguez',
    programTitle: 'Digital Literacy for Educators',
    completionDate: '2024-03-10',
    issueDate: '2024-03-11',
    certificateType: 'achievement',
    totalHours: 80,
    cefrLevel: 'B1',
    grade: 'Merit',
    skills: ['Technology Integration', 'Digital Assessment'],
    signatory: {
      name: 'Dr. Sarah Johnson',
      title: 'Program Director',
      organization: 'EduPathways Institute'
    },
    verificationCode: 'EP-2024-002',
    template: 'standard'
  }
];

const certificateTemplates: CertificateTemplate[] = [
  {
    id: '1',
    name: 'Standard Certificate',
    type: 'standard',
    layout: 'landscape',
    colors: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' },
    fonts: { title: 'serif', body: 'sans-serif', signature: 'cursive' },
    elements: { logo: true, border: true, watermark: false, qrCode: true }
  },
  {
    id: '2',
    name: 'Premium Certificate',
    type: 'premium',
    layout: 'landscape',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10B981' },
    fonts: { title: 'serif', body: 'sans-serif', signature: 'cursive' },
    elements: { logo: true, border: true, watermark: true, qrCode: true }
  }
];

export function CertificateGenerator() {
  const [certificates, setCertificates] = useState(mockCertificates);
  const [selectedTemplate, setSelectedTemplate] = useState(certificateTemplates[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const [showBulkGenerate, setShowBulkGenerate] = useState(false);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.programTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || cert.certificateType === filterType;
    return matchesSearch && matchesFilter;
  });

  const generateCertificate = (certificate: Certificate) => {
    // Mock certificate generation
    console.log('Generating certificate for:', certificate.participantName);
    // In real implementation, this would generate a PDF
  };

  const previewCertificateHandler = (certificate: Certificate) => {
    setPreviewCertificate(certificate);
    setShowPreview(true);
  };

  const sendCertificate = (certificate: Certificate) => {
    console.log('Sending certificate to:', certificate.participantName);
    // Mock email sending
  };

  const bulkGenerate = () => {
    console.log('Bulk generating certificates for all completed participants');
    setShowBulkGenerate(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Certificate Generator</h2>
          <p className="text-slate-600 mt-1">Generate and manage completion certificates</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBulkGenerate(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Award className="w-4 h-4" />
            Bulk Generate
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4" />
            Template Settings
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Total Certificates</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{certificates.length}</p>
          <p className="text-sm text-slate-600">Generated this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Completion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">84%</p>
          <p className="text-sm text-slate-600">Program completion</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Sent Certificates</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">156</p>
          <p className="text-sm text-slate-600">Via email</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Download className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Downloads</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">203</p>
          <p className="text-sm text-slate-600">PDF downloads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search participants or programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full"
          />
        </div>
        
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="completion">Completion</option>
          <option value="achievement">Achievement</option>
          <option value="participation">Participation</option>
        </select>

        <select 
          value={selectedTemplate.id}
          onChange={(e) => setSelectedTemplate(certificateTemplates.find(t => t.id === e.target.value) || certificateTemplates[0])}
          className="px-4 py-2 border border-slate-200 rounded-lg"
        >
          {certificateTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      {/* Certificates List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Generated Certificates</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Participant</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900">Program</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Type</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">CEFR Level</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Grade</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Issue Date</th>
                <th className="text-center py-4 px-6 font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{certificate.participantName}</p>
                        <p className="text-sm text-slate-600">{certificate.totalHours} hours</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{certificate.programTitle}</p>
                    <p className="text-sm text-slate-600">Code: {certificate.verificationCode}</p>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      certificate.certificateType === 'completion' ? 'bg-green-100 text-green-700' :
                      certificate.certificateType === 'achievement' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {certificate.certificateType}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                      {certificate.cefrLevel}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      certificate.grade === 'Distinction' ? 'bg-gold-100 text-gold-700' :
                      certificate.grade === 'Merit' ? 'bg-silver-100 text-silver-700' :
                      'bg-bronze-100 text-bronze-700'
                    }`}>
                      {certificate.grade}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6 text-center text-sm text-slate-600">
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </td>
                  
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => previewCertificateHandler(certificate)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => generateCertificate(certificate)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => sendCertificate(certificate)}
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => generateCertificate(certificate)}
                        className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Generate Modal */}
      {showBulkGenerate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Bulk Generate Certificates</h3>
            <p className="text-slate-600 mb-6">
              Generate certificates for all participants who have completed their programs.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Type</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option value="completion">Completion Certificate</option>
                  <option value="achievement">Achievement Certificate</option>
                  <option value="participation">Participation Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Template</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  {certificateTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBulkGenerate(false)}
                className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={bulkGenerate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Generate All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showPreview && previewCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Certificate Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Mock Certificate Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-4 border-blue-200 text-center">
                <div className="mb-6">
                  <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Certificate of Completion</h1>
                  <p className="text-slate-600">This is to certify that</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-4xl font-serif font-bold text-blue-900 mb-2">{previewCertificate.participantName}</h2>
                  <p className="text-slate-600">has successfully completed</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">{previewCertificate.programTitle}</h3>
                  <p className="text-slate-600">
                    Total Duration: {previewCertificate.totalHours} hours | 
                    CEFR Level: {previewCertificate.cefrLevel} | 
                    Grade: {previewCertificate.grade}
                  </p>
                </div>
                
                <div className="mb-6">
                  <p className="text-slate-600">Skills Acquired:</p>
                  <p className="text-slate-800 font-medium">{previewCertificate.skills.join(', ')}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-slate-600">Issue Date:</p>
                    <p className="font-medium">{new Date(previewCertificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-slate-400 pt-2">
                      <p className="font-semibold">{previewCertificate.signatory.name}</p>
                      <p className="text-sm text-slate-600">{previewCertificate.signatory.title}</p>
                      <p className="text-sm text-slate-600">{previewCertificate.signatory.organization}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Verification Code:</p>
                    <p className="font-mono text-sm">{previewCertificate.verificationCode}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => generateCertificate(previewCertificate)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => sendCertificate(previewCertificate)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}