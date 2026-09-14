import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Truck, Shield, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface RoleCard {
  id: string;
  title: string;
  description: string;
  icon: typeof Heart;
  color: string;
  bgGradient: string;
  features: string[];
}

const roles: RoleCard[] = [
  {
    id: 'patient',
    title: 'Patient',
    description: 'Access emergency services, find hospitals, track ambulances, and manage your health records.',
    icon: Heart,
    color: 'text-brand-500',
    bgGradient: 'from-brand-500 to-brand-700',
    features: ['Emergency Requests', 'Hospital Finder', 'Ambulance Tracking', 'Health Vault'],
  },
  {
    id: 'doctor',
    title: 'Doctor',
    description: 'Review patient cases, provide consultations, and manage emergency responses.',
    icon: Stethoscope,
    color: 'text-purple-500',
    bgGradient: 'from-purple-600 to-indigo-700',
    features: ['Case Review', 'AI Symptom Analysis', 'Video Consultations', 'Patient Vitals'],
  },
  {
    id: 'ambulance_driver',
    title: 'Ambulance Driver',
    description: 'Receive emergency dispatch requests, navigate to patients, and update response status.',
    icon: Truck,
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-600 to-teal-700',
    features: ['Dispatch Alerts', 'GPS Navigation', 'Status Updates', 'Patient Contact'],
  },
  {
    id: 'admin',
    title: 'Hospital Admin',
    description: 'Manage hospital resources, oversee ambulance fleet, and monitor emergency operations.',
    icon: Shield,
    color: 'text-red-500',
    bgGradient: 'from-red-600 to-rose-700',
    features: ['Resource Management', 'Fleet Overview', 'Analytics Dashboard', 'Staff Coordination'],
  },
];

export function RoleSelect() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <button
        onClick={toggle}
        className="fixed top-6 right-6 p-3 bg-white border border-night-200 rounded-full shadow-md hover:shadow-lg transition z-50"
        title={dark ? 'Light Mode' : 'Dark Mode'}
      >
        {dark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-night-600" />}
      </button>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-4 shadow-lg shadow-brand-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-night-800 mb-2">
            Neuro<span className="text-brand-500">Care</span> Tech
          </h1>
          <p className="text-night-400 text-lg max-w-xl mx-auto">
            Select your role to access your personalized healthcare dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => navigate(`/login/${role.id}`)}
                className="group bg-white rounded-2xl shadow-sm border border-night-100 p-6 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.bgGradient} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className={`text-lg font-bold ${role.color} mb-2`}>{role.title}</h3>
                <p className="text-sm text-night-500 leading-relaxed mb-4 flex-1">
                  {role.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  {role.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-night-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${role.color}`} />
                      {f}
                    </div>
                  ))}
                </div>

                <div className={`flex items-center gap-1 text-sm font-medium ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Continue with Email <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-night-400">
            Powered by NeuroCare Tech &mdash; Smart Healthcare Platform
          </p>
        </div>
      </div>
    </div>
  );
}
