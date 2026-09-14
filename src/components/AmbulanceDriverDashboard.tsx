import { useState } from 'react';
import { Truck, Phone, Navigation, Clock, CheckCircle2, XCircle, Activity, MapPin } from 'lucide-react';
import { TriageBadge } from './TriageBadge';

interface EmergencyRequest {
  id: string;
  patientType: string;
  patientName: string;
  location: string;
  symptoms: string[];
  triage: 'red' | 'yellow' | 'green';
  timeAgo: string;
  distance: string;
  status: 'pending' | 'accepted' | 'en_route' | 'reached' | 'transporting' | 'completed';
}

const initialRequests: EmergencyRequest[] = [
  { id: 'EMG-1024', patientType: 'Unknown Patient', patientName: 'Unknown', location: 'Saket Nagar, Bhopal', symptoms: ['Heavy Bleeding', 'Accident'], triage: 'red', timeAgo: '2 min ago', distance: '2.3 km', status: 'pending' },
  { id: 'EMG-1023', patientType: 'Known Patient', patientName: 'Rajesh Kumar', location: 'Shahpura, Bhopal', symptoms: ['Chest Pain'], triage: 'red', timeAgo: '5 min ago', distance: '3.1 km', status: 'accepted' },
  { id: 'EMG-1022', patientType: 'Self', patientName: 'Sunita Devi', location: 'MP Nagar, Bhopal', symptoms: ['High Fever'], triage: 'yellow', timeAgo: '15 min ago', distance: '1.8 km', status: 'en_route' },
  { id: 'EMG-1021', patientType: 'Unknown Patient', patientName: 'Unknown', location: 'Arera Colony, Bhopal', symptoms: ['Accident', 'Fracture'], triage: 'red', timeAgo: '20 min ago', distance: '4.2 km', status: 'pending' },
];

const statusFlow = ['pending', 'accepted', 'en_route', 'reached', 'transporting', 'completed'] as const;

export function AmbulanceDriverDashboard() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'all'>('pending');

  const advanceStatus = (id: string) => {
    setRequests(requests.map(req => {
      if (req.id !== id) return req;
      const currentIdx = statusFlow.indexOf(req.status);
      const nextIdx = Math.min(currentIdx + 1, statusFlow.length - 1);
      return { ...req, status: statusFlow[nextIdx] };
    }));
  };

  const rejectRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'active') return req.status !== 'pending' && req.status !== 'completed';
    return true;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-brand-100 text-brand-700',
    en_route: 'bg-indigo-100 text-indigo-700',
    reached: 'bg-green-100 text-green-700',
    transporting: 'bg-orange-100 text-orange-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><Truck className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Ambulance Driver Panel</h2>
                <p className="text-brand-100">Accept emergency requests and update status</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">Vehicle: MP-04-AB-1001</span>
              <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full">● Available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: requests.filter(r => r.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Active', count: requests.filter(r => r.status !== 'pending' && r.status !== 'completed').length, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Completed', count: requests.filter(r => r.status === 'completed').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total', count: requests.length, color: 'text-brand-600', bg: 'bg-brand-50' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-200 animate-scale-in`} style={{ animationDelay: `${i * 0.08}s` }}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-gray-200">
          {(['pending', 'active', 'all'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {tab === 'all' ? 'All Requests' : tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No requests found</div>
          ) : (
            filteredRequests.map((req, i) => (
              <div key={req.id} className="p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      req.triage === 'red' ? 'bg-red-100' : req.triage === 'yellow' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <Truck className={`w-5 h-5 ${
                        req.triage === 'red' ? 'text-red-600' : req.triage === 'yellow' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{req.id}</h4>
                        <TriageBadge level={req.triage} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600">{req.patientType}: {req.patientName}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" /> {req.location} — {req.distance}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {req.symptoms.map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>)}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[req.status]}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => advanceStatus(req.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Accept Request
                    </button>
                    <button onClick={() => rejectRequest(req.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition text-sm">
                      <XCircle className="w-4 h-4" /> Decline
                    </button>
                  </div>
                ) : req.status !== 'completed' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Status: <span className="font-medium capitalize">{req.status.replace('_', ' ')}</span></span>
                    </div>
                    <button onClick={() => advanceStatus(req.id)}
                      className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                      {req.status === 'accepted' ? 'Start Journey →' : req.status === 'en_route' ? 'Mark Reached' : req.status === 'reached' ? 'Start Transport' : 'Complete'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3 text-sm">
                  <a href="tel:+919876510001" className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
                    <Phone className="w-4 h-4" /> Call Reporter
                  </a>
                  <button className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
                    <Navigation className="w-4 h-4" /> Navigate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="animate-fade-in-up bg-brand-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-brand-900 mb-2">Simulation Mode</h3>
            <p className="text-sm text-brand-800">
              This is a simulated ambulance driver dashboard for hackathon demo.
              In production, real GPS tracking and live updates would be integrated via Socket.io.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
