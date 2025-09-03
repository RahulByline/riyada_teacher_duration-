import React, { useState } from 'react';
import { GraduationCap, Key, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useBranding } from '../contexts/BrandingContext';

export function LoginScreen() {
  const { signInWithPasscode, loading, error } = useUser();
  const { branding } = useBranding();
  const [passcode, setPasscode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithPasscode(passcode);
  };

  const passcodeUsers = [
    { passcode: 'admin@riyadatrainings.com', role: 'Administrator', description: 'Full system access and management' },
    { passcode: 'trainer@riyadatrainings.com', role: 'Trainer', description: 'Manage pathways and participants' },
    { passcode: 'participant@riyadatrainings.com', role: 'Participant', description: 'Learning and progress tracking' },
    { passcode: 'client@riyadatrainings.com', role: 'Client', description: 'View reports and analytics' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{branding.portalName}</h1>
          <p className="text-slate-600 mt-2">Enter your access passcode</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Access Passcode
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your passcode"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Accessing...' : 'Access Portal'}
            </button>
          </form>

          {/* Demo Passcodes */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Available Access Codes:</h3>
            <div className="space-y-2">
              {passcodeUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => setPasscode(user.passcode)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-sm font-medium text-slate-900">{user.role}</div>
                  <div className="text-xs text-slate-600 mb-1">{user.description}</div>
                  <div className="text-xs text-blue-600 font-mono">{user.passcode}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}