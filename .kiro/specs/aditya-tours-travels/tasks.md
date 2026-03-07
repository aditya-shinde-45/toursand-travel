# Implementation Tasks: Aditya Tours and Travels

## Phase 1: Project Setup and Infrastructure

### 1. Frontend Project Setup
- [-] 1.1 Initialize React + TypeScript project with Vite
  - Create new Vite project with React-TS template
  - Configure TypeScript with strict mode
  - Set up project folder structure
- [ ] 1.2 Install and configure core dependencies
  - Install Tailwind CSS and configure
  - Install React Router DOM for routing
  - Install React Query for server state management
  - Install React Hook Form and Zod for form handling
  - Install Lucide React for icons
  - Install date-fns for date utilities
- [ ] 1.3 Configure development environment
  - Set up ESLint and Prettier
  - Create .env.example file with required variables
  - Configure Vite proxy for API calls
  - Set up Git repository and .gitignore
- [ ] 1.4 Create base folder structure
  - Create /src/components folder with subfolders (booking, home, admin, common, seo)
  - Create /src/pages folder
  - Create /src/hooks folder
  - Create /src/services folder
  - Create /src/utils folder
  - Create /src/types folder
  - Create /src/styles folder

### 2. Supabase Setup
- [ ] 2.1 Create Supabase project
  - Sign up/login to Supabase
  - Create new project for Aditya Tours
  - Note project URL and anon key
  - Configure project settings
- [ ] 2.2 Install Supabase client
  - Install @supabase/supabase-js package
  - Create Supabase client configuration file
  - Set up environment variables for Supabase credentials
- [ ] 2.3 Create database schema
  - Create bookings table with all required fields
  - Create vehicles table
  - Create vehicle_blocks table
  - Create pricing_config table
  - Create pricing_history table
  - Create admins table
  - Create booking_history table
  - Create popular_routes table
  - Create testimonials table
  - Create faqs table
  - Create contact_inquiries table
  - Create rate_limits table
- [ ] 2.4 Set up database relationships and constraints
  - Add foreign key constraints
  - Create indexes for performance
  - Set up Row Level Security (RLS) policies
  - Create database functions for complex queries
- [ ] 2.5 Seed initial data
  - Insert single Ertiga vehicle record
  - Insert default pricing packages (2hr, 4hr, 6hr, 8hr, 10hr, 12hr)
  - Insert admin user with hashed password
  - Insert sample popular routes
  - Insert sample FAQs

### 3. Backend Project Setup
- [ ] 3.1 Initialize Node.js + TypeScript project
  - Create backend folder structure
  - Initialize npm project
  - Install TypeScript and configure tsconfig.json
  - Install Express.js and types
- [ ] 3.2 Install backend dependencies
  - Install Supabase client for server-side
  - Install bcrypt for password hashing
  - Install jsonwebtoken for JWT authentication
  - Install zod for validation
  - Install cors and helmet for security
  - Install dotenv for environment variables
  - Install nodemailer or SendGrid SDK for emails
- [ ] 3.3 Create backend folder structure
  - Create /src/controllers folder
  - Create /src/services folder
  - Create /src/middleware folder
  - Create /src/utils folder
  - Create /src/types folder
  - Create /src/config folder
  - Create /src/templates/emails folder
- [ ] 3.4 Configure Express server
  - Set up Express app with middleware
  - Configure CORS
  - Set up error handling middleware
  - Create health check endpoint
  - Configure request logging

## Phase 2: Core Frontend Components

### 4. Design System and Common Components
- [ ] 4.1 Set up Tailwind design system
  - Configure custom colors in tailwind.config.js
  - Set up custom spacing and typography
  - Configure breakpoints for responsive design
- [ ] 4.2 Create common UI components
  - Button component with variants
  - Input component with validation states
  - Select/Dropdown component
  - Modal component
  - Toast/Notification component
  - Loader/Spinner component
  - ErrorBoundary component
- [ ] 4.3 Create layout components
  - Header component with navigation
  - Footer component with all sections
  - Main layout wrapper
  - Admin layout wrapper

### 5. Homepage Implementation
- [ ] 5.1 Create Hero section
  - Company name and tagline
  - Quick booking form preview
  - Call-to-action buttons
  - Background image/gradient
- [ ] 5.2 Create Vehicle Details section
  - Ertiga image display
  - Specifications list (7 seats, AC, etc.)
  - Features with icons
  - "Book This Vehicle" CTA
- [ ] 5.3 Create Pricing section
  - Display all 6 packages in grid/table
  - Show included hours and kilometers
  - Display package prices
  - Show extra charges (₹15/km, ₹150/hr)
  - Add sample calculation example
- [ ] 5.4 Create Popular Routes section
  - Grid layout (responsive)
  - Route cards with destination, distance, time, price
  - Click handler to pre-fill booking form
- [ ] 5.5 Create Why Choose Us section
  - 4 benefit cards with icons
  - Responsive grid layout
- [ ] 5.6 Create Testimonials section
  - Carousel/slider component
  - Star ratings display
  - Auto-rotate functionality
- [ ] 5.7 Create FAQ section
  - Accordion component
  - Expand/collapse animation
  - Load FAQs from API
- [ ] 5.8 Create Contact section
  - Click-to-call phone button
  - WhatsApp button with pre-filled message
  - Email link
  - Contact form
  - Business hours display

### 6. Google Maps Integration
- [ ] 6.1 Set up Google Maps API
  - Create Google Cloud project
  - Enable required APIs (Places, Geocoding, Distance Matrix, Maps JavaScript)
  - Generate API keys (dev and prod)
  - Configure API key restrictions
- [ ] 6.2 Install Google Maps React library
  - Install @react-google-maps/api
  - Create Maps provider wrapper
  - Implement lazy loading for Maps script
- [ ] 6.3 Create Location Autocomplete component
  - Implement Places Autocomplete for pickup (Thane restricted)
  - Implement Places Autocomplete for drop (unrestricted)
  - Handle place selection and extract coordinates
  - Display selected location
- [ ] 6.4 Create Route Map Display component
  - Display map with pickup and drop markers
  - Draw route polyline
  - Auto-fit bounds to show entire route
  - Responsive map sizing
- [ ] 6.5 Implement distance and time calculation
  - Use Distance Matrix API
  - Calculate route distance in kilometers
  - Calculate estimated travel time
  - Handle API errors gracefully

## Phase 3: Booking Flow Implementation

### 7. Booking Flow - Step 1 (Location Selection)
- [ ] 7.1 Create Step 1 component structure
  - Step indicator component
  - Form layout with validation
  - Navigation buttons (Back, Continue)
- [ ] 7.2 Implement pickup location input
  - Google Maps autocomplete with Thane restriction
  - Validation for required field
  - Store address and coordinates
- [ ] 7.3 Implement drop location input
  - Google Maps autocomplete (unrestricted)
  - Validation for required field
  - Store address and coordinates
- [ ] 7.4 Implement trip type selection
  - Radio buttons for One Way / Round Trip
  - Update form state on selection
- [ ] 7.5 Implement route preview
  - Display map when both locations selected
  - Show distance and estimated time
  - Calculate and display fare estimate
- [ ] 7.6 Add form validation and navigation
  - Validate all required fields
  - Enable/disable Continue button
  - Navigate to Step 2 on continue

### 8. Booking Flow - Step 2 (Date & Time Selection)
- [ ] 8.1 Create Step 2 component structure
  - Conditional rendering based on trip type
  - Date and time picker components
- [ ] 8.2 Implement departure date/time selection
  - Date picker with disabled past dates
  - Time picker with 30-minute intervals
  - Validation for required fields
- [ ] 8.3 Implement return date/time selection (Round Trip)
  - Show only for round trip bookings
  - Validate return is after departure
  - Date and time pickers
- [ ] 8.4 Implement real-time availability check
  - Call availability API when dates selected
  - Display availability status (✓ available / ✗ unavailable)
  - Show suggested alternative dates if unavailable
- [ ] 8.5 Add form validation and navigation
  - Validate all required fields
  - Check availability before proceeding
  - Navigate to Step 3 on continue

### 9. Booking Flow - Step 3 (Customer Details)
- [ ] 9.1 Create Step 3 component structure
  - Form layout with all customer fields
  - Validation messages
- [ ] 9.2 Implement customer name input
  - Text input with validation
  - Required field validation
- [ ] 9.3 Implement phone number input
  - Phone input with +91 prefix
  - Format validation (10 digits)
  - Real-time validation feedback
- [ ] 9.4 Implement email input
  - Email input with validation
  - Format validation
  - Real-time validation feedback
- [ ] 9.5 Implement passenger count selector
  - Number selector (1-7)
  - Visual button group
  - Default to 1 passenger
- [ ] 9.6 Implement special instructions textarea
  - Optional textarea
  - Character limit (500 chars)
- [ ] 9.7 Add form validation and navigation
  - Validate all required fields
  - Enable/disable Continue button
  - Navigate to Step 4 on continue

### 10. Booking Flow - Step 4 (Summary & Confirmation)
- [ ] 10.1 Create Step 4 component structure
  - Summary display sections
  - Confirmation button
- [ ] 10.2 Display trip details summary
  - Pickup and drop addresses
  - Date and time
  - Trip type and distance
  - Map preview
- [ ] 10.3 Display customer details summary
  - Name, phone, email
  - Passenger count
  - Special instructions
- [ ] 10.4 Display fare breakdown
  - Selected package details
  - Extra charges (if any)
  - Total fare
  - Payment method note
- [ ] 10.5 Implement terms and conditions checkbox
  - Checkbox component
  - Link to T&C page
  - Required validation
- [ ] 10.6 Implement booking submission
  - Call booking API
  - Handle loading state
  - Handle success response
  - Handle error response
- [ ] 10.7 Create confirmation screen
  - Success message
  - Booking reference number display
  - Next steps information
  - Track Booking and Book Another buttons

### 11. Booking Tracking Feature
- [ ] 11.1 Create Track Booking page
  - Form to enter reference number and email
  - Validation
- [ ] 11.2 Implement booking lookup
  - Call tracking API
  - Handle not found errors
  - Display loading state
- [ ] 11.3 Display booking status
  - Show booking details
  - Display current status with visual indicator
  - Show trip information
  - Display driver contact (if confirmed)

## Phase 4: Backend API Implementation

### 12. Authentication and Security
- [ ] 12.1 Implement JWT authentication
  - Create token generation function
  - Create token verification middleware
  - Implement refresh token logic (optional)
- [ ] 12.2 Implement password hashing
  - Use bcrypt for hashing
  - Create hash and verify functions
  - Implement password strength validation
- [ ] 12.3 Implement rate limiting
  - Create rate limit middleware
  - Configure limits for different endpoints
  - Store rate limit data in Supabase
  - Implement IP blocking logic
- [ ] 12.4 Implement security headers
  - Configure Helmet middleware
  - Set up CORS properly
  - Implement CSRF protection

### 13. Public Booking API Endpoints
- [ ] 13.1 POST /api/bookings - Create booking
  - Validate request body with Zod
  - Check vehicle availability
  - Generate unique reference number
  - Calculate fare
  - Insert booking into database
  - Send customer confirmation email
  - Send admin notification email
  - Return booking details
- [ ] 13.2 GET /api/bookings/check-availability
  - Parse query parameters
  - Query vehicle blocks from database
  - Check for overlapping bookings
  - Return availability status
  - Suggest alternative dates if unavailable
- [ ] 13.3 GET /api/bookings/track/:referenceNumber
  - Validate reference number and email
  - Query booking from database
  - Return booking details and status
  - Handle not found errors
- [ ] 13.4 GET /api/pricing/calculate
  - Parse distance and duration parameters
  - Get active pricing config
  - Calculate best package match
  - Calculate extra charges
  - Return fare breakdown
- [ ] 13.5 GET /api/pricing/packages
  - Query active pricing packages
  - Return all packages with details
  - Include extra rates

### 14. Public Content API Endpoints
- [ ] 14.1 GET /api/popular-routes
  - Query active popular routes
  - Calculate estimated fares
  - Return sorted by display order
- [ ] 14.2 GET /api/testimonials
  - Query active testimonials
  - Return sorted by featured and date
  - Limit to recent 6
- [ ] 14.3 GET /api/faqs
  - Query active FAQs
  - Return sorted by display order
- [ ] 14.4 POST /api/contact
  - Validate contact form data
  - Insert into contact_inquiries table
  - Send email to admin
  - Return success message

### 15. Admin Authentication API Endpoints
- [ ] 15.1 POST /api/admin/auth/login
  - Validate credentials
  - Verify password hash
  - Generate JWT token
  - Update last login timestamp
  - Return token and admin details
- [ ] 15.2 POST /api/admin/auth/logout
  - Invalidate token (if using token blacklist)
  - Return success message
- [ ] 15.3 POST /api/admin/auth/forgot-password
  - Validate email
  - Generate reset token
  - Store token with expiry
  - Send password reset email
- [ ] 15.4 POST /api/admin/auth/reset-password
  - Validate reset token
  - Check token expiry
  - Hash new password
  - Update admin password
  - Invalidate reset token

### 16. Admin Booking Management API Endpoints
- [ ] 16.1 GET /api/admin/bookings
  - Require authentication
  - Parse filter parameters (status, date range)
  - Query bookings with pagination
  - Return bookings list with metadata
- [ ] 16.2 GET /api/admin/bookings/:id
  - Require authentication
  - Query booking with full details
  - Include booking history
  - Return booking details
- [ ] 16.3 PATCH /api/admin/bookings/:id/confirm
  - Require authentication
  - Validate booking exists and is pending
  - Check vehicle availability again
  - Update status to CONFIRMED
  - Create vehicle block
  - Add to booking history
  - Send confirmation email to customer
  - Return updated booking
- [ ] 16.4 PATCH /api/admin/bookings/:id/cancel
  - Require authentication
  - Validate booking exists
  - Update status to CANCELLED
  - Remove vehicle block if exists
  - Add to booking history
  - Send cancellation email to customer
  - Return updated booking
- [ ] 16.5 PATCH /api/admin/bookings/:id/complete
  - Require authentication
  - Validate booking exists and is confirmed
  - Update status to COMPLETED
  - Store actual distance and final fare
  - Release vehicle block
  - Add to booking history
  - Return updated booking

### 17. Admin Calendar and Analytics API Endpoints
- [ ] 17.1 GET /api/admin/calendar
  - Require authentication
  - Parse year and month parameters
  - Query bookings for the month
  - Format for calendar display
  - Return calendar data
- [ ] 17.2 GET /api/admin/analytics/dashboard
  - Require authentication
  - Calculate total bookings by status
  - Calculate total revenue
  - Calculate average booking value
  - Calculate conversion rate
  - Get popular routes statistics
  - Get booking trends
  - Return dashboard data
- [ ] 17.3 GET /api/admin/analytics/reports
  - Require authentication
  - Parse year and month parameters
  - Generate monthly report
  - Calculate all metrics
  - Return report data

### 18. Admin Content Management API Endpoints
- [ ] 18.1 Pricing management endpoints
  - GET /api/admin/pricing - Get current pricing
  - PUT /api/admin/pricing/packages/:id - Update package
  - PUT /api/admin/pricing/extra-rates - Update extra rates
  - Store changes in pricing_history
- [ ] 18.2 Popular routes management endpoints
  - GET /api/admin/popular-routes - List all
  - POST /api/admin/popular-routes - Create new
  - PUT /api/admin/popular-routes/:id - Update
  - DELETE /api/admin/popular-routes/:id - Delete
- [ ] 18.3 Testimonials management endpoints
  - GET /api/admin/testimonials - List all
  - POST /api/admin/testimonials - Create new
  - PUT /api/admin/testimonials/:id - Update
  - DELETE /api/admin/testimonials/:id - Delete
- [ ] 18.4 FAQs management endpoints
  - GET /api/admin/faqs - List all
  - POST /api/admin/faqs - Create new
  - PUT /api/admin/faqs/:id - Update
  - DELETE /api/admin/faqs/:id - Delete
- [ ] 18.5 Contact inquiries endpoints
  - GET /api/admin/contact-inquiries - List all
  - PATCH /api/admin/contact-inquiries/:id - Update status

### 19. Admin Vehicle Management API Endpoints
- [ ] 19.1 GET /api/admin/vehicles
  - Require authentication
  - Query all vehicles
  - Include current booking status
  - Return vehicles list
- [ ] 19.2 Vehicle blocks management
  - POST /api/admin/vehicle-blocks - Create manual block
  - GET /api/admin/vehicle-blocks - List blocks
  - DELETE /api/admin/vehicle-blocks/:id - Remove block

## Phase 5: Email Service Implementation

### 20. Email Templates and Service
- [ ] 20.1 Set up email service (SendGrid or Nodemailer)
  - Configure email service credentials
  - Create email service wrapper
  - Implement retry logic with exponential backoff
- [ ] 20.2 Create email templates
  - Customer booking confirmation template
  - Admin booking notification template
  - Customer booking confirmed template
  - Customer booking cancelled template
  - Admin password reset template
- [ ] 20.3 Implement email sending functions
  - sendBookingConfirmation(booking, customer)
  - sendAdminNotification(booking)
  - sendBookingConfirmed(booking, customer)
  - sendBookingCancelled(booking, customer, reason)
  - sendPasswordReset(admin, resetToken)
- [ ] 20.4 Add email error handling and logging
  - Log all email attempts
  - Handle delivery failures
  - Implement retry queue

## Phase 6: Admin Panel Implementation

### 21. Admin Authentication UI
- [ ] 21.1 Create admin login page
  - Login form with username and password
  - Form validation
  - Error message display
  - Remember me option (optional)
- [ ] 21.2 Create forgot password page
  - Email input form
  - Success message display
- [ ] 21.3 Create reset password page
  - New password form
  - Password strength indicator
  - Confirmation message
- [ ] 21.4 Implement admin authentication context
  - Store JWT token in localStorage
  - Provide authentication state
  - Handle token expiry
  - Implement logout function

### 22. Admin Dashboard
- [ ] 22.1 Create dashboard layout
  - Sidebar navigation
  - Header with admin info and logout
  - Main content area
- [ ] 22.2 Create statistics cards
  - Total bookings by status
  - Revenue metrics
  - Display with icons and colors
- [ ] 22.3 Create recent bookings list
  - Display latest 5-10 bookings
  - Quick action buttons (Confirm, Cancel)
  - Link to full bookings page
- [ ] 22.4 Create booking trends chart
  - Line chart for last 30 days
  - Use Chart.js or Recharts
  - Show bookings and revenue trends
- [ ] 22.5 Create popular routes display
  - List top routes with statistics
  - Show trip count and revenue

### 23. Admin Bookings Management
- [ ] 23.1 Create bookings list page
  - Table with all bookings
  - Status filters (All, Pending, Confirmed, Cancelled, Completed)
  - Date range filter
  - Search by reference number or customer name
  - Pagination
- [ ] 23.2 Create booking details modal/page
  - Display all booking information
  - Show booking history timeline
  - Action buttons (Confirm, Cancel, Complete)
- [ ] 23.3 Implement booking actions
  - Confirm booking with confirmation dialog
  - Cancel booking with reason input
  - Complete booking with actual distance and fare input
  - Show success/error notifications

### 24. Admin Calendar View
- [ ] 24.1 Create calendar component
  - Monthly calendar view
  - Display bookings on dates
  - Color coding by status
  - Month navigation
- [ ] 24.2 Implement booking display on calendar
  - Show booking indicators on dates
  - Click to view bookings for that date
  - Visual distinction for one-way vs round-trip
- [ ] 24.3 Add calendar interactions
  - Click date to see bookings
  - Click booking to view details
  - Navigate between months

### 25. Admin Content Management
- [ ] 25.1 Create pricing management page
  - Display all packages in editable form
  - Edit package prices
  - Edit extra kilometer and hour rates
  - Set effective date
  - View pricing history
- [ ] 25.2 Create popular routes management
  - List all routes
  - Add new route form
  - Edit route details
  - Delete route with confirmation
  - Reorder routes (drag and drop optional)
- [ ] 25.3 Create testimonials management
  - List all testimonials
  - Add new testimonial form
  - Edit testimonial
  - Delete testimonial with confirmation
  - Toggle featured status
- [ ] 25.4 Create FAQs management
  - List all FAQs
  - Add new FAQ form
  - Edit FAQ
  - Delete FAQ with confirmation
  - Reorder FAQs
- [ ] 25.5 Create contact inquiries page
  - List all inquiries
  - Filter by status (New, In Progress, Resolved)
  - View inquiry details
  - Update status and add notes

### 26. Admin Vehicle Management
- [ ] 26.1 Create vehicles page
  - Display vehicle details (Ertiga)
  - Show current status
  - Edit vehicle information
- [ ] 26.2 Create vehicle blocks management
  - List all blocks (booking and manual)
  - Add manual block form (for maintenance)
  - Delete manual blocks
  - Calendar view of blocks

## Phase 7: SEO and Additional Pages

### 27. SEO Implementation
- [ ] 27.1 Create SEO component
  - Meta tags component
  - Open Graph tags
  - Twitter Card tags
  - Canonical URL
- [ ] 27.2 Implement structured data
  - LocalBusiness schema
  - Service schema
  - Review schema for testimonials
  - FAQ schema
- [ ] 27.3 Create SEO landing pages
  - /thane-taxi-service page
  - /thane-airport-taxi page
  - /thane-outstation-cab page
  - /thane-ertiga-cab page
  - Each with unique content and booking CTA
- [ ] 27.4 Generate sitemap.xml
  - Include all pages
  - Include SEO landing pages
  - Set priorities and change frequencies
- [ ] 27.5 Create robots.txt
  - Allow all pages except admin
  - Link to sitemap

### 28. Legal and Additional Pages
- [ ] 28.1 Create Privacy Policy page
  - Content about data collection and usage
  - GDPR compliance information
  - Contact information
- [ ] 28.2 Create Terms and Conditions page
  - Service terms
  - Cancellation policy
  - Payment terms
  - Liability disclaimers
- [ ] 28.3 Create Contact page
  - Contact form
  - Phone and email display
  - WhatsApp button
  - Business hours
  - Location map (optional)
- [ ] 28.4 Create About Us page (optional)
  - Company information
  - Mission and values
  - Team information

## Phase 8: Testing and Quality Assurance

### 29. Frontend Testing
- [ ] 29.1 Test booking flow end-to-end
  - Test all 4 steps
  - Test validation errors
  - Test successful booking
  - Test error handling
- [ ] 29.2 Test Google Maps integration
  - Test location autocomplete
  - Test route calculation
  - Test map display
  - Test error scenarios
- [ ] 29.3 Test responsive design
  - Test on mobile devices (320px, 375px, 414px)
  - Test on tablets (768px, 1024px)
  - Test on desktop (1280px, 1920px)
- [ ] 29.4 Test admin panel
  - Test all CRUD operations
  - Test authentication flow
  - Test dashboard statistics
  - Test calendar view

### 30. Backend Testing
- [ ] 30.1 Test all API endpoints
  - Test with valid data
  - Test with invalid data
  - Test authentication
  - Test rate limiting
- [ ] 30.2 Test availability algorithm
  - Test with no bookings
  - Test with overlapping bookings
  - Test with adjacent bookings
  - Test round trip scenarios
- [ ] 30.3 Test pricing calculation
  - Test all package scenarios
  - Test extra charges calculation
  - Test edge cases
- [ ] 30.4 Test email delivery
  - Test all email templates
  - Test retry logic
  - Test error handling

### 31. Security Testing
- [ ] 31.1 Test authentication security
  - Test JWT token validation
  - Test password hashing
  - Test session management
- [ ] 31.2 Test rate limiting
  - Test booking endpoint limits
  - Test login endpoint limits
  - Test IP blocking
- [ ] 31.3 Test input validation
  - Test SQL injection prevention
  - Test XSS prevention
  - Test CSRF protection
- [ ] 31.4 Test API security
  - Test CORS configuration
  - Test security headers
  - Test sensitive data exposure

## Phase 9: Performance Optimization

### 32. Frontend Performance
- [ ] 32.1 Optimize images
  - Compress all images
  - Use WebP format with fallbacks
  - Implement lazy loading
- [ ] 32.2 Optimize JavaScript bundles
  - Code splitting by route
  - Lazy load admin panel
  - Tree shaking unused code
- [ ] 32.3 Optimize CSS
  - Remove unused Tailwind classes
  - Minify CSS
- [ ] 32.4 Implement caching
  - Cache static assets
  - Cache API responses with React Query
  - Service worker for offline support (optional)

### 33. Backend Performance
- [ ] 33.1 Optimize database queries
  - Add indexes for frequently queried fields
  - Optimize complex queries
  - Use database functions where appropriate
- [ ] 33.2 Implement caching
  - Cache pricing configuration
  - Cache popular routes
  - Cache FAQs and testimonials
- [ ] 33.3 Optimize API responses
  - Compress responses with gzip
  - Implement pagination
  - Limit response payload size

## Phase 10: Deployment

### 34. Frontend Deployment
- [ ] 34.1 Prepare for production
  - Set production environment variables
  - Build production bundle
  - Test production build locally
- [ ] 34.2 Deploy to Vercel
  - Connect GitHub repository
  - Configure build settings
  - Set environment variables
  - Deploy and test
- [ ] 34.3 Configure custom domain
  - Add custom domain in Vercel
  - Configure DNS records
  - Enable SSL certificate

### 35. Backend Deployment
- [ ] 35.1 Prepare for production
  - Set production environment variables
  - Configure production database
  - Test production configuration
- [ ] 35.2 Deploy to Railway/Render
  - Create new project
  - Connect GitHub repository
  - Configure build and start commands
  - Set environment variables
  - Deploy and test
- [ ] 35.3 Configure custom domain (optional)
  - Add custom domain
  - Configure DNS records
  - Enable SSL certificate

### 36. Post-Deployment
- [ ] 36.1 Set up monitoring
  - Configure error tracking (Sentry)
  - Set up uptime monitoring
  - Configure performance monitoring
- [ ] 36.2 Set up analytics
  - Configure Google Analytics
  - Set up conversion tracking
  - Configure event tracking
- [ ] 36.3 Set up backups
  - Configure Supabase automatic backups
  - Test backup restoration
- [ ] 36.4 Create documentation
  - API documentation
  - Admin user guide
  - Deployment guide
  - Maintenance guide

### 37. Launch Checklist
- [ ] 37.1 Final testing
  - Test all features in production
  - Test on multiple devices
  - Test email delivery
  - Test payment flow (offline)
- [ ] 37.2 SEO setup
  - Submit sitemap to Google Search Console
  - Set up Google Business Profile
  - Verify website in search engines
- [ ] 37.3 Go live
  - Announce launch
  - Monitor for issues
  - Gather user feedback

## Notes

- All tasks should be completed in order within each phase
- Each task should be tested before moving to the next
- Use feature branches for development
- Create pull requests for code review
- Update documentation as features are completed
- Keep environment variables secure and never commit them to Git
