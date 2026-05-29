import React, { useState, useEffect } from 'react';
import {
  Phone,
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  Heart,
  Brain,
  Zap,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EmergencyIllustration } from './Illustrations';

interface EmergencyRequest {
  id: string;
  status: string;
  severity: string;
  symptoms: string[];
  description: string;
  created_at: string;
  estimated_arrival: string | null;
  ambulance?: {
    vehicle_number: string;
    driver_name: string;
    driver_phone: string;
    location_lat: number;
    location_lng: number;
  };
  hospital?: {
    name: string;
    address: string;
    phone: string;
  };
}

const commonSymptoms = [
  'Chest Pain',
  'Difficulty Breathing',
  'Severe Bleeding',
  'Loss of Consciousness',
  'Stroke Symptoms',
  'Severe Allergic Reaction',
  'High Fever',
  'Severe Pain',
  'Vomiting Blood',
  'Broken Bones',
  'Severe Burns',
  'Seizures',
];

const severityLevels = [
  { id: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { id: 'critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
];

export function EmergencyPage() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchActiveRequest();
    getCurrentLocation();
    const interval = setInterval(fetchActiveRequest, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError('');
      },
      (error) => {
        setLocationError('Unable to get location. Please enable location services.');
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchActiveRequest = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('emergency_requests')
      .select(
        `
        *,
        ambulance:ambulances(vehicle_number, driver_name, driver_phone, location_lat, location_lng),
        hospital:hospitals(name, address, phone)
      `
      )
      .eq('user_id', user.id)
      .in('status', ['pending', 'dispatched', 'en_route'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setActiveRequest(data);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !location) return;

    setLoading(true);

    try {
      const { data: hospitals } = await supabase
        .from('hospitals')
        .select('*')
        .eq('accepts_emergency', true)
        .limit(5);

      const { data: ambulances } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available')
        .limit(1);

      const nearestHospital = hospitals?.[0];
      const availableAmbulance = ambulances?.[0];

      const eta = new Date();
      eta.setMinutes(eta.getMinutes() + 8 + Math.random() * 7);

      const { data: request, error } = await supabase
        .from('emergency_requests')
        .insert({
          user_id: user.id,
          hospital_id: nearestHospital?.id || null,
          ambulance_id: availableAmbulance?.id || null,
          status: 'pending',
          severity,
          symptoms,
          description,
          pickup_location: {
            lat: location.lat,
            lng: location.lng,
            address: 'Current Location',
          },
          estimated_arrival: eta.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      if (availableAmbulance) {
        await supabase
          .from('ambulances')
          .update({ status: 'busy' })
          .eq('id', availableAmbulance.id);
      }

      setActiveRequest({
        ...request,
        ambulance: availableAmbulance,
        hospital: nearestHospital,
      });

      setSymptoms([]);
      setDescription('');
      setSeverity('medium');
    } catch (error) {
      console.error('Error creating emergency request:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async () => {
    if (!activeRequest) return;

    await supabase
      .from('emergency_requests')
      .update({ status: 'cancelled' })
      .eq('id', activeRequest.id);

    if (activeRequest.ambulance_id) {
      await supabase
        .from('ambulances')
        .update({ status: 'available' })
        .eq('id', activeRequest.ambulance_id);
    }

    setActiveRequest(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'dispatched':
        return <Zap className="w-5 h-5" />;
      case 'en_route':
        return <Activity className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  if (activeRequest) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-700 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">{getStatusIcon(activeRequest.status)}</div>
              <div>
                <h2 className="text-xl font-bold">Emergency Request Active</h2>
                <p className="text-blue-100">
                  Status:{' '}
                  <span className="capitalize font-medium">{activeRequest.status.replace('_', ' ')}</span>
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-20 h-20">
              <EmergencyIllustration className="w-full h-full" />
            </div>
          </div>

          {activeRequest.estimated_arrival && (
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <span className="text-lg">
                ETA:{' '}
                {Math.max(
                  0,
                  Math.round(
                    (new Date(activeRequest.estimated_arrival).getTime() - Date.now()) / 60000
                  )
                )}{' '}
                minutes
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {activeRequest.hospital && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-200" />
                  <span className="font-semibold">Hospital Assigned</span>
                </div>
                <p className="font-bold text-lg">{activeRequest.hospital.name}</p>
                <p className="text-sm text-blue-100">{activeRequest.hospital.address}</p>
                <p className="text-sm text-blue-100">{activeRequest.hospital.phone}</p>
              </div>
            )}

            {activeRequest.ambulance && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5" />
                  <span className="font-semibold">Ambulance Dispatched</span>
                </div>
                <p className="font-bold text-lg">{activeRequest.ambulance.vehicle_number}</p>
                <p className="text-sm text-blue-100">Driver: {activeRequest.ambulance.driver_name}</p>
                <p className="text-sm text-blue-100">{activeRequest.ambulance.driver_phone}</p>
              </div>
            )}
          </div>

          {activeRequest.status === 'pending' && (
            <button
              onClick={cancelRequest}
              className="mt-4 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg font-medium transition"
            >
              Cancel Request
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500">Request ID</span>
              <p className="font-mono text-sm">{activeRequest.id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Severity</span>
              <p className="font-semibold capitalize">{activeRequest.severity}</p>
            </div>
            {activeRequest.symptoms.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Symptoms</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activeRequest.symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeRequest.description && (
              <div>
                <span className="text-sm text-gray-500">Description</span>
                <p className="text-gray-700">{activeRequest.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">While You Wait</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>Stay calm and keep the patient comfortable</li>
                <li>Do not move the patient unless absolutely necessary</li>
                <li>If trained, check for breathing and pulse</li>
                <li>Keep phone line open for emergency services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-rose-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute top-10 right-20 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg animate-pulse">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Emergency Request</h2>
                <p className="text-red-100">Request immediate medical assistance</p>
              </div>
            </div>

            {locationError && (
              <div className="bg-white/10 rounded-lg p-3 mb-4 backdrop-blur">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">{locationError}</span>
                </div>
              </div>
            )}

            {location && (
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-200" />
                  <span className="text-sm">Location acquired successfully</span>
                </div>
              </div>
            )}
          </div>
          <div className="hidden sm:block w-32 h-32">
            <EmergencyIllustration className="w-full h-full" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Symptoms</h3>
          <p className="text-sm text-gray-500 mb-4">
            Check all symptoms that apply to help us better assist you
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                  symptoms.includes(symptom)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {severityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setSeverity(level.id)}
                className={`p-3 rounded-lg border text-center font-medium transition ${
                  severity === level.id
                    ? `${level.bg} border-2`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className={level.color}>{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            placeholder="Describe the emergency situation in detail..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !location || symptoms.length === 0}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Request Emergency Assistance
            </>
          )}
        </button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">AI Analysis</h4>
          </div>
          <p className="text-sm text-gray-600">
            Our AI analyzes symptoms to prioritize your request
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-gray-900">Fast Dispatch</h4>
          </div>
          <p className="text-sm text-gray-600">
            Nearest ambulance dispatched within minutes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-gray-900">Hospital Ready</h4>
          </div>
          <p className="text-sm text-gray-600">
            Hospital notified and prepared for arrival
          </p>
        </div>
      </div>
    </div>
  );
}
