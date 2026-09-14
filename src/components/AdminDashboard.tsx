import { useState } from 'react';
import { Shield, Users, Truck, Building2, AlertTriangle, Activity, MapPin } from 'lucide-react';

interface HeatmapArea {
  name: string;
  cases: number;
  risk: 'low' | 'medium' | 'high';
  symptoms: string[];
  trend: 'up' | 'down' | 'stable';
}

const heatmapData: HeatmapArea[] = [
  { name: 'Village A - Saket Nagar', cases: 18, risk: 'high', symptoms: ['Fever', 'Body Ache', 'Headache'], trend: 'up' },
  { name: 'Village B - Shahpura', cases: 12, risk: 'high', symptoms: ['Dengue-like', 'Fever'], trend: 'up' },
  { name: 'Village C - MP Nagar', cases: 7, risk: 'medium', symptoms: ['Cough', 'Cold', 'Fever'], trend: 'stable' },
  { name: 'Village D - Arera Colony', cases: 4, risk: 'low', symptoms: ['BP Issues', 'Sugar'], trend: 'down' },
  { name: 'Village E - Bhanpur', cases: 9, risk: 'medium', symptoms: ['Injury', 'Accident'], trend: 'stable' },
];

export function AdminDashboard() {
  const [selectedArea, setSelectedArea] = useState<HeatmapArea | null>(null);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><Shield className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold">Hospital Admin Panel</h2>
              <p className="text-amber-100">Manage doctors, ambulances, and monitor community health</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Cases', value: '7', icon: Activity, color: 'text-red-300' },
              { label: 'Doctors', value: '12', icon: Users, color: 'text-blue-300' },
              { label: 'Ambulances', value: '8', icon: Truck, color: 'text-green-300' },
              { label: 'Available Beds', value: '24', icon: Building2, color: 'text-yellow-300' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <Icon className={`w-5 h-5 ${stat.color} mb-1`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-white/80">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> Community Health Heatmap
            </h3>
            <p className="text-sm text-gray-500 mb-4">Disease and injury hotspots in your region — Last 7 days</p>

            <div className="space-y-3">
              {heatmapData.map((area, i) => {
                const riskColors = {
                  low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
                  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
                  high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
                };
                const c = riskColors[area.risk];
                return (
                  <div key={area.name}
                    className={`${c.bg} border ${c.border} rounded-xl p-4 cursor-pointer transition hover:shadow-md animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => setSelectedArea(selectedArea?.name === area.name ? null : area)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className={`w-3 h-3 rounded-full ${c.dot} mt-1.5 flex-shrink-0 ${area.risk === 'high' ? 'animate-pulse' : ''}`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{area.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-lg font-bold ${c.text}`}>{area.cases} cases</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              area.trend === 'up' ? 'bg-red-100 text-red-700' : area.trend === 'down' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {area.trend === 'up' ? '↑ Rising' : area.trend === 'down' ? '↓ Declining' : '→ Stable'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {area.symptoms.map(s => (
                              <span key={s} className="px-2 py-0.5 bg-white/80 text-xs rounded border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.text} ${c.bg} border ${c.border}`}>
                        {area.risk === 'high' ? 'Potential Outbreak' : area.risk === 'medium' ? 'Watch' : 'Normal'}
                      </span>
                    </div>

                    {selectedArea?.name === area.name && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-up">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="font-bold text-gray-900">{area.cases}</p>
                            <p className="text-xs text-gray-500">Total Cases</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="font-bold text-gray-900">{Math.round(area.cases * 0.3)}</p>
                            <p className="text-xs text-gray-500">Require Hospital</p>
                          </div>
                          <div className="text-center p-2 bg-white rounded-lg">
                            <p className="font-bold text-gray-900">{Math.round(area.cases * 0.1)}</p>
                            <p className="text-xs text-gray-500">Emergency</p>
                          </div>
                        </div>
                        <button className="mt-3 w-full px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition">
                          Send Health Team to Village
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="animate-slide-up-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Emergency Cases</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-red-500 animate-pulse' : i < 4 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">EMG-{1024 - i}</p>
                      <p className="text-xs text-gray-500">{['Accident - Heavy Bleeding', 'Chest Pain', 'High Fever', 'Fracture', 'Minor Cut'][i]}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    i < 2 ? 'bg-red-100 text-red-700' : i < 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {i < 2 ? 'Red' : i < 4 ? 'Yellow' : 'Green'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-500" /> Ambulance Fleet
            </h3>
            <div className="space-y-3">
              {[
                { id: 'MP-04-AB-1001', driver: 'Ramesh Gupta', status: 'available' },
                { id: 'MP-04-AB-1002', driver: 'Suresh Patel', status: 'busy' },
                { id: 'MP-04-AB-1003', driver: 'Vikram Singh', status: 'busy' },
                { id: 'MP-04-AB-1004', driver: 'Amit Sharma', status: 'available' },
              ].map((a, i) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{a.id}</p>
                    <p className="text-xs text-gray-500">{a.driver}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-up-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" /> Doctors On Duty
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Dr. Aditya Verma', specialty: 'Cardiologist', status: 'available' },
                { name: 'Dr. Priya Sharma', specialty: 'Neurologist', status: 'busy' },
                { name: 'Dr. Sunita Gupta', specialty: 'Gynecologist', status: 'available' },
                { name: 'Dr. Vikas Singh', specialty: 'Pediatrician', status: 'available' },
              ].map((d, i) => (
                <div key={d.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.specialty}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    d.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">Outbreak Alert: </span>
                Village A & B show rising fever cases. Consider sending a health team.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
