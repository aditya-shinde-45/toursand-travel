# Aditya Tours & Travels - Quick Start Guide

## 🎯 Complete Integration Done!

Your backend and frontend are now fully integrated and ready to use.

---

## 📋 Before You Start

### 1. Setup Supabase Database
Open your Supabase dashboard and run the schema:

```bash
# Navigate to Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of: Backend/supabase-schema.sql
# Click "Run" to create all tables
```

This will create:
- ✅ 11 database tables
- ✅ Sample data (pricing packages, routes, testimonials, FAQs)
- ✅ Default admin user (username: `admin`, password: `admin123`)

### 2. Verify Environment Variables

**Backend** (`/Backend/.env`):
```env
DATABASE_URL=postgresql://postgres:your-db-password@your-supabase-host:5432/postgres
JWT_SECRET=replace-with-a-strong-random-secret
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
SMTP_USER=your-business-email@example.com
SMTP_PASS=your-16-char-app-password
```

**Frontend** (`/aditya-tours-frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## 🚀 Start the Application

### Terminal 1 - Backend Server
```bash
cd /home/ideabliss/Downloads/toursand-travel/Backend
npm run dev
```

**You should see:**
```
🚀 Server running on http://localhost:5000
✅ Connected to Supabase PostgreSQL database
```

### Terminal 2 - Frontend Development Server
```bash
cd /home/ideabliss/Downloads/toursand-travel/aditya-tours-frontend
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## 🧪 Test the Integration

### 1. Test Public Endpoints

**Open browser:** `http://localhost:5173`

✅ **Homepage should display:**
- Popular routes (from database)
- Customer testimonials (from database)
- FAQs (from database)
- Pricing packages (from database)

### 2. Test Booking Flow

1. Click on a **Popular Route** card (e.g., "Thane Station → Mumbai Airport")
2. Location fields should auto-fill
3. Select date/time and passenger count
4. Click "Continue" → Enter customer details
5. Submit booking
6. You'll receive a reference number (format: `ATT-XXXXXX`)
7. Check email for confirmation (if SMTP is working)

### 3. Test Booking Tracking

1. Go to **Track Booking** page
2. Enter reference number from step 2
3. View booking status and details

### 4. Test Admin Dashboard

**URL:** `http://localhost:5173/admin/login`

**Credentials:**
- Username: `admin`
- Password: `admin123`

✅ **After login, you should see:**
- Dashboard with statistics
- All bookings list
- Ability to change booking status
- Contact form submissions

---

## 🔍 Verify Database Connection

### Option 1: Check Server Logs
Backend terminal should show:
```
✅ Connected to Supabase PostgreSQL database
```

### Option 2: Test API Directly
```bash
# Health check
curl http://localhost:5000/api/health

# Get popular routes
curl http://localhost:5000/api/content/popular-routes

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📊 What's Integrated

### ✅ Public Features
- **Booking Creation** → `/api/bookings` (POST)
- **Booking Tracking** → `/api/bookings/track/:reference` (GET)
- **Vehicle Availability Check** → `/api/bookings/check-availability` (POST)
- **Popular Routes** → `/api/content/popular-routes` (GET)
- **Testimonials** → `/api/content/testimonials` (GET)
- **FAQs** → `/api/content/faqs` (GET)
- **Pricing Packages** → `/api/content/pricing` (GET)
- **Contact Form** → `/api/content/contact` (POST)

### ✅ Admin Features
- **Login with JWT** → `/api/admin/login` (POST)
- **Dashboard Stats** → `/api/admin/dashboard/stats` (GET)
- **View All Bookings** → `/api/admin/bookings` (GET)
- **Update Booking Status** → `/api/admin/bookings/:id/status` (PATCH)
- **Booking History** → `/api/admin/bookings/:id/history` (GET)
- **Contact Submissions** → `/api/admin/contacts` (GET)

### ✅ Email Notifications
- Booking confirmation email sent to customer
- Status update emails (when admin changes status)
- HTML-formatted professional templates

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure you're in the Backend directory
cd /home/ideabliss/Downloads/toursand-travel/Backend

# Install dependencies again
npm install

# Try running
npm run dev
```

### Frontend API calls failing
1. Check backend is running on `http://localhost:5000`
2. Open browser console (F12) to see error messages
3. Verify `.env` file has correct `VITE_API_URL`

### Database connection failed
1. Verify `DATABASE_URL` in `.env` is correct
2. Check Supabase project is active
3. Run the schema SQL if tables don't exist

### CORS errors
Check `CORS_ORIGIN` in backend `.env` matches frontend URL:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 📱 Sample Test Data

### Test Booking
```json
{
  "tripType": "ONE_WAY",
  "pickupAddress": "Thane Station, Thane West, Thane, Maharashtra 400601",
  "pickupLat": 19.1864,
  "pickupLng": 72.9766,
  "dropAddress": "Mumbai Airport, Mumbai, Maharashtra 400099",
  "dropLat": 19.0896,
  "dropLng": 72.8656,
  "distanceKm": 32.5,
  "travelTimeMinutes": 65,
  "departureDateTime": "2026-03-15T10:00:00Z",
  "customerName": "Test User",
  "customerPhone": "+919876543210",
  "customerEmail": "test@example.com",
  "passengerCount": 2,
  "totalFare": 1350
}
```

---

## 🎉 You're All Set!

Your complete taxi booking system is now running with:
- ✅ Full-stack integration (Frontend ↔ Backend ↔ Database)
- ✅ Real-time booking system
- ✅ Admin dashboard with JWT authentication
- ✅ Email notifications
- ✅ PostgreSQL database with sample data
- ✅ Professional UI with Tailwind CSS

**Next Steps:**
1. Test all features thoroughly
2. Customize content (routes, pricing, testimonials)
3. Update admin password from default
4. Generate new JWT_SECRET for production
5. Setup custom domain and deploy

---

## 📚 Additional Resources

- **API Documentation:** `/Backend/API_DOCUMENTATION.md`
- **Database Setup:** `/Backend/SUPABASE_SETUP.md`
- **Backend Structure:** `/Backend/src/` (controllers, repositories, services)
- **Frontend Services:** `/aditya-tours-frontend/src/services/`

---

**Need Help?**
- Check terminal logs for errors
- Review API documentation for endpoint details
- Verify all environment variables are set correctly
