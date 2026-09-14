import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Shield, Activity, Truck, Stethoscope, ArrowLeft, Moon, Sun, Mail, Lock, Loader2, User } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const demoAccounts = [
  { id: 'patient', label: 'Patient', email: 'patient@demo.com', password: 'patient123' },
  { id: 'doctor', label: 'Doctor', email: 'doctor@demo.com', password: 'doctor123' },
  { id: 'ambulance_driver', label: 'Ambulance Driver', email: 'driver@demo.com', password: 'driver123' },
  { id: 'admin', label: 'Hospital Admin', email: 'admin@demo.com', password: 'admin123' },
];

const roleConfig: Record<string, {
  label: string;
  icon: typeof Heart;
  color: string;
  bgGradient: string;
  accent: string;
  dashboard: string;
}> = {
  patient: {
    label: 'Patient',
    icon: Heart,
    color: 'text-brand-500',
    bgGradient: 'from-brand-500 to-brand-700',
    accent: 'brand',
    dashboard: '/',
  },
  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    color: 'text-purple-500',
    bgGradient: 'from-purple-600 to-indigo-700',
    accent: 'purple',
    dashboard: '/doctor-dashboard',
  },
  ambulance_driver: {
    label: 'Ambulance Driver',
    icon: Truck,
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-600 to-teal-700',
    accent: 'emerald',
    dashboard: '/ambulance-driver',
  },
  admin: {
    label: 'Hospital Admin',
    icon: Shield,
    color: 'text-red-500',
    bgGradient: 'from-red-600 to-rose-700',
    accent: 'red',
    dashboard: '/admin-dashboard',
  },
};

export function AuthPage() {
  const { role = 'patient' } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const config = roleConfig[role] || roleConfig.patient;
  const Icon = config.icon;
  const { dark, toggle } = useTheme();
  const { signIn, signUp, isSignedIn, user, demoSignIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const metaRole = (user?.publicMetadata as any)?.role as string | undefined;
    if (metaRole) {
      setRedirecting(true);
      navigate(roleConfig[metaRole]?.dashboard || '/', { replace: true });
      return;
    }
    const pendingRole = sessionStorage.getItem('pendingRole');
    if (pendingRole) {
      setRedirecting(true);
      supabase.auth.updateUser({ data: { role: pendingRole } }).then(() => {
        sessionStorage.removeItem('pendingRole');
        navigate(roleConfig[pendingRole]?.dashboard || '/', { replace: true });
      });
    }
  }, [isSignedIn, user, navigate]);

  if (redirecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-full mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-night-800 mb-1">NeuroCare Tech</h2>
          <p className="text-night-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  const loginWithDemo = async (demoId: string) => {
    setError('');
    setLoading(true);
    await demoSignIn(demoId);
    navigate(roleConfig[demoId]?.dashboard || '/', { replace: true });
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const demo = demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim());
      if (demo) {
        if (demo.password === password) {
          await demoSignIn(demo.id);
          navigate(config.dashboard, { replace: true });
          return;
        }
        setError(`Wrong password. Use "${demo.password}" for the ${demo.label} account.`);
        return;
      }

      if (isSignUp) {
        const { error: authError } = await signUp(email, password, fullName);
        if (authError) {
          setError(authError);
          return;
        }
      } else {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          setError(authError);
          return;
        }
      }
      sessionStorage.setItem('pendingRole', role);
      navigate(config.dashboard);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <button
        onClick={toggle}
        className="fixed top-6 right-6 p-3 bg-white border border-night-200 rounded-full shadow-md hover:shadow-lg transition z-50"
        title={dark ? 'Light Mode' : 'Dark Mode'}
      >
        {dark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-night-600" />}
      </button>
      <div className="w-full max-w-6xl flex items-stretch gap-0 relative z-10">
        <div className={`hidden lg:flex w-3/5 bg-night-950 rounded-l-2xl flex-col relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-10 right-10 w-40 h-40 border border-white rounded-full" />
            <div className="absolute top-32 right-32 w-64 h-64 border border-white rounded-full" />
            <div className="absolute bottom-20 left-20 w-48 h-48 border border-white rounded-full" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col px-12 pt-14 pb-8">
            <div className="flex items-center gap-3 mb-10">
              <div className={`p-2.5 rounded-xl shadow-lg`}
                style={{ backgroundColor: config.accent === 'brand' ? '#e87722' : undefined }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">NeuroCare</span>
                <span className={`text-xl font-bold ${config.color}`}> Tech</span>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white leading-tight">
                {config.label}{' '}
                <span className={config.color}>Portal</span>
              </h1>
              <p className="text-night-300 text-lg mt-4 max-w-md leading-relaxed">
                {role === 'patient' && 'Request emergency services, find nearby hospitals, track ambulances, and manage your health records — all in one place.'}
                {role === 'doctor' && 'Review patient cases, provide remote consultations, monitor vitals, and coordinate with emergency response teams.'}
                {role === 'ambulance_driver' && 'Receive real-time dispatch requests, navigate to emergency locations, and update response status on the go.'}
                {role === 'admin' && 'Manage hospital resources, oversee ambulance fleet operations, and monitor real-time emergency responses.'}
              </p>
            </div>

            <div className="flex items-center gap-3 mb-10">
              <div className="px-6 py-2.5 bg-brand-500 text-white rounded-lg font-medium shadow-lg shadow-brand-500/25">
                Sign In
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border border-night-400 text-night-200 rounded-lg font-medium hover:bg-white/5 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Change Role
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-2xl font-bold text-white">10,000+</p>
                <p className="text-xs text-night-400 mt-1">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-night-400 mt-1">Hospitals</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-night-400 mt-1">Support</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-brand-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Emergency Ready</p>
                <p className="text-xs text-night-400">Instant response & alert system</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-brand-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">AI-Powered</p>
                <p className="text-xs text-night-400">Smart symptom analysis & reports</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5 text-brand-400" />
                </div>
                <p className="text-sm font-medium text-white mb-1">Track & Trace</p>
                <p className="text-xs text-night-400">Real-time ambulance & hospital finder</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/5 px-12 py-4">
            <p className="text-night-400 text-xs">
              24/7 Emergency Support &bull; Hospital Finder &bull; AI Health Assistant &bull; Ambulance Tracking
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/5 bg-white lg:rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-xl border border-night-100 overflow-hidden">
          <div className={`bg-night-950 px-8 py-8 text-center lg:hidden bg-gradient-to-r ${config.bgGradient}`}>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {config.label} <span className="text-white/80">Portal</span>
            </h1>
            <p className="text-white/70 text-sm">NeuroCare Tech</p>
          </div>

          <div className="px-8 py-10 lg:py-14">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-night-400 hover:text-night-600 hover:bg-night-50 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-night-800">
                  {isSignUp ? 'Create Account' : 'Welcome'}
                </h2>
                <p className={`text-sm font-medium ${config.color}`}>
                  as {config.label}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-night-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-night-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-night-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-night-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-night-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>{isSignUp ? 'Create Account' : 'Sign In'}</>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-night-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-night-400">Quick Demo Login</span>
                </div>
              </div>

              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => loginWithDemo(account.id)}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-night-200 rounded-lg hover:bg-night-50 transition disabled:opacity-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${
                        account.id === 'patient' ? 'bg-brand-500'
                        : account.id === 'doctor' ? 'bg-purple-600'
                        : account.id === 'ambulance_driver' ? 'bg-emerald-600'
                        : 'bg-red-600'
                      }`}>
                        {account.label.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-night-700">{account.label}</p>
                        <p className="text-xs text-night-400 font-mono">{account.email} / {account.password}</p>
                      </div>
                    </div>
                    <span className="text-xs text-brand-600 opacity-0 group-hover:opacity-100 transition font-medium">Login →</span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-center text-night-400">
                Click an account to sign in instantly with pre-filled credentials.
              </p>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-night-100 text-center">
              <p className="text-xs text-night-400">
                <span className={`font-semibold ${config.color}`}>{config.label}</span> Portal &mdash; NeuroCare Tech
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
