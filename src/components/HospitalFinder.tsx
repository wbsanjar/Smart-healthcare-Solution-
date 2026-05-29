import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Navigation,
  Clock,
  Heart,
  Loader2,
  Bed,
} from 'lucide-react';
import { supabase } from '../config/supabase';
import { HospitalIllustration } from './Illustrations';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  location_lat: number;
  location_lng: number;
  emergency_capacity: number;
  available_beds: number;
  specialties: string[];
  accepts_emergency: boolean;
  rating: number;
  distance?: number;
}

export function HospitalFinder() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  useEffect(() => {
    fetchHospitals();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {}
      );
    }
  };

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      setHospitals(data || []);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      generateMockHospitals();
    } finally {
      setLoading(false);
    }
  };

  const generateMockHospitals = async () => {
    const mockHospitals: Partial<Hospital>[] = [
      {
        name: 'City General Hospital',
        address: '123 Medical Center Dr, Downtown',
        phone: '(555) 123-4567',
        location_lat: 40.7128,
        location_lng: -74.006,
        emergency_capacity: 50,
        available_beds: 12,
        specialties: ['Emergency', 'Cardiology', 'Trauma', 'Surgery'],
        accepts_emergency: true,
        rating: 4.8,
      },
      {
        name: 'St. Mary Medical Center',
        address: '456 Health Ave, Midtown',
        phone: '(555) 234-5678',
        location_lat: 40.758,
        location_lng: -73.9855,
        emergency_capacity: 30,
        available_beds: 8,
        specialties: ['Pediatrics', 'Maternity', 'General Medicine'],
        accepts_emergency: true,
        rating: 4.6,
      },
      {
        name: 'Westside Regional Hospital',
        address: '789 Care Blvd, Westside',
        phone: '(555) 345-6789',
        location_lat: 40.7484,
        location_lng: -73.9857,
        emergency_capacity: 25,
        available_beds: 5,
        specialties: ['Orthopedics', 'Neurology', 'Rehabilitation'],
        accepts_emergency: true,
        rating: 4.5,
      },
      {
        name: 'University Medical Center',
        address: '101 Research Way, University District',
        phone: '(555) 456-7890',
        location_lat: 40.73,
        location_lng: -73.98,
        emergency_capacity: 40,
        available_beds: 15,
        specialties: ['Oncology', 'Cardiology', 'Transplant', 'Research'],
        accepts_emergency: true,
        rating: 4.9,
      },
      {
        name: 'Eastside Community Hospital',
        address: '202 Community St, Eastside',
        phone: '(555) 567-8901',
        location_lat: 40.76,
        location_lng: -73.95,
        emergency_capacity: 15,
        available_beds: 3,
        specialties: ['General Practice', 'Minor Surgery'],
        accepts_emergency: false,
        rating: 4.2,
      },
    ];

    for (const hospital of mockHospitals) {
      await supabase.from('hospitals').insert(hospital);
    }

    fetchHospitals();
  };

  const calculateDistance = (hospital: Hospital) => {
    if (!location) return 0;

    const R = 6371;
    const dLat = ((hospital.location_lat - location.lat) * Math.PI) / 180;
    const dLon = ((hospital.location_lng - location.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.lat * Math.PI) / 180) *
        Math.cos((hospital.location_lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const allSpecialties = ['all', ...new Set(hospitals.flatMap((h) => h.specialties))];

  const filteredHospitals = hospitals
    .map((h) => ({ ...h, distance: calculateDistance(h) }))
    .filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'all' || h.specialties.includes(selectedSpecialty);
      const matchesEmergency = !showEmergencyOnly || h.accepts_emergency;

      return matchesSearch && matchesSpecialty && matchesEmergency;
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hospital Finder</h2>
                <p className="text-blue-100">Find nearby hospitals and emergency facilities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="text-sm text-blue-100">Total Hospitals</p>
                <p className="text-2xl font-bold">{hospitals.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <p className="text-sm text-blue-100">Emergency Ready</p>
                <p className="text-2xl font-bold">{hospitals.filter((h) => h.accepts_emergency).length}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28">
            <HospitalIllustration className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or locations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
              className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                showEmergencyOnly
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredHospitals.length} Hospitals Found
            </h3>
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                <span>Sorted by distance</span>
              </div>
            )}
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No hospitals found matching your criteria</p>
            </div>
          ) : (
            filteredHospitals.map((hospital) => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className={`w-full text-left bg-white rounded-lg shadow-sm border p-4 transition hover:shadow-md ${
                  selectedHospital?.id === hospital.id
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{hospital.address}</span>
                    </div>
                  </div>
                  {hospital.accepts_emergency && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded">
                      ER
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{hospital.rating.toFixed(1)}</span>
                  </div>

                  {hospital.distance !== undefined && hospital.distance > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>{hospital.distance.toFixed(1)} km</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span>{hospital.available_beds} beds</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {hospital.specialties.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-0.5 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{hospital.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div>
          {selectedHospital ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Map View</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {selectedHospital.location_lat.toFixed(4)}, Lng:{' '}
                    {selectedHospital.location_lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedHospital.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {selectedHospital.address}
                    </div>
                  </div>
                  {selectedHospital.accepts_emergency && (
                    <span className="px-3 py-1 text-sm font-medium bg-red-50 text-red-700 border border-red-200 rounded-full">
                      Emergency
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedHospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-medium">{selectedHospital.rating.toFixed(1)} Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">
                      {selectedHospital.available_beds}/{selectedHospital.emergency_capacity} Beds
                    </span>
                  </div>
                  {selectedHospital.distance !== undefined && selectedHospital.distance > 0 && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedHospital.distance.toFixed(1)} km</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    <Phone className="w-5 h-5" />
                    Call
                  </a>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
                  >
                    <Navigation className="w-5 h-5" />
                    Directions
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated wait time: {'<'} 30 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Select a hospital to view details</p>
              <p className="text-sm text-gray-500">
                Click on any hospital from the list to see more information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
