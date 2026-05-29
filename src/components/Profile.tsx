import { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ProfileIllustration } from './Illustrations';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  blood_type: string;
  date_of_birth: string | null;
  address: string;
  emergency_contact: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  medical_conditions: string[];
  allergies: string[];
  current_medications: string[];
  location_lat: number;
  location_lng: number;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      } else {
        const newProfile: Partial<Profile> = {
          id: user.id,
          full_name: '',
          phone: '',
          blood_type: 'Unknown',
          date_of_birth: null,
          address: '',
          emergency_contact: {},
          medical_conditions: [],
          allergies: [],
          current_medications: [],
          location_lat: 0,
          location_lng: 0,
        };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            emergency_contact: {
              ...prev.emergency_contact,
              [field]: value,
            },
          }
        : null
    );
  };

  const addCondition = () => {
    if (!newCondition.trim() || !profile) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            medical_conditions: [...prev.medical_conditions, newCondition.trim()],
          }
        : null
    );
    setNewCondition('');
  };

  const removeAllergy = () => {
    if (!newAllergy.trim() || !profile) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            allergies: [...prev.allergies, newAllergy.trim()],
          }
        : null
    );
    setNewAllergy('');
  };

  const addMedication = () => {
    if (!newMedication.trim() || !profile) return;
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            current_medications: [...prev.current_medications, newMedication.trim()],
          }
        : null
    );
    setNewMedication('');
  };

  const removeCondition = (condition: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            medical_conditions: prev.medical_conditions.filter((c) => c !== condition),
          }
        : null
    );
  };

  const removeAllergyItem = (allergy: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            allergies: prev.allergies.filter((a) => a !== allergy),
          }
        : null
    );
  };

  const removeMedication = (medication: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            current_medications: prev.current_medications.filter((m) => m !== medication),
          }
        : null
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Medical Profile</h2>
                <p className="text-blue-100">
                  Keep your medical information up to date for faster emergency response
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28">
            <ProfileIllustration className="w-full h-full" />
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={profile.date_of_birth || ''}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={profile.blood_type}
                  onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={profile.emergency_contact.name || ''}
                onChange={(e) => updateEmergencyContact('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                value={profile.emergency_contact.relationship || ''}
                onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Spouse, Parent, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.emergency_contact.phone || ''}
                onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(555) 987-6543"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Medical Conditions</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.medical_conditions.map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg"
              >
                {condition}
                <button
                  type="button"
                  onClick={() => removeCondition(condition)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add medical condition"
            />
            <button
              type="button"
              onClick={addCondition}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.allergies.map((allergy) => (
              <span
                key={allergy}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg"
              >
                {allergy}
                <button
                  type="button"
                  onClick={() => removeAllergyItem(allergy)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), removeAllergy())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add allergy"
            />
            <button
              type="button"
              onClick={removeAllergy}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.current_medications.map((medication) => (
              <span
                key={medication}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg"
              >
                {medication}
                <button
                  type="button"
                  onClick={() => removeMedication(medication)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add medication"
            />
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Saved!</span>
            </div>
          )}
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Why This Information Matters</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>Emergency Response:</strong> Medical teams are instantly notified of your
                conditions, allergies, and medications
              </li>
              <li>
                <strong>Faster Care:</strong> Your blood type and medical history help doctors make
                critical decisions quickly
              </li>
              <li>
                <strong>Family Contact:</strong> Emergency contacts are automatically notified when
                you request help
              </li>
              <li>
                <strong>Safer Treatment:</strong> Allergies and current medications prevent harmful
                drug interactions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
