-- ============================================
-- ADITYA TOURS & TRAVELS - SUPABASE DATABASE SCHEMA
-- ============================================
-- This schema supports the complete frontend application
-- including bookings, admin management, content, and pricing
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster login lookups
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ============================================
-- 2. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
  trip_type VARCHAR(20) NOT NULL CHECK (trip_type IN ('ONE_WAY', 'ROUND_TRIP')),
  
  -- Pickup Location
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8) NOT NULL,
  pickup_lng DECIMAL(11, 8) NOT NULL,
  
  -- Drop Location
  drop_address TEXT NOT NULL,
  drop_lat DECIMAL(10, 8) NOT NULL,
  drop_lng DECIMAL(11, 8) NOT NULL,
  
  -- Trip Details
  distance_km DECIMAL(10, 2) NOT NULL,
  travel_time_minutes INTEGER NOT NULL,
  departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  return_datetime TIMESTAMP WITH TIME ZONE,
  
  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count > 0),
  special_instructions TEXT,
  
  -- Pricing
  total_fare DECIMAL(10, 2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin Notes
  admin_notes TEXT
);

-- Indexes for better query performance
CREATE INDEX idx_bookings_reference_number ON bookings(reference_number);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_bookings_departure_datetime ON bookings(departure_datetime);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_status_departure ON bookings(status, departure_datetime);

-- ============================================
-- 3. BOOKING HISTORY TABLE
-- ============================================
CREATE TABLE booking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES admin_users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  reason TEXT
);

-- Index for fetching history by booking
CREATE INDEX idx_booking_history_booking_id ON booking_history(booking_id, changed_at DESC);

-- ============================================
-- 4. PRICING PACKAGES TABLE
-- ============================================
CREATE TABLE pricing_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_name VARCHAR(100) NOT NULL,
  duration_hours INTEGER NOT NULL,
  included_km INTEGER NOT NULL,
  package_price DECIMAL(10, 2) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active packages
CREATE INDEX idx_pricing_packages_active ON pricing_packages(is_active, display_order);

-- Insert default pricing packages
INSERT INTO pricing_packages (package_name, duration_hours, included_km, package_price, display_order) VALUES
('4 Hours / 40 Km', 4, 40, 1400, 1),
('8 Hours / 80 Km', 8, 80, 2600, 2),
('12 Hours / 120 Km', 12, 120, 3800, 3),
('Full Day', 24, 300, 7500, 4);

-- ============================================
-- 5. PRICING SETTINGS TABLE
-- ============================================
CREATE TABLE pricing_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default pricing settings
INSERT INTO pricing_settings (key, value, description) VALUES
('extra_km_rate', '15', 'Price per extra kilometer beyond package inclusion'),
('extra_hour_rate', '150', 'Price per extra hour beyond package duration'),
('base_fare', '300', 'Base fare for any trip'),
('night_charge_percentage', '25', 'Additional percentage for night trips (10 PM - 6 AM)'),
('toll_charges', 'actual', 'Toll charges policy (actual/included/flat)');

-- ============================================
-- 6. POPULAR ROUTES TABLE
-- ============================================
CREATE TABLE popular_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pickup_location VARCHAR(255) NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_name VARCHAR(255) NOT NULL,
  destination_address TEXT NOT NULL,
  distance_km DECIMAL(10, 2) NOT NULL,
  travel_time_minutes INTEGER NOT NULL,
  estimated_fare DECIMAL(10, 2) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active routes
CREATE INDEX idx_popular_routes_active ON popular_routes(is_active, display_order);

-- Insert default popular routes
INSERT INTO popular_routes (pickup_location, pickup_address, destination_name, destination_address, distance_km, travel_time_minutes, estimated_fare, display_order) VALUES
('Thane Station', 'Thane Railway Station, Thane West, Thane, Maharashtra 400601, India', 'Mumbai Airport', 'Chhatrapati Shivaji Maharaj International Airport, Mumbai, Maharashtra 400099, India', 32.5, 65, 1350, 1),
('Thane', 'Thane, Maharashtra, India', 'Pune', 'Pune, Maharashtra, India', 145, 180, 4800, 2),
('Kalyan', 'Kalyan, Maharashtra, India', 'Mumbai Airport', 'Chhatrapati Shivaji Maharaj International Airport, Mumbai, Maharashtra 400099, India', 45, 75, 1800, 3),
('Dombivli', 'Dombivli, Maharashtra, India', 'Mumbai CST', 'Chhatrapati Shivaji Terminus, Mumbai, Maharashtra 400001, India', 52, 90, 2100, 4),
('Thane', 'Thane, Maharashtra, India', 'Lonavala', 'Lonavala, Maharashtra, India', 95, 120, 3200, 5),
('Bhiwandi', 'Bhiwandi, Maharashtra, India', 'Nashik', 'Nashik, Maharashtra, India', 110, 150, 3600, 6);

-- ============================================
-- 7. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for approved testimonials
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved, display_order);

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, review_text, rating, review_date, is_approved, is_featured, display_order) VALUES
('Rajesh Kumar', 'Excellent service! Driver was on time and very professional. The car was clean and comfortable. Highly recommend for airport transfers.', 5, '2024-01-15', true, true, 1),
('Priya Sharma', 'Best taxi service in Thane! Used them for a family trip to Lonavala. Very reasonable rates and friendly driver.', 5, '2024-01-20', true, true, 2),
('Amit Patel', 'Reliable and punctual service. Booked for Mumbai airport pickup at 5 AM and driver arrived 10 minutes early. Great experience!', 5, '2024-02-05', true, true, 3),
('Sneha Desai', 'Very professional service. The booking process was smooth and customer support was helpful. Will definitely use again.', 4, '2024-02-10', true, false, 4),
('Vikram Mehta', 'Comfortable ride from Thane to Pune. Driver took the best route and we reached on time. Good value for money.', 5, '2024-02-18', true, false, 5),
('Neha Joshi', 'Excellent outstation cab service. Used for a weekend trip and everything was perfect. Highly satisfied!', 5, '2024-02-25', true, false, 6);

-- ============================================
-- 8. FAQS TABLE
-- ============================================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active FAQs
CREATE INDEX idx_faqs_active ON faqs(is_active, display_order);

-- Insert default FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('How do I book a cab?', 'You can book a cab through our website by filling the booking form, or call us directly at +91-XXXXXXXXXX. Online bookings are confirmed within 30 minutes.', 'Booking', 1),
('What are your payment options?', 'We accept cash, UPI, credit/debit cards, and online payment. Payment can be made after the trip or advance booking payment online.', 'Payment', 2),
('Do you provide outstation services?', 'Yes, we provide outstation cab services to all major cities from Thane including Pune, Lonavala, Nashik, Shirdi, and more.', 'Services', 3),
('What is your cancellation policy?', 'Free cancellation up to 2 hours before pickup. Late cancellations may incur a nominal fee. Contact us for more details.', 'Cancellation', 4),
('Are your drivers verified?', 'Yes, all our drivers are professionally trained, verified, and have valid licenses. Your safety is our priority.', 'Safety', 5),
('Do you charge waiting time?', 'First 15 minutes of waiting time is free. After that, nominal charges apply as per the package selected.', 'Pricing', 6);

-- ============================================
-- 9. CONTENT SECTIONS TABLE
-- ============================================
CREATE TABLE content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) UNIQUE NOT NULL,
  section_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- Insert default content sections
INSERT INTO content_sections (section_key, section_data) VALUES
('hero_section', '{
  "badgeText": "🚖 Trusted Taxi Service Since 2015",
  "titleLine1": "Premium Cab Service",
  "titleLine2": "in Thane & Beyond",
  "description": "Reliable, comfortable, and affordable taxi service for local trips, airport transfers, and outstation journeys. Book your ride with confidence.",
  "chipRating": "4.8★ Rating",
  "chipService": "24/7 Service",
  "chipRoutes": "50+ Routes",
  "primaryButtonText": "Book a Ride",
  "secondaryButtonText": "Call Now",
  "callPhone": "+91-9876543210",
  "stat1Value": "10,000+",
  "stat1Label": "Happy Customers",
  "stat1SubLabel": "Trusted by thousands",
  "stat2Value": "24/7",
  "stat2Label": "Available",
  "stat3Value": "4.8★",
  "stat3Label": "Rating",
  "imageUrl": "/hero-taxi.jpg",
  "imageAlt": "Premium Taxi Service",
  "floatingCardTopLabel": "Available Now",
  "floatingCardTopValue": "Book Your Ride",
  "floatingBadge": "Best Price",
  "floatingTag": "Guaranteed"
}'),
('popular_routes_section', '{
  "title": "Popular Routes",
  "subtitle": "Quick booking for frequently traveled destinations"
}'),
('pricing_section', '{
  "title": "Transparent Pricing",
  "subtitle": "Choose the package that suits your journey",
  "additionalChargesTitle": "Additional Charges",
  "extraKmLabel": "Extra Km",
  "extraKmRate": "₹15/km",
  "extraHourLabel": "Extra Hour",
  "extraHourRate": "₹150/hr"
}'),
('footer_section', '{
  "brandTitle": "Aditya Tours & Travels",
  "brandDescription": "Your trusted partner for comfortable and reliable taxi services in Thane and beyond.",
  "quickLinksTitle": "Quick Links",
  "linkHomeLabel": "Home",
  "linkBookLabel": "Book a Ride",
  "linkTrackLabel": "Track Booking",
  "linkPrivacyLabel": "Privacy Policy",
  "linkTermsLabel": "Terms of Service",
  "contactTitle": "Contact Us",
  "contactPhone": "+91-9876543210",
  "contactEmail": "info@adityatours.com",
  "businessHours": "24/7 Available",
  "responseTime": "Response within 30 minutes"
}');

-- ============================================
-- 10. VEHICLE AVAILABILITY TABLE (Optional for future use)
-- ============================================
CREATE TABLE vehicle_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for checking availability
CREATE INDEX idx_vehicle_blocks_datetime ON vehicle_blocks(start_datetime, end_datetime);

-- ============================================
-- 11. CONTACT FORM SUBMISSIONS TABLE
-- ============================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for unread submissions
CREATE INDEX idx_contact_submissions_read ON contact_submissions(is_read, created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_packages_updated_at BEFORE UPDATE ON pricing_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_popular_routes_updated_at BEFORE UPDATE ON popular_routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ============================================
-- Enable RLS on sensitive tables
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies as needed for your security requirements
-- Example: Allow admins to view all bookings
-- CREATE POLICY admin_view_all_bookings ON bookings
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for booking analytics
CREATE OR REPLACE VIEW booking_analytics AS
SELECT 
  DATE(departure_datetime) as booking_date,
  status,
  COUNT(*) as total_bookings,
  SUM(total_fare) as total_revenue,
  AVG(distance_km) as avg_distance,
  AVG(total_fare) as avg_fare
FROM bookings
GROUP BY DATE(departure_datetime), status
ORDER BY booking_date DESC;

-- View for dashboard stats
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'PENDING') as pending_requests,
  COUNT(*) FILTER (WHERE status = 'CONFIRMED') as confirmed_bookings,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_bookings,
  COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled_bookings,
  COUNT(*) as total_bookings,
  COALESCE(SUM(total_fare) FILTER (WHERE status = 'COMPLETED'), 0) as total_revenue
FROM bookings;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common query patterns
CREATE INDEX idx_bookings_status_created ON bookings(status, created_at DESC);
CREATE INDEX idx_bookings_departure_status ON bookings(departure_datetime, status);
CREATE INDEX idx_bookings_customer_search ON bookings(customer_email, customer_phone);

-- Full-text search indexes (optional)
-- CREATE INDEX idx_bookings_customer_name_fts ON bookings USING gin(to_tsvector('english', customer_name));
-- CREATE INDEX idx_faqs_question_fts ON faqs USING gin(to_tsvector('english', question || ' ' || answer));

-- ============================================
-- SEED DATA FOR DEVELOPMENT
-- ============================================

-- SECURITY NOTE:
-- Do not seed default admin credentials in shared or production schemas.
-- Create admin users manually with strong passwords using secure setup scripts.

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to generate unique booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'ATT-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check vehicle availability
CREATE OR REPLACE FUNCTION check_vehicle_availability(
  p_start_datetime TIMESTAMP WITH TIME ZONE,
  p_end_datetime TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM vehicle_blocks
    WHERE (start_datetime, end_datetime) OVERLAPS (p_start_datetime, p_end_datetime)
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 12. PRICING RANGES TABLE (Distance-based pricing)
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_ranges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_km DECIMAL(10, 2) NOT NULL CHECK (from_km >= 0),
  to_km DECIMAL(10, 2) NOT NULL CHECK (to_km >= from_km),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active ranges
CREATE INDEX IF NOT EXISTS idx_pricing_ranges_active
  ON pricing_ranges(is_active, display_order);

-- Trigger for updated_at
CREATE TRIGGER update_pricing_ranges_updated_at
  BEFORE UPDATE ON pricing_ranges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default pricing ranges
INSERT INTO pricing_ranges (from_km, to_km, price, display_order, is_active) VALUES
(0, 20, 1200, 1, true),
(21, 40, 2000, 2, true),
(41, 80, 3200, 3, true),
(81, 120, 4500, 4, true),
(121, 200, 7000, 5, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Grant necessary permissions (adjust based on your Supabase setup)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- GRANT SELECT ON dashboard_stats TO authenticated;
-- GRANT SELECT ON booking_analytics TO authenticated;
