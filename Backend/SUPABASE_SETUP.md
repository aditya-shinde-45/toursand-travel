# Supabase Database Setup Guide

## Overview
This guide will help you set up the complete Supabase database for the Aditya Tours & Travels application.

## Prerequisites
- Supabase account (free tier works fine)
- Database connection details from your Supabase project

## Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter project details:
   - **Name**: aditya-tours-travels
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., Mumbai/Singapore for India)
4. Wait for project to be provisioned (1-2 minutes)

### 2. Get Database Connection String
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Under "Connection string", select **URI** format
3. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. **URL encode special characters** in password (e.g., `@` becomes `%40`, `#` becomes `%23`)

### 3. Update Backend .env File
Open `Backend/.env` and update:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 4. Run Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click **Run** button
6. Verify success (should see "Success. No rows returned")

### 5. Verify Setup
Run these queries in SQL Editor to verify tables were created:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check data was seeded
SELECT COUNT(*) as pricing_packages FROM pricing_packages;
SELECT COUNT(*) as popular_routes FROM popular_routes;
SELECT COUNT(*) as testimonials FROM testimonials;
SELECT COUNT(*) as faqs FROM faqs;
```

You should see:
- 11 tables created
- 4 pricing packages
- 6 popular routes
- 6 testimonials
- 6 FAQs

## Database Tables

### Core Tables
1. **bookings** - All booking requests and their details
2. **admin_users** - Admin panel user accounts
3. **booking_history** - Audit trail for booking status changes
4. **pricing_packages** - Available pricing tiers (4 Hours, 8 Hours, etc.)
5. **pricing_settings** - Dynamic pricing configuration
6. **popular_routes** - Pre-configured routes for quick booking
7. **testimonials** - Customer reviews
8. **faqs** - Frequently Asked Questions
9. **content_sections** - Dynamic website content (hero, footer, etc.)
10. **vehicle_blocks** - Vehicle availability tracking
11. **contact_submissions** - Contact form entries

### Views
- **dashboard_stats** - Real-time dashboard statistics
- **booking_analytics** - Booking trends and revenue analytics

## Default Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- ⚠️ **IMPORTANT**: Change this password immediately in production!

### Change Admin Password
Run this in SQL Editor after replacing `NEW_PASSWORD_HASH`:

```sql
-- Generate hash using bcrypt online tool with rounds=10
UPDATE admin_users 
SET password_hash = '$2b$10$...' -- Put your bcrypt hash here
WHERE username = 'admin';
```

Or use the backend API endpoint:
```bash
POST /api/admin/change-password
{
  "currentPassword": "admin123",
  "newPassword": "YourSecurePassword123!"
}
```

## Sample Queries

### Get All Pending Bookings
```sql
SELECT 
  reference_number,
  customer_name,
  pickup_address,
  drop_address,
  departure_datetime,
  total_fare
FROM bookings
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

### Get Revenue Statistics
```sql
SELECT * FROM dashboard_stats;
```

### Get Popular Routes
```sql
SELECT 
  pickup_location,
  destination_name,
  distance_km,
  estimated_fare
FROM popular_routes
WHERE is_active = true
ORDER BY display_order;
```

### Get Customer Bookings by Email
```sql
SELECT 
  reference_number,
  status,
  trip_type,
  departure_datetime,
  total_fare
FROM bookings
WHERE customer_email = 'customer@example.com'
ORDER BY created_at DESC;
```

## API Integration

### Test Database Connection
Run this from your Backend directory:

```bash
cd Backend
npm run dev
```

Check console output for:
```
✅ Connected to Supabase PostgreSQL database
```

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "database": {
      "ok": true,
      "message": "Connected to PostgreSQL"
    },
    "email": {
      "ok": false,
      "message": "Email credentials not configured"
    }
  },
  "timestamp": "2024-03-07T10:30:00.000Z"
}
```

## Repository Functions

### Booking Operations
```javascript
const bookingRepo = require('./repositories/bookingRepository');

// Create booking
const booking = await bookingRepo.createBooking({
  tripType: 'ONE_WAY',
  pickupAddress: 'Thane Station',
  pickupLat: 19.1864,
  pickupLng: 72.9781,
  // ... other fields
});

// Get bookings with filters
const bookings = await bookingRepo.getBookings({
  status: 'PENDING',
  startDate: '2024-03-01',
  limit: 20
});

// Update booking status
await bookingRepo.updateBookingStatus(
  bookingId,
  'CONFIRMED',
  adminId,
  'Customer verified'
);
```

### Content Operations
```javascript
const contentRepo = require('./repositories/contentRepository');

// Get popular routes
const routes = await contentRepo.getPopularRoutes();

// Get pricing packages
const packages = await contentRepo.getPricingPackages();

// Get FAQs
const faqs = await contentRepo.getFAQs();
```

### Admin Operations
```javascript
const adminRepo = require('./repositories/adminRepository');

// Verify login
const admin = await adminRepo.verifyAdminPassword(
  'admin',
  'admin123'
);

// Create new admin
await adminRepo.createAdminUser({
  username: 'john',
  password: 'SecurePass123',
  name: 'John Doe',
  email: 'john@adityatours.com'
});
```

## Data Maintenance

### Backup Database
In Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Scroll to **Database Backups**
3. Click **Download Backup** (available on paid plans)

Or use pg_dump:
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > backup.sql
```

### Clean Old Bookings (Optional)
```sql
-- Archive completed bookings older than 1 year
DELETE FROM bookings
WHERE status = 'COMPLETED' 
AND completed_at < NOW() - INTERVAL '1 year';
```

### Reset Test Data
```sql
-- Clear all bookings (be careful!)
TRUNCATE bookings CASCADE;

-- Reset auto-increment sequences
-- Not needed with UUID primary keys
```

## Troubleshooting

### Connection Issues
**Error**: `Connection refused` or `timeout`
- Check DATABASE_URL has correct password
- Ensure password is URL-encoded
- Verify Supabase project is active

**Error**: `SSL required`
- Supabase requires SSL connections
- This is already configured in `src/config/db.js`

### Query Errors
**Error**: `relation "bookings" does not exist`
- Schema not created yet
- Run `supabase-schema.sql` in SQL Editor

**Error**: `duplicate key value violates unique constraint`
- Reference number collision (very rare)
- Function will retry up to 10 times

### Performance Issues
- Add indexes for frequently queried columns
- Use connection pooling (already configured)
- Consider pagination for large result sets

## Security Best Practices

1. **Row Level Security (RLS)**
   ```sql
   -- Enable RLS on sensitive tables
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Admins can view all bookings"
   ON bookings FOR SELECT
   TO authenticated
   USING (true);
   ```

2. **Change Default Credentials**
   - Update admin password immediately
   - Rotate JWT_SECRET in .env

3. **Backup Regularly**
   - Enable automatic backups in Supabase
   - Export critical data weekly

4. **Monitor Access**
   - Review Supabase logs regularly
   - Set up alerts for suspicious activity

## Useful Supabase Features

### Real-time Subscriptions (Optional)
Enable real-time for instant booking updates:
```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

supabase
  .channel('bookings')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'bookings' },
    (payload) => console.log('New booking:', payload)
  )
  .subscribe();
```

### Storage (Optional)
Store images for testimonials or driver photos:
1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `testimonial-images`
3. Set policies for public read access

## Support

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Common Resources
- [SQL Tutorial](https://www.postgresqltutorial.com/)
- [Node.js PostgreSQL](https://node-postgres.com/)

## Next Steps

1. ✅ Set up Supabase database
2. ✅ Run schema creation
3. ✅ Verify default data
4. 🔲 Change admin password
5. 🔲 Test backend connection
6. 🔲 Deploy backend to AWS Lambda
7. 🔲 Test API endpoints
8. 🔲 Configure email service (SMTP)

---

**Last Updated**: March 2024  
**Schema Version**: 1.0.0
