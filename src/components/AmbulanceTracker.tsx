import { useState, useEffect } from 'react';
import {
  Truck,
  Phone,
  Clock,
  Navigation,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AmbulanceIllustration } from './Illustrations';

interface Ambulance {
  id: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  location_lat: number;
  location_lng: number;
  status: string;
  hospital_id: string | null;
  hospital?: {
    name: string;
    address: string;
  };
  distance?: number;
}

interface ActiveRequest {
  id: string;
  status: string;
  ambulance_id: string | null;
  ambulance?: Ambulance;
  hospital?: {
    name: string;
    address: string;
    phone: string;
  };
  estimated_arrival: string | null;
  pickup_location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export function AmbulanceTracker() {
  const { user } = useAuth();
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
    getCurrentLocation();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const loadData = async () => {
    try {
      const { data: ambulanceData } = await supabase
        .from('ambulances')
        .select(
          `
          *,
          hospital:hospitals(name, address)
        `
        )
        .order('status');

      if (ambulanceData) {
        setAmbulances(ambulanceData);
      }

      if (user) {
        const { data: requestData } = await supabase
          .from('emergency_requests')
          .select(
            `
            *,
            ambulance:ambulances(*),
            hospital:hospitals(name, address, phone)
          `
          )
          .eq('user_id', user.id)
          .in('status', ['pending', 'dispatched', 'en_route'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (requestData) {
          setActiveRequest(requestData);
        }
      }

      if (!ambulanceData || ambulanceData.length === 0) {
        generateMockAmbulances();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateMockAmbulances = async () => {
    const mockAmbulances: Partial<Ambulance>[] = [
      {
        vehicle_number: 'AMB-001',
        driver_name: 'John Smith',
        driver_phone: '(555) 111-0001',
        location_lat: 40.7128,
        location_lng: -74.006,
        status: 'available',
      },
      {
        vehicle_number: 'AMB-002',
        driver_name: 'Sarah Johnson',
        driver_phone: '(555) 111-0002',
        location_lat: 40.7484,
        location_lng: -73.9857,
        status: 'available',
      },
      {
        vehicle_number: 'AMB-003',
        driver_name: 'Michael Brown',
        driver_phone: '(555) 111-0003',
        location_lat: 40.73,
        location_lng: -73.98,
        status: 'busy',
      },
      {
        vehicle_number: 'AMB-004',
        driver_name: 'Emily Davis',
        driver_phone: '(555) 111-0004',
        location_lat: 40.76,
        location_lng: -73.95,
        status: 'available',
      },
      {
        vehicle_number: 'AMB-005',
        driver_name: 'David Wilson',
        driver_phone: '(555) 111-0005',
        location_lat: 40.758,
        location_lng: -73.9855,
        status: 'offline',
      },
    ];

    for (const ambulance of mockAmbulances) {
      await supabase.from('ambulances').insert(ambulance);
    }

    loadData();
  };

  const calculateDistance = (ambulance: Ambulance) => {
    if (!location) return 0;

    const R = 6371;
    const dLat = ((ambulance.location_lat - location.lat) * Math.PI) / 180;
    const dLon = ((ambulance.location_lng - location.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.lat * Math.PI) / 180) *
        Math.cos((ambulance.location_lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const availableAmbulances = ambulances
    .filter((a) => a.status === 'available')
    .map((a) => ({ ...a, distance: calculateDistance(a) }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const busyAmbulances = ambulances.filter((a) => a.status === 'busy');
  const offlineAmbulances = ambulances.filter((a) => a.status === 'offline');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeRequest && (
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Active Request</h2>
                  <p className="text-emerald-100">Track your emergency response</p>
                </div>
              </div>
              <div className="w-16 h-16">
                <AmbulanceIllustration className="w-full h-full" />
              </div>
            </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Status</span>
              </div>
              <p className="text-2xl font-bold capitalize">
                {activeRequest.status.replace('_', ' ')}
              </p>
            </div>

            {activeRequest.estimated_arrival && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">ETA</span>
                </div>
                <p className="text-2xl font-bold">
                  {Math.max(
                    0,
                    Math.round(
                      (new Date(activeRequest.estimated_arrival).getTime() - Date.now()) / 60000
                    )
                  )}{' '}
                  min
                </p>
              </div>
            )}

            {activeRequest.ambulance && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5" />
                  <span className="font-semibold">Vehicle</span>
                </div>
                <p className="text-lg font-bold">{activeRequest.ambulance.vehicle_number}</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {activeRequest.ambulance && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <h4 className="font-semibold mb-2">Driver Information</h4>
                <p className="font-medium">{activeRequest.ambulance.driver_name}</p>
                <p className="text-sm text-emerald-100">{activeRequest.ambulance.driver_phone}</p>
                <a
                  href={`tel:${activeRequest.ambulance.driver_phone}`}
                  className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition"
                >
                  <Phone className="w-4 h-4" />
                  Call Driver
                </a>
              </div>
            )}

            {activeRequest.hospital && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <h4 className="font-semibold mb-2">Destination Hospital</h4>
                <p className="font-medium">{activeRequest.hospital.name}</p>
                <p className="text-sm text-emerald-100">{activeRequest.hospital.address}</p>
                <p className="text-sm text-emerald-100">{activeRequest.hospital.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-4 h-32 bg-white/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Navigation className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Live Tracking View</p>
              <p className="text-xs text-emerald-100 mt-1">
                From: {activeRequest.pickup_location?.address || 'Your location'}
              </p>
            </div>
          </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ambulance Fleet Status</h3>
            <p className="text-sm text-gray-500">
              {availableAmbulances.length} available, {busyAmbulances.length} busy,{' '}
              {offlineAmbulances.length} offline
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Available ({availableAmbulances.length})
            </h4>
            <div className="space-y-2">
              {availableAmbulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{ambulance.vehicle_number}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4" />
                        <span>{ambulance.driver_name}</span>
                      </div>
                    </div>
                    {ambulance.distance !== undefined && ambulance.distance > 0 && (
                      <span className="text-sm font-medium text-green-700">
                        {ambulance.distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`tel:${ambulance.driver_phone}`}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </a>
                    <span className="text-xs text-gray-600">{ambulance.driver_phone}</span>
                  </div>
                </div>
              ))}
              {availableAmbulances.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No ambulances available
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-yellow-700 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              On Duty ({busyAmbulances.length})
            </h4>
            <div className="space-y-2">
              {busyAmbulances.map((ambulance) => (
                <div key={ambulance.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="font-semibold text-gray-900">{ambulance.vehicle_number}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>{ambulance.driver_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-yellow-600/20 text-yellow-700 rounded">
                      Responding
                    </span>
                    <span className="text-xs text-gray-600">{ambulance.driver_phone}</span>
                  </div>
                </div>
              ))}
              {busyAmbulances.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">All units available</div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-500 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Offline ({offlineAmbulances.length})
            </h4>
            <div className="space-y-2">
              {offlineAmbulances.map((ambulance) => (
                <div key={ambulance.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="font-semibold text-gray-700">{ambulance.vehicle_number}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <User className="w-4 h-4" />
                      <span>{ambulance.driver_name}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                    Maintenance
                  </span>
                </div>
              ))}
              {offlineAmbulances.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  All units operational
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Truck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How Ambulance Tracking Works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>GPS-enabled ambulances update location in real-time</li>
              <li>Nearest available ambulance dispatched to your location</li>
              <li>Live ETA updates sent to your device</li>
              <li>Hospital notified and prepared for your arrival</li>
              <li>Direct communication with driver for updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
