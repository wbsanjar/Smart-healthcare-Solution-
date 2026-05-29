import React, { useState } from 'react';
import {
  Heart,
  Phone,
  MessageCircle,
  Building2,
  Truck,
  User,
  LogOut,
  Activity,
  Menu,
  X,
  Bell,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EmergencyPage } from './EmergencyPage';
import { ChatBot } from './ChatBot';
import { HospitalFinder } from './HospitalFinder';
import { AmbulanceTracker } from './AmbulanceTracker';
import { Profile } from './Profile';
import {
  EmergencyIllustration,
  HospitalIllustration,
  AmbulanceIllustration,
  ChatIllustration,
  ProfileIllustration,
} from './Illustrations';

type Tab = 'emergency' | 'chat' | 'hospitals' | 'ambulance' | 'profile';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('emergency');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigation = [
    { id: 'emergency' as Tab, label: 'Emergency', icon: Phone },
    { id: 'chat' as Tab, label: 'AI Assistant', icon: MessageCircle },
    { id: 'hospitals' as Tab, label: 'Hospitals', icon: Building2 },
    { id: 'ambulance' as Tab, label: 'Ambulance', icon: Truck },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'emergency':
        return <EmergencyPage />;
      case 'chat':
        return <ChatBot />;
      case 'hospitals':
        return <HospitalFinder />;
      case 'ambulance':
        return <AmbulanceTracker />;
      case 'profile':
        return <Profile />;
      default:
        return <EmergencyPage />;
    }
  };

  const tabIllustrations: Record<Tab, React.ReactNode> = {
    emergency: <EmergencyIllustration className="w-full h-full" />,
    chat: <ChatIllustration className="w-full h-full" />,
    hospitals: <HospitalIllustration className="w-full h-full" />,
    ambulance: <AmbulanceIllustration className="w-full h-full" />,
    profile: <ProfileIllustration className="w-full h-full" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedAssist</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Healthcare Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">24/7 Active</span>
              </div>

              <button
                onClick={signOut}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
              </button>

              <button
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <nav className="border-t border-gray-200 lg:hidden">
          {mobileMenuOpen && (
            <div className="px-4 py-3 space-y-1 bg-white/80 backdrop-blur-md">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
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
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 bg-gradient-to-br from-blue-600 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-6 -right-6 w-20 h-20 border border-white rounded-full" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white rounded-full" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white overflow-hidden">
                    <p className="font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-blue-100">Patient Account</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition mb-0.5 group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Response Time: &lt;5 min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Activity className="w-4 h-4" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-100 p-4">
              <div className="w-16 h-16 mx-auto mb-3">
                {tabIllustrations[activeTab]}
              </div>
              <p className="text-xs text-center text-blue-700 font-medium">
                {activeTab === 'emergency' && 'Emergency Services Active'}
                {activeTab === 'chat' && 'AI Health Assistant Ready'}
                {activeTab === 'hospitals' && 'Finding Nearby Hospitals'}
                {activeTab === 'ambulance' && 'Tracking Ambulances'}
                {activeTab === 'profile' && 'Managing Your Profile'}
              </p>
            </div>
          </aside>

          <main className="flex-1 min-w-0">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
