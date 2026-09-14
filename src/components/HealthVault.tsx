import { useState } from 'react';
import { FileText, Upload, X, Download, Search, Heart, Activity, Baby, Eye, Stethoscope, File as FileIcon } from 'lucide-react';
import { HealthIllustration } from './Illustrations';

interface HealthRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  fileUrl: string;
  notes: string;
}

const recordTypes = [
  { id: 'prescription', label: 'Prescription', icon: FileText },
  { id: 'blood_report', label: 'Blood Report', icon: Activity },
  { id: 'xray', label: 'X-Ray / Scan', icon: Eye },
  { id: 'vaccination', label: 'Vaccination', icon: Baby },
  { id: 'surgery', label: 'Surgery Record', icon: Heart },
  { id: 'doctor_note', label: 'Doctor Note', icon: Stethoscope },
  { id: 'ecg', label: 'ECG', icon: Activity },
  { id: 'other', label: 'Other', icon: FileIcon },
];

const mockRecords: HealthRecord[] = [
  { id: '1', type: 'blood_report', title: 'Complete Blood Count', date: '2026-04-15', doctor: 'Dr. Aditya Verma', hospital: 'Apollo Sultan Hospital', fileUrl: '', notes: 'Hb: 13.2, WBC: 7800, Platelets: 2.5L' },
  { id: '2', type: 'prescription', title: 'General Medicine - Fever', date: '2026-03-22', doctor: 'Dr. Suresh Yadav', hospital: 'National Hospital', fileUrl: '', notes: 'Paracetamol 500mg, Azithromycin 500mg' },
  { id: '3', type: 'vaccination', title: 'COVID-19 Vaccine - Booster', date: '2026-01-10', doctor: 'Dr. Priya Sharma', hospital: 'Bansal Hospital', fileUrl: '', notes: 'Covishield booster dose administered' },
];

const vitalRanges = [
  { label: 'Blood Pressure', value: '118/76', status: 'normal', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Heart Rate', value: '72 bpm', status: 'normal', icon: Heart, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Blood Sugar', value: '98 mg/dL', status: 'normal', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },

  { label: 'Hemoglobin', value: '13.2 g/dL', status: 'normal', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
];

export function HealthVault() {
  const [records, setRecords] = useState<HealthRecord[]>(mockRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ type: 'prescription', title: '', notes: '' });

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      type: uploadData.type,
      title: uploadData.title,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Self-uploaded',
      hospital: '',
      fileUrl: '',
      notes: uploadData.notes,
    };
    setRecords([newRecord, ...records]);
    setShowUpload(false);
    setUploadData({ type: 'prescription', title: '', notes: '' });
  };

  const deleteRecord = (id: string) => setRecords(records.filter(r => r.id !== id));

  const getTypeIcon = (type: string) => {
    const found = recordTypes.find(t => t.id === type);
    const Icon = found?.icon || FileIcon;
    return <Icon className="w-5 h-5 text-brand-600" />;
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
              <div className="p-2 bg-white/20 rounded-lg"><FileText className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Digital Health Vault</h2>
                <p className="text-brand-100">Store and manage all your health records securely</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28"><HealthIllustration className="w-full h-full" /></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {vitalRanges.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={v.label} className={`${v.bg} rounded-xl p-4 border border-gray-200 animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${v.color}`} />
                <div>
                  <p className="text-xs text-gray-500">{v.label}</p>
                  <p className="font-semibold text-gray-900">{v.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="flex gap-2">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 text-sm">
              <option value="all">All Types</option>
              {recordTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <button onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition flex items-center gap-2 text-sm whitespace-nowrap">
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload New Record</h3>
            <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
              <div className="grid grid-cols-4 gap-2">
                {recordTypes.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setUploadData({ ...uploadData, type: t.id })}
                      className={`p-3 rounded-lg border text-center text-xs transition ${
                        uploadData.type === t.id ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}>
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={uploadData.title} onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                placeholder="e.g., Blood Test Report - April 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={uploadData.notes} onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })} rows={2}
                placeholder="Add any notes..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag & drop file here, or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
            <button onClick={handleUpload} disabled={!uploadData.title}
              className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition disabled:opacity-50">
              Upload to Health Vault
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="animate-fade-in-up bg-white rounded-xl border border-gray-200 p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No records found</p>
          </div>
        ) : (
          filteredRecords.map((record, i) => (
            <div key={record.id} className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-50 rounded-lg">{getTypeIcon(record.type)}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{record.title}</h4>
                    <p className="text-sm text-gray-500">{record.date} — {record.doctor}</p>
                    {record.notes && <p className="text-sm text-gray-600 mt-1">{record.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"><Download className="w-4 h-4" /></button>
                  <button onClick={() => deleteRecord(record.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><X className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
