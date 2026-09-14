import { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  Loader2,
  Award,
  IndianRupee,
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  location: string;
  phone: string;
  rating: number;
  fee: number;
  available: string[];
  education: string;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Aditya Verma',
    specialty: 'Cardiologist',
    experience: '15 years',
    hospital: 'Apollo Sultan Hospital',
    location: 'Shivaji Nagar, Bhopal',
    phone: '+91 98765-20001',
    rating: 4.9,
    fee: 800,
    available: ['Mon', 'Tue', 'Thu', 'Fri'],
    education: 'MD, DM Cardiology - AIIMS Delhi',
    image: '',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Sharma',
    specialty: 'Neurologist',
    experience: '12 years',
    hospital: 'Bansal Hospital',
    location: 'Shahpura, Bhopal',
    phone: '+91 98765-20002',
    rating: 4.8,
    fee: 1000,
    available: ['Mon', 'Wed', 'Fri', 'Sat'],
    education: 'MD, DM Neurology - PGI Chandigarh',
    image: '',
  },
  {
    id: 'doc-3',
    name: 'Dr. Rakesh Patel',
    specialty: 'Orthopedic Surgeon',
    experience: '18 years',
    hospital: 'AIIMS Bhopal',
    location: 'Saket Nagar, Bhopal',
    phone: '+91 98765-20003',
    rating: 4.7,
    fee: 700,
    available: ['Tue', 'Wed', 'Thu', 'Sat'],
    education: 'MS Ortho - Grant Medical College',
    image: '',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sunita Gupta',
    specialty: 'Gynecologist',
    experience: '14 years',
    hospital: 'Chirayu Medical College',
    location: 'Bhilkheda, Bhopal',
    phone: '+91 98765-20004',
    rating: 4.6,
    fee: 600,
    available: ['Mon', 'Tue', 'Thu', 'Sat'],
    education: 'MD, DNB Gynecology',
    image: '',
  },
  {
    id: 'doc-5',
    name: 'Dr. Vikas Singh',
    specialty: 'Pediatrician',
    experience: '10 years',
    hospital: 'Peoples Hospital',
    location: 'Bhanpur, Bhopal',
    phone: '+91 98765-20005',
    rating: 4.5,
    fee: 500,
    available: ['Mon', 'Wed', 'Fri', 'Sun'],
    education: 'MD Pediatrics - KEM Hospital',
    image: '',
  },
  {
    id: 'doc-6',
    name: 'Dr. Anjali Mishra',
    specialty: 'Dermatologist',
    experience: '9 years',
    hospital: 'Shree Narayana Hospital',
    location: 'Arera Colony, Bhopal',
    phone: '+91 98765-20006',
    rating: 4.4,
    fee: 500,
    available: ['Tue', 'Thu', 'Fri', 'Sat'],
    education: 'MD Dermatology - MGM Indore',
    image: '',
  },
  {
    id: 'doc-7',
    name: 'Dr. Suresh Yadav',
    specialty: 'General Physician',
    experience: '20 years',
    hospital: 'National Hospital',
    location: 'Hamidia Road, Bhopal',
    phone: '+91 98765-20007',
    rating: 4.3,
    fee: 400,
    available: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    education: 'MD Medicine - Gandhi Medical College',
    image: '',
  },
  {
    id: 'doc-8',
    name: 'Dr. Neha Jain',
    specialty: 'Eye Specialist',
    experience: '11 years',
    hospital: 'Narmada Trauma Centre',
    location: 'Railway Station Road, Bhopal',
    phone: '+91 98765-20008',
    rating: 4.5,
    fee: 600,
    available: ['Mon', 'Wed', 'Thu', 'Sat'],
    education: 'MS Ophthalmology - AIIMS Delhi',
    image: '',
  },
  {
    id: 'doc-9',
    name: 'Dr. Arun Kumar',
    specialty: 'Pulmonologist',
    experience: '13 years',
    hospital: 'Bhopal Memorial Hospital',
    location: 'Karondh, Bhopal',
    phone: '+91 98765-20009',
    rating: 4.6,
    fee: 700,
    available: ['Tue', 'Thu', 'Fri', 'Sun'],
    education: 'MD, DM Pulmonology - KGMU Lucknow',
    image: '',
  },
  {
    id: 'doc-10',
    name: 'Dr. Meena Choudhary',
    specialty: 'ENT Specialist',
    experience: '16 years',
    hospital: 'JK Hospital',
    location: 'Lalghati, Bhopal',
    phone: '+91 98765-20010',
    rating: 4.4,
    fee: 500,
    available: ['Mon', 'Wed', 'Fri', 'Sat'],
    education: 'MS ENT - MGM Medical College',
    image: '',
  },
  {
    id: 'doc-11',
    name: 'Dr. Rajiv Saxena',
    specialty: 'Psychiatrist',
    experience: '14 years',
    hospital: 'Apollo Sultan Hospital',
    location: 'Shivaji Nagar, Bhopal',
    phone: '+91 98765-20011',
    rating: 4.3,
    fee: 800,
    available: ['Mon', 'Tue', 'Thu', 'Sat'],
    education: 'MD Psychiatry - NIMHANS',
    image: '',
  },
  {
    id: 'doc-12',
    name: 'Dr. Pooja Tiwari',
    specialty: 'Dentist',
    experience: '8 years',
    hospital: 'Sparsh Hospital',
    location: 'MP Nagar, Bhopal',
    phone: '+91 98765-20012',
    rating: 4.2,
    fee: 400,
    available: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
    education: 'MDS - Dental College Bhopal',
    image: '',
  },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM',
  '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
];

const specialties = ['All Specialties', ...new Set(doctors.map((d) => d.specialty))];

export function DoctorBooking() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState<'list' | 'book'>('list');
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter((d) => {
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || d.specialty === selectedSpecialty;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleBook = () => {
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      setBooked(true);
    }, 2000);
  };

  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('book');
    setSelectedDate('');
    setSelectedTime('');
    setBooked(false);
  };

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (booked && selectedDoctor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your appointment has been booked successfully.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-gray-900">{selectedDoctor.name}</p>
            <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
            <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{selectedDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedTime}</span>
            </div>
          </div>
          <button
            onClick={() => { setBooked(false); setStep('list'); setSelectedDoctor(null); }}
            className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Doctor Appointment</h2>
                <p className="text-purple-100">Book appointments with top specialists in Bhopal</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in">
                <p className="text-sm text-purple-100">Specialists</p>
                <p className="text-2xl font-bold">{doctors.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in-1">
                <p className="text-sm text-purple-100">Avg. Rating</p>
                <p className="text-2xl font-bold">4.5 ⭐</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur animate-scale-in-2">
                <p className="text-sm text-purple-100">Hospitals</p>
                <p className="text-2xl font-bold">{new Set(doctors.map((d) => d.hospital)).size}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="white" opacity="0.1" />
              <g transform="translate(100, 85)">
                <circle cx="0" cy="-15" r="18" fill="white" opacity="0.15" />
                <circle cx="0" cy="-15" r="12" fill="white" opacity="0.2" />
                <rect x="-20" y="5" width="40" height="30" rx="10" fill="white" opacity="0.1" />
                <path d="M-8 15 L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M-6 22 L6 22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                <circle cx="0" cy="-15" r="6" fill="white" opacity="0.3" />
              </g>
              <g transform="translate(100, 160)">
                <line x1="-40" y1="0" x2="40" y2="0" stroke="white" strokeWidth="1.5" opacity="0.15" />
                <line x1="-30" y1="5" x2="30" y2="5" stroke="white" strokeWidth="1" opacity="0.1" />
              </g>
            </svg>
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
              placeholder="Search doctors, hospitals, or specialties..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredDoctors.length} Doctors Available
            </h3>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="animate-fade-in-up bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No doctors found matching your criteria</p>
            </div>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <button
                key={doctor.id}
                onClick={() => handleViewDetails(doctor)}
                className={`w-full text-left bg-white rounded-lg shadow-sm border p-4 transition hover:shadow-md animate-fade-in-up ${
                  selectedDoctor?.id === doctor.id ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-200'
                }`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-purple-600 font-medium">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{doctor.hospital}, {doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Award className="w-4 h-4" />{doctor.experience}</span>
                      <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" />{doctor.fee}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctor.available.map((day) => (
                        <span key={day} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div>
          {step === 'book' && selectedDoctor ? (
            <div className="animate-slide-up bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                    <p className="text-purple-600 font-medium">{selectedDoctor.specialty}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.hospital}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span>{selectedDoctor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{selectedDoctor.rating.toFixed(1)} Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IndianRupee className="w-4 h-4 text-purple-500" />
                    <span>₹{selectedDoctor.fee} Consultation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-purple-500" />
                    <span>{selectedDoctor.phone}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4 italic">{selectedDoctor.education}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Select Date
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {dates.map((d, index) => {
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dateNum = d.getDate();
                      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                      const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                      const isSelected = selectedDate === dateStr;
                      const isAvailable = selectedDoctor.available.includes(dayName);
                      return (
                        <button
                          key={dateStr}
                          onClick={() => isAvailable && setSelectedDate(dateStr)}
                          disabled={!isAvailable}
                          className={`flex-shrink-0 p-3 rounded-lg border text-center transition min-w-[70px] animate-scale-in ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : isAvailable
                              ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-900'
                              : 'border-gray-100 text-gray-300 cursor-not-allowed'
                          }`}
                          style={{ animationDelay: `${index * 0.03}s` }}
                        >
                          <p className="text-xs font-medium">{dayName}</p>
                          <p className="text-lg font-bold">{dateNum}</p>
                          <p className="text-xs">{monthName}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="mb-6 animate-fade-in-up">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      Select Time
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time, index) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-2 py-2 rounded-lg border text-sm font-medium transition animate-fade-in-up ${
                            selectedTime === time
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                          style={{ animationDelay: `${index * 0.02}s` }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime || booking}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Book Appointment - ₹{selectedDoctor.fee}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep('list')}
                  className="w-full mt-2 px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition"
                >
                  ← Back to search
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Select a doctor to book appointment</p>
              <p className="text-sm text-gray-500">
                Click on any doctor from the list to view their availability and book
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
