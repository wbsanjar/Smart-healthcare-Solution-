import { useState, useEffect, useRef } from 'react';
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

function MapView({ hospitals, center, selectedId }: {
  hospitals: Hospital[];
  center: [number, number];
  selectedId?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center,
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
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    hospitals.forEach((h) => {
      const marker = L.marker([h.location_lat, h.location_lng])
        .addTo(map)
        .bindPopup(`
          <b>${h.name}</b><br/>
          ${h.address}<br/>
          ⭐ ${h.rating} | 🛏️ ${h.available_beds} beds<br/>
          ${h.accepts_emergency ? '🚨 Emergency' : ''}
        `);

      if (selectedId === h.id) {
        marker.openPopup();
        map.setView([h.location_lat, h.location_lng], 15);
      }
    });
  }, [hospitals, selectedId]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
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
      setHospitals(getMockHospitals());
    } finally {
      setLoading(false);
    }
  };

  const getMockHospitals = (): Hospital[] => [
    {
      id: 'bpl-1',
      name: 'AIIMS Bhopal',
      address: 'Raisen Bypass Road, Saket Nagar, Bhopal, MP 462020',
      phone: '0755-2672200',
      location_lat: 23.1993,
      location_lng: 77.4165,
      emergency_capacity: 200,
      available_beds: 45,
      specialties: ['Emergency', 'Cardiology', 'Neurology', 'Trauma', 'Surgery', 'Oncology'],
      accepts_emergency: true,
      rating: 4.9,
    },
    {
      id: 'bpl-2',
      name: 'Hamidia Hospital',
      address: 'Govindpura, Bhopal, MP 462023',
      phone: '0755-2753831',
      location_lat: 23.2548,
      location_lng: 77.4026,
      emergency_capacity: 150,
      available_beds: 30,
      specialties: ['Emergency', 'General Medicine', 'Pediatrics', 'Maternity'],
      accepts_emergency: true,
      rating: 4.5,
    },
    {
      id: 'bpl-3',
      name: 'Bansal Hospital',
      address: 'Shahpura, Bhopal, MP 462039',
      phone: '0755-4086000',
      location_lat: 23.2369,
      location_lng: 77.4330,
      emergency_capacity: 80,
      available_beds: 20,
      specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Emergency'],
      accepts_emergency: true,
      rating: 4.7,
    },
    {
      id: 'bpl-4',
      name: 'JK Hospital',
      address: 'Airport Road, Lalghati, Bhopal, MP 462030',
      phone: '0755-4200000',
      location_lat: 23.2305,
      location_lng: 77.4236,
      emergency_capacity: 60,
      available_beds: 15,
      specialties: ['Emergency', 'Surgery', 'Orthopedics', 'ENT'],
      accepts_emergency: true,
      rating: 4.4,
    },
    {
      id: 'bpl-5',
      name: 'Chirayu Medical College & Hospital',
      address: 'Bhopal Indore Highway, Bhilkheda, Bhopal, MP 462042',
      phone: '0755-4085555',
      location_lat: 23.2184,
      location_lng: 77.4529,
      emergency_capacity: 100,
      available_beds: 25,
      specialties: ['Emergency', 'Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
      accepts_emergency: true,
      rating: 4.3,
    },
    {
      id: 'bpl-6',
      name: 'Peoples Hospital',
      address: 'Bhanpur, Bhopal, MP 462037',
      phone: '0755-2557111',
      location_lat: 23.2747,
      location_lng: 77.4214,
      emergency_capacity: 70,
      available_beds: 18,
      specialties: ['Emergency', 'Cardiology', 'Pulmonology', 'General Medicine'],
      accepts_emergency: true,
      rating: 4.2,
    },
    {
      id: 'bpl-7',
      name: 'Apollo Sultan Hospital',
      address: '10, Shivaji Nagar, Bhopal, MP 462016',
      phone: '0755-4299999',
      location_lat: 23.2409,
      location_lng: 77.4092,
      emergency_capacity: 90,
      available_beds: 22,
      specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'Nephrology'],
      accepts_emergency: true,
      rating: 4.8,
    },
    {
      id: 'bpl-8',
      name: 'MGM Medical College',
      address: 'Kolar Road, Bhopal, MP 462042',
      phone: '0755-2493700',
      location_lat: 23.2152,
      location_lng: 77.4096,
      emergency_capacity: 120,
      available_beds: 28,
      specialties: ['Emergency', 'Medicine', 'Surgery', 'Pediatrics', 'Obstetrics'],
      accepts_emergency: true,
      rating: 4.1,
    },
    {
      id: 'bpl-9',
      name: 'National Hospital',
      address: '29, Hamidia Road, Bhopal, MP 462001',
      phone: '0755-2544276',
      location_lat: 23.2529,
      location_lng: 77.4136,
      emergency_capacity: 50,
      available_beds: 10,
      specialties: ['General Medicine', 'Surgery', 'Emergency'],
      accepts_emergency: true,
      rating: 4.0,
    },
    {
      id: 'bpl-10',
      name: 'Shree Narayana Hospital',
      address: 'E-4, Arera Colony, Bhopal, MP 462016',
      phone: '0755-2460234',
      location_lat: 23.2645,
      location_lng: 77.4303,
      emergency_capacity: 40,
      available_beds: 8,
      specialties: ['Cardiology', 'Neurology', 'Emergency', 'Medicine'],
      accepts_emergency: true,
      rating: 4.3,
    },
    {
      id: 'bpl-11',
      name: 'Anad Hospital',
      address: 'A-97, Shahpura, Bhopal, MP 462039',
      phone: '0755-4034000',
      location_lat: 23.2573,
      location_lng: 77.4290,
      emergency_capacity: 35,
      available_beds: 7,
      specialties: ['Orthopedics', 'Gynecology', 'General Surgery'],
      accepts_emergency: true,
      rating: 4.2,
    },
    {
      id: 'bpl-12',
      name: 'Bhopal Memorial Hospital & Research Centre',
      address: 'Raisen Bypass Road, Karondh, Bhopal, MP 462038',
      phone: '0755-4087000',
      location_lat: 23.1990,
      location_lng: 77.4313,
      emergency_capacity: 75,
      available_beds: 16,
      specialties: ['Cardiology', 'Nephrology', 'Urology', 'Emergency'],
      accepts_emergency: true,
      rating: 4.5,
    },
    {
      id: 'bpl-13',
      name: 'Sparsh Hospital',
      address: 'Plot No. 25, Zone-II, M.P. Nagar, Bhopal, MP 462011',
      phone: '0755-4209999',
      location_lat: 23.2275,
      location_lng: 77.4343,
      emergency_capacity: 45,
      available_beds: 12,
      specialties: ['Orthopedics', 'Neurology', 'Pediatrics', 'Emergency'],
      accepts_emergency: true,
      rating: 4.4,
    },
    {
      id: 'bpl-14',
      name: 'Sanjeevani Hospital',
      address: '10, New Market, TT Nagar, Bhopal, MP 462003',
      phone: '0755-2553666',
      location_lat: 23.2400,
      location_lng: 77.4260,
      emergency_capacity: 30,
      available_beds: 6,
      specialties: ['General Medicine', 'Pediatrics', 'Gynecology'],
      accepts_emergency: false,
      rating: 3.9,
    },
    {
      id: 'bpl-15',
      name: 'Lifeline Hospital',
      address: 'Hoshangabad Road, Bhopal, MP 462026',
      phone: '0755-2589333',
      location_lat: 23.2600,
      location_lng: 77.4400,
      emergency_capacity: 55,
      available_beds: 14,
      specialties: ['Emergency', 'Cardiology', 'Pulmonology', 'ICU'],
      accepts_emergency: true,
      rating: 4.1,
    },
    {
      id: 'bpl-16',
      name: 'City Hospital Bhopal',
      address: '12, NH-12, Bawadiya Kalan, Bhopal, MP 462039',
      phone: '0755-4001122',
      location_lat: 23.2450,
      location_lng: 77.4150,
      emergency_capacity: 25,
      available_beds: 5,
      specialties: ['General Medicine', 'Surgery', 'Orthopedics'],
      accepts_emergency: true,
      rating: 3.8,
    },
    {
      id: 'bpl-17',
      name: 'Navodaya Hospital',
      address: 'C-Sector, BHEL, Bhopal, MP 462022',
      phone: '0755-2601301',
      location_lat: 23.2700,
      location_lng: 77.4350,
      emergency_capacity: 40,
      available_beds: 10,
      specialties: ['Emergency', 'General Medicine', 'Pediatrics'],
      accepts_emergency: true,
      rating: 4.0,
    },
    {
      id: 'bpl-18',
      name: 'Rukhmani Hospital',
      address: '365, Zone-1, M.P. Nagar, Bhopal, MP 462011',
      phone: '0755-4271234',
      location_lat: 23.2300,
      location_lng: 77.4450,
      emergency_capacity: 20,
      available_beds: 4,
      specialties: ['Gynecology', 'Pediatrics', 'Maternity'],
      accepts_emergency: false,
      rating: 4.2,
    },
    {
      id: 'bpl-19',
      name: 'Deep Hospital',
      address: '87, Indrapuri, Bhopal, MP 462022',
      phone: '0755-2675645',
      location_lat: 23.2550,
      location_lng: 77.3950,
      emergency_capacity: 30,
      available_beds: 8,
      specialties: ['General Medicine', 'Surgery', 'ENT'],
      accepts_emergency: true,
      rating: 3.7,
    },
    {
      id: 'bpl-20',
      name: 'Narmada Trauma Centre',
      address: 'Bhopal Railway Station Road, Bhopal, MP 462001',
      phone: '0755-2740555',
      location_lat: 23.2480,
      location_lng: 77.4080,
      emergency_capacity: 60,
      available_beds: 20,
      specialties: ['Trauma', 'Orthopedics', 'Emergency', 'Neurology', 'ICU'],
      accepts_emergency: true,
      rating: 4.6,
    },
  ];

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
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

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
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hospital Finder</h2>
                <p className="text-brand-100">Find nearby hospitals and emergency facilities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in">
                <p className="text-sm text-brand-100">Total Hospitals</p>
                <p className="text-2xl font-bold">{hospitals.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in-1">
                <p className="text-sm text-brand-100">Emergency Ready</p>
                <p className="text-2xl font-bold">{hospitals.filter((h) => h.accepts_emergency).length}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28">
            <HospitalIllustration className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals or locations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
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
              <div className="flex items-center gap-2 text-sm text-gray-600 animate-fade-in-up">
                <Navigation className="w-4 h-4" />
                <span>Sorted by distance</span>
              </div>
            )}
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="animate-fade-in-up bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No hospitals found matching your criteria</p>
            </div>
          ) : (
            filteredHospitals.map((hospital, index) => (
              <button
                key={hospital.id}
                onClick={() => setSelectedHospital(hospital)}
                className={`w-full text-left bg-white rounded-lg shadow-sm border p-4 transition hover:shadow-md animate-fade-in-up ${
                  selectedHospital?.id === hospital.id
                    ? 'border-brand-500 ring-2 ring-brand-500'
                    : 'border-gray-200'
                }`}
                style={{ animationDelay: `${index * 0.04}s` }}
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
            <div className="animate-slide-up bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="h-48">
                <MapView
                  hospitals={[selectedHospital]}
                  center={[selectedHospital.location_lat, selectedHospital.location_lng]}
                  selectedId={selectedHospital.id}
                />
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
                        className="px-3 py-1.5 text-sm bg-brand-50 text-brand-700 border border-brand-200 rounded-lg"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition"
                  >
                    <Phone className="w-5 h-5" />
                    Call
                  </a>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition"
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
            <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="h-64">
                <MapView
                  hospitals={filteredHospitals}
                  center={[23.2599, 77.4126]}
                />
              </div>
              <div className="p-4 text-center">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Select a hospital to view details</p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredHospitals.length} hospitals in Bhopal
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
