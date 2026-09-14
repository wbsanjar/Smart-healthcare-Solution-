import { useState, useEffect, useRef } from 'react';
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
  Camera,
  X,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

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
  avatar_url: string | null;
  updated_at: string;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export function Profile() {
  const { userId, isLoaded: authLoaded, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoaded) fetchProfile();
  }, [userId, authLoaded]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      } else {
        const newProfile: Partial<Profile> = {
          id: userId,
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
          avatar_url: null,
        };
        const { error: insertError } = await supabase.from('profiles').insert(newProfile);
        if (insertError) throw insertError;
        setProfile(newProfile as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Could not load profile. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !userId) return;

    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          blood_type: profile.blood_type,
          date_of_birth: profile.date_of_birth,
          address: profile.address,
          emergency_contact: profile.emergency_contact,
          medical_conditions: profile.medical_conditions,
          allergies: profile.allergies,
          current_medications: profile.current_medications,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      const { data: verify } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (!verify) {
        throw new Error(
          'Profile was not saved. This is likely because Supabase RLS is blocking the update. ' +
          'Run the RLS fix migration or set up a Clerk Supabase JWT template.'
        );
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('Image must be less than 2MB');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, WebP, and GIF images are allowed');
      return;
    }

    setAvatarUploading(true);
    setError('');

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: urlData.publicUrl } : null
      );
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setAvatarUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!profile?.avatar_url || !userId) return;

    try {
      const { data: files } = await supabase.storage
        .from('avatars')
        .list(userId);

      const paths = (files || [])
        .filter((f) => f.name.startsWith('avatar'))
        .map((f) => `${userId}/${f.name}`);

      if (paths.length > 0) {
        await supabase.storage.from('avatars').remove(paths);
      }

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: null } : null
      );
    } catch (err) {
      console.error('Error removing avatar:', err);
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

  const addAllergy = () => {
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
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-slide-up bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start gap-5">
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/30 bg-white/10">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white/60" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md text-brand-600 hover:bg-brand-50 transition disabled:opacity-50"
              >
                {avatarUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              {profile.avatar_url && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your Medical Profile</h2>
                  <p className="text-brand-100 text-sm">
                    Keep your medical information up to date for faster emergency response
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-100">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>
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
        <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={profile.emergency_contact.name || ''}
                onChange={(e) => updateEmergencyContact('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                value={profile.emergency_contact.relationship || ''}
                onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Spouse, Parent, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.emergency_contact.phone || ''}
                onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="(555) 987-6543"
              />
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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

        <div className="animate-fade-in-up-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Add allergy"
            />
            <button
              type="button"
              onClick={addAllergy}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        <div className="animate-fade-in-up-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.current_medications.map((medication) => (
              <span
                key={medication}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg"
              >
                {medication}
                <button
                  type="button"
                  onClick={() => removeMedication(medication)}
                  className="text-brand-500 hover:text-brand-700"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Add medication"
            />
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
            >
              Add
            </button>
          </div>
        </div>

        {error && (
          <div className="animate-fade-in bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 animate-slide-up">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
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
            <div className="flex items-center gap-2 text-green-600 animate-scale-in">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Saved!</span>
            </div>
          )}
        </div>
      </form>

      <div className="animate-fade-in-up-5 bg-brand-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5 animate-heartbeat" />
          <div>
            <h3 className="font-semibold text-brand-900 mb-2">Why This Information Matters</h3>
            <ul className="text-sm text-brand-800 space-y-1">
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
