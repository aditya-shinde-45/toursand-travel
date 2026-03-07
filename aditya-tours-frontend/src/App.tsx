import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TrackBookingPage from './pages/TrackBookingPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import BookingsPage from './pages/admin/BookingsPage';
import CalendarPage from './pages/admin/CalendarPage';
import SettingsPage from './pages/admin/SettingsPage';
import ContentPage from './pages/admin/ContentPage';
import AdminLayout from './components/admin/AdminLayout';
import Toast from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { trackPageView } from './services/analyticsService';
import { useEffect } from 'react';

// SEO Landing Pages
import ThaneTaxiServicePage from './pages/seo/ThaneTaxiServicePage';
import ThaneAirportTaxiPage from './pages/seo/ThaneAirportTaxiPage';
import ThaneOutstationCabPage from './pages/seo/ThaneOutstationCabPage';
import ThaneErtigaCabPage from './pages/seo/ThaneErtigaCabPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Router>
              <RouteAnalytics />
              <Toast />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/track" element={<TrackBookingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />

                <Route path="/thane-taxi-service" element={<ThaneTaxiServicePage />} />
                <Route path="/thane-airport-taxi" element={<ThaneAirportTaxiPage />} />
                <Route path="/thane-outstation-cab" element={<ThaneOutstationCabPage />} />
                <Route path="/thane-ertiga-cab" element={<ThaneErtigaCabPage />} />

                <Route path="/admin/login" element={<LoginPage />} />
                <Route element={<ProtectedAdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="content" element={<ContentPage />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
