import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage.tsx';

// SEO Landing Pages
import ThaneTaxiServicePage from './pages/seo/ThaneTaxiServicePage.tsx';
import ThaneAirportTaxiPage from './pages/seo/ThaneAirportTaxiPage.tsx';
import ThaneOutstationCabPage from './pages/seo/ThaneOutstationCabPage.tsx';
import ThaneErtigaCabPage from './pages/seo/ThaneErtigaCabPage.tsx';
import CarRentalThanePage from './pages/seo/CarRentalThanePage.tsx';
import NaviMumbaiTaxiServicePage from './pages/seo/NaviMumbaiTaxiServicePage.tsx';
import NaviMumbaiAirportCabPage from './pages/seo/NaviMumbaiAirportCabPage.tsx';
import CarRentalNaviMumbaiPage from './pages/seo/CarRentalNaviMumbaiPage.tsx';
import MumbaiTaxiServicePage from './pages/seo/MumbaiTaxiServicePage.tsx';
import MumbaiAirportCabPage from './pages/seo/MumbaiAirportCabPage.tsx';

// Admin Pages
import LoginPage from './pages/admin/LoginPage.tsx';
import DashboardPage from './pages/admin/DashboardPage.tsx';
import BookingsPage from './pages/admin/BookingsPage.tsx';
import CalendarPage from './pages/admin/CalendarPage.tsx';
import ContentPage from './pages/admin/ContentPage.tsx';
import SettingsPage from './pages/admin/SettingsPage.tsx';
import PriceRangesPage from './pages/admin/PriceRangesPage.tsx';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import Toast from './components/common/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/booking" element={<Navigate to="/book" replace />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />

              {/* SEO Landing Pages - Thane */}
              <Route path="/thane-taxi-service" element={<ThaneTaxiServicePage />} />
              <Route path="/thane-airport-taxi" element={<ThaneAirportTaxiPage />} />
              <Route path="/thane-outstation-cab" element={<ThaneOutstationCabPage />} />
              <Route path="/thane-ertiga-cab" element={<ThaneErtigaCabPage />} />
              <Route path="/car-rental-thane" element={<CarRentalThanePage />} />

              {/* SEO Landing Pages - Navi Mumbai */}
              <Route path="/navi-mumbai-taxi-service" element={<NaviMumbaiTaxiServicePage />} />
              <Route path="/navi-mumbai-airport-cab" element={<NaviMumbaiAirportCabPage />} />
              <Route path="/car-rental-navi-mumbai" element={<CarRentalNaviMumbaiPage />} />

              {/* SEO Landing Pages - Mumbai */}
              <Route path="/mumbai-taxi-service" element={<MumbaiTaxiServicePage />} />
              <Route path="/mumbai-airport-cab" element={<MumbaiAirportCabPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="bookings" element={<BookingsPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="content" element={<ContentPage />} />
                  <Route path="price-ranges" element={<PriceRangesPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
