import { useState, useEffect, useRef } from 'react';
import {
  Truck,
  Phone,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AmbulanceIllustration } from './Illustrations';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function AmbulanceMap({ ambulances, userLocation }: {
  ambulances: Ambulance[];
  userLocation: { lat: number; lng: number } | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [23.2599, 77.4126],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const greenIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const greyIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    ambulances.forEach((a) => {
      let icon = greyIcon;
      let statusLabel = a.status;
      if (a.status === 'available') { icon = greenIcon; statusLabel = 'Available'; }
      else if (a.status === 'busy') { icon = redIcon; statusLabel = 'Responding'; }

      L.marker([a.location_lat, a.location_lng], { icon })
        .addTo(map)
        .bindPopup(`
          <b>${a.vehicle_number}</b><br/>
          Driver: ${a.driver_name}<br/>
          Status: <span style="color:${a.status === 'available' ? 'green' : a.status === 'busy' ? 'red' : 'grey'}">${statusLabel}</span><br/>
          📞 ${a.driver_phone}
        `);
    });

    if (userLocation) {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 10,
        fillColor: '#3b82f6',
        color: '#1d4ed8',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.6,
      })
        .addTo(map)
        .bindPopup('<b>Your Location</b>')
        .openPopup();

      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [ambulances, userLocation]);

  return <div ref={mapRef} className="w-full h-80 rounded-lg" />;
}

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
  const { userId } = useAuth();
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
    getCurrentLocation();

    const channel = supabase
      .channel('ambulance-tracker')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ambulances' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_requests', filter: userId ? `user_id=eq.${userId}` : undefined }, () => { loadData(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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

      if (userId) {
        const { data: requestData } = await supabase
          .from('emergency_requests')
          .select(
            `
            *,
            ambulance:ambulances(*),
            hospital:hospitals(name, address, phone)
          `
          )
          .eq('user_id', userId)
          .in('status', ['pending', 'dispatched', 'en_route'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (requestData) {
          setActiveRequest(requestData);
        }
      }

      if (!ambulanceData || ambulanceData.length === 0) {
        setAmbulances(getMockAmbulances());
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setAmbulances(getMockAmbulances());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMockAmbulances = (): Ambulance[] => [
    {
      id: 'amb-bpl-1',
      vehicle_number: 'MP-04-AB-1001',
      driver_name: 'Ramesh Gupta',
      driver_phone: '+91 98765-10001',
      location_lat: 23.2400,
      location_lng: 77.4200,
      status: 'available',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-2',
      vehicle_number: 'MP-04-AB-1002',
      driver_name: 'Suresh Patel',
      driver_phone: '+91 98765-10002',
      location_lat: 23.2750,
      location_lng: 77.4350,
      status: 'available',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-3',
      vehicle_number: 'MP-04-AB-1003',
      driver_name: 'Vikram Singh',
      driver_phone: '+91 98765-10003',
      location_lat: 23.2100,
      location_lng: 77.4000,
      status: 'busy',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-4',
      vehicle_number: 'MP-04-AB-1004',
      driver_name: 'Amit Sharma',
      driver_phone: '+91 98765-10004',
      location_lat: 23.2500,
      location_lng: 77.4450,
      status: 'available',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-5',
      vehicle_number: 'MP-04-AB-1005',
      driver_name: 'Rajesh Verma',
      driver_phone: '+91 98765-10005',
      location_lat: 23.2650,
      location_lng: 77.4050,
      status: 'available',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-6',
      vehicle_number: 'MP-04-AB-1006',
      driver_name: 'Manoj Tiwari',
      driver_phone: '+91 98765-10006',
      location_lat: 23.2250,
      location_lng: 77.4380,
      status: 'busy',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-7',
      vehicle_number: 'MP-04-AB-1007',
      driver_name: 'Sanjay Yadav',
      driver_phone: '+91 98765-10007',
      location_lat: 23.2350,
      location_lng: 77.4100,
      status: 'offline',
      hospital_id: null,
    },
    {
      id: 'amb-bpl-8',
      vehicle_number: 'MP-04-AB-1008',
      driver_name: 'Deepak Chauhan',
      driver_phone: '+91 98765-10008',
      location_lat: 23.2580,
      location_lng: 77.4250,
      status: 'available',
      hospital_id: null,
    },
  ];

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
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeRequest && (
        <div className="animate-slide-up bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Active Request</h2>
                  <p className="text-brand-100">Track your emergency response</p>
                </div>
              </div>
              <div className="w-16 h-16">
                <AmbulanceIllustration className="w-full h-full" />
              </div>
            </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur animate-scale-in">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 animate-pulse-soft" />
                <span className="font-semibold">Status</span>
              </div>
              <p className="text-2xl font-bold capitalize">
                {activeRequest.status.replace('_', ' ')}
              </p>
            </div>

            {activeRequest.estimated_arrival && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur animate-scale-in-1">
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
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur animate-scale-in-2">
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
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur animate-fade-in-up-1">
                <h4 className="font-semibold mb-2">Driver Information</h4>
                <p className="font-medium">{activeRequest.ambulance.driver_name}</p>
                <p className="text-sm text-brand-100">{activeRequest.ambulance.driver_phone}</p>
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
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur animate-fade-in-up-2">
                <h4 className="font-semibold mb-2">Destination Hospital</h4>
                <p className="font-medium">{activeRequest.hospital.name}</p>
                <p className="text-sm text-brand-100">{activeRequest.hospital.address}</p>
                <p className="text-sm text-brand-100">{activeRequest.hospital.phone}</p>
              </div>
            )}
          </div>

          <div className="mt-4 h-48 rounded-lg overflow-hidden">
            <AmbulanceMap
              ambulances={activeRequest.ambulance ? [activeRequest.ambulance] : []}
              userLocation={{ lat: activeRequest.pickup_location?.lat || 23.2599, lng: activeRequest.pickup_location?.lng || 77.4126 }}
            />
          </div>
          </div>
        </div>
      )}

      <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              {availableAmbulances.map((ambulance, index) => (
                <div
                  key={ambulance.id}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.06}s` }}
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
              {busyAmbulances.map((ambulance, index) => (
                <div key={ambulance.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: `${index * 0.06}s` }}>
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
              {offlineAmbulances.map((ambulance, index) => (
                <div key={ambulance.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: `${index * 0.06}s` }}>
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

      <div className="animate-slide-up-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Map</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Busy</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-500 inline-block" /> Offline</span>
            {location && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> You</span>}
          </div>
        </div>
        <AmbulanceMap ambulances={ambulances} userLocation={location} />
      </div>

      <div className="animate-fade-in-up bg-brand-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Truck className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5 animate-float" />
          <div>
            <h3 className="font-semibold text-brand-900 mb-2">How Ambulance Tracking Works</h3>
            <ul className="text-sm text-brand-800 space-y-1">
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
