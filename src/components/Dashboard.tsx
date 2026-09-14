import { useState, useEffect, useRef, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart, Phone, MessageCircle, Building2, Truck, Stethoscope, User, LogOut,
  Activity, Menu, X, Bell, Shield, Camera, Search, FileText, QrCode,
  AlertTriangle, Users, Ambulance as AmbulanceIcon, ClipboardList,
  UserCog, CheckCheck, Trash2, CheckCircle2, Navigation,
  Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  EmergencyIllustration, HospitalIllustration, AmbulanceIllustration,
  ChatIllustration, ProfileIllustration, InjuryIllustration, HealthIllustration,
} from './Illustrations';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

export type UserRole = 'patient' | 'doctor' | 'ambulance_driver' | 'admin' | 'community_worker';

const navigation = (role: UserRole) => {
  const items = [
    { path: '/', label: 'Emergency', icon: Phone, roles: ['patient', 'ambulance_driver', 'admin', 'community_worker'] },
    { path: '/injury-scan', label: 'Injury Scan', icon: Camera, roles: ['patient', 'community_worker'] },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: Search, roles: ['patient', 'community_worker'] },
    { path: '/chat', label: 'AI Assistant', icon: MessageCircle, roles: ['patient', 'community_worker'] },
    { path: '/hospitals', label: 'Hospitals', icon: Building2, roles: ['patient', 'ambulance_driver', 'community_worker'] },
    { path: '/ambulance', label: 'Ambulance', icon: Truck, roles: ['patient'] },
    { path: '/doctors', label: 'Doctor Booking', icon: Stethoscope, roles: ['patient', 'community_worker'] },
    { path: '/health-vault', label: 'Health Vault', icon: FileText, roles: ['patient', 'community_worker'] },
    { path: '/qr-card', label: 'QR Medical Card', icon: QrCode, roles: ['patient'] },
    { path: '/report-analyzer', label: 'Report Analyzer', icon: ClipboardList, roles: ['patient'] },
    { path: '/family-alert', label: 'Family Alert', icon: AlertTriangle, roles: ['patient'] },
    { path: '/doctor-dashboard', label: 'Cases', icon: UserCog, roles: ['doctor'] },
    { path: '/admin-dashboard', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
    { path: '/ambulance-driver', label: 'Driver Panel', icon: AmbulanceIcon, roles: ['ambulance_driver'] },
    { path: '/community-worker', label: 'ASHA Worker', icon: Users, roles: ['community_worker'] },
    { path: '/profile', label: 'Profile', icon: User, roles: ['patient', 'doctor', 'ambulance_driver', 'admin', 'community_worker'] },
  ];
  return items.filter(item => item.roles.includes(role));
};

const roleLabels: Record<UserRole, string> = {
  patient: 'Patient Account',
  doctor: 'Doctor Account',
  ambulance_driver: 'Ambulance Driver',
  admin: 'Hospital Admin',
  community_worker: 'ASHA Worker',
};

const roleColors: Record<UserRole, string> = {
  patient: 'bg-brand-500',
  doctor: 'bg-purple-600',
  ambulance_driver: 'bg-emerald-600',
  admin: 'bg-red-600',
  community_worker: 'bg-amber-600',
};

export function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const metadataRole = (user?.publicMetadata as any)?.role as UserRole | undefined;
  const lastRole = useRef<UserRole>('patient');
  const inferredRole: UserRole = useMemo(() => {
    const pathRole: UserRole | undefined =
      currentPath.startsWith('/doctor-dashboard') ? 'doctor'
      : currentPath.startsWith('/admin-dashboard') ? 'admin'
      : currentPath.startsWith('/ambulance-driver') ? 'ambulance_driver'
      : currentPath.startsWith('/community-worker') ? 'community_worker'
      : undefined;
    return metadataRole || pathRole || lastRole.current;
  }, [currentPath, metadataRole]);
  lastRole.current = inferredRole;
  const userRole = inferredRole;
  const navItems = navigation(userRole);

  const handleSignOut = () => signOut();

  const getIllustration = () => {
    switch (currentPath) {
      case '/': return <EmergencyIllustration className="w-full h-full" />;
      case '/chat': return <ChatIllustration className="w-full h-full" />;
      case '/hospitals': return <HospitalIllustration className="w-full h-full" />;
      case '/ambulance': return <AmbulanceIllustration className="w-full h-full" />;
      case '/injury-scan': return <InjuryIllustration className="w-full h-full" />;
      case '/health-vault': return <HealthIllustration className="w-full h-full" />;
      case '/symptom-checker': return <Search className="w-full h-full text-brand-300" />;
      case '/qr-card': return <QrCode className="w-full h-full text-brand-300" />;
      case '/profile': return <ProfileIllustration className="w-full h-full" />;
      default: return <EmergencyIllustration className="w-full h-full" />;
    }
  };

  const getStatusText = () => {
    const statusMap: Record<string, string> = {
      '/': 'Emergency Services Active',
      '/chat': 'AI Health Assistant Ready',
      '/hospitals': 'Finding Nearby Hospitals',
      '/ambulance': 'Tracking Ambulances',
      '/doctors': 'Book Doctor Appointments',
      '/profile': 'Managing Your Profile',
      '/injury-scan': 'AI Injury Analysis Ready',
      '/symptom-checker': 'AI Symptom Analysis Ready',
      '/health-vault': 'Your Health Records',
      '/qr-card': 'Your Medical QR Code',
      '/family-alert': 'Family Alert Settings',
      '/report-analyzer': 'AI Report Analysis',
      '/doctor-dashboard': 'Doctor Control Panel',
      '/admin-dashboard': 'Hospital Admin Panel',
      '/ambulance-driver': 'Ambulance Driver Panel',
      '/community-worker': 'ASHA Worker Dashboard',
    };
    return statusMap[currentPath] || 'Welcome to NeuroCare Tech';
  };

  const isRoleSpecificPath = ['/doctor-dashboard', '/admin-dashboard', '/ambulance-driver', '/community-worker'].includes(currentPath);
  const { unreadCount, notifications, markAsRead, markAllAsRead, clearNotifications, removeNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🔴';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="min-h-screen bg-night-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <header className="bg-night-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-brand-500 p-2 rounded-lg shadow-lg shadow-brand-500/30">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">NeuroCare Tech</h1>
                <p className="text-xs text-night-300 hidden sm:block">Smart Healthcare Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 ${roleColors[userRole]} text-white text-xs font-medium rounded-full hidden sm:inline-block`}>
                {roleLabels[userRole]}
              </span>

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-night-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-night-100 z-50 animate-scale-in overflow-hidden">
                    <div className="p-3 border-b border-night-100 flex items-center justify-between">
                      <h3 className="font-semibold text-night-800 text-sm">Notifications</h3>
                      <div className="flex gap-1">
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="p-1.5 text-night-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition" title="Mark all as read">
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearNotifications} className="p-1.5 text-night-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Clear all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-night-400 text-sm">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => { markAsRead(n.id); if (n.link) navigate(n.link); }}
                            className={`w-full text-left p-3 border-b border-night-50 hover:bg-night-50 transition flex items-start gap-3 ${
                              !n.read ? 'bg-brand-50/50' : ''
                            }`}
                          >
                            <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!n.read ? 'font-semibold text-night-800' : 'text-night-600'}`}>
                                {n.title}
                              </p>
                              <p className="text-xs text-night-400 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-night-300 mt-1">
                                {new Date(n.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                              className="p-1 text-night-300 hover:text-red-500 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full">
                <Activity className="w-4 h-4 text-brand-400" />
                <span className="text-sm text-brand-300 font-medium">24/7 Active</span>
              </div>

              <button
                onClick={toggle}
                className="p-2 text-night-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                title={dark ? 'Light Mode' : 'Dark Mode'}
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-night-300 hover:text-white transition px-3 py-2 hover:bg-white/10 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
              </button>

              <button
                className="lg:hidden p-2 text-night-300 hover:text-white hover:bg-white/10 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-white/10 lg:hidden">
          {mobileMenuOpen && (
            <div className="px-4 py-3 space-y-1 bg-night-800 max-h-80 overflow-y-auto">
              {navItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition animate-fade-in-up ${
                    currentPath === item.path ? 'bg-brand-500/20 text-brand-300' : 'text-night-200 hover:bg-white/5'
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-night-100 overflow-hidden">
              <div className="p-5 bg-night-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute -top-6 -right-6 w-20 h-20 border border-white rounded-full" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white rounded-full" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center ring-2 ring-brand-500/30">
                    <User className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="text-white overflow-hidden">
                    <p className="font-medium truncate text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                    <p className="text-xs text-night-300">{roleLabels[userRole]}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition mb-0.5 group animate-fade-in-up ${
                        currentPath === item.path
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-night-600 hover:bg-night-50'
                      }`}
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <Icon className={`w-5 h-5 ${
                        currentPath === item.path ? 'text-brand-500' : 'text-night-400 group-hover:text-night-600'
                      }`} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 bg-gradient-to-b from-night-50 to-white border-t border-night-100">
                <div className="flex items-center gap-2 text-sm text-night-600 mb-2">
                  <Shield className="w-4 h-4 text-brand-500" />
                  <span>Response Time: &lt;5 min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-600">
                  <Activity className="w-4 h-4" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>

            {!isRoleSpecificPath && (
              <div className="mt-4 bg-brand-50 rounded-xl border border-brand-100 p-4 animate-scale-in">
                <div className="w-16 h-16 mx-auto mb-3">{getIllustration()}</div>
                <p className="text-xs text-center text-brand-700 font-medium">{getStatusText()}</p>
              </div>
            )}
          </aside>

          <main className="flex-1 min-w-0">
            {/* Role-based Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6 animate-fade-in-up">
              {userRole === 'doctor' ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">12</span>
                      <UserCog className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-xs text-night-400">Total Cases</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-red-600">5</span>
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-xs text-night-400">New Cases</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-yellow-600">4</span>
                      <ClipboardList className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-xs text-night-400">Reviewing</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-green-600">3</span>
                      <CheckCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-night-400">Completed</p>
                  </div>
                </>
              ) : userRole === 'ambulance_driver' ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">4</span>
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-night-400">Pending Requests</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-brand-600">2</span>
                      <Truck className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Active Runs</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-green-600">8</span>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-night-400">Completed</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">2.3</span>
                      <Navigation className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Avg Distance</p>
                  </div>
                </>
              ) : userRole === 'admin' ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">12</span>
                      <Phone className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-xs text-night-400">Active Emergencies</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">8</span>
                      <Building2 className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Hospitals</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">6</span>
                      <Truck className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Ambulances</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">24</span>
                      <Users className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Staff On Duty</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">12</span>
                      <Phone className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Active Emergencies</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">8</span>
                      <Building2 className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Nearby Hospitals</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">3</span>
                      <Truck className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Ambulances Active</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-night-100 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl font-bold text-night-800">4.8</span>
                      <Heart className="w-4 h-4 text-brand-500" />
                    </div>
                    <p className="text-xs text-night-400">Avg. Rating</p>
                  </div>
                </>
              )}
            </div>

            <Outlet />
          </main>
        </div>
      </div>

      {/* OpenMRS-style Dark Footer */}
      <footer className="bg-night-950 border-t border-white/5 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-bold text-white">NeuroCare Tech</span>
              </div>
              <p className="text-xs text-night-400 leading-relaxed">
                AI-powered smart healthcare platform for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2">
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Features</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Emergency</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Ambulance</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Hospitals</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Community</h4>
              <ul className="space-y-2">
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Get Involved</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Support</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Blog</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">About</h4>
              <ul className="space-y-2">
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Our Story</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Privacy Policy</button></li>
                <li><button className="text-xs text-night-400 hover:text-brand-400 transition">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-night-500">&copy; 2026 NeuroCare Tech. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-night-500">Built with care for better healthcare</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
