import { useState } from 'react';
import { User, Video, AlertTriangle, Clock, CheckCircle2, Search, MessageCircle, Activity, Heart, Brain } from 'lucide-react';
import { TriageBadge, TriageLevel } from './TriageBadge';

interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string[];
  triage: TriageLevel;
  status: 'new' | 'reviewing' | 'completed';
  timeAgo: string;
  aiSummary: string;
  injutyPhoto?: string;
}

const mockCases: PatientCase[] = [
  { id: 'EMG-1024', patientName: 'Unknown Patient', age: 35, gender: 'Male', symptoms: ['Heavy Bleeding', 'Accident'], triage: 'red', status: 'new', timeAgo: '2 min ago', aiSummary: 'Severe laceration with active bleeding. Fracture suspected.' },
  { id: 'EMG-1023', patientName: 'Rajesh Kumar', age: 58, gender: 'Male', symptoms: ['Chest Pain', 'Breathing Difficulty'], triage: 'red', status: 'new', timeAgo: '5 min ago', aiSummary: 'Crushing chest pain radiating to left arm. Possible cardiac event.' },
  { id: 'EMG-1022', patientName: 'Sunita Devi', age: 42, gender: 'Female', symptoms: ['High Fever', 'Body Ache'], triage: 'yellow', status: 'reviewing', timeAgo: '15 min ago', aiSummary: 'Fever 102°F for 3 days with body ache. Likely viral infection.' },
  { id: 'EMG-1021', patientName: 'Amit Sharma', age: 28, gender: 'Male', symptoms: ['Small Cut', 'Mild Bleeding'], triage: 'green', status: 'completed', timeAgo: '1 hour ago', aiSummary: 'Minor cut on hand. Bleeding controlled. Home care recommended.' },
  { id: 'EMG-1020', patientName: 'Priya Patel', age: 65, gender: 'Female', symptoms: ['Dizziness', 'High BP'], triage: 'yellow', status: 'reviewing', timeAgo: '30 min ago', aiSummary: 'BP 160/100 with dizziness. Needs medication adjustment.' },
];

export function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'reviewing' | 'completed'>('all');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);

  const filteredCases = activeTab === 'all' ? mockCases : mockCases.filter(c => c.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><User className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Doctor Dashboard</h2>
                <p className="text-purple-100">Review cases, provide advice, start consultations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'New Cases', count: mockCases.filter(c => c.status === 'new').length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Reviewing', count: mockCases.filter(c => c.status === 'reviewing').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Completed', count: mockCases.filter(c => c.status === 'completed').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Today', count: mockCases.length, color: 'text-brand-600', bg: 'bg-brand-50' },
        ].map((stat, i) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-200 animate-scale-in`} style={{ animationDelay: `${i * 0.08}s` }}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-gray-200">
          {(['all', 'new', 'reviewing', 'completed'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {tab === 'all' ? 'All Cases' : tab}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-48" />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCases.map((c, i) => (
            <div key={c.id} className="p-4 hover:bg-gray-50 transition cursor-pointer animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => setSelectedCase(selectedCase?.id === c.id ? null : c)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    c.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    <User className={`w-5 h-5 ${c.gender === 'Male' ? 'text-brand-600' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{c.patientName}</h4>
                      <TriageBadge level={c.triage} size="sm" />
                    </div>
                    <p className="text-sm text-gray-500">{c.age} yrs, {c.gender} — {c.id} — <Clock className="w-3 h-3 inline" /> {c.timeAgo}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {c.symptoms.map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>)}
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  c.status === 'new' ? 'bg-red-100 text-red-700' : c.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {c.status === 'new' ? 'New' : c.status === 'reviewing' ? 'Reviewing' : 'Completed'}
                </span>
              </div>

              {selectedCase?.id === c.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" /> AI Summary
                      </h5>
                      <p className="text-sm text-gray-700 bg-purple-50 rounded-lg p-3">{c.aiSummary}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-500" /> Actions
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
                          <MessageCircle className="w-4 h-4" /> Give Advice
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                          <Video className="w-4 h-4" /> Video Call
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                          <CheckCircle2 className="w-4 h-4" /> Mark Complete
                        </button>
                        <button className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition">
                          <AlertTriangle className="w-4 h-4" /> Escalate
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-semibold text-gray-900 mb-2">Recommended Consultation</h5>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">General Physician</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">₹500</span>
                      <span className="px-2 py-1 bg-gray-100 rounded">Available now</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up bg-brand-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-brand-900 mb-2">Doctor Dashboard Demo</h3>
            <p className="text-sm text-brand-800">
              This is a demo view for hackathon presentation. In production:
              doctors are verified through hospital partnerships, consultations are paid,
              and patient data comes from real emergency cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
