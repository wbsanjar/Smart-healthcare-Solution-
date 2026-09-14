import { useState } from 'react';
import { AlertTriangle, Phone, User, Plus, X, Save, CheckCircle2, Heart, Users } from 'lucide-react';

interface FamilyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notifyOnEmergency: boolean;
}

export function FamilyAlert() {
  const [contacts, setContacts] = useState<FamilyContact[]>([
    { id: '1', name: 'Ramesh Sharma', phone: '+91 98765-43210', relationship: 'Father', notifyOnEmergency: true },
    { id: '2', name: 'Priya Sharma', phone: '+91 98765-43211', relationship: 'Mother', notifyOnEmergency: true },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [saved, setSaved] = useState(false);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts([...contacts, { ...newContact, id: Date.now().toString(), notifyOnEmergency: true }]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAdd(false);
  };

  const removeContact = (id: string) => setContacts(contacts.filter(c => c.id !== id));

  const toggleNotify = (id: string) => setContacts(contacts.map(c => c.id === id ? { ...c, notifyOnEmergency: !c.notifyOnEmergency } : c));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="animate-slide-up bg-gradient-to-br from-red-500 via-rose-600 to-pink-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">Family Alert System</h2>
                <p className="text-pink-100">Automatically notify family during emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-slide-up-1 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">How it works</h3>
            <p className="text-sm text-amber-800">
              When a Red (Emergency) alert is triggered, all family contacts with notifications enabled
              will receive an alert with your location, emergency case ID, and status.
            </p>
          </div>
        </div>
      </div>

      {contacts.length > 0 && (
        <div className="animate-slide-up-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts ({contacts.length})</h3>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {contacts.map((contact, i) => (
              <div key={contact.id} className={`p-4 animate-fade-in-up`} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleNotify(contact.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        contact.notifyOnEmergency
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {contact.notifyOnEmergency ? 'Alert On' : 'Muted'}
                    </button>
                    <button onClick={() => removeContact(contact.id)} className="p-1 text-gray-400 hover:text-red-500 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Emergency Contact</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="+91 98765-43210" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input type="text" value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="Spouse, Parent, Sibling" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={addContact} disabled={!newContact.name || !newContact.phone}
                className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition disabled:opacity-50">
                Add Contact
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-500" /> Alert Preferences
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto-alert on Red triage</p>
              <p className="text-sm text-gray-500">Send alert to all contacts when emergency is declared Red</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Share live location</p>
              <p className="text-sm text-gray-500">Include GPS location in emergency alerts</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS alerts (SMS charges apply)</p>
              <p className="text-sm text-gray-500">Send SMS in addition to in-app notification</p>
            </div>
            <input type="checkbox" className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
          </label>
        </div>
        <button onClick={handleSave} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition">
          {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Preferences</>}
        </button>
      </div>

      <div className="animate-fade-in-up bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-rose-900 mb-2">What happens during an emergency?</h3>
            <ul className="text-sm text-rose-800 space-y-1">
              <li>• All contacts with "Alert On" are notified immediately</li>
              <li>• Alert includes: patient name, location, emergency case ID</li>
              <li>• Live ambulance tracking link is shared</li>
              <li>• Destination hospital is included in alert</li>
              <li>• Family can contact the attending ambulance driver</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
