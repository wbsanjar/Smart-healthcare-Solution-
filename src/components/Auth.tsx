import React, { useState } from 'react';
import { Heart, Mail, Lock, User, ArrowRight, Loader2, Shield, Activity, Ambulance, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HeroIllustration } from './Illustrations';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError('Invalid email or password');
        }
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />

        <div className="absolute top-[12%] left-[8%] animate-float-slow">
          <Heart className="w-5 h-5 text-red-300/30" />
        </div>
        <div className="absolute top-[20%] right-[12%] animate-float-delayed">
          <Plus className="w-6 h-6 text-blue-300/25" />
        </div>
        <div className="absolute bottom-[35%] left-[15%] animate-float">
          <Activity className="w-5 h-5 text-emerald-300/25" />
        </div>
        <div className="absolute bottom-[25%] right-[8%] animate-float-slow">
          <Ambulance className="w-6 h-6 text-blue-300/20" />
        </div>
        <div className="absolute top-[45%] left-[45%] animate-float-delayed">
          <Shield className="w-5 h-5 text-purple-300/20" />
        </div>
        <div className="absolute top-[60%] right-[20%] animate-float">
          <Heart className="w-4 h-4 text-red-300/20" />
        </div>
      </div>

      <div className="w-full max-w-5xl flex items-stretch gap-0 relative z-10">
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-700 rounded-l-2xl p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full" />
            <div className="absolute top-20 left-40 w-32 h-32 border border-white rounded-full" />
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
            <div className="absolute bottom-40 right-40 w-16 h-16 border border-white rounded-full" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-72 h-72 rounded-full border border-white/10 animate-pulse-ring" />
            <div className="absolute w-56 h-56 rounded-full border border-white/10 animate-pulse-ring" style={{ animationDelay: '0.8s' }} />
            <div className="absolute w-40 h-40 rounded-full border border-white/10 animate-pulse-ring" style={{ animationDelay: '1.6s' }} />
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="animate-fade-in-up">
              <HeroIllustration className="w-full max-w-sm mx-auto mb-8" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in-up-1">MedAssist</h1>
            <p className="text-blue-100 text-lg mb-8 animate-fade-in-up-2">
              AI-Powered Healthcare Platform — Your intelligent health companion, available 24/7.
            </p>

            <div className="space-y-4 animate-fade-in-up-3">
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Emergency Response</p>
                  <p className="text-sm text-blue-200">Instant access to emergency services</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Health Monitoring</p>
                  <p className="text-sm text-blue-200">AI-powered symptom analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Ambulance Tracking</p>
                  <p className="text-sm text-blue-200">Real-time ambulance location & ETA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 overflow-hidden" aria-hidden="true">
            <svg viewBox="0 0 400 32" className="w-full h-8 opacity-30" preserveAspectRatio="none">
              <path
                d="M0,16 L60,16 L70,16 L85,3 L100,29 L115,16 L180,16 L190,16 L205,6 L220,26 L235,16 L400,16"
                stroke="white"
                strokeWidth="2"
                fill="none"
                className="animate-draw-ecg"
                strokeDasharray="1000"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="relative z-10 text-blue-200 text-sm mt-3">
            24/7 Emergency Support • Hospital Finder • AI Health Assistant
          </p>
        </div>

        <div className="w-full lg:w-1/2 bg-white lg:rounded-r-2xl lg:rounded-l-none rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-8 text-center lg:hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3 relative">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse-ring" />
              <Heart className="w-7 h-7 text-white relative z-10 animate-heartbeat" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">MedAssist</h1>
            <p className="text-blue-100 text-sm">AI-Powered Healthcare Platform</p>
          </div>

          <div className="px-8 py-8 lg:py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin
                ? 'Sign in to access your healthcare dashboard'
                : 'Join MedAssist for instant healthcare support'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
