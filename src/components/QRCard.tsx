import { useState } from 'react';
import { QrCode, Download, Share2, Heart, Shield, User, Phone, AlertTriangle, Droplets, Printer } from 'lucide-react';

const emergencyData = {
  name: 'Patient Name',
  bloodGroup: 'A+',
  allergies: ['Penicillin', 'Peanuts'],
  emergencyContact: '+91 98765-43210',
  emergencyName: 'Ramesh Sharma',
  criticalConditions: ['Asthma', 'Diabetes Type 2'],
  organDonor: true,
  healthId: 'HID-MP-2026-0042',
};

export function QRCard() {
  const [activeTab, setActiveTab] = useState<'qr' | 'info'>('qr');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="animate-slide-up bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><QrCode className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Emergency QR Medical Card</h2>
                <p className="text-purple-100">Your critical medical info at a glance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        {(['qr', 'info'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === tab ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            {tab === 'qr' ? 'QR Code' : 'Medical Info'}
          </button>
        ))}
      </div>

      {activeTab === 'qr' ? (
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-xs mx-auto">
            <div className="bg-white rounded-2xl p-6 border-2 border-purple-100 shadow-lg">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 mb-4 text-center text-white">
                <Heart className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-semibold">EMERGENCY MEDICAL CARD</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-center">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'} ${i === 24 ? 'bg-purple-600' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{emergencyData.name}</p>
                <p className="text-sm text-gray-500">Blood Group: <span className="font-bold text-red-600">{emergencyData.bloodGroup}</span></p>
                <p className="text-xs text-gray-400 mt-2">Tap to show medical info</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
              <Download className="w-5 h-5" /> Save Image
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
              <Printer className="w-5 h-5" /> Print
            </button>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">Privacy Protected: </span>
                QR shows only emergency data (blood group, allergies, emergency contact).
                Full medical history is not shared.
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">📱 Ways to use your QR Medical Card:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Phone lock screen wallpaper</li>
              <li>• Print as wallet card</li>
              <li>• Helmet or bike sticker</li>
              <li>• Share with family members</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{emergencyData.name}</h3>
              <p className="text-sm text-gray-500">Health ID: {emergencyData.healthId}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Droplets className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="text-xl font-bold text-red-700">{emergencyData.bloodGroup}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">Allergies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {emergencyData.allergies.map(a => (
                  <span key={a} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">{a}</span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-brand-600" />
                <span className="font-semibold text-brand-900">Critical Conditions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {emergencyData.criticalConditions.map(c => (
                  <span key={c} className="px-3 py-1 bg-brand-100 text-brand-800 rounded-lg text-sm font-medium">{c}</span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Emergency Contact</span>
              </div>
              <p className="font-medium text-gray-900">{emergencyData.emergencyName}</p>
              <p className="text-lg font-bold text-green-700">{emergencyData.emergencyContact}</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">Organ Donor:</span> {emergencyData.organDonor ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
            <Share2 className="w-5 h-5" /> Share Medical Card
          </button>
        </div>
      )}
    </div>
  );
}
