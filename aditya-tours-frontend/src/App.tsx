import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TrackBookingPage from './pages/TrackBookingPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// SEO Landing Pages
import ThaneT axiServicePage from './pages/seo/ThaneTaxiServicePage';
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/track" element={<TrackBookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          
          {/* SEO Landing Pages */}
          <Route path="/thane-taxi-service" element={<ThaneTaxiServicePage />} />
          <Route path="/thane-airport-taxi" element={<ThaneAirportTaxiPage />} />
          <Route path="/thane-outstation-cab" element={<ThaneOutstationCabPage />} />
          <Route path="/thane-ertiga-cab" element={<ThaneErtigaCabPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
