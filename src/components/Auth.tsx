import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Shield, Activity, Truck, Stethoscope, ArrowLeft, Moon, Sun, Mail, Lock, Loader2, User } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      sessionStorage.setItem('pendingRole', role);
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login/' + role,
        },
      });
      if (oauthError) {
        await demoSignIn(role);
        sessionStorage.removeItem('pendingRole');
        navigate(config.dashboard, { replace: true });
      }
    } catch (err) {
      await demoSignIn(role);
      sessionStorage.removeItem('pendingRole');
      navigate(config.dashboard, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
                  <span className="bg-white px-2 text-night-400">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-night-200 rounded-lg text-night-700 font-medium hover:bg-night-50 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

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
