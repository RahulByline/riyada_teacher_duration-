export interface Certificate {
  id: string;
  participantId: string;
  participantName: string;
  programTitle: string;
  completionDate: string;
  issueDate: string;
  certificateType: 'completion' | 'achievement' | 'participation';
  totalHours: number;
  cefrLevel?: string;
  grade?: string;
  skills: string[];
  signatory: {
    name: string;
    title: string;
    organization: string;
  };
  verificationCode: string;
  template: 'standard' | 'premium' | 'custom';
}

export interface CertificateTemplate {
  id: string;
  name: string;
  type: 'standard' | 'premium' | 'custom';
  layout: 'portrait' | 'landscape';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    title: string;
    body: string;
    signature: string;
  };
  elements: {
    logo: boolean;
    border: boolean;
    watermark: boolean;
    qrCode: boolean;
  };
}