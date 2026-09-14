import { useState } from 'react';
import { Users, ClipboardList, MapPin, Phone, Calendar, CheckCircle2, X, Search, Activity, UserPlus, Heart } from 'lucide-react';

interface Villager {
  id: string;
  name: string;
  age: number;
  village: string;
  phone: string;
  lastVisit: string;
  conditions: string[];
  pregnant: boolean;
  childVaccinations: string[];
}

const initialVillagers: Villager[] = [
  { id: 'V-001', name: 'Gita Devi', age: 34, village: 'Saket Nagar', phone: '+91 98765 10001', lastVisit: '2026-05-20', conditions: ['Anemia'], pregnant: true, childVaccinations: [] },
  { id: 'V-002', name: 'Ram Singh', age: 67, village: 'Shahpura', phone: '+91 98765 10002', lastVisit: '2026-05-18', conditions: ['Diabetes', 'Hypertension'], pregnant: false, childVaccinations: [] },
  { id: 'V-003', name: 'Sunita Bai', age: 28, village: 'Arera Colony', phone: '+91 98765 10003', lastVisit: '2026-05-15', conditions: [], pregnant: true, childVaccinations: [] },
  { id: 'V-004', name: 'Mohan Lal', age: 45, village: 'MP Nagar', phone: '+91 98765 10004', lastVisit: '2026-05-10', conditions: ['Tuberculosis'], pregnant: false, childVaccinations: [] },
  { id: 'V-005', name: 'Kavita Sharma', age: 2, village: 'Saket Nagar', phone: '+91 98765 10005', lastVisit: '2026-05-22', conditions: [], pregnant: false, childVaccinations: ['Polio', 'DPT', 'MMR'] },
];

const villages = ['Saket Nagar', 'Shahpura', 'Arera Colony', 'MP Nagar', 'New Market'];

export function CommunityWorkerDashboard() {
  const [villagers, setVillagers] = useState(initialVillagers);
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('all');
  const [showRegistration, setShowRegistration] = useState(false);
  const [newVillager, setNewVillager] = useState({ name: '', age: '', village: '', phone: '', conditions: '', pregnant: false });

  const pendingVisits = villagers.filter(v => {
    const daysSinceLastVisit = Math.floor((Date.now() - new Date(v.lastVisit).getTime()) / 86400000);
    return daysSinceLastVisit > 14 || v.pregnant || v.conditions.length > 0;
  });

  const filteredVillagers = villagers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVillage = villageFilter === 'all' || v.village === villageFilter;
    return matchesSearch && matchesVillage;
  });

  const handleRegister = () => {
    if (!newVillager.name || !newVillager.age || !newVillager.village) return;
    const villager: Villager = {
      id: `V-${String(villagers.length + 1).padStart(3, '0')}`,
      name: newVillager.name,
      age: parseInt(newVillager.age),
      village: newVillager.village,
      phone: newVillager.phone || 'Not provided',
      lastVisit: new Date().toISOString().split('T')[0],
      conditions: newVillager.conditions ? newVillager.conditions.split(',').map(c => c.trim()).filter(Boolean) : [],
      pregnant: newVillager.pregnant,
      childVaccinations: [],
    };
    setVillagers([villager, ...villagers]);
    setNewVillager({ name: '', age: '', village: '', phone: '', conditions: '', pregnant: false });
    setShowRegistration(false);
  };

  const recordVisit = (id: string) => {
    setVillagers(villagers.map(v => v.id === id ? { ...v, lastVisit: new Date().toISOString().split('T')[0] } : v));
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
              <div className="p-2 bg-white/20 rounded-lg"><Users className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Community Health Worker</h2>
                <p className="text-brand-100">ASHA — Villager registration & health tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">Covered: {villages.length} villages</span>
              <span className="bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full">{pendingVisits.length} pending visits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Families Registered', count: villagers.length, color: 'text-brand-600', bg: 'bg-brand-50', icon: Users },
          { label: 'Pending Visits', count: pendingVisits.length, color: 'text-amber-600', bg: 'bg-amber-50', icon: ClipboardList },
          { label: 'Pregnant Women', count: villagers.filter(v => v.pregnant).length, color: 'text-pink-600', bg: 'bg-pink-50', icon: Heart },
          { label: 'Children Vaccinated', count: villagers.filter(v => v.childVaccinations.length > 0).length, color: 'text-brand-600', bg: 'bg-brand-50', icon: Activity },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-200 animate-scale-in`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </div>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Villager Registry</h3>
            <button onClick={() => setShowRegistration(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition">
              <UserPlus className="w-4 h-4" /> Register New
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or ID..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
            </div>
            <select value={villageFilter} onChange={e => setVillageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
              <option value="all">All Villages</option>
              {villages.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredVillagers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No villagers found</div>
          ) : (
            filteredVillagers.map((v, i) => {
              const daysSinceVisit = Math.floor((Date.now() - new Date(v.lastVisit).getTime()) / 86400000);
              const needsVisit = daysSinceVisit > 14 || v.pregnant || v.conditions.length > 0;
              return (
                <div key={v.id} className="p-4 animate-fade-in-up hover:bg-gray-50 transition" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.pregnant ? 'bg-pink-100' : 'bg-brand-100'}`}>
                        <Users className={`w-5 h-5 ${v.pregnant ? 'text-pink-600' : 'text-brand-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{v.name}</h4>
                          <span className="text-xs text-gray-400">({v.id})</span>
                          {v.pregnant && <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs font-medium">Pregnant</span>}
                          {needsVisit && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Visit Due</span>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span>Age: {v.age}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.village}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {v.phone}</span>
                        </div>
                        {v.conditions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {v.conditions.map(c => <span key={c} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs">{c}</span>)}
                          </div>
                        )}
                        {v.childVaccinations.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {v.childVaccinations.map(vac => <span key={vac} className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-xs">{vac}</span>)}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Last visit: {v.lastVisit} ({daysSinceVisit === 0 ? 'Today' : `${daysSinceVisit} days ago`})
                        </p>
                      </div>
                    </div>
                    <button onClick={() => recordVisit(v.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-200 transition">
                      <CheckCircle2 className="w-4 h-4" /> Record Visit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowRegistration(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Register New Villager</h3>
              <button onClick={() => setShowRegistration(false)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={newVillager.name} onChange={e => setNewVillager({ ...newVillager, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" value={newVillager.age} onChange={e => setNewVillager({ ...newVillager, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <select value={newVillager.village} onChange={e => setNewVillager({ ...newVillager, village: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500">
                    <option value="">Select village</option>
                    {villages.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={newVillager.phone} onChange={e => setNewVillager({ ...newVillager, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions (comma separated)</label>
                <input type="text" value={newVillager.conditions} onChange={e => setNewVillager({ ...newVillager, conditions: e.target.value })}
                  placeholder="e.g., Diabetes, Hypertension" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newVillager.pregnant} onChange={e => setNewVillager({ ...newVillager, pregnant: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-gray-700">Pregnant</span>
              </label>
              <button onClick={handleRegister}
                className="w-full py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /> Register Villager
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in-up bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Upcoming Health Camps</h3>
            <div className="space-y-2 text-sm text-amber-800">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span><strong>Jun 5</strong> — Vaccination drive at Saket Nagar (Children & Pregnant Women)</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span><strong>Jun 12</strong> — General health check-up at Shahpura Community Center</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span><strong>Jun 19</strong> — TB screening camp at Arera Colony</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
