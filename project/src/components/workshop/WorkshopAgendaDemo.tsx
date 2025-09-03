import React, { useState } from 'react';
import { WorkshopAgendaManager } from './WorkshopAgendaManager';

// Mock workshop data for demonstration
const mockWorkshop = {
  id: 'demo-workshop-123',
  title: 'Digital Assessment Workshop',
  description: 'Learn to create effective digital assessments for your students',
  workshop_date: '2025-01-15',
  duration_hours: 8,
  location: 'Conference Room A',
  max_participants: 25,
  facilitator_id: 'facilitator-123',
  facilitator_name: 'Dr. Sarah Johnson',
  pathway_id: 'pathway-123',
  pathway_title: 'Digital Teaching Methods',
  status: 'planning'
};

export function WorkshopAgendaDemo() {
  const [showDemo, setShowDemo] = useState(false);

  if (!showDemo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Workshop Agenda Management System
        </h2>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Experience the complete workshop agenda management system with drag-and-drop functionality, 
          multiple activity types, facilitator assignment, and real-time updates.
        </p>
        <button
          onClick={() => setShowDemo(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Launch Demo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Workshop Agenda Demo</h2>
          <p className="text-slate-600 mt-1">Interactive demonstration of the agenda management system</p>
        </div>
        <button
          onClick={() => setShowDemo(false)}
          className="text-slate-600 hover:text-slate-800 transition-colors"
        >
          ← Back to Overview
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Demo Features</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Create, edit, and delete agenda items</li>
          <li>• Drag and drop reordering</li>
          <li>• Multiple activity types (sessions, breaks, activities, etc.)</li>
          <li>• Time slot management</li>
          <li>• Facilitator assignment</li>
          <li>• Real-time updates</li>
        </ul>
      </div>

      <WorkshopAgendaManager workshop={mockWorkshop} />
    </div>
  );
}
