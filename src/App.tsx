import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth';
import { RoleSelect } from './components/RoleSelect';
import { Dashboard } from './components/Dashboard';
import { EmergencyPage } from './components/EmergencyPage';
import { ChatBot } from './components/ChatBot';
import { HospitalFinder } from './components/HospitalFinder';
import { AmbulanceTracker } from './components/AmbulanceTracker';
import { DoctorBooking } from './components/DoctorBooking';
import { Profile } from './components/Profile';
import { InjuryScan } from './components/InjuryScan';
import { SymptomChecker } from './components/SymptomChecker';
import { HealthVault } from './components/HealthVault';
import { QRCard } from './components/QRCard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AmbulanceDriverDashboard } from './components/AmbulanceDriverDashboard';
import { CommunityWorkerDashboard } from './components/CommunityWorkerDashboard';
import { FamilyAlert } from './components/FamilyAlert';
import { ReportAnalyzer } from './components/ReportAnalyzer';
import { NotificationProvider } from './contexts/NotificationContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { useState, useEffect } from 'react';
import type { UserRole } from './components/Dashboard';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-full mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-night-800 mb-1">NeuroCare Tech</h2>
        <p className="text-night-400">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/role-select" replace />;
  return <>{children}</>;
}

const roleAllowedRoutes: Record<UserRole, string[]> = {
  patient: ['/', '/chat', '/hospitals', '/ambulance', '/doctors', '/profile', '/injury-scan', '/symptom-checker', '/health-vault', '/qr-card', '/family-alert', '/report-analyzer'],
  doctor: ['/', '/doctor-dashboard', '/hospitals', '/profile'],
  ambulance_driver: ['/', '/ambulance-driver', '/hospitals', '/profile'],
  admin: ['/', '/admin-dashboard', '/hospitals', '/profile'],
  community_worker: ['/', '/community-worker', '/hospitals', '/profile', '/chat', '/injury-scan', '/symptom-checker', '/doctors', '/health-vault'],
};

const roleDashMap: Record<UserRole, string> = {
  patient: '/',
  doctor: '/doctor-dashboard',
  ambulance_driver: '/ambulance-driver',
  admin: '/admin-dashboard',
  community_worker: '/community-worker',
};

function AppContent() {
  const { isLoaded, isSignedIn, user } = useAuth();
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || initialLoading) return <LoadingScreen />;

  const metaRole = (user?.publicMetadata as any)?.role as UserRole | undefined;
  const currentPath = location.pathname;

  if (isSignedIn && metaRole) {
    const allowed = roleAllowedRoutes[metaRole] || ['/'];
    const isAllowed = allowed.includes(currentPath);
    if (!isAllowed && currentPath !== '/role-select' && !currentPath.startsWith('/login')) {
      return <Navigate to={roleDashMap[metaRole] || '/'} replace />;
    }
  }

  return (
    <Routes>
      <Route path="/role-select" element={isSignedIn && metaRole ? <Navigate to="/" replace /> : <RoleSelect />} />
      <Route path="/login" element={isSignedIn && metaRole ? <Navigate to="/" replace /> : <RoleSelect />} />
      <Route path="/login/:role" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
        <Route index element={<EmergencyPage />} />
        <Route path="chat" element={<ChatBot />} />
        <Route path="hospitals" element={<HospitalFinder />} />
        <Route path="ambulance" element={<AmbulanceTracker />} />
        <Route path="doctors" element={<DoctorBooking />} />
        <Route path="profile" element={<Profile />} />
        <Route path="injury-scan" element={<InjuryScan />} />
        <Route path="symptom-checker" element={<SymptomChecker />} />
        <Route path="health-vault" element={<HealthVault />} />
        <Route path="qr-card" element={<QRCard />} />
        <Route path="family-alert" element={<FamilyAlert />} />
        <Route path="report-analyzer" element={<ReportAnalyzer />} />
        <Route path="doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="ambulance-driver" element={<AmbulanceDriverDashboard />} />
        <Route path="community-worker" element={<CommunityWorkerDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/role-select" replace />} />
    </Routes>
  );
}

function AppShell() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  const content = <AppContent />;

  if (!isSignedIn) return content;

  return <RealtimeProvider>{content}</RealtimeProvider>;
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppShell />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
