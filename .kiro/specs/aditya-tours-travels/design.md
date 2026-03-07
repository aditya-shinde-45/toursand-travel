# Design Document: Aditya Tours and Travels Booking Website

## Overview

Aditya Tours and Travels is a single-vehicle taxi booking platform built for a Maruti Suzuki Ertiga operating from Thane, Maharashtra. The system enables guest users to book trips without authentication, with manual admin confirmation and offline payment processing. The architecture prioritizes mobile-first design, local SEO optimization, and robust availability management to prevent double-booking.

### Key Design Principles

- **Guest-First Experience**: No authentication barriers, streamlined booking flow
- **Mobile-First Design**: Optimized for smartphone users with touch-friendly interfaces
- **Availability Integrity**: Strict validation to prevent overlapping bookings
- **Local SEO Focus**: Optimized for "Thane taxi service" and related searches
- **Admin Efficiency**: Comprehensive admin panel for booking and business management
- **Future-Ready**: Architecture supports multi-vehicle expansion

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive, mobile-first design
- **State Management**: React Context API + React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Maps Integration**: @react-google-maps/api
- **Date/Time Picker**: react-datepicker
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful JSON API
- **Validation**: Zod for request/response validation
- **Authentication**: JWT for admin sessions
- **Password Hashing**: bcrypt

### Database
- **Primary Database**: PostgreSQL 15
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Connection Pooling**: PgBouncer for production

### Email Service
- **Provider**: SendGrid (transactional email API)
- **Templates**: HTML email templates with inline CSS
- **Retry Logic**: Exponential backoff with 3 retry attempts

### Hosting & Infrastructure
- **Frontend Hosting**: Vercel (automatic deployments, CDN, SSL)
- **Backend Hosting**: Railway or Render (Node.js hosting with PostgreSQL)
- **Domain & DNS**: Namecheap or GoDaddy
- **SSL**: Automatic via hosting provider (Let's Encrypt)
- **Monitoring**: Sentry for error tracking, Uptime Robot for availability

### External APIs
- **Google Maps Platform**:
  - Places API (autocomplete)
  - Geocoding API (address to coordinates)
  - Distance Matrix API (route calculation)
  - Maps JavaScript API (map display)
- **Google Analytics**: GA4 for usage tracking

### Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier
- **Testing**: Vitest (unit), Playwright (E2E)
- **Environment Management**: dotenv


## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Mobile[Mobile Browser]
        Desktop[Desktop Browser]
    end
    
    subgraph "CDN Layer"
        Vercel[Vercel CDN]
    end
    
    subgraph "Application Layer"
        React[React SPA]
        Express[Express API Server]
    end
    
    subgraph "Data Layer"
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        GMaps[Google Maps APIs]
        SendGrid[SendGrid Email]
        Analytics[Google Analytics]
    end
    
    Mobile --> Vercel
    Desktop --> Vercel
    Vercel --> React
    React --> Express
    Express --> Postgres
    Express --> Redis
    Express --> GMaps
    Express --> SendGrid
    React --> GMaps
    React --> Analytics

```

### Component Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        BookingFlow[Booking Flow Controller]
        LocationPicker[Location Picker]
        DateTimePicker[Date/Time Picker]
        PriceCalculator[Price Display]
        TrackBooking[Booking Tracker]
    end
    
    subgraph "Backend Services"
        BookingService[Booking Service]
        AvailabilityService[Availability Service]
        PricingService[Pricing Service]
        EmailService[Email Service]
        AuthService[Auth Service]
    end
    
    subgraph "Data Access Layer"
        BookingRepo[Booking Repository]
        VehicleRepo[Vehicle Repository]
        PricingRepo[Pricing Repository]
        AdminRepo[Admin Repository]
    end
    
    BookingFlow --> BookingService
    LocationPicker --> BookingService
    DateTimePicker --> AvailabilityService
    PriceCalculator --> PricingService
    TrackBooking --> BookingService
    
    BookingService --> BookingRepo
    BookingService --> EmailService
    AvailabilityService --> BookingRepo
    AvailabilityService --> VehicleRepo
    PricingService --> PricingRepo
    AuthService --> AdminRepo
```

### Request Flow

**Guest Booking Flow**:
1. User fills booking form (4 steps)
2. Frontend validates input and checks availability via API
3. Backend validates request, checks vehicle availability
4. Backend creates booking record with "Pending" status
5. Backend triggers email notifications (customer + admin)
6. Frontend displays confirmation with booking reference

**Admin Confirmation Flow**:
1. Admin logs into admin panel
2. Admin views pending bookings
3. Admin reviews booking details
4. Admin confirms or cancels booking
5. Backend updates booking status
6. Backend triggers customer notification email
7. If confirmed, vehicle calendar is blocked


## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    BOOKINGS ||--o{ BOOKING_HISTORY : has
    VEHICLES ||--o{ BOOKINGS : assigned_to
    VEHICLES ||--o{ VEHICLE_BLOCKS : has
    PRICING_CONFIG ||--|| PRICING_HISTORY : tracks
    ADMINS ||--o{ BOOKING_HISTORY : creates
    
    BOOKINGS {
        uuid id PK
        string reference_number UK
        uuid vehicle_id FK
        enum trip_type
        enum status
        string pickup_address
        decimal pickup_lat
        decimal pickup_lng
        string drop_address
        decimal drop_lat
        decimal drop_lng
        decimal distance_km
        int travel_time_minutes
        datetime departure_datetime
        datetime return_datetime
        string customer_name
        string customer_phone
        string customer_email
        int passenger_count
        text special_instructions
        decimal base_fare
        decimal distance_charge
        decimal discount_amount
        decimal total_fare
        decimal actual_distance_km
        decimal final_fare
        datetime created_at
        datetime updated_at
    }
    
    VEHICLES {
        uuid id PK
        string registration_number UK
        string model
        int seating_capacity
        enum status
        text features
        datetime created_at
        datetime updated_at
    }
    
    VEHICLE_BLOCKS {
        uuid id PK
        uuid vehicle_id FK
        datetime start_datetime
        datetime end_datetime
        string reason
        uuid booking_id FK
        datetime created_at
    }
    
    PRICING_CONFIG {
        uuid id PK
        string package_name
        int duration_hours
        int included_km
        decimal package_price
        decimal extra_km_rate
        decimal extra_hour_rate
        boolean is_active
        datetime effective_from
        int display_order
        datetime created_at
    }
    
    PRICING_HISTORY {
        uuid id PK
        uuid pricing_config_id FK
        string package_name
        int duration_hours
        int included_km
        decimal package_price
        decimal extra_km_rate
        decimal extra_hour_rate
        datetime changed_at
        uuid changed_by FK
    }
    
    ADMINS {
        uuid id PK
        string username UK
        string email UK
        string password_hash
        string reset_token
        datetime reset_token_expires
        datetime last_login
        datetime created_at
        datetime updated_at
    }
    
    BOOKING_HISTORY {
        uuid id PK
        uuid booking_id FK
        enum previous_status
        enum new_status
        uuid changed_by FK
        text notes
        datetime changed_at
    }
    
    POPULAR_ROUTES {
        uuid id PK
        string destination_name
        string destination_address
        decimal destination_lat
        decimal destination_lng
        decimal distance_km
        int travel_time_minutes
        int display_order
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    TESTIMONIALS {
        uuid id PK
        string customer_name
        text review_text
        int rating
        boolean is_featured
        boolean is_active
        datetime review_date
        datetime created_at
        datetime updated_at
    }
    
    FAQS {
        uuid id PK
        text question
        text answer
        int display_order
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    CONTACT_INQUIRIES {
        uuid id PK
        string name
        string email
        string phone
        text message
        enum status
        text admin_notes
        datetime created_at
        datetime responded_at
    }
    
    RATE_LIMITS {
        uuid id PK
        string ip_address
        string endpoint
        int request_count
        datetime window_start
        datetime blocked_until
    }
```


### Schema Details

#### Bookings Table
- **id**: UUID primary key
- **reference_number**: Unique 8-character alphanumeric (e.g., "ATT-A7K9M2")
- **vehicle_id**: Foreign key to vehicles (prepared for multi-vehicle)
- **trip_type**: ENUM('ONE_WAY', 'ROUND_TRIP')
- **status**: ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')
- **pickup/drop coordinates**: Decimal(10,7) for latitude, Decimal(10,7) for longitude
- **distance_km**: Decimal(8,2) - calculated from Google Maps
- **travel_time_minutes**: Integer - estimated travel time
- **departure_datetime**: Timestamp with timezone
- **return_datetime**: Nullable timestamp (only for round trips)
- **customer_phone**: VARCHAR(15) with validation
- **customer_email**: VARCHAR(255) with validation
- **passenger_count**: Integer (1-7 for Ertiga)
- **actual_distance_km**: Nullable decimal - filled when trip completed
- **final_fare**: Nullable decimal - actual charged amount

**Indexes**:
- `idx_bookings_reference` on reference_number (unique)
- `idx_bookings_status` on status
- `idx_bookings_vehicle_datetime` on (vehicle_id, departure_datetime)
- `idx_bookings_customer_email` on customer_email
- `idx_bookings_created_at` on created_at

#### Vehicles Table
- **id**: UUID primary key
- **registration_number**: VARCHAR(20) unique (e.g., "MH-04-AB-1234")
- **model**: VARCHAR(100) (e.g., "Maruti Suzuki Ertiga")
- **seating_capacity**: Integer (7 for Ertiga)
- **status**: ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE')
- **features**: JSONB - array of features (AC, Music System, etc.)

**Initial Data**: Single Ertiga record created during setup

#### Vehicle_Blocks Table
- **id**: UUID primary key
- **vehicle_id**: Foreign key to vehicles
- **start_datetime**: Timestamp - block start time
- **end_datetime**: Timestamp - block end time
- **reason**: VARCHAR(255) - "BOOKING", "MAINTENANCE", "PERSONAL"
- **booking_id**: Nullable foreign key (null for manual blocks)

**Purpose**: Tracks all time periods when vehicle is unavailable

**Indexes**:
- `idx_vehicle_blocks_vehicle_time` on (vehicle_id, start_datetime, end_datetime)
- `idx_vehicle_blocks_booking` on booking_id

#### Pricing_Config Table
- **id**: UUID primary key
- **package_name**: VARCHAR(50) - e.g., "2 Hours", "4 Hours"
- **duration_hours**: Integer - package duration in hours
- **included_km**: Integer - kilometers included in package
- **package_price**: Decimal(10,2) - fixed package price
- **extra_km_rate**: Decimal(10,2) - rate per extra kilometer
- **extra_hour_rate**: Decimal(10,2) - rate per extra hour
- **is_active**: Boolean - only one active config at a time
- **effective_from**: Timestamp - when pricing takes effect
- **display_order**: Integer - order for display

**Standard Packages**:
- 2 Hours: 20 km, ₹1,200
- 4 Hours: 40 km, ₹1,400
- 6 Hours: 60 km, ₹1,800
- 8 Hours: 80 km, ₹2,500
- 10 Hours: 100 km, ₹3,500
- 12 Hours: 120 km, ₹4,000

**Extra Charges**:
- Extra kilometer: ₹15/km
- Extra hour: ₹150/hour

**Constraints**: Unique constraint on (is_active=true) ensures single active config

#### Rate_Limits Table
- **ip_address**: VARCHAR(45) - supports IPv6
- **endpoint**: VARCHAR(255) - API endpoint path
- **request_count**: Integer - requests in current window
- **window_start**: Timestamp - start of rate limit window
- **blocked_until**: Nullable timestamp - temporary block expiry

**Indexes**:
- `idx_rate_limits_ip_endpoint` on (ip_address, endpoint)


## REST API Structure

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.adityatours.com/api`

### Authentication
- **Admin endpoints**: Require `Authorization: Bearer <JWT_TOKEN>` header
- **Guest endpoints**: No authentication required
- **JWT expiry**: 24 hours
- **Refresh strategy**: Re-login required after expiry

### API Endpoints

#### Public Booking Endpoints

**POST /api/bookings**
Create a new booking request

Request:
```json
{
  "tripType": "ONE_WAY" | "ROUND_TRIP",
  "pickupAddress": "string",
  "pickupLat": number,
  "pickupLng": number,
  "dropAddress": "string",
  "dropLat": number,
  "dropLng": number,
  "distanceKm": number,
  "travelTimeMinutes": number,
  "departureDatetime": "ISO8601 string",
  "returnDatetime": "ISO8601 string | null",
  "customerName": "string",
  "customerPhone": "string",
  "customerEmail": "string",
  "passengerCount": number,
  "specialInstructions": "string | null"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "bookingId": "uuid",
    "referenceNumber": "ATT-A7K9M2",
    "status": "PENDING",
    "estimatedFare": {
      "baseFare": 300,
      "distanceCharge": 1200,
      "discount": 150,
      "total": 1350
    }
  }
}
```

Error Response (400):
```json
{
  "success": false,
  "error": {
    "code": "VEHICLE_UNAVAILABLE",
    "message": "Vehicle is not available for the selected time slot",
    "suggestedDates": ["2024-01-15", "2024-01-16"]
  }
}
```

**GET /api/bookings/check-availability**
Check vehicle availability for a time slot

Query Parameters:
- `departureDatetime`: ISO8601 string
- `returnDatetime`: ISO8601 string (optional)
- `travelTimeMinutes`: number

Response (200):
```json
{
  "success": true,
  "data": {
    "available": true,
    "conflictingBookings": []
  }
}
```

**GET /api/bookings/track/:referenceNumber**
Track booking status

Query Parameters:
- `email`: Customer email for verification

Response (200):
```json
{
  "success": true,
  "data": {
    "referenceNumber": "ATT-A7K9M2",
    "status": "CONFIRMED",
    "tripType": "ONE_WAY",
    "pickupAddress": "Thane Station",
    "dropAddress": "Mumbai Airport",
    "departureDatetime": "2024-01-15T10:00:00Z",
    "customerName": "John Doe",
    "totalFare": 1350,
    "driverContact": "+91-9876543210"
  }
}
```

**GET /api/pricing/calculate**
Calculate fare estimate

Query Parameters:
- `distanceKm`: number
- `durationHours`: number

Response (200):
```json
{
  "success": true,
  "data": {
    "selectedPackage": {
      "name": "4 Hours",
      "durationHours": 4,
      "includedKm": 40,
      "packagePrice": 1400
    },
    "extraKm": 5,
    "extraKmCharge": 75,
    "extraHours": 0,
    "extraHourCharge": 0,
    "total": 1475,
    "disclaimer": "Final fare may vary based on actual distance, duration, and tolls"
  }
}
```

**GET /api/pricing/packages**
Get all available pricing packages

Response (200):
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "uuid",
        "name": "2 Hours",
        "durationHours": 2,
        "includedKm": 20,
        "packagePrice": 1200,
        "displayOrder": 1
      },
      {
        "id": "uuid",
        "name": "4 Hours",
        "durationHours": 4,
        "includedKm": 40,
        "packagePrice": 1400,
        "displayOrder": 2
      }
    ],
    "extraKmRate": 15,
    "extraHourRate": 150
  }
}
```


#### Public Content Endpoints

**GET /api/popular-routes**
Get list of popular routes

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "destinationName": "Mumbai Airport",
      "destinationAddress": "Chhatrapati Shivaji Maharaj International Airport",
      "distanceKm": 35,
      "travelTimeMinutes": 60,
      "estimatedFare": 720
    }
  ]
}
```

**GET /api/testimonials**
Get active testimonials

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "customerName": "Rajesh Kumar",
      "reviewText": "Excellent service! Very punctual and professional.",
      "rating": 5,
      "reviewDate": "2024-01-10"
    }
  ]
}
```

**GET /api/faqs**
Get active FAQs

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "What payment methods do you accept?",
      "answer": "We accept cash and UPI payments after the trip."
    }
  ]
}
```

**POST /api/contact**
Submit contact inquiry

Request:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Your inquiry has been submitted. We'll respond within 24 hours."
}
```


#### Admin Authentication Endpoints

**POST /api/admin/auth/login**
Admin login

Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_string",
    "expiresIn": 86400,
    "admin": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@adityatours.com"
    }
  }
}
```

**POST /api/admin/auth/logout**
Admin logout (invalidate token)

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**POST /api/admin/auth/forgot-password**
Request password reset

Request:
```json
{
  "email": "string"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**POST /api/admin/auth/reset-password**
Reset password with token

Request:
```json
{
  "token": "string",
  "newPassword": "string"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```


#### Admin Booking Management Endpoints

**GET /api/admin/bookings**
List all bookings with filters

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `status`: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
- `startDate`: ISO8601 date
- `endDate`: ISO8601 date
- `page`: number (default: 1)
- `limit`: number (default: 20)

Response (200):
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "referenceNumber": "ATT-A7K9M2",
        "status": "PENDING",
        "tripType": "ONE_WAY",
        "customerName": "John Doe",
        "customerPhone": "+91-9876543210",
        "customerEmail": "john@example.com",
        "pickupAddress": "Thane Station",
        "dropAddress": "Mumbai Airport",
        "departureDatetime": "2024-01-15T10:00:00Z",
        "totalFare": 1350,
        "createdAt": "2024-01-10T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**GET /api/admin/bookings/:id**
Get booking details

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "ATT-A7K9M2",
    "status": "PENDING",
    "tripType": "ONE_WAY",
    "pickupAddress": "Thane Station, Thane West",
    "pickupLat": 19.1871,
    "pickupLng": 72.9786,
    "dropAddress": "Mumbai Airport Terminal 2",
    "dropLat": 19.0896,
    "dropLng": 72.8656,
    "distanceKm": 35.5,
    "travelTimeMinutes": 60,
    "departureDatetime": "2024-01-15T10:00:00Z",
    "returnDatetime": null,
    "customerName": "John Doe",
    "customerPhone": "+91-9876543210",
    "customerEmail": "john@example.com",
    "passengerCount": 4,
    "specialInstructions": "Please call 10 minutes before arrival",
    "baseFare": 300,
    "distanceCharge": 1200,
    "discountAmount": 150,
    "totalFare": 1350,
    "actualDistanceKm": null,
    "finalFare": null,
    "createdAt": "2024-01-10T15:30:00Z",
    "updatedAt": "2024-01-10T15:30:00Z",
    "history": [
      {
        "previousStatus": null,
        "newStatus": "PENDING",
        "changedBy": null,
        "changedAt": "2024-01-10T15:30:00Z",
        "notes": "Booking created"
      }
    ]
  }
}
```

**PATCH /api/admin/bookings/:id/confirm**
Confirm a booking

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "notes": "string (optional)"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    "updatedAt": "2024-01-11T09:00:00Z"
  }
}
```

**PATCH /api/admin/bookings/:id/cancel**
Cancel a booking

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "reason": "string",
  "notes": "string (optional)"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "updatedAt": "2024-01-11T09:00:00Z"
  }
}
```

**PATCH /api/admin/bookings/:id/complete**
Mark booking as completed

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "actualDistanceKm": number,
  "finalFare": number,
  "notes": "string (optional)"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "actualDistanceKm": 37.2,
    "finalFare": 1400,
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```


#### Admin Calendar & Analytics Endpoints

**GET /api/admin/calendar**
Get calendar view of bookings

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `year`: number
- `month`: number (1-12)

Response (200):
```json
{
  "success": true,
  "data": {
    "year": 2024,
    "month": 1,
    "bookings": [
      {
        "id": "uuid",
        "referenceNumber": "ATT-A7K9M2",
        "date": "2024-01-15",
        "startTime": "10:00",
        "endTime": "12:00",
        "tripType": "ONE_WAY",
        "customerName": "John Doe",
        "route": "Thane → Mumbai Airport",
        "status": "CONFIRMED"
      }
    ]
  }
}
```

**GET /api/admin/analytics/dashboard**
Get dashboard statistics

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `startDate`: ISO8601 date (optional)
- `endDate`: ISO8601 date (optional)

Response (200):
```json
{
  "success": true,
  "data": {
    "totalBookings": 156,
    "pendingBookings": 8,
    "confirmedBookings": 12,
    "completedBookings": 130,
    "cancelledBookings": 6,
    "totalRevenue": 187500,
    "averageBookingValue": 1442,
    "conversionRate": 92.3,
    "popularRoutes": [
      {
        "route": "Thane → Mumbai Airport",
        "count": 45,
        "revenue": 67500
      }
    ],
    "bookingTrends": [
      {
        "date": "2024-01-01",
        "bookings": 5,
        "revenue": 6750
      }
    ]
  }
}
```

**GET /api/admin/analytics/reports**
Generate monthly report

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `year`: number
- `month`: number

Response (200):
```json
{
  "success": true,
  "data": {
    "period": "January 2024",
    "totalBookings": 45,
    "completedTrips": 42,
    "totalDistance": 1580,
    "totalRevenue": 56700,
    "averageFare": 1350,
    "topRoutes": [...],
    "dailyBreakdown": [...]
  }
}
```


#### Admin Content Management Endpoints

**GET /api/admin/pricing**
Get pricing configuration

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "uuid",
        "name": "2 Hours",
        "durationHours": 2,
        "includedKm": 20,
        "packagePrice": 1200,
        "displayOrder": 1
      }
    ],
    "extraKmRate": 15,
    "extraHourRate": 150,
    "effectiveFrom": "2024-01-01T00:00:00Z"
  }
}
```

**PUT /api/admin/pricing/packages/:id**
Update pricing package

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "packagePrice": number,
  "effectiveFrom": "ISO8601 string (optional)"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "2 Hours",
    "durationHours": 2,
    "includedKm": 20,
    "packagePrice": 1300,
    "effectiveFrom": "2024-02-01T00:00:00Z"
  }
}
```

**PUT /api/admin/pricing/extra-rates**
Update extra kilometer and hour rates

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "extraKmRate": number,
  "extraHourRate": number,
  "effectiveFrom": "ISO8601 string (optional)"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "extraKmRate": 16,
    "extraHourRate": 160,
    "effectiveFrom": "2024-02-01T00:00:00Z"
  }
}
```

**GET /api/admin/popular-routes**
Get all popular routes (admin view)

Headers: `Authorization: Bearer <token>`

**POST /api/admin/popular-routes**
Create popular route

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "destinationName": "string",
  "destinationAddress": "string",
  "destinationLat": number,
  "destinationLng": number,
  "distanceKm": number,
  "travelTimeMinutes": number,
  "displayOrder": number
}
```

**PUT /api/admin/popular-routes/:id**
Update popular route

**DELETE /api/admin/popular-routes/:id**
Delete popular route

**GET /api/admin/testimonials**
Get all testimonials (admin view)

**POST /api/admin/testimonials**
Create testimonial

Request:
```json
{
  "customerName": "string",
  "reviewText": "string",
  "rating": number (1-5),
  "isFeatured": boolean,
  "reviewDate": "ISO8601 string"
}
```

**PUT /api/admin/testimonials/:id**
Update testimonial

**DELETE /api/admin/testimonials/:id**
Delete testimonial

**GET /api/admin/faqs**
Get all FAQs (admin view)

**POST /api/admin/faqs**
Create FAQ

Request:
```json
{
  "question": "string",
  "answer": "string",
  "displayOrder": number
}
```

**PUT /api/admin/faqs/:id**
Update FAQ

**DELETE /api/admin/faqs/:id**
Delete FAQ

**GET /api/admin/contact-inquiries**
Get contact inquiries

Query Parameters:
- `status`: "NEW" | "IN_PROGRESS" | "RESOLVED"
- `page`: number
- `limit`: number

**PATCH /api/admin/contact-inquiries/:id**
Update inquiry status

Request:
```json
{
  "status": "IN_PROGRESS" | "RESOLVED",
  "adminNotes": "string"
}
```


#### Admin Vehicle Management Endpoints

**GET /api/admin/vehicles**
Get all vehicles

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "registrationNumber": "MH-04-AB-1234",
      "model": "Maruti Suzuki Ertiga",
      "seatingCapacity": 7,
      "status": "ACTIVE",
      "features": ["AC", "Music System", "GPS"],
      "currentBooking": null
    }
  ]
}
```

**POST /api/admin/vehicle-blocks**
Create manual vehicle block

Headers: `Authorization: Bearer <token>`

Request:
```json
{
  "vehicleId": "uuid",
  "startDatetime": "ISO8601 string",
  "endDatetime": "ISO8601 string",
  "reason": "string"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "vehicleId": "uuid",
    "startDatetime": "2024-01-20T00:00:00Z",
    "endDatetime": "2024-01-22T23:59:59Z",
    "reason": "Vehicle maintenance"
  }
}
```

**GET /api/admin/vehicle-blocks**
Get all vehicle blocks

Headers: `Authorization: Bearer <token>`

Query Parameters:
- `vehicleId`: uuid (optional)
- `startDate`: ISO8601 date
- `endDate`: ISO8601 date

**DELETE /api/admin/vehicle-blocks/:id**
Remove manual vehicle block

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "success": true,
  "message": "Vehicle block removed successfully"
}
```


## Components and Interfaces

### Frontend Component Structure

```
src/
├── components/
│   ├── booking/
│   │   ├── BookingFlow.tsx          # Main booking flow controller
│   │   ├── Step1Location.tsx        # Pickup/drop location selection
│   │   ├── Step2DateTime.tsx        # Date/time selection
│   │   ├── Step3CustomerInfo.tsx    # Customer details form
│   │   ├── Step4Summary.tsx         # Booking summary & confirmation
│   │   ├── LocationPicker.tsx       # Google Maps autocomplete
│   │   ├── DateTimePicker.tsx       # Date/time input with validation
│   │   ├── PriceDisplay.tsx         # Fare calculation display
│   │   └── RouteMap.tsx             # Map with route preview
│   ├── tracking/
│   │   ├── TrackBooking.tsx         # Booking tracking form
│   │   └── BookingStatus.tsx        # Status display component
│   ├── home/
│   │   ├── HeroSection.tsx          # Hero with booking CTA
│   │   ├── VehicleDetails.tsx       # Ertiga specifications
│   │   ├── PricingSection.tsx       # Pricing information
│   │   ├── PopularRoutes.tsx        # Popular destinations
│   │   ├── WhyChooseUs.tsx          # Benefits section
│   │   ├── Testimonials.tsx         # Customer reviews
│   │   ├── FAQ.tsx                  # FAQ accordion
│   │   └── ContactSection.tsx       # Contact form & info
│   ├── admin/
│   │   ├── AdminLayout.tsx          # Admin panel layout
│   │   ├── Dashboard.tsx            # Analytics dashboard
│   │   ├── BookingsList.tsx         # Bookings table
│   │   ├── BookingDetails.tsx       # Booking detail view
│   │   ├── CalendarView.tsx         # Calendar with bookings
│   │   ├── PricingManager.tsx       # Pricing configuration
│   │   ├── ContentManager.tsx       # Routes/testimonials/FAQs
│   │   └── VehicleManager.tsx       # Vehicle & blocks management
│   ├── common/
│   │   ├── Header.tsx               # Site header with navigation
│   │   ├── Footer.tsx               # Site footer
│   │   ├── Button.tsx               # Reusable button component
│   │   ├── Input.tsx                # Form input component
│   │   ├── Select.tsx               # Dropdown component
│   │   ├── Modal.tsx                # Modal dialog
│   │   ├── Toast.tsx                # Notification toast
│   │   ├── Loader.tsx               # Loading spinner
│   │   └── ErrorBoundary.tsx        # Error boundary wrapper
│   └── seo/
│       ├── SEOHead.tsx              # Meta tags component
│       └── StructuredData.tsx       # Schema.org JSON-LD
├── pages/
│   ├── HomePage.tsx
│   ├── BookingPage.tsx
│   ├── TrackBookingPage.tsx
│   ├── ThaneT axiServicePage.tsx    # SEO landing page
│   ├── ThaneAirportTaxiPage.tsx     # SEO landing page
│   ├── ThaneOutstationCabPage.tsx   # SEO landing page
│   ├── ThaneErtigaCabPage.tsx       # SEO landing page
│   ├── ContactPage.tsx
│   ├── PrivacyPolicyPage.tsx
│   ├── TermsOfServicePage.tsx
│   └── admin/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── BookingsPage.tsx
│       ├── CalendarPage.tsx
│       ├── SettingsPage.tsx
│       └── ContentPage.tsx
├── hooks/
│   ├── useBooking.ts                # Booking state management
│   ├── useAvailability.ts           # Availability checking
│   ├── usePricing.ts                # Pricing calculations
│   ├── useGoogleMaps.ts             # Maps API integration
│   ├── useAuth.ts                   # Admin authentication
│   └── useToast.ts                  # Toast notifications
├── services/
│   ├── api.ts                       # API client configuration
│   ├── bookingService.ts            # Booking API calls
│   ├── adminService.ts              # Admin API calls
│   ├── contentService.ts            # Content API calls
│   └── analyticsService.ts          # Google Analytics integration
├── utils/
│   ├── validation.ts                # Form validation schemas
│   ├── dateTime.ts                  # Date/time utilities
│   ├── formatting.ts                # Number/currency formatting
│   └── constants.ts                 # App constants
└── types/
    ├── booking.ts                   # Booking type definitions
    ├── admin.ts                     # Admin type definitions
    └── api.ts                       # API response types
```


### Backend Service Structure

```
src/
├── controllers/
│   ├── bookingController.ts         # Booking endpoints
│   ├── adminController.ts           # Admin endpoints
│   ├── contentController.ts         # Content endpoints
│   └── authController.ts            # Authentication endpoints
├── services/
│   ├── bookingService.ts            # Booking business logic
│   ├── availabilityService.ts       # Availability checking
│   ├── pricingService.ts            # Fare calculations
│   ├── emailService.ts              # Email sending
│   ├── authService.ts               # JWT & password handling
│   └── analyticsService.ts          # Statistics & reports
├── repositories/
│   ├── bookingRepository.ts         # Booking data access
│   ├── vehicleRepository.ts         # Vehicle data access
│   ├── pricingRepository.ts         # Pricing data access
│   ├── adminRepository.ts           # Admin data access
│   └── contentRepository.ts         # Content data access
├── middleware/
│   ├── auth.ts                      # JWT verification
│   ├── validation.ts                # Request validation
│   ├── rateLimit.ts                 # Rate limiting
│   ├── errorHandler.ts              # Global error handler
│   └── logger.ts                    # Request logging
├── utils/
│   ├── referenceGenerator.ts        # Booking reference generation
│   ├── dateTime.ts                  # Date/time utilities
│   ├── validation.ts                # Validation schemas
│   └── constants.ts                 # App constants
├── config/
│   ├── database.ts                  # Prisma client
│   ├── email.ts                     # SendGrid configuration
│   ├── maps.ts                      # Google Maps configuration
│   └── env.ts                       # Environment variables
├── types/
│   ├── booking.ts                   # Booking types
│   ├── admin.ts                     # Admin types
│   └── api.ts                       # API types
└── templates/
    ├── emails/
    │   ├── bookingConfirmation.html
    │   ├── adminNotification.html
    │   ├── bookingConfirmed.html
    │   ├── bookingCancelled.html
    │   └── passwordReset.html
    └── seo/
        └── sitemap.xml
```

### Key Interfaces

#### Booking Interface
```typescript
interface Booking {
  id: string;
  referenceNumber: string;
  vehicleId: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  
  // Location data
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropAddress: string;
  dropLat: number;
  dropLng: number;
  
  // Trip data
  distanceKm: number;
  travelTimeMinutes: number;
  departureDatetime: Date;
  returnDatetime: Date | null;
  
  // Customer data
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengerCount: number;
  specialInstructions: string | null;
  
  // Pricing data
  baseFare: number;
  distanceCharge: number;
  discountAmount: number;
  totalFare: number;
  actualDistanceKm: number | null;
  finalFare: number | null;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

#### Availability Check Interface
```typescript
interface AvailabilityCheck {
  vehicleId: string;
  departureDatetime: Date;
  returnDatetime: Date | null;
  travelTimeMinutes: number;
  bufferMinutes: number; // Default: 120
}

interface AvailabilityResult {
  available: boolean;
  conflictingBookings: Array<{
    id: string;
    referenceNumber: string;
    startTime: Date;
    endTime: Date;
  }>;
  suggestedDates: string[]; // ISO date strings
}
```

#### Pricing Calculation Interface
```typescript
interface PricingInput {
  distanceKm: number;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
}

interface PricingResult {
  baseFare: number;
  perKmRate: number;
  distanceCharge: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  disclaimer: string;
}
```

#### Email Template Interface
```typescript
interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface BookingEmailData {
  customerName: string;
  referenceNumber: string;
  tripType: string;
  pickupAddress: string;
  dropAddress: string;
  departureDatetime: string;
  returnDatetime?: string;
  totalFare: number;
  driverContact?: string;
}
```


## Data Models

### Booking State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING: Customer submits booking
    PENDING --> CONFIRMED: Admin confirms
    PENDING --> CANCELLED: Admin/Customer cancels
    CONFIRMED --> COMPLETED: Trip finished
    CONFIRMED --> CANCELLED: Admin cancels
    CANCELLED --> [*]
    COMPLETED --> [*]
    
    note right of PENDING
        - Vehicle not blocked
        - Customer notified
        - Admin notified
    end note
    
    note right of CONFIRMED
        - Vehicle blocked
        - Customer notified
        - Calendar updated
    end note
    
    note right of COMPLETED
        - Vehicle released
        - Final fare recorded
        - Statistics updated
    end note
    
    note right of CANCELLED
        - Vehicle released (if was blocked)
        - Customer notified
        - Reason recorded
    end note
```

### Vehicle Availability Algorithm

The availability checker ensures no overlapping bookings by calculating time blocks:

**For One-Way Trips**:
```
Block Start = Departure DateTime
Block End = Departure DateTime + Travel Time + Buffer (2 hours)
```

**For Round Trips**:
```
Block Start = Departure DateTime
Block End = Return DateTime + Travel Time + Buffer (2 hours)
```

**Availability Check Logic**:
```typescript
function checkAvailability(request: AvailabilityCheck): AvailabilityResult {
  const requestStart = request.departureDatetime;
  const requestEnd = calculateBlockEnd(request);
  
  // Query all confirmed bookings and manual blocks for the vehicle
  const existingBlocks = getVehicleBlocks(
    request.vehicleId,
    requestStart,
    requestEnd
  );
  
  // Check for overlaps
  const conflicts = existingBlocks.filter(block => {
    return (
      (requestStart >= block.startDatetime && requestStart < block.endDatetime) ||
      (requestEnd > block.startDatetime && requestEnd <= block.endDatetime) ||
      (requestStart <= block.startDatetime && requestEnd >= block.endDatetime)
    );
  });
  
  if (conflicts.length > 0) {
    return {
      available: false,
      conflictingBookings: conflicts,
      suggestedDates: generateSuggestedDates(request, existingBlocks)
    };
  }
  
  return {
    available: true,
    conflictingBookings: [],
    suggestedDates: []
  };
}

function calculateBlockEnd(request: AvailabilityCheck): Date {
  if (request.returnDatetime) {
    // Round trip: return time + travel time + buffer
    return addMinutes(
      request.returnDatetime,
      request.travelTimeMinutes + request.bufferMinutes
    );
  } else {
    // One-way: departure time + travel time + buffer
    return addMinutes(
      request.departureDatetime,
      request.travelTimeMinutes + request.bufferMinutes
    );
  }
}

function generateSuggestedDates(
  request: AvailabilityCheck,
  existingBlocks: VehicleBlock[]
): string[] {
  const suggestions: string[] = [];
  const requestDuration = calculateDuration(request);
  
  // Find next 3 available dates within 30 days
  let currentDate = addDays(request.departureDatetime, 1);
  const maxDate = addDays(request.departureDatetime, 30);
  
  while (suggestions.length < 3 && currentDate <= maxDate) {
    const testStart = setTime(currentDate, getTime(request.departureDatetime));
    const testEnd = addMinutes(testStart, requestDuration);
    
    const hasConflict = existingBlocks.some(block =>
      overlaps(testStart, testEnd, block.startDatetime, block.endDatetime)
    );
    
    if (!hasConflict) {
      suggestions.push(formatDate(currentDate));
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return suggestions;
}
```

### Pricing Calculation Algorithm

```typescript
interface PricingPackage {
  id: string;
  name: string;
  durationHours: number;
  includedKm: number;
  packagePrice: number;
  displayOrder: number;
}

interface PricingConfig {
  packages: PricingPackage[];
  extraKmRate: number;
  extraHourRate: number;
}

interface PricingInput {
  distanceKm: number;
  durationHours: number;
}

interface PricingResult {
  selectedPackage: PricingPackage;
  extraKm: number;
  extraKmCharge: number;
  extraHours: number;
  extraHourCharge: number;
  total: number;
  disclaimer: string;
}

function calculateFare(input: PricingInput): PricingResult {
  // Get current active pricing config
  const config = getActivePricingConfig();
  
  // Find the best matching package
  // Package must have duration >= estimated duration
  const suitablePackages = config.packages.filter(
    pkg => pkg.durationHours >= input.durationHours
  );
  
  // Select the smallest suitable package (most economical)
  const selectedPackage = suitablePackages.sort(
    (a, b) => a.durationHours - b.durationHours
  )[0];
  
  if (!selectedPackage) {
    // If no package fits, use the largest package
    selectedPackage = config.packages.sort(
      (a, b) => b.durationHours - a.durationHours
    )[0];
  }
  
  // Calculate extra charges
  const extraKm = Math.max(0, input.distanceKm - selectedPackage.includedKm);
  const extraKmCharge = extraKm * config.extraKmRate;
  
  const extraHours = Math.max(0, input.durationHours - selectedPackage.durationHours);
  const extraHourCharge = extraHours * config.extraHourRate;
  
  const total = selectedPackage.packagePrice + extraKmCharge + extraHourCharge;
  
  return {
    selectedPackage,
    extraKm: Math.round(extraKm * 10) / 10,
    extraKmCharge: Math.round(extraKmCharge),
    extraHours: Math.round(extraHours * 10) / 10,
    extraHourCharge: Math.round(extraHourCharge),
    total: Math.round(total),
    disclaimer: 'Final fare may vary based on actual distance, duration, and tolls'
  };
}
```

### Reference Number Generation

```typescript
function generateReferenceNumber(): string {
  const prefix = 'ATT';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars
  const length = 6;
  
  let reference = '';
  for (let i = 0; i < length; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const fullReference = `${prefix}-${reference}`;
  
  // Check uniqueness in database
  const exists = checkReferenceExists(fullReference);
  if (exists) {
    return generateReferenceNumber(); // Retry if collision
  }
  
  return fullReference;
}
```


## UI/UX Design Specifications

### Design System

**Color Palette**:
- Primary: `#2563EB` (Blue 600) - CTAs, links, active states
- Primary Dark: `#1E40AF` (Blue 700) - Hover states
- Secondary: `#10B981` (Green 500) - Success states, confirmed bookings
- Accent: `#F59E0B` (Amber 500) - Pending states, warnings
- Error: `#EF4444` (Red 500) - Errors, cancelled bookings
- Neutral Gray: `#6B7280` (Gray 500) - Text, borders
- Background: `#F9FAFB` (Gray 50) - Page background
- White: `#FFFFFF` - Cards, modals

**Typography**:
- Font Family: Inter (Google Fonts)
- Headings: 
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 2rem (32px), font-weight: 600
  - H3: 1.5rem (24px), font-weight: 600
  - H4: 1.25rem (20px), font-weight: 600
- Body: 1rem (16px), font-weight: 400
- Small: 0.875rem (14px), font-weight: 400

**Spacing Scale** (Tailwind):
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

**Border Radius**:
- Small: 0.375rem (6px) - Inputs, small buttons
- Medium: 0.5rem (8px) - Cards, large buttons
- Large: 0.75rem (12px) - Modals, hero sections

**Shadows**:
- Small: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- Medium: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- Large: `0 10px 15px -3px rgb(0 0 0 / 0.1)`

**Touch Targets**:
- Minimum size: 44×44 pixels
- Button padding: 12px vertical, 24px horizontal
- Input height: 48px minimum

### Mobile-First Breakpoints

```css
/* Mobile: 320px - 639px (default) */
/* Tablet: 640px - 1023px */
@media (min-width: 640px) { /* sm */ }

/* Desktop: 1024px+ */
@media (min-width: 1024px) { /* lg */ }

/* Large Desktop: 1280px+ */
@media (min-width: 1280px) { /* xl */ }
```

### Homepage Layout

**Hero Section** (Above the fold):
```
┌─────────────────────────────────────┐
│  [Logo]              [☰ Menu]       │
├─────────────────────────────────────┤
│                                     │
│   Reliable Taxi Service in Thane   │
│   Comfortable Ertiga • 7 Seats     │
│                                     │
│   ┌───────────────────────────┐   │
│   │  📍 Pickup Location       │   │
│   ├───────────────────────────┤   │
│   │  📍 Drop Location         │   │
│   ├───────────────────────────┤   │
│   │  ○ One Way  ○ Round Trip  │   │
│   ├───────────────────────────┤   │
│   │  [Book Now →]             │   │
│   └───────────────────────────┘   │
│                                     │
│   ✓ Professional Driver             │
│   ✓ Transparent Pricing             │
│   ✓ 24/7 Service                    │
└─────────────────────────────────────┘
```

**Vehicle Details Section**:
- Large image of Ertiga
- Specifications: 7 seats, AC, luggage space
- Features list with icons
- "Book This Vehicle" CTA

**Pricing Section**:
- Package-based pricing display
- Table showing all packages (2hr, 4hr, 6hr, 8hr, 10hr, 12hr)
- Each package shows: duration, included km, price
- Extra charges display: ₹15/km, ₹150/hour
- Sample calculation example
- "Get Instant Quote" CTA

**Popular Routes Section**:
- Grid of 6 route cards (2 columns mobile, 3 desktop)
- Each card: Destination, distance, time, starting price
- Click to pre-fill booking form

**Why Choose Us Section**:
- 4 benefit cards with icons
- Reliability, Comfort, Professional Driver, Transparent Pricing

**Testimonials Section**:
- Carousel of customer reviews
- 5-star ratings
- Customer names and dates
- Auto-rotate every 5 seconds

**FAQ Section**:
- Accordion with 8-10 common questions
- Expand/collapse animation
- Search functionality

**Contact Section**:
- Phone number (click-to-call)
- WhatsApp button
- Email address
- Contact form
- Business hours

**Footer**:
- Quick links (Home, Book, Track, Contact)
- Service areas
- Social media links
- Legal links (Privacy, Terms)
- Copyright notice


### Booking Flow UI Specifications

**Step Indicator** (All steps):
```
[1 ●]────[2 ○]────[3 ○]────[4 ○]
Location  Date    Details  Confirm
```

**Step 1: Location Selection**

Mobile Layout:
```
┌─────────────────────────────────────┐
│  ← Back          Step 1 of 4        │
├─────────────────────────────────────┤
│  Where are you going?               │
│                                     │
│  Pickup Location *                  │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Search in Thane...         │ │
│  └───────────────────────────────┘ │
│  [Autocomplete suggestions appear]  │
│                                     │
│  Drop Location *                    │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Search anywhere...         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Trip Type *                        │
│  ┌─────────────┐ ┌─────────────┐  │
│  │ ● One Way   │ │ ○ Round Trip│  │
│  └─────────────┘ └─────────────┘  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [Map Preview]                │ │
│  │  📍 → 📍                      │ │
│  │  35 km • 4 hrs estimated      │ │
│  └───────────────────────────────┘ │
│                                     │
│  Recommended Package: 4 Hours       │
│  ₹1,400 (40 km included)            │
│  Estimated Total: ₹1,400            │
│                                     │
│  [Continue to Date & Time →]        │
└─────────────────────────────────────┘
```

Features:
- Google Maps autocomplete with Thane restriction for pickup
- Real-time route preview on map
- Distance and time calculation
- Live fare estimate
- Validation before proceeding

**Step 2: Date & Time Selection**

One-Way Layout:
```
┌─────────────────────────────────────┐
│  ← Back          Step 2 of 4        │
├─────────────────────────────────────┤
│  When do you need the cab?          │
│                                     │
│  Departure Date *                   │
│  ┌───────────────────────────────┐ │
│  │ 📅 Select date                │ │
│  └───────────────────────────────┘ │
│  [Calendar picker opens]            │
│                                     │
│  Departure Time *                   │
│  ┌───────────────────────────────┐ │
│  │ 🕐 Select time                │ │
│  └───────────────────────────────┘ │
│  [Time picker opens]                │
│                                     │
│  ✓ Vehicle available                │
│                                     │
│  [Continue to Details →]            │
└─────────────────────────────────────┘
```

Round-Trip Layout (additional fields):
```
│  Return Date *                      │
│  ┌───────────────────────────────┐ │
│  │ 📅 Select return date         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Return Time *                      │
│  ┌───────────────────────────────┐ │
│  │ 🕐 Select return time         │ │
│  └───────────────────────────────┘ │
```

Features:
- Date picker with disabled past dates
- Time picker in 30-minute intervals
- Real-time availability check
- Visual feedback (✓ available / ✗ unavailable)
- Suggested alternative dates if unavailable
- Validation: return after departure for round trips

**Step 3: Customer Details**

```
┌─────────────────────────────────────┐
│  ← Back          Step 3 of 4        │
├─────────────────────────────────────┤
│  Your Details                       │
│                                     │
│  Full Name *                        │
│  ┌───────────────────────────────┐ │
│  │ Enter your name               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Phone Number *                     │
│  ┌───────────────────────────────┐ │
│  │ +91 |                         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Email Address *                    │
│  ┌───────────────────────────────┐ │
│  │ your@email.com                │ │
│  └───────────────────────────────┘ │
│                                     │
│  Number of Passengers *             │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐     │
│  │1│ │2│ │3│ │4│ │5│ │6│ │7│     │
│  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘     │
│                                     │
│  Special Instructions (Optional)    │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Continue to Summary →]            │
└─────────────────────────────────────┘
```

Features:
- Auto-format phone number
- Email validation
- Passenger count selector (1-7)
- Optional instructions textarea
- Form validation with inline errors

**Step 4: Summary & Confirmation**

```
┌─────────────────────────────────────┐
│  ← Back          Step 4 of 4        │
├─────────────────────────────────────┤
│  Confirm Your Booking               │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Trip Details                  │ │
│  │ ───────────────────────────── │ │
│  │ Thane Station                 │ │
│  │      ↓                        │ │
│  │ Mumbai Airport T2             │ │
│  │                               │ │
│  │ 📅 Jan 15, 2024 • 10:00 AM   │ │
│  │ 🚗 One Way • 35 km            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Customer Details              │ │
│  │ ───────────────────────────── │ │
│  │ John Doe                      │ │
│  │ +91-9876543210                │ │
│  │ john@example.com              │ │
│  │ 4 passengers                  │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Fare Breakdown                │ │
│  │ ───────────────────────────── │ │
│  │ Package: 4 Hours              │ │
│  │ (40 km included)   ₹1,400     │ │
│  │ Extra: 0 km, 0 hrs ₹0         │ │
│  │ ───────────────────────────── │ │
│  │ Total              ₹1,400     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ℹ️ Payment: Cash/UPI after trip   │
│                                     │
│  ☐ I agree to Terms & Conditions   │
│                                     │
│  [Confirm Booking]                  │
└─────────────────────────────────────┘
```

**Confirmation Screen** (After submission):
```
┌─────────────────────────────────────┐
│              ✓                      │
│     Booking Confirmed!              │
│                                     │
│  Your booking reference:            │
│  ┌───────────────────────────────┐ │
│  │      ATT-A7K9M2               │ │
│  └───────────────────────────────┘ │
│                                     │
│  We've sent confirmation emails to: │
│  john@example.com                   │
│                                     │
│  What happens next?                 │
│  1. Admin will review your booking  │
│  2. You'll receive confirmation     │
│     within 2 hours                  │
│  3. Driver will contact you before  │
│     pickup                          │
│                                     │
│  [Track Booking]  [Book Another]    │
│                                     │
│  Need help? Call +91-9876543210     │
└─────────────────────────────────────┘
```


### Admin Panel UI Specifications

**Admin Login Page**:
```
┌─────────────────────────────────────┐
│                                     │
│         🚗 Aditya Tours              │
│         Admin Panel                 │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Username                      │ │
│  │ ┌─────────────────────────┐  │ │
│  │ │                         │  │ │
│  │ └─────────────────────────┘  │ │
│  │                              │ │
│  │ Password                     │ │
│  │ ┌─────────────────────────┐  │ │
│  │ │ ••••••••                │  │ │
│  │ └─────────────────────────┘  │ │
│  │                              │ │
│  │ [Login]                      │ │
│  │                              │ │
│  │ Forgot password?             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Admin Dashboard Layout**:
```
┌─────────────────────────────────────────────────────┐
│ 🚗 Aditya Tours    [Dashboard ▼]    [Admin ▼] [⚙️] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │ Pending  │ │Confirmed │ │Completed │ │Revenue ││
│  │    8     │ │    12    │ │   130    │ │₹187.5K ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
│  Recent Bookings                    [View All →]   │
│  ┌─────────────────────────────────────────────┐  │
│  │ ATT-A7K9M2  John Doe    Thane → Mumbai      │  │
│  │ Jan 15, 10:00 AM        [Confirm] [Cancel]  │  │
│  ├─────────────────────────────────────────────┤  │
│  │ ATT-B3M8N1  Jane Smith  Thane → Pune        │  │
│  │ Jan 16, 2:00 PM         [Confirm] [Cancel]  │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Booking Trends (Last 30 Days)                     │
│  ┌─────────────────────────────────────────────┐  │
│  │         [Line Chart]                        │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Popular Routes                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Thane → Mumbai Airport    45 trips  ₹67.5K  │  │
│  │ Thane → Pune              28 trips  ₹52.0K  │  │
│  │ Thane → Nashik            18 trips  ₹36.0K  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Bookings List Page**:
```
┌─────────────────────────────────────────────────────┐
│ Bookings                                            │
├─────────────────────────────────────────────────────┤
│ [All ▼] [Date Range ▼]              [🔍 Search]    │
├─────────────────────────────────────────────────────┤
│ Ref         Customer    Route          Date    Fare│
│ ATT-A7K9M2  John Doe    Thane→Mumbai  Jan 15  1350│
│ 🟡 PENDING                            10:00 AM     │
│ [View] [Confirm] [Cancel]                          │
├─────────────────────────────────────────────────────┤
│ ATT-B3M8N1  Jane Smith  Thane→Pune    Jan 16  2100│
│ 🟢 CONFIRMED                          2:00 PM      │
│ [View] [Complete] [Cancel]                         │
├─────────────────────────────────────────────────────┤
│                                    [← 1 2 3 4 5 →] │
└─────────────────────────────────────────────────────┘
```

**Booking Detail Modal**:
```
┌─────────────────────────────────────┐
│ Booking Details          [✕]        │
├─────────────────────────────────────┤
│ Reference: ATT-A7K9M2               │
│ Status: 🟡 PENDING                  │
│                                     │
│ Trip Information                    │
│ ─────────────────────────────────   │
│ Type: One Way                       │
│ From: Thane Station                 │
│ To: Mumbai Airport T2               │
│ Date: Jan 15, 2024                  │
│ Time: 10:00 AM                      │
│ Distance: 35 km                     │
│                                     │
│ Customer Information                │
│ ─────────────────────────────────   │
│ Name: John Doe                      │
│ Phone: +91-9876543210 [📞]          │
│ Email: john@example.com [✉️]        │
│ Passengers: 4                       │
│ Instructions: Please call 10 mins   │
│               before arrival        │
│                                     │
│ Pricing                             │
│ ─────────────────────────────────   │
│ Base Fare: ₹300                     │
│ Distance: ₹1,200                    │
│ Total: ₹1,500                       │
│                                     │
│ [Confirm Booking] [Cancel Booking]  │
└─────────────────────────────────────┘
```

**Calendar View**:
```
┌─────────────────────────────────────────────────────┐
│ Calendar                    [← Jan 2024 →]          │
├─────────────────────────────────────────────────────┤
│ Sun  Mon  Tue  Wed  Thu  Fri  Sat                  │
│      1    2    3    4    5    6                    │
│  7   8    9   10   11   12   13                    │
│ 14  [15]  16   17   18   19   20                   │
│     ●●                                              │
│ 21   22   23   24   25   26   27                   │
│ 28   29   30   31                                   │
│                                                     │
│ Selected: January 15, 2024                          │
│ ┌─────────────────────────────────────────────┐    │
│ │ 10:00 AM - 12:00 PM                         │    │
│ │ ATT-A7K9M2 • John Doe                       │    │
│ │ Thane → Mumbai Airport                      │    │
│ │ 🟢 CONFIRMED                                │    │
│ ├─────────────────────────────────────────────┤    │
│ │ 3:00 PM - 8:00 PM                           │    │
│ │ ATT-C5P2Q7 • Jane Smith                     │    │
│ │ Thane → Pune (Round Trip)                   │    │
│ │ 🟡 PENDING                                  │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

**Pricing Management**:
```
┌─────────────────────────────────────┐
│ Pricing Configuration               │
├─────────────────────────────────────┤
│ Pricing Packages                    │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ 2 Hours Package               │  │
│ │ Duration: 2 hours             │  │
│ │ Included KM: 20 km            │  │
│ │ Price (₹)                     │  │
│ │ ┌─────────────────────────┐   │  │
│ │ │ 1200                    │   │  │
│ │ └─────────────────────────┘   │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ 4 Hours Package               │  │
│ │ Duration: 4 hours             │  │
│ │ Included KM: 40 km            │  │
│ │ Price (₹)                     │  │
│ │ ┌─────────────────────────┐   │  │
│ │ │ 1400                    │   │  │
│ │ └─────────────────────────┘   │  │
│ └───────────────────────────────┘  │
│                                     │
│ [... 6hr, 8hr, 10hr, 12hr packages]│
│                                     │
│ Extra Charges                       │
│ ┌───────────────────────────────┐  │
│ │ Extra Kilometer Rate (₹)      │  │
│ │ ┌─────────────────────────┐   │  │
│ │ │ 15                      │   │  │
│ │ └─────────────────────────┘   │  │
│ │                               │  │
│ │ Extra Hour Rate (₹)           │  │
│ │ ┌─────────────────────────┐   │  │
│ │ │ 150                     │   │  │
│ │ └─────────────────────────┘   │  │
│ └───────────────────────────────┘  │
│                                     │
│ Effective From                      │
│ ┌───────────────────────────────┐  │
│ │ 📅 Immediate                  │  │
│ └───────────────────────────────┘  │
│                                     │
│ [Save Changes]                      │
│                                     │
│ Pricing History                     │
│ ┌───────────────────────────────┐  │
│ │ Jan 1, 2024: Packages updated │  │
│ │ Dec 1, 2023: Rates changed    │  │
│ └───────────────────────────────┘  │
└─────────────────────────────────────┘
```


## Google Maps Integration

### Maps API Configuration

**Required APIs**:
1. **Places API** - Autocomplete for location search
2. **Geocoding API** - Convert addresses to coordinates
3. **Distance Matrix API** - Calculate route distance and time
4. **Maps JavaScript API** - Display interactive maps

**API Key Setup**:
- Separate keys for development and production
- Restrict production key to domain: `adityatours.com`
- Enable only required APIs
- Set usage quotas and billing alerts

### Location Autocomplete Implementation

```typescript
interface AutocompleteConfig {
  componentRestrictions?: {
    country: string; // 'in' for India
  };
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  types?: string[]; // ['geocode', 'establishment']
}

// Pickup location: Restricted to Thane
const pickupConfig: AutocompleteConfig = {
  componentRestrictions: { country: 'in' },
  bounds: {
    north: 19.2500,
    south: 19.1500,
    east: 72.9900,
    west: 72.9500
  },
  types: ['geocode', 'establishment']
};

// Drop location: No restrictions
const dropConfig: AutocompleteConfig = {
  componentRestrictions: { country: 'in' },
  types: ['geocode', 'establishment']
};

function initAutocomplete(
  inputElement: HTMLInputElement,
  config: AutocompleteConfig,
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
) {
  const autocomplete = new google.maps.places.Autocomplete(
    inputElement,
    config
  );
  
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      // User entered invalid place
      showError('Please select a valid location from the suggestions');
      return;
    }
    
    onPlaceSelected(place);
  });
}
```

### Route Calculation

```typescript
interface RouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface RouteResult {
  distanceKm: number;
  travelTimeMinutes: number;
  polyline: string; // Encoded polyline for map display
}

async function calculateRoute(request: RouteRequest): Promise<RouteResult> {
  const service = new google.maps.DistanceMatrixService();
  
  const response = await service.getDistanceMatrix({
    origins: [request.origin],
    destinations: [request.destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  });
  
  if (response.rows[0].elements[0].status !== 'OK') {
    throw new Error('Unable to calculate route');
  }
  
  const element = response.rows[0].elements[0];
  
  return {
    distanceKm: Math.round(element.distance.value / 1000 * 10) / 10,
    travelTimeMinutes: Math.round(element.duration.value / 60),
    polyline: await getDirectionsPolyline(request.origin, request.destination)
  };
}

async function getDirectionsPolyline(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<string> {
  const directionsService = new google.maps.DirectionsService();
  
  const result = await directionsService.route({
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING
  });
  
  return result.routes[0].overview_polyline;
}
```

### Map Display Component

```typescript
interface MapDisplayProps {
  origin: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  polyline?: string;
}

function RouteMapDisplay({ origin, destination, polyline }: MapDisplayProps) {
  const mapRef = useRef<google.maps.Map>();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers and polylines
    // ... clearing logic
    
    // Add origin marker
    new google.maps.Marker({
      position: origin,
      map,
      label: 'A',
      title: origin.address
    });
    
    // Add destination marker
    new google.maps.Marker({
      position: destination,
      map,
      label: 'B',
      title: destination.address
    });
    
    // Draw route polyline if available
    if (polyline) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#2563EB',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map
      });
    }
    
    // Fit bounds to show entire route
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    map.fitBounds(bounds);
    
  }, [map, origin, destination, polyline]);
  
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <GoogleMap
        onLoad={setMap}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative'
        }}
      />
    </div>
  );
}
```

### Performance Optimization

**Lazy Loading**:
```typescript
// Load Maps API only when needed
const loadGoogleMapsScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

// Usage: Load when user starts booking
useEffect(() => {
  if (bookingFlowStarted) {
    loadGoogleMapsScript();
  }
}, [bookingFlowStarted]);
```

**Caching**:
- Cache popular route calculations in Redis (1 hour TTL)
- Cache key: `route:${originLat},${originLng}:${destLat},${destLng}`
- Reduces API calls for frequently searched routes

**Error Handling**:
```typescript
function handleMapsError(error: Error) {
  console.error('Maps API Error:', error);
  
  // Fallback to manual address entry
  showNotification({
    type: 'warning',
    message: 'Unable to load map. Please enter address manually.',
    action: {
      label: 'Enter Manually',
      onClick: () => switchToManualEntry()
    }
  });
  
  // Log error for monitoring
  logError('maps_api_failure', {
    error: error.message,
    timestamp: new Date().toISOString()
  });
}
```


## Email Templates

### Email Service Configuration

**SendGrid Setup**:
```typescript
interface EmailConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

const emailConfig: EmailConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: 'bookings@adityatours.com',
  fromName: 'Aditya Tours and Travels',
  replyTo: 'contact@adityatours.com'
};
```

**Retry Logic**:
```typescript
async function sendEmailWithRetry(
  email: EmailTemplate,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendGridClient.send(email);
      return; // Success
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await sleep(delay);
      }
    }
  }
  
  // All retries failed
  logError('email_send_failed', {
    to: email.to,
    subject: email.subject,
    attempts: maxRetries,
    error: lastError.message
  });
  
  throw new Error(`Failed to send email after ${maxRetries} attempts`);
}
```

### Template 1: Customer Booking Confirmation

**Subject**: Booking Request Received - {{referenceNumber}}

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; }
    .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .reference { font-size: 24px; font-weight: bold; color: #2563EB; text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px; margin: 15px 0; }
    .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Aditya Tours and Travels</h1>
      <p>Booking Request Received</p>
    </div>
    
    <div class="content">
      <p>Dear {{customerName}},</p>
      
      <p>Thank you for choosing Aditya Tours and Travels! We have received your booking request.</p>
      
      <div class="reference">
        Booking Reference: {{referenceNumber}}
      </div>
      
      <div class="booking-details">
        <h3>Trip Details</h3>
        <div class="detail-row">
          <span>Trip Type:</span>
          <strong>{{tripType}}</strong>
        </div>
        <div class="detail-row">
          <span>Pickup:</span>
          <strong>{{pickupAddress}}</strong>
        </div>
        <div class="detail-row">
          <span>Drop:</span>
          <strong>{{dropAddress}}</strong>
        </div>
        <div class="detail-row">
          <span>Date & Time:</span>
          <strong>{{departureDatetime}}</strong>
        </div>
        {{#if returnDatetime}}
        <div class="detail-row">
          <span>Return:</span>
          <strong>{{returnDatetime}}</strong>
        </div>
        {{/if}}
        <div class="detail-row">
          <span>Passengers:</span>
          <strong>{{passengerCount}}</strong>
        </div>
        <div class="detail-row">
          <span>Distance:</span>
          <strong>{{distanceKm}} km</strong>
        </div>
      </div>
      
      <div class="booking-details">
        <h3>Fare Estimate</h3>
        <div class="detail-row">
          <span>Base Fare:</span>
          <span>₹{{baseFare}}</span>
        </div>
        <div class="detail-row">
          <span>Distance Charge:</span>
          <span>₹{{distanceCharge}}</span>
        </div>
        {{#if discountAmount}}
        <div class="detail-row">
          <span>Round Trip Discount:</span>
          <span>-₹{{discountAmount}}</span>
        </div>
        {{/if}}
        <div class="detail-row" style="font-size: 18px; font-weight: bold; border-top: 2px solid #2563EB; margin-top: 10px; padding-top: 10px;">
          <span>Total Fare:</span>
          <span>₹{{totalFare}}</span>
        </div>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Our team will review your booking request</li>
        <li>You'll receive confirmation within 2 hours</li>
        <li>Our driver will contact you before pickup</li>
      </ol>
      
      <p style="text-align: center;">
        <a href="{{trackingUrl}}" class="button">Track Your Booking</a>
      </p>
      
      <p><strong>Payment:</strong> Cash or UPI payment accepted after the trip.</p>
      
      <p><strong>Need to make changes?</strong> Please call us at <a href="tel:+919876543210">+91-9876543210</a> or reply to this email.</p>
    </div>
    
    <div class="footer">
      <p>Aditya Tours and Travels<br>
      Thane, Maharashtra<br>
      Phone: +91-9876543210<br>
      Email: contact@adityatours.com</p>
      
      <p style="font-size: 12px; color: #9ca3af;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
```

### Template 2: Admin Notification

**Subject**: New Booking Request - {{referenceNumber}}

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f59e0b; color: white; padding: 20px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    .booking-details { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .button-cancel { background: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>⚠️ New Booking Request</h2>
      <p>Reference: {{referenceNumber}}</p>
    </div>
    
    <div class="alert">
      <strong>Action Required:</strong> Please review and confirm this booking request.
    </div>
    
    <div class="booking-details">
      <h3>Customer Information</h3>
      <div class="detail-row">
        <strong>Name:</strong> {{customerName}}
      </div>
      <div class="detail-row">
        <strong>Phone:</strong> <a href="tel:{{customerPhone}}">{{customerPhone}}</a>
      </div>
      <div class="detail-row">
        <strong>Email:</strong> <a href="mailto:{{customerEmail}}">{{customerEmail}}</a>
      </div>
      <div class="detail-row">
        <strong>Passengers:</strong> {{passengerCount}}
      </div>
      {{#if specialInstructions}}
      <div class="detail-row">
        <strong>Special Instructions:</strong><br>
        {{specialInstructions}}
      </div>
      {{/if}}
    </div>
    
    <div class="booking-details">
      <h3>Trip Details</h3>
      <div class="detail-row">
        <strong>Type:</strong> {{tripType}}
      </div>
      <div class="detail-row">
        <strong>Pickup:</strong> {{pickupAddress}}
      </div>
      <div class="detail-row">
        <strong>Drop:</strong> {{dropAddress}}
      </div>
      <div class="detail-row">
        <strong>Departure:</strong> {{departureDatetime}}
      </div>
      {{#if returnDatetime}}
      <div class="detail-row">
        <strong>Return:</strong> {{returnDatetime}}
      </div>
      {{/if}}
      <div class="detail-row">
        <strong>Distance:</strong> {{distanceKm}} km ({{travelTimeMinutes}} mins)
      </div>
      <div class="detail-row">
        <strong>Estimated Fare:</strong> ₹{{totalFare}}
      </div>
    </div>
    
    <div style="text-align: center; margin: 20px 0;">
      <a href="{{adminPanelUrl}}/bookings/{{bookingId}}/confirm" class="button">✓ Confirm Booking</a>
      <a href="{{adminPanelUrl}}/bookings/{{bookingId}}/cancel" class="button button-cancel">✗ Cancel Booking</a>
    </div>
    
    <p style="text-align: center;">
      <a href="{{adminPanelUrl}}/bookings/{{bookingId}}">View Full Details in Admin Panel</a>
    </p>
    
    <p style="font-size: 14px; color: #6b7280;">
      Booking created at: {{createdAt}}
    </p>
  </div>
</body>
</html>
```


### Template 3: Booking Confirmed (to Customer)

**Subject**: Booking Confirmed - {{referenceNumber}} - Aditya Tours

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; }
    .success-badge { background: #d1fae5; color: #065f46; padding: 15px; text-align: center; border-radius: 8px; margin: 15px 0; font-size: 18px; font-weight: bold; }
    .booking-details { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .important { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
    .contact-box { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Booking Confirmed!</h1>
    </div>
    
    <div class="success-badge">
      Your booking is confirmed<br>
      Reference: {{referenceNumber}}
    </div>
    
    <p>Dear {{customerName}},</p>
    
    <p>Great news! Your booking with Aditya Tours and Travels has been confirmed. We look forward to serving you.</p>
    
    <div class="booking-details">
      <h3>Your Trip Details</h3>
      <div class="detail-row">
        <strong>Pickup Location:</strong><br>
        {{pickupAddress}}
      </div>
      <div class="detail-row">
        <strong>Drop Location:</strong><br>
        {{dropAddress}}
      </div>
      <div class="detail-row">
        <strong>Date & Time:</strong><br>
        {{departureDatetime}}
      </div>
      {{#if returnDatetime}}
      <div class="detail-row">
        <strong>Return:</strong><br>
        {{returnDatetime}}
      </div>
      {{/if}}
      <div class="detail-row">
        <strong>Vehicle:</strong> Maruti Suzuki Ertiga (7 Seater)
      </div>
      <div class="detail-row">
        <strong>Passengers:</strong> {{passengerCount}}
      </div>
      <div class="detail-row">
        <strong>Fare:</strong> ₹{{totalFare}}
      </div>
    </div>
    
    <div class="important">
      <h4>Important Information:</h4>
      <ul>
        <li>Our driver will contact you 30 minutes before pickup</li>
        <li>Please be ready at the pickup location 5 minutes early</li>
        <li>Payment: Cash or UPI accepted after the trip</li>
        <li>Toll charges (if any) will be added to the final fare</li>
      </ul>
    </div>
    
    <div class="contact-box">
      <h4>Driver Contact</h4>
      <p style="font-size: 18px; margin: 10px 0;">
        📞 <a href="tel:+919876543210">+91-9876543210</a>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        (Driver will call you before pickup)
      </p>
    </div>
    
    <p><strong>Need to make changes or cancel?</strong><br>
    Please call us at least 2 hours before your scheduled pickup time.</p>
    
    <p style="text-align: center; margin: 20px 0;">
      <a href="{{trackingUrl}}" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Your Booking</a>
    </p>
    
    <p>Thank you for choosing Aditya Tours and Travels. Have a safe journey!</p>
    
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; margin-top: 20px;">
      <p>Aditya Tours and Travels<br>
      Thane, Maharashtra<br>
      Phone: +91-9876543210<br>
      Email: contact@adityatours.com</p>
    </div>
  </div>
</body>
</html>
```

### Template 4: Booking Cancelled

**Subject**: Booking Cancelled - {{referenceNumber}}

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
    .cancellation-notice { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
    .booking-details { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Cancelled</h1>
    </div>
    
    <div class="cancellation-notice">
      <strong>Booking Reference: {{referenceNumber}}</strong><br>
      Status: Cancelled
    </div>
    
    <p>Dear {{customerName}},</p>
    
    <p>Your booking with Aditya Tours and Travels has been cancelled.</p>
    
    {{#if cancellationReason}}
    <p><strong>Reason:</strong> {{cancellationReason}}</p>
    {{/if}}
    
    <div class="booking-details">
      <h3>Cancelled Booking Details</h3>
      <p><strong>Route:</strong> {{pickupAddress}} → {{dropAddress}}</p>
      <p><strong>Date:</strong> {{departureDatetime}}</p>
      <p><strong>Fare:</strong> ₹{{totalFare}}</p>
    </div>
    
    <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
    
    <p style="text-align: center;">
      <a href="{{websiteUrl}}/book" class="button">Make a New Booking</a>
    </p>
    
    <p>We hope to serve you again soon!</p>
    
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; margin-top: 20px;">
      <p>Aditya Tours and Travels<br>
      Phone: +91-9876543210<br>
      Email: contact@adityatours.com</p>
    </div>
  </div>
</body>
</html>
```

### Template 5: Password Reset

**Subject**: Reset Your Admin Password - Aditya Tours

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    
    <div class="content">
      <p>Hello,</p>
      
      <p>We received a request to reset your admin password for Aditya Tours and Travels.</p>
      
      <p style="text-align: center;">
        <a href="{{resetUrl}}" class="button">Reset Password</a>
      </p>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 4px;">
        {{resetUrl}}
      </p>
      
      <div class="warning">
        <strong>Security Notice:</strong>
        <ul>
          <li>This link will expire in 1 hour</li>
          <li>If you didn't request this reset, please ignore this email</li>
          <li>Never share this link with anyone</li>
        </ul>
      </div>
      
      <p>If you have any questions, please contact the system administrator.</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
      <p>Aditya Tours and Travels - Admin Panel<br>
      This is an automated security email.</p>
    </div>
  </div>
</body>
</html>
```


## Security Implementation

### Authentication & Authorization

**Admin JWT Implementation**:
```typescript
interface JWTPayload {
  adminId: string;
  username: string;
  email: string;
  iat: number; // Issued at
  exp: number; // Expiry
}

function generateToken(admin: Admin): string {
  const payload: JWTPayload = {
    adminId: admin.id,
    username: admin.username,
    email: admin.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256'
  });
}

function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
}

// Middleware
async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' }
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: error.message }
    });
  }
}
```

**Password Hashing**:
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Password strength validation
function validatePasswordStrength(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}
```

### Rate Limiting

**Implementation**:
```typescript
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs: number;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  booking: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    blockDurationMs: 60 * 60 * 1000 // 1 hour block
  },
  contact: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    blockDurationMs: 60 * 60 * 1000
  },
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    blockDurationMs: 15 * 60 * 1000 // 15 minute block
  }
};

async function checkRateLimit(
  ipAddress: string,
  endpoint: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const config = rateLimitConfigs[endpoint];
  const now = new Date();
  
  // Check if IP is currently blocked
  const block = await prisma.rateLimit.findFirst({
    where: {
      ipAddress,
      endpoint,
      blockedUntil: { gt: now }
    }
  });
  
  if (block) {
    return {
      allowed: false,
      retryAfter: Math.ceil((block.blockedUntil.getTime() - now.getTime()) / 1000)
    };
  }
  
  // Get or create rate limit record
  const windowStart = new Date(now.getTime() - config.windowMs);
  
  let rateLimit = await prisma.rateLimit.findFirst({
    where: {
      ipAddress,
      endpoint,
      windowStart: { gte: windowStart }
    }
  });
  
  if (!rateLimit) {
    // Create new window
    rateLimit = await prisma.rateLimit.create({
      data: {
        ipAddress,
        endpoint,
        requestCount: 1,
        windowStart: now,
        blockedUntil: null
      }
    });
    return { allowed: true };
  }
  
  // Increment request count
  rateLimit = await prisma.rateLimit.update({
    where: { id: rateLimit.id },
    data: { requestCount: { increment: 1 } }
  });
  
  if (rateLimit.requestCount > config.maxRequests) {
    // Block the IP
    const blockedUntil = new Date(now.getTime() + config.blockDurationMs);
    await prisma.rateLimit.update({
      where: { id: rateLimit.id },
      data: { blockedUntil }
    });
    
    return {
      allowed: false,
      retryAfter: Math.ceil(config.blockDurationMs / 1000)
    };
  }
  
  return { allowed: true };
}

// Middleware
async function rateLimitMiddleware(endpoint: string) {
  return async (req, res, next) => {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const result = await checkRateLimit(ipAddress, endpoint);
    
    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter: result.retryAfter
        }
      });
    }
    
    next();
  };
}
```

### Input Validation & Sanitization

**Zod Schemas**:
```typescript
import { z } from 'zod';

// Phone number validation (Indian format)
const phoneSchema = z.string()
  .regex(/^[6-9]\d{9}$/, 'Invalid phone number')
  .transform(val => `+91${val}`);

// Email validation
const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase();

// Booking request validation
const bookingRequestSchema = z.object({
  tripType: z.enum(['ONE_WAY', 'ROUND_TRIP']),
  pickupAddress: z.string().min(5).max(500),
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
  dropAddress: z.string().min(5).max(500),
  dropLat: z.number().min(-90).max(90),
  dropLng: z.number().min(-180).max(180),
  distanceKm: z.number().positive().max(2000),
  travelTimeMinutes: z.number().positive().max(1440),
  departureDatetime: z.string().datetime(),
  returnDatetime: z.string().datetime().nullable(),
  customerName: z.string().min(2).max(100),
  customerPhone: phoneSchema,
  customerEmail: emailSchema,
  passengerCount: z.number().int().min(1).max(7),
  specialInstructions: z.string().max(1000).nullable()
}).refine(
  data => {
    if (data.tripType === 'ROUND_TRIP') {
      return data.returnDatetime !== null;
    }
    return true;
  },
  { message: 'Return datetime required for round trips' }
).refine(
  data => {
    if (data.tripType === 'ROUND_TRIP' && data.returnDatetime) {
      return new Date(data.returnDatetime) > new Date(data.departureDatetime);
    }
    return true;
  },
  { message: 'Return datetime must be after departure' }
);

// Validation middleware
function validateRequest(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors
          }
        });
      }
      next(error);
    }
  };
}
```

### SQL Injection Prevention

**Prisma ORM** automatically prevents SQL injection through parameterized queries:
```typescript
// Safe - Prisma handles parameterization
const booking = await prisma.booking.findUnique({
  where: { referenceNumber: userInput }
});

// Never use raw SQL with user input
// If raw SQL is necessary, use parameterized queries:
const result = await prisma.$queryRaw`
  SELECT * FROM bookings 
  WHERE reference_number = ${userInput}
`;
```

### XSS Prevention

**Content Security Policy**:
```typescript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://maps.googleapis.com; " +
    "frame-src 'none';"
  );
  next();
});
```

**Output Sanitization**:
```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

// Use in email templates and user-generated content
const safeInstructions = sanitizeHtml(booking.specialInstructions);
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://adityatours.com', 'https://www.adityatours.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Environment Variables Security

```typescript
// .env.example (committed to repo)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-here
SENDGRID_API_KEY=your-sendgrid-key
GOOGLE_MAPS_API_KEY=your-maps-key
ADMIN_EMAIL=admin@adityatours.com
NODE_ENV=development

// .env (never committed)
// Contains actual secrets

// Validation on startup
function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SENDGRID_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'ADMIN_EMAIL'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
  
  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }
}

validateEnvironment();
```


## SEO Implementation

### Meta Tags Structure

**Homepage Meta Tags**:
```html
<head>
  <title>Aditya Tours and Travels - Taxi Service in Thane | Ertiga Cab Booking</title>
  <meta name="description" content="Book reliable taxi service in Thane with Aditya Tours and Travels. Comfortable 7-seater Maruti Suzuki Ertiga for local and outstation trips. Professional driver, transparent pricing, 24/7 service.">
  <meta name="keywords" content="Thane taxi, Thane cab service, Ertiga taxi Thane, Thane to Mumbai airport taxi, outstation cab Thane, taxi booking Thane">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://adityatours.com/">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Aditya Tours and Travels - Taxi Service in Thane">
  <meta property="og:description" content="Book reliable taxi service in Thane. Comfortable Ertiga, professional driver, transparent pricing.">
  <meta property="og:url" content="https://adityatours.com/">
  <meta property="og:image" content="https://adityatours.com/images/og-image.jpg">
  <meta property="og:locale" content="en_IN">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Aditya Tours and Travels - Taxi Service in Thane">
  <meta name="twitter:description" content="Book reliable taxi service in Thane. Comfortable Ertiga, professional driver, transparent pricing.">
  <meta name="twitter:image" content="https://adityatours.com/images/twitter-card.jpg">
  
  <!-- Mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#2563EB">
  
  <!-- Geo Tags -->
  <meta name="geo.region" content="IN-MH">
  <meta name="geo.placename" content="Thane">
  <meta name="geo.position" content="19.2183;72.9781">
  <meta name="ICBM" content="19.2183, 72.9781">
</head>
```

### Structured Data (Schema.org)

**LocalBusiness Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://adityatours.com/#business",
  "name": "Aditya Tours and Travels",
  "image": "https://adityatours.com/images/logo.png",
  "description": "Reliable taxi service in Thane offering comfortable Maruti Suzuki Ertiga for local and outstation trips with professional drivers.",
  "url": "https://adityatours.com",
  "telephone": "+91-9876543210",
  "email": "contact@adityatours.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Thane West",
    "addressLocality": "Thane",
    "addressRegion": "Maharashtra",
    "postalCode": "400601",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "19.2183",
    "longitude": "72.9781"
  },
  "areaServed": {
    "@type": "City",
    "name": "Thane"
  },
  "priceRange": "₹₹",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}
```

**Service Schema**:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Taxi Service",
  "provider": {
    "@id": "https://adityatours.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Thane"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Taxi Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "One Way Taxi",
          "description": "One-way taxi service from Thane to any destination"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Round Trip Taxi",
          "description": "Round trip taxi service with 10% discount"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Airport Transfer",
          "description": "Reliable airport transfer service from Thane to Mumbai Airport"
        }
      }
    ]
  }
}
```

**Review Schema** (for testimonials):
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@id": "https://adityatours.com/#business"
  },
  "author": {
    "@type": "Person",
    "name": "Rajesh Kumar"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "Excellent service! Very punctual and professional driver. The Ertiga was clean and comfortable.",
  "datePublished": "2024-01-10"
}
```

### SEO Landing Pages

**Page 1: /thane-taxi-service**

Title: "Taxi Service in Thane | Book Reliable Cab - Aditya Tours"

Content Structure:
```markdown
# Taxi Service in Thane - Aditya Tours and Travels

Looking for a reliable taxi service in Thane? Aditya Tours and Travels offers comfortable and affordable cab booking for all your travel needs in Thane and beyond.

## Why Choose Our Thane Taxi Service?

- **Comfortable Ertiga**: Spacious 7-seater Maruti Suzuki Ertiga
- **Professional Driver**: Experienced and courteous drivers
- **Transparent Pricing**: No hidden charges, clear fare structure
- **24/7 Availability**: Book anytime, day or night
- **Local Expertise**: Deep knowledge of Thane routes

## Popular Routes from Thane

- Thane to Mumbai Airport: ₹720 onwards
- Thane to Pune: ₹2,100 onwards
- Thane to Nashik: ₹2,400 onwards
- Thane to Lonavala: ₹1,800 onwards

## Service Areas in Thane

We provide taxi service across all areas of Thane including:
- Thane West
- Thane East
- Ghodbunder Road
- Majiwada
- Naupada
- Kopri
- Vartak Nagar

[Book Your Taxi Now →]

## About Thane Taxi Booking

Thane, a bustling city in Maharashtra, requires reliable transportation for daily commutes and outstation trips. Our taxi service in Thane ensures you reach your destination safely and comfortably.

## Frequently Asked Questions

**Q: How do I book a taxi in Thane?**
A: Simply fill our online booking form with pickup location, destination, and travel date. You'll receive instant confirmation.

**Q: What are your taxi rates in Thane?**
A: We charge ₹300 base fare + ₹12 per kilometer. Round trips get 10% discount.

**Q: Do you provide airport taxi service from Thane?**
A: Yes, we specialize in Thane to Mumbai Airport transfers with timely pickups.

[Contact Us] [View Pricing] [Track Booking]
```

**Page 2: /thane-airport-taxi**

Title: "Thane to Mumbai Airport Taxi | Reliable Airport Transfer"

Focus: Airport transfers, early morning pickups, flight tracking

**Page 3: /thane-outstation-cab**

Title: "Outstation Cab from Thane | One Way & Round Trip"

Focus: Outstation destinations, round trip discounts, popular hill stations

**Page 4: /thane-ertiga-cab**

Title: "Ertiga Cab in Thane | 7 Seater Taxi Booking"

Focus: Vehicle features, family trips, luggage capacity

### Sitemap Generation

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://adityatours.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://adityatours.com/book</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://adityatours.com/thane-taxi-service</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://adityatours.com/thane-airport-taxi</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://adityatours.com/thane-outstation-cab</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://adityatours.com/thane-ertiga-cab</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://adityatours.com/track-booking</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://adityatours.com/contact</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://adityatours.com/privacy-policy</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://adityatours.com/terms-of-service</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://adityatours.com/sitemap.xml
```

### Performance Optimization for SEO

**Image Optimization**:
- Use WebP format with JPEG fallback
- Lazy load below-the-fold images
- Responsive images with srcset
- Compress images to <100KB

**Core Web Vitals Targets**:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Implementation**:
```typescript
// Next.js Image component or custom implementation
<img
  src="/images/ertiga.webp"
  srcset="/images/ertiga-320w.webp 320w,
          /images/ertiga-640w.webp 640w,
          /images/ertiga-1024w.webp 1024w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Maruti Suzuki Ertiga taxi in Thane"
  loading="lazy"
  width="800"
  height="600"
/>
```


## Error Handling

### Error Classification

**Error Types**:
1. **Validation Errors** (400): Invalid user input
2. **Authentication Errors** (401): Missing or invalid credentials
3. **Authorization Errors** (403): Insufficient permissions
4. **Not Found Errors** (404): Resource doesn't exist
5. **Conflict Errors** (409): Business logic conflicts (e.g., vehicle unavailable)
6. **Rate Limit Errors** (429): Too many requests
7. **Server Errors** (500): Unexpected server failures
8. **External Service Errors** (502/503): Google Maps, SendGrid failures

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    retryAfter?: number;
    suggestedAction?: string;
  };
}

// Examples
const validationError: ErrorResponse = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid booking data',
    details: [
      { field: 'customerPhone', message: 'Invalid phone number format' },
      { field: 'passengerCount', message: 'Must be between 1 and 7' }
    ]
  }
};

const unavailableError: ErrorResponse = {
  success: false,
  error: {
    code: 'VEHICLE_UNAVAILABLE',
    message: 'Vehicle is not available for the selected time slot',
    details: {
      requestedDate: '2024-01-15',
      conflictingBooking: 'ATT-A7K9M2'
    },
    suggestedAction: 'Try selecting a different date or time'
  }
};

const rateLimitError: ErrorResponse = {
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many booking requests. Please try again later.',
    retryAfter: 3600
  }
};
```

### Global Error Handler

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Specific error classes
class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `${resource} not found`);
  }
}

class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(409, 'CONFLICT', message, details);
  }
}

// Global error handler middleware
function errorHandler(err: Error, req, res, next) {
  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  // Send to error tracking service (Sentry)
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }
  
  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }
  
  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this value already exists'
        }
      });
    }
  }
  
  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message
    }
  });
}
```

### Frontend Error Handling

```typescript
// API client with error handling
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.error.code,
        data.error.message,
        response.status,
        data.error.details
      );
    }
    
    return data.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network error
    throw new APIError(
      'NETWORK_ERROR',
      'Unable to connect to server. Please check your internet connection.',
      0
    );
  }
}

// Error display component
function ErrorDisplay({ error }: { error: APIError }) {
  const getErrorMessage = () => {
    switch (error.code) {
      case 'VEHICLE_UNAVAILABLE':
        return {
          title: 'Vehicle Not Available',
          message: error.message,
          action: 'Try Different Date',
          icon: '📅'
        };
      case 'VALIDATION_ERROR':
        return {
          title: 'Invalid Information',
          message: 'Please check the highlighted fields',
          action: 'Fix Errors',
          icon: '⚠️'
        };
      case 'NETWORK_ERROR':
        return {
          title: 'Connection Error',
          message: error.message,
          action: 'Retry',
          icon: '🔌'
        };
      default:
        return {
          title: 'Something Went Wrong',
          message: error.message,
          action: 'Try Again',
          icon: '❌'
        };
    }
  };
  
  const errorInfo = getErrorMessage();
  
  return (
    <div className="error-display">
      <div className="error-icon">{errorInfo.icon}</div>
      <h3>{errorInfo.title}</h3>
      <p>{errorInfo.message}</p>
      <button onClick={handleRetry}>{errorInfo.action}</button>
    </div>
  );
}

// Toast notifications for errors
function showErrorToast(error: APIError) {
  toast.error(error.message, {
    duration: 5000,
    position: 'top-center',
    action: error.code === 'NETWORK_ERROR' ? {
      label: 'Retry',
      onClick: () => window.location.reload()
    } : undefined
  });
}
```

### Graceful Degradation

**Google Maps Failure**:
```typescript
function LocationPicker() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(false);
  
  useEffect(() => {
    loadGoogleMaps()
      .then(() => setMapsLoaded(true))
      .catch(() => setMapsError(true));
  }, []);
  
  if (mapsError) {
    // Fallback to manual entry
    return (
      <div>
        <p className="warning">
          Unable to load map. Please enter address manually.
        </p>
        <input
          type="text"
          placeholder="Enter pickup address"
          onChange={handleManualEntry}
        />
      </div>
    );
  }
  
  if (!mapsLoaded) {
    return <Loader />;
  }
  
  return <GoogleMapsAutocomplete />;
}
```

**Email Service Failure**:
```typescript
async function createBooking(data: BookingData) {
  // Create booking in database
  const booking = await bookingRepository.create(data);
  
  // Try to send emails (non-blocking)
  try {
    await sendEmailWithRetry(customerEmail);
    await sendEmailWithRetry(adminEmail);
  } catch (error) {
    // Log error but don't fail the booking
    logError('email_send_failed', {
      bookingId: booking.id,
      error: error.message
    });
    
    // Store failed email for manual retry
    await queueFailedEmail({
      bookingId: booking.id,
      type: 'booking_confirmation',
      recipient: data.customerEmail
    });
  }
  
  return booking;
}
```

### Monitoring & Alerting

**Error Logging**:
```typescript
interface ErrorLog {
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  stack?: string;
  context: {
    url?: string;
    method?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
  };
}

function logError(code: string, details: any) {
  const log: ErrorLog = {
    timestamp: new Date(),
    level: 'error',
    code,
    message: details.message || code,
    stack: details.stack,
    context: {
      url: details.url,
      method: details.method,
      ip: details.ip,
      userAgent: details.userAgent
    }
  };
  
  // Log to console
  console.error(log);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(new Error(code), {
      extra: details
    });
  }
  
  // Store in database for analysis
  prisma.errorLog.create({ data: log });
}
```

**Health Check Endpoint**:
```typescript
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok',
      email: 'ok',
      maps: 'ok'
    }
  };
  
  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    health.status = 'degraded';
    health.services.database = 'error';
  }
  
  // Check email service
  try {
    await sendGridClient.request({
      method: 'GET',
      url: '/v3/user/profile'
    });
  } catch (error) {
    health.status = 'degraded';
    health.services.email = 'error';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```


## Testing Strategy

### Testing Pyramid

```
        /\
       /  \
      / E2E \          10% - End-to-End Tests
     /______\
    /        \
   /Integration\       20% - Integration Tests
  /____________\
 /              \
/   Unit Tests   \     70% - Unit Tests
/__________________\
```

### Unit Testing

**Framework**: Vitest

**Coverage Targets**:
- Overall: 80%
- Business Logic: 90%
- Utilities: 95%

**Key Areas to Test**:

1. **Availability Checking**:
```typescript
describe('AvailabilityService', () => {
  describe('checkAvailability', () => {
    it('should return available when no conflicts exist', async () => {
      const request = {
        vehicleId: 'vehicle-1',
        departureDatetime: new Date('2024-01-15T10:00:00Z'),
        returnDatetime: null,
        travelTimeMinutes: 60,
        bufferMinutes: 120
      };
      
      const result = await availabilityService.checkAvailability(request);
      
      expect(result.available).toBe(true);
      expect(result.conflictingBookings).toHaveLength(0);
    });
    
    it('should return unavailable when booking overlaps', async () => {
      // Create existing booking
      await createTestBooking({
        departureDatetime: new Date('2024-01-15T09:00:00Z'),
        travelTimeMinutes: 120
      });
      
      const request = {
        vehicleId: 'vehicle-1',
        departureDatetime: new Date('2024-01-15T10:00:00Z'),
        returnDatetime: null,
        travelTimeMinutes: 60,
        bufferMinutes: 120
      };
      
      const result = await availabilityService.checkAvailability(request);
      
      expect(result.available).toBe(false);
      expect(result.conflictingBookings).toHaveLength(1);
    });
    
    it('should suggest alternative dates when unavailable', async () => {
      const request = {
        vehicleId: 'vehicle-1',
        departureDatetime: new Date('2024-01-15T10:00:00Z'),
        returnDatetime: null,
        travelTimeMinutes: 60,
        bufferMinutes: 120
      };
      
      const result = await availabilityService.checkAvailability(request);
      
      expect(result.suggestedDates).toHaveLength(3);
      expect(result.suggestedDates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
```

2. **Pricing Calculation**:
```typescript
describe('PricingService', () => {
  describe('calculateFare', () => {
    it('should select appropriate package based on duration', () => {
      const input = {
        distanceKm: 35,
        durationHours: 3.5
      };
      
      const result = pricingService.calculateFare(input);
      
      expect(result.selectedPackage.name).toBe('4 Hours');
      expect(result.selectedPackage.packagePrice).toBe(1400);
      expect(result.extraKm).toBe(0); // 35 < 40
      expect(result.extraHours).toBe(0); // 3.5 < 4
      expect(result.total).toBe(1400);
    });
    
    it('should calculate extra charges correctly', () => {
      const input = {
        distanceKm: 50,
        durationHours: 5
      };
      
      const result = pricingService.calculateFare(input);
      
      expect(result.selectedPackage.name).toBe('6 Hours');
      expect(result.extraKm).toBe(10); // 50 - 40
      expect(result.extraKmCharge).toBe(150); // 10 * 15
      expect(result.extraHours).toBe(0); // 5 < 6
      expect(result.total).toBe(1950); // 1800 + 150
    });
    
    it('should handle both extra km and extra hours', () => {
      const input = {
        distanceKm: 130,
        durationHours: 13
      };
      
      const result = pricingService.calculateFare(input);
      
      expect(result.selectedPackage.name).toBe('12 Hours');
      expect(result.extraKm).toBe(10); // 130 - 120
      expect(result.extraKmCharge).toBe(150); // 10 * 15
      expect(result.extraHours).toBe(1); // 13 - 12
      expect(result.extraHourCharge).toBe(150); // 1 * 150
      expect(result.total).toBe(4300); // 4000 + 150 + 150
    });
  });
});
```

3. **Reference Number Generation**:
```typescript
describe('generateReferenceNumber', () => {
  it('should generate reference with correct format', () => {
    const ref = generateReferenceNumber();
    
    expect(ref).toMatch(/^ATT-[A-Z0-9]{6}$/);
  });
  
  it('should generate unique references', () => {
    const refs = new Set();
    for (let i = 0; i < 1000; i++) {
      refs.add(generateReferenceNumber());
    }
    
    expect(refs.size).toBe(1000);
  });
  
  it('should not include ambiguous characters', () => {
    const ref = generateReferenceNumber();
    
    expect(ref).not.toMatch(/[0O1Il]/);
  });
});
```

4. **Validation**:
```typescript
describe('Booking Validation', () => {
  it('should validate phone number format', () => {
    const valid = ['9876543210', '8765432109'];
    const invalid = ['123456789', '12345678901', 'abcdefghij'];
    
    valid.forEach(phone => {
      expect(() => phoneSchema.parse(phone)).not.toThrow();
    });
    
    invalid.forEach(phone => {
      expect(() => phoneSchema.parse(phone)).toThrow();
    });
  });
  
  it('should require return datetime for round trips', () => {
    const booking = {
      tripType: 'ROUND_TRIP',
      departureDatetime: '2024-01-15T10:00:00Z',
      returnDatetime: null,
      // ... other fields
    };
    
    expect(() => bookingRequestSchema.parse(booking)).toThrow();
  });
  
  it('should validate return after departure', () => {
    const booking = {
      tripType: 'ROUND_TRIP',
      departureDatetime: '2024-01-15T10:00:00Z',
      returnDatetime: '2024-01-15T08:00:00Z', // Before departure
      // ... other fields
    };
    
    expect(() => bookingRequestSchema.parse(booking)).toThrow();
  });
});
```

### Property-Based Testing

**Framework**: fast-check (for TypeScript)

**Properties to Test**:

1. **Availability Idempotence**:
```typescript
import fc from 'fast-check';

describe('Availability Properties', () => {
  it('checking availability twice should give same result', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.date(),
        fc.integer({ min: 30, max: 480 }),
        async (date, travelTime) => {
          const request = {
            vehicleId: 'vehicle-1',
            departureDatetime: date,
            returnDatetime: null,
            travelTimeMinutes: travelTime,
            bufferMinutes: 120
          };
          
          const result1 = await availabilityService.checkAvailability(request);
          const result2 = await availabilityService.checkAvailability(request);
          
          expect(result1.available).toBe(result2.available);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

2. **Pricing Monotonicity**:
```typescript
it('fare should increase with duration for same distance', () => {
  fc.assert(
    fc.property(
      fc.float({ min: 1, max: 12 }),
      fc.float({ min: 1, max: 12 }),
      fc.float({ min: 10, max: 100 }),
      (duration1, duration2, distance) => {
        fc.pre(duration1 < duration2); // Precondition
        
        const fare1 = pricingService.calculateFare({
          distanceKm: distance,
          durationHours: duration1
        });
        
        const fare2 = pricingService.calculateFare({
          distanceKm: distance,
          durationHours: duration2
        });
        
        // Longer duration should select larger or equal package
        expect(fare2.selectedPackage.durationHours)
          .toBeGreaterThanOrEqual(fare1.selectedPackage.durationHours);
      }
    ),
    { numRuns: 100 }
  );
});
```

3. **Reference Number Uniqueness**:
```typescript
it('generated references should always be unique', () => {
  fc.assert(
    fc.property(
      fc.array(fc.constant(null), { minLength: 100, maxLength: 100 }),
      (arr) => {
        const refs = arr.map(() => generateReferenceNumber());
        const uniqueRefs = new Set(refs);
        
        expect(uniqueRefs.size).toBe(refs.length);
      }
    ),
    { numRuns: 10 }
  );
});
```

### Integration Testing

**Framework**: Vitest + Supertest

**Test Database**: PostgreSQL test instance

**Key Integration Tests**:

1. **Booking Flow**:
```typescript
describe('Booking API Integration', () => {
  beforeEach(async () => {
    await resetTestDatabase();
    await seedTestData();
  });
  
  it('should create booking and send emails', async () => {
    const bookingData = {
      tripType: 'ONE_WAY',
      pickupAddress: 'Thane Station',
      pickupLat: 19.1871,
      pickupLng: 72.9786,
      dropAddress: 'Mumbai Airport',
      dropLat: 19.0896,
      dropLng: 72.8656,
      distanceKm: 35,
      travelTimeMinutes: 60,
      departureDatetime: '2024-01-15T10:00:00Z',
      returnDatetime: null,
      customerName: 'Test User',
      customerPhone: '9876543210',
      customerEmail: 'test@example.com',
      passengerCount: 4,
      specialInstructions: null
    };
    
    const response = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.referenceNumber).toMatch(/^ATT-/);
    
    // Verify booking in database
    const booking = await prisma.booking.findUnique({
      where: { id: response.body.data.bookingId }
    });
    expect(booking).toBeTruthy();
    expect(booking.status).toBe('PENDING');
    
    // Verify emails were queued
    expect(emailQueue).toHaveLength(2); // Customer + Admin
  });
  
  it('should reject booking when vehicle unavailable', async () => {
    // Create existing booking
    await createTestBooking({
      departureDatetime: new Date('2024-01-15T10:00:00Z'),
      travelTimeMinutes: 120
    });
    
    const bookingData = {
      // ... overlapping time slot
      departureDatetime: '2024-01-15T11:00:00Z',
      travelTimeMinutes: 60
    };
    
    const response = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(400);
    
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VEHICLE_UNAVAILABLE');
  });
});
```

2. **Admin Authentication**:
```typescript
describe('Admin Auth Integration', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/admin/auth/login')
      .send({
        username: 'admin',
        password: 'testpassword123'
      })
      .expect(200);
    
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.admin.username).toBe('admin');
  });
  
  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/admin/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      })
      .expect(401);
    
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
  
  it('should access protected route with valid token', async () => {
    const loginResponse = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'admin', password: 'testpassword123' });
    
    const token = loginResponse.body.data.token;
    
    const response = await request(app)
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

### End-to-End Testing

**Framework**: Playwright

**Key E2E Scenarios**:

1. **Complete Booking Flow**:
```typescript
test('user can complete booking flow', async ({ page }) => {
  await page.goto('/');
  
  // Step 1: Location
  await page.fill('[data-testid="pickup-input"]', 'Thane Station');
  await page.click('[data-testid="autocomplete-option-0"]');
  
  await page.fill('[data-testid="drop-input"]', 'Mumbai Airport');
  await page.click('[data-testid="autocomplete-option-0"]');
  
  await page.click('[data-testid="trip-type-oneway"]');
  await page.click('[data-testid="continue-to-datetime"]');
  
  // Step 2: Date & Time
  await page.click('[data-testid="date-picker"]');
  await page.click('[data-testid="date-tomorrow"]');
  
  await page.click('[data-testid="time-picker"]');
  await page.click('[data-testid="time-10am"]');
  
  await page.click('[data-testid="continue-to-details"]');
  
  // Step 3: Customer Details
  await page.fill('[data-testid="customer-name"]', 'John Doe');
  await page.fill('[data-testid="customer-phone"]', '9876543210');
  await page.fill('[data-testid="customer-email"]', 'john@example.com');
  await page.click('[data-testid="passenger-count-4"]');
  
  await page.click('[data-testid="continue-to-summary"]');
  
  // Step 4: Summary & Confirm
  await expect(page.locator('[data-testid="summary-pickup"]'))
    .toContainText('Thane Station');
  await expect(page.locator('[data-testid="summary-total"]'))
    .toContainText('₹');
  
  await page.check('[data-testid="terms-checkbox"]');
  await page.click('[data-testid="confirm-booking"]');
  
  // Confirmation
  await expect(page.locator('[data-testid="confirmation-message"]'))
    .toContainText('Booking Confirmed');
  await expect(page.locator('[data-testid="reference-number"]'))
    .toMatch(/ATT-[A-Z0-9]{6}/);
});
```

2. **Admin Booking Management**:
```typescript
test('admin can confirm booking', async ({ page }) => {
  // Login
  await page.goto('/admin/login');
  await page.fill('[data-testid="username"]', 'admin');
  await page.fill('[data-testid="password"]', 'testpassword123');
  await page.click('[data-testid="login-button"]');
  
  // Navigate to bookings
  await page.click('[data-testid="nav-bookings"]');
  
  // Find pending booking
  await page.click('[data-testid="filter-pending"]');
  await page.click('[data-testid="booking-row-0"]');
  
  // Confirm booking
  await page.click('[data-testid="confirm-booking-button"]');
  await page.click('[data-testid="confirm-dialog-yes"]');
  
  // Verify status changed
  await expect(page.locator('[data-testid="booking-status"]'))
    .toContainText('CONFIRMED');
});
```

### Test Data Management

```typescript
// Test fixtures
export const testBookingData = {
  valid: {
    tripType: 'ONE_WAY',
    pickupAddress: 'Thane Station, Thane West',
    pickupLat: 19.1871,
    pickupLng: 72.9786,
    dropAddress: 'Mumbai Airport Terminal 2',
    dropLat: 19.0896,
    dropLng: 72.8656,
    distanceKm: 35,
    travelTimeMinutes: 60,
    departureDatetime: '2024-01-15T10:00:00Z',
    returnDatetime: null,
    customerName: 'Test User',
    customerPhone: '9876543210',
    customerEmail: 'test@example.com',
    passengerCount: 4,
    specialInstructions: null
  },
  invalidPhone: {
    // ... with customerPhone: '123'
  },
  invalidEmail: {
    // ... with customerEmail: 'invalid-email'
  }
};

// Database seeding
async function seedTestData() {
  await prisma.vehicle.create({
    data: {
      id: 'vehicle-1',
      registrationNumber: 'MH-04-TEST-1234',
      model: 'Maruti Suzuki Ertiga',
      seatingCapacity: 7,
      status: 'ACTIVE',
      features: ['AC', 'Music System']
    }
  });
  
  await prisma.pricingConfig.create({
    data: {
      baseFare: 300,
      perKmRate: 12,
      roundTripDiscountPercent: 10,
      isActive: true,
      effectiveFrom: new Date()
    }
  });
  
  await prisma.admin.create({
    data: {
      username: 'admin',
      email: 'admin@test.com',
      passwordHash: await hashPassword('testpassword123')
    }
  });
}
```


## Deployment Architecture

### Infrastructure Overview

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        CDN[Vercel CDN]
        Static[Static Assets]
        React[React App]
    end
    
    subgraph "Backend - Railway/Render"
        API[Express API]
        Worker[Background Jobs]
    end
    
    subgraph "Database - Railway/Render"
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        SendGrid[SendGrid Email]
        GMaps[Google Maps]
        Sentry[Sentry Monitoring]
    end
    
    Users --> CDN
    CDN --> Static
    CDN --> React
    React --> API
    API --> Postgres
    API --> Redis
    API --> SendGrid
    API --> GMaps
    API --> Sentry
    Worker --> Postgres
    Worker --> SendGrid
```

### Environment Configuration

**Development**:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/aditya_tours_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
SENDGRID_API_KEY=your-dev-key
GOOGLE_MAPS_API_KEY=your-dev-key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@localhost
```

**Production**:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/aditya_tours_prod
REDIS_URL=redis://user:pass@host:6379
JWT_SECRET=<strong-random-secret-64-chars>
SENDGRID_API_KEY=<production-key>
GOOGLE_MAPS_API_KEY=<production-key-with-domain-restriction>
FRONTEND_URL=https://adityatours.com
ADMIN_EMAIL=admin@adityatours.com
SENTRY_DSN=<sentry-project-dsn>
```

### Deployment Steps

**Frontend (Vercel)**:

1. **Connect Repository**:
   - Link GitHub repository to Vercel
   - Set root directory to `frontend/`
   - Framework preset: Vite

2. **Environment Variables**:
   ```
   VITE_API_URL=https://api.adityatours.com
   VITE_GOOGLE_MAPS_API_KEY=<key>
   VITE_GA_MEASUREMENT_ID=<ga-id>
   ```

3. **Build Configuration**:
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": "dist",
     "installCommand": "pnpm install",
     "devCommand": "pnpm dev"
   }
   ```

4. **Domain Setup**:
   - Add custom domain: `adityatours.com`
   - Add www redirect: `www.adityatours.com` → `adityatours.com`
   - SSL automatically provisioned

**Backend (Railway/Render)**:

1. **Create Service**:
   - Connect GitHub repository
   - Set root directory to `backend/`
   - Runtime: Node.js 20

2. **Environment Variables**:
   - Add all production environment variables
   - Enable automatic deployments from main branch

3. **Database Setup**:
   - Create PostgreSQL instance
   - Copy DATABASE_URL to environment variables
   - Run migrations: `npx prisma migrate deploy`

4. **Redis Setup**:
   - Create Redis instance
   - Copy REDIS_URL to environment variables

5. **Health Checks**:
   - Path: `/api/health`
   - Interval: 60 seconds
   - Timeout: 10 seconds

6. **Scaling**:
   - Initial: 1 instance, 512MB RAM
   - Auto-scale: Up to 3 instances based on CPU/memory

### Database Migrations

**Development**:
```bash
# Create migration
npx prisma migrate dev --name add_booking_table

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

**Production**:
```bash
# Apply migrations (in CI/CD or manually)
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

**Migration Strategy**:
- All migrations tested in staging first
- Backward-compatible migrations (no breaking changes)
- Zero-downtime deployments
- Rollback plan for each migration

### CI/CD Pipeline

**GitHub Actions Workflow**:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm lint
      
      - name: Run type check
        run: pnpm type-check
      
      - name: Run unit tests
        run: pnpm test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Build
        run: pnpm build
  
  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
  
  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: aditya-tours-api
```

### Monitoring & Logging

**Sentry Configuration**:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Sentry.Integrations.Prisma({ client: prisma })
  ]
});

// Request handler
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler (must be last)
app.use(Sentry.Handlers.errorHandler());
```

**Uptime Monitoring**:
- Service: Uptime Robot or Better Uptime
- Endpoints to monitor:
  - `https://adityatours.com` (every 5 minutes)
  - `https://api.adityatours.com/api/health` (every 5 minutes)
- Alerts: Email + SMS for downtime

**Log Aggregation**:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Usage
logger.info('Booking created', { bookingId, referenceNumber });
logger.error('Email send failed', { error, bookingId });
```

### Backup Strategy

**Database Backups**:
- Automated daily backups (Railway/Render built-in)
- Retention: 30 days
- Manual backup before major migrations
- Backup verification: Weekly restore test

**Backup Script**:
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Upload to cloud storage (S3, Google Cloud Storage, etc.)
aws s3 cp ${BACKUP_FILE}.gz s3://aditya-tours-backups/

# Keep only last 30 days locally
find . -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

### Disaster Recovery

**Recovery Time Objective (RTO)**: 4 hours
**Recovery Point Objective (RPO)**: 24 hours

**Recovery Steps**:
1. Provision new database instance
2. Restore from latest backup
3. Update DATABASE_URL in backend service
4. Restart backend service
5. Verify health checks pass
6. Monitor error rates

**Runbook Location**: `docs/runbooks/disaster-recovery.md`

### Performance Optimization

**Backend**:
- Enable gzip compression
- Implement response caching for static data
- Database connection pooling (PgBouncer)
- Redis caching for frequently accessed data

```typescript
// Compression middleware
import compression from 'compression';
app.use(compression());

// Cache middleware for pricing
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

app.get('/api/pricing/current', async (req, res) => {
  const cached = cache.get('current-pricing');
  if (cached) {
    return res.json({ success: true, data: cached });
  }
  
  const pricing = await pricingRepository.getActive();
  cache.set('current-pricing', pricing);
  
  res.json({ success: true, data: pricing });
});
```

**Frontend**:
- Code splitting by route
- Lazy load components
- Image optimization (WebP, responsive)
- Service Worker for offline support

```typescript
// Lazy loading
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

// Route-based code splitting
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/book" element={
    <Suspense fallback={<Loader />}>
      <BookingPage />
    </Suspense>
  } />
  <Route path="/admin/*" element={
    <Suspense fallback={<Loader />}>
      <AdminPanel />
    </Suspense>
  } />
</Routes>
```

### Security Hardening

**Production Checklist**:
- [ ] HTTPS enforced (HSTS header)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (input sanitization)
- [ ] Admin panel behind authentication
- [ ] Sensitive data encrypted at rest
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerability scanning (npm audit)

**Security Headers**:
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://maps.googleapis.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```


## Future Scalability - Multi-Vehicle Support

### Architecture Preparation

The current system is designed with multi-vehicle support in mind, even though only one vehicle is active initially. Key design decisions that enable future scaling:

1. **Vehicle ID in All Queries**: All availability checks and bookings include `vehicle_id`
2. **Vehicle Table**: Separate vehicles table ready for additional entries
3. **Vehicle Blocks**: Time blocks are per-vehicle, not global
4. **Admin Interface**: Vehicle management UI exists (shows single vehicle initially)

### Database Schema (Already Prepared)

The schema already supports multiple vehicles:

```sql
-- Vehicles table (currently 1 row, can add more)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  registration_number VARCHAR(20) UNIQUE,
  model VARCHAR(100),
  seating_capacity INTEGER,
  status VARCHAR(20), -- ACTIVE, MAINTENANCE, INACTIVE
  features JSONB
);

-- Bookings reference vehicle_id
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  -- ... other fields
);

-- Vehicle blocks are per-vehicle
CREATE TABLE vehicle_blocks (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  start_datetime TIMESTAMP,
  end_datetime TIMESTAMP,
  -- ... other fields
);
```

### Availability Algorithm (Already Multi-Vehicle)

The current availability checker is vehicle-specific:

```typescript
function checkAvailability(request: AvailabilityCheck): AvailabilityResult {
  // Query blocks for SPECIFIC vehicle
  const existingBlocks = getVehicleBlocks(
    request.vehicleId,  // ← Vehicle-specific
    requestStart,
    requestEnd
  );
  
  // Check conflicts only for this vehicle
  // ...
}
```

### Migration Path to Multi-Vehicle

**Phase 1: Add Second Vehicle** (Minimal Changes)

1. **Add Vehicle Record**:
```sql
INSERT INTO vehicles (id, registration_number, model, seating_capacity, status, features)
VALUES (
  gen_random_uuid(),
  'MH-04-XY-5678',
  'Maruti Suzuki Ertiga',
  7,
  'ACTIVE',
  '["AC", "Music System", "GPS"]'::jsonb
);
```

2. **Update Booking Form**:
```typescript
// Add vehicle selection step (optional)
function VehicleSelectionStep() {
  const { data: vehicles } = useQuery('vehicles', fetchActiveVehicles);
  
  return (
    <div>
      <h3>Select Vehicle</h3>
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onSelect={() => setSelectedVehicle(vehicle.id)}
        />
      ))}
    </div>
  );
}
```

3. **Smart Vehicle Assignment** (Alternative to manual selection):
```typescript
async function findAvailableVehicle(
  departureDatetime: Date,
  returnDatetime: Date | null,
  travelTimeMinutes: number
): Promise<string | null> {
  const vehicles = await vehicleRepository.findActive();
  
  for (const vehicle of vehicles) {
    const availability = await checkAvailability({
      vehicleId: vehicle.id,
      departureDatetime,
      returnDatetime,
      travelTimeMinutes,
      bufferMinutes: 120
    });
    
    if (availability.available) {
      return vehicle.id;
    }
  }
  
  return null; // No vehicles available
}

// Use in booking creation
async function createBooking(data: BookingData) {
  // Auto-assign available vehicle
  const vehicleId = await findAvailableVehicle(
    data.departureDatetime,
    data.returnDatetime,
    data.travelTimeMinutes
  );
  
  if (!vehicleId) {
    throw new ConflictError('No vehicles available for selected time');
  }
  
  return bookingRepository.create({
    ...data,
    vehicleId
  });
}
```

**Phase 2: Vehicle-Specific Pricing** (Optional)

```typescript
// Add pricing per vehicle
interface VehiclePricing {
  vehicleId: string;
  baseFare: number;
  perKmRate: number;
  roundTripDiscountPercent: number;
}

// Update pricing calculation
function calculateFare(
  input: PricingInput,
  vehicleId: string
): PricingResult {
  const pricing = getPricingForVehicle(vehicleId);
  // ... rest of calculation
}
```

**Phase 3: Vehicle Types & Categories**

```typescript
// Add vehicle types
enum VehicleType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  LUXURY = 'LUXURY'
}

interface Vehicle {
  id: string;
  type: VehicleType;
  model: string;
  seatingCapacity: number;
  // ...
}

// Filter by type in booking
function BookingForm() {
  const [vehicleType, setVehicleType] = useState<VehicleType>();
  
  const availableVehicles = useQuery(
    ['vehicles', vehicleType],
    () => fetchVehiclesByType(vehicleType)
  );
  
  // ...
}
```

### Admin Panel Updates for Multi-Vehicle

**Vehicle Management Page**:
```typescript
function VehicleManagementPage() {
  const { data: vehicles } = useQuery('vehicles', fetchAllVehicles);
  
  return (
    <div>
      <h2>Vehicle Management</h2>
      <button onClick={openAddVehicleModal}>Add Vehicle</button>
      
      <table>
        <thead>
          <tr>
            <th>Registration</th>
            <th>Model</th>
            <th>Status</th>
            <th>Current Booking</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.registrationNumber}</td>
              <td>{vehicle.model}</td>
              <td>
                <StatusBadge status={vehicle.status} />
              </td>
              <td>
                {vehicle.currentBooking ? (
                  <Link to={`/bookings/${vehicle.currentBooking.id}`}>
                    {vehicle.currentBooking.referenceNumber}
                  </Link>
                ) : (
                  'Available'
                )}
              </td>
              <td>
                <button onClick={() => editVehicle(vehicle.id)}>Edit</button>
                <button onClick={() => blockVehicle(vehicle.id)}>Block</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Calendar View with Multiple Vehicles**:
```typescript
function MultiVehicleCalendarView() {
  const { data: vehicles } = useQuery('vehicles', fetchActiveVehicles);
  const { data: bookings } = useQuery('bookings', fetchBookingsByMonth);
  
  return (
    <div className="calendar-grid">
      {/* Header with vehicle columns */}
      <div className="calendar-header">
        <div className="date-column">Date</div>
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="vehicle-column">
            {vehicle.registrationNumber}
          </div>
        ))}
      </div>
      
      {/* Rows for each date */}
      {dates.map(date => (
        <div key={date} className="calendar-row">
          <div className="date-cell">{formatDate(date)}</div>
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="booking-cell">
              {getBookingsForVehicleAndDate(bookings, vehicle.id, date).map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Performance Considerations

**Caching Strategy**:
```typescript
// Cache vehicle availability for quick lookups
const vehicleAvailabilityCache = new Map<string, AvailabilityResult>();

async function getVehicleAvailability(
  vehicleId: string,
  date: Date
): Promise<AvailabilityResult> {
  const cacheKey = `${vehicleId}:${formatDate(date)}`;
  
  if (vehicleAvailabilityCache.has(cacheKey)) {
    return vehicleAvailabilityCache.get(cacheKey);
  }
  
  const result = await checkAvailability({
    vehicleId,
    departureDatetime: date,
    // ...
  });
  
  // Cache for 5 minutes
  vehicleAvailabilityCache.set(cacheKey, result);
  setTimeout(() => vehicleAvailabilityCache.delete(cacheKey), 5 * 60 * 1000);
  
  return result;
}
```

**Database Indexing**:
```sql
-- Optimize vehicle-specific queries
CREATE INDEX idx_bookings_vehicle_datetime 
ON bookings(vehicle_id, departure_datetime);

CREATE INDEX idx_vehicle_blocks_vehicle_time 
ON vehicle_blocks(vehicle_id, start_datetime, end_datetime);

-- Optimize status filtering
CREATE INDEX idx_vehicles_status 
ON vehicles(status) WHERE status = 'ACTIVE';
```

### Estimated Effort for Multi-Vehicle Migration

**Small Fleet (2-5 vehicles)**:
- Development: 2-3 days
- Testing: 1 day
- Deployment: 1 day
- Total: ~1 week

**Medium Fleet (6-20 vehicles)**:
- Development: 1 week (add vehicle types, advanced filtering)
- Testing: 2 days
- Deployment: 1 day
- Total: ~2 weeks

**Large Fleet (20+ vehicles)**:
- Development: 2-3 weeks (add fleet management, driver assignment)
- Testing: 1 week
- Deployment: 2 days
- Total: ~1 month

### Key Takeaway

The current single-vehicle system is architected to support multiple vehicles with minimal changes. The database schema, availability algorithm, and admin interface are all vehicle-aware. When ready to scale, the primary changes are:

1. Add vehicle records to database
2. Update booking form to show/select vehicles
3. Enhance admin panel for fleet management
4. Add vehicle-specific analytics

No fundamental architecture changes required.


## Correctness Properties

### What Are Correctness Properties?

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

In this system, properties validate universal behaviors (e.g., "for any booking, the reference number must be unique") while unit tests validate specific examples and edge cases (e.g., "booking ATT-A7K9M2 should have reference ATT-A7K9M2").

### Core System Properties

**Property 1: Reference Number Uniqueness**
*For any* set of bookings in the system, all booking reference numbers must be unique.
**Validates: Requirements 1.5, 21.1**

**Property 2: Reference Number Non-Predictability**
*For any* sequence of generated reference numbers, the numbers should not follow a predictable sequential pattern.
**Validates: Requirements 21.2**

**Property 3: Guest Booking Without Authentication**
*For any* valid booking request submitted without authentication credentials, the system should successfully create the booking.
**Validates: Requirements 1.2**

**Property 4: Complete Booking Data Capture**
*For any* created booking, the database record must contain customer name, phone, email, passenger count, and special instructions (if provided).
**Validates: Requirements 1.3, 17.1, 17.2, 17.3, 17.4, 17.5**

**Property 5: No Authentication Data Storage**
*For any* booking record in the database, it should not contain password fields or authentication tokens.
**Validates: Requirements 1.4**

### Booking Flow Properties

**Property 6: Flow Progression with Valid Data**
*For any* booking step with valid input data, the system should allow progression to the next step.
**Validates: Requirements 2.2, 2.3, 2.4**

**Property 7: Flow Blocking with Invalid Data**
*For any* booking step with invalid input data, the system should prevent progression and display validation errors.
**Validates: Requirements 2.5**

**Property 8: Backward Navigation**
*For any* booking step greater than step 1, the user should be able to navigate back to the previous step.
**Validates: Requirements 2.6**

**Property 9: Booking Creation on Completion**
*For any* completed booking flow, the system should create a booking record and trigger email notifications.
**Validates: Requirements 2.7**

### Location and Maps Properties

**Property 10: Pickup Location Geographic Restriction**
*For any* pickup location autocomplete query, all returned suggestions should have coordinates within Thane, Maharashtra bounds (19.15°N to 19.25°N, 72.95°E to 72.99°E).
**Validates: Requirements 3.1**

**Property 11: Location Data Completeness**
*For any* location selected from autocomplete, both the full address string and geographic coordinates (latitude, longitude) must be captured.
**Validates: Requirements 3.3**

**Property 12: Route Calculation Completeness**
*For any* pair of valid pickup and drop locations, the system should calculate and store distance in kilometers and estimated travel time in minutes.
**Validates: Requirements 3.4, 3.5, 3.7**

### Trip Type and Validation Properties

**Property 13: Round Trip Return After Departure**
*For any* round-trip booking, the return datetime must be chronologically after the departure datetime.
**Validates: Requirements 4.4**

**Property 14: Trip Type Persistence**
*For any* created booking, the trip type (ONE_WAY or ROUND_TRIP) must be stored in the database.
**Validates: Requirements 4.5**

### Availability Management Properties

**Property 15: Availability Check Against Confirmed Bookings**
*For any* availability check request, the system should only consider bookings with status "CONFIRMED" when determining conflicts, not "PENDING" bookings.
**Validates: Requirements 5.1, 5.5**

**Property 16: One-Way Time Block Calculation**
*For any* confirmed one-way booking, the vehicle block duration should equal departure time + travel time + 120 minutes (2-hour buffer).
**Validates: Requirements 5.2**

**Property 17: Round-Trip Time Block Calculation**
*For any* confirmed round-trip booking, the vehicle block should span from departure time to return time + travel time + 120 minutes (2-hour buffer).
**Validates: Requirements 5.3**

**Property 18: Unavailability Error Response**
*For any* booking request where the vehicle is unavailable, the system should return an error response with suggested alternative dates.
**Validates: Requirements 5.4, 18.2**

### Email Notification Properties

**Property 19: Customer Booking Confirmation Email**
*For any* newly created booking, the system should send a confirmation email to the customer's email address containing the booking reference number and trip details.
**Validates: Requirements 6.1, 21.3**

**Property 20: Admin Booking Notification Email**
*For any* newly created booking, the system should send a notification email to the admin email address containing all booking details.
**Validates: Requirements 6.2**

**Property 21: Booking Confirmation Email on Admin Approval**
*For any* booking status change from PENDING to CONFIRMED, the system should send a confirmation email to the customer with pickup details and driver contact information.
**Validates: Requirements 6.3**

**Property 22: Cancellation Notification Email**
*For any* booking status change to CANCELLED, the system should send a cancellation notification email to the customer.
**Validates: Requirements 6.4**

**Property 23: Email Content Completeness**
*For any* booking-related email, the content must include the booking reference number, trip details, customer details, and pricing information.
**Validates: Requirements 6.5**

**Property 24: Email Retry on Failure**
*For any* failed email send attempt, the system should retry up to 3 times before logging a permanent failure.
**Validates: Requirements 6.6**

### Admin Authentication Properties

**Property 25: Admin Endpoint Authentication Requirement**
*For any* request to an admin API endpoint without a valid JWT token, the system should return a 401 Unauthorized response.
**Validates: Requirements 7.1, 19.1**

**Property 26: Booking Status Update Side Effects**
*For any* admin action that changes booking status to CONFIRMED or CANCELLED, the system should update the database status and trigger the appropriate customer notification email.
**Validates: Requirements 7.4, 7.5**

**Property 27: Failed Login Logging**
*For any* failed admin login attempt, the system should log the attempt with timestamp and IP address.
**Validates: Requirements 19.2**

**Property 28: Successful Login Session Creation**
*For any* successful admin login, the system should generate a JWT token with an expiration time of 24 hours.
**Validates: Requirements 19.3**

**Property 29: Expired Session Rejection**
*For any* request with an expired JWT token, the system should return a 401 Unauthorized response.
**Validates: Requirements 19.4**

**Property 30: Account Lockout After Failed Attempts**
*For any* admin account with 5 or more consecutive failed login attempts, the system should temporarily lock the account for 15 minutes.
**Validates: Requirements 19.7**

### Pricing Properties

**Property 31: Positive Pricing Validation**
*For any* pricing configuration update, all values (package prices, extra km rate, extra hour rate) must be positive numbers.
**Validates: Requirements 9.3**

**Property 32: Pricing Change Immediate Effect**
*For any* pricing configuration update, all new bookings created after the update should use the new pricing values.
**Validates: Requirements 9.4**

**Property 33: Pricing History Logging**
*For any* pricing configuration change, the system should create a history record with the old values, new values, timestamp, and admin ID.
**Validates: Requirements 9.5**

**Property 34: Package Selection Logic**
*For any* booking with estimated duration and distance, the system should select the smallest package where package duration >= estimated duration.
**Validates: Requirements 10.1**

**Property 35: Extra Charges Calculation**
*For any* booking where actual distance exceeds package included km or actual duration exceeds package hours, the system should calculate extra charges as: (extra km × ₹15) + (extra hours × ₹150).
**Validates: Requirements 10.3, 10.4**

**Property 36: Total Fare Calculation**
*For any* booking, the total fare should equal: package price + extra km charges + extra hour charges.
**Validates: Requirements 10.4**

**Property 37: Fare Monotonicity with Duration**
*For any* two bookings with the same distance, if booking A has greater duration than booking B, then booking A should select a larger or equal package (and thus have greater or equal base fare).
**Validates: Requirements 10.1**

### Rate Limiting and Security Properties

**Property 37: Booking Submission Rate Limit**
*For any* IP address, after 5 booking submissions within a 1-hour window, the 6th submission should be rejected with a 429 Too Many Requests response.
**Validates: Requirements 16.1**

**Property 38: Input Format Validation**
*For any* booking submission, if the email format is invalid or phone number format is invalid, the system should reject the request with a 400 Bad Request response containing validation errors.
**Validates: Requirements 16.2**

**Property 39: Submission Logging**
*For any* booking or contact form submission, the system should log the attempt with IP address, timestamp, and submission result.
**Validates: Requirements 16.5**

**Property 40: IP Blocking After Multiple Failures**
*For any* IP address with multiple failed submission attempts (5+ within 1 hour), the system should block that IP for 1 hour.
**Validates: Requirements 16.6**

### Error Handling Properties

**Property 41: Field-Specific Validation Errors**
*For any* form submission with validation errors, the error response should include specific error messages mapped to the invalid fields.
**Validates: Requirements 18.1**

**Property 42: Email Failure Logging**
*For any* email send failure, the system should log the error with booking ID, recipient, error message, and timestamp.
**Validates: Requirements 18.5**

**Property 43: Error Sanitization**
*For any* error response sent to users, the response should not contain technical details such as stack traces, database errors, or internal system information.
**Validates: Requirements 18.6**

**Property 44: Comprehensive Error Logging**
*For any* system error, the system should log the error with timestamp, error type, error message, request context (URL, method, user), and stack trace.
**Validates: Requirements 18.7**

### Contact Form Properties

**Property 45: Contact Form Email Delivery**
*For any* contact form submission, the system should send an email to the admin email address containing the inquiry details.
**Validates: Requirements 15.4**

**Property 46: Contact Form Success Feedback**
*For any* successful contact form submission, the system should display a success message to the user.
**Validates: Requirements 15.5**

### Performance Properties

**Property 47: Homepage Load Time**
*For any* homepage request, the above-the-fold content should load and render within 3 seconds on a 3G connection.
**Validates: Requirements 12.1**

**Property 48: Image Optimization**
*For any* image served by the system, the file size should be optimized (compressed) and the format should be WebP with JPEG fallback.
**Validates: Requirements 12.2**

### Mobile and Accessibility Properties

**Property 49: Touch Target Minimum Size**
*For any* interactive button or link element, the touch target size should be at least 44×44 pixels.
**Validates: Requirements 11.3**

### Data Completeness Properties

**Property 50: Complete Booking Data Persistence**
*For any* booking stored in the database, all required fields must be present: trip type, pickup/drop addresses and coordinates, distance, travel time, departure datetime, customer name/phone/email, passenger count, and fare breakdown.
**Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5**

### Statistics and Analytics Properties

**Property 51: Booking Statistics Accuracy**
*For any* admin dashboard statistics display, the total bookings count should equal the sum of pending, confirmed, cancelled, and completed bookings.
**Validates: Requirements 7.8**

**Property 52: Revenue Calculation Accuracy**
*For any* revenue statistics calculation, the total revenue should equal the sum of all completed bookings' final fare amounts.
**Validates: Requirements 7.8**


## Testing Strategy Summary

### Dual Testing Approach

The system requires both unit tests and property-based tests working together to ensure comprehensive coverage:

**Unit Tests** (70% of test suite):
- Validate specific examples and edge cases
- Test integration points between components
- Verify error conditions and boundary cases
- Test UI component rendering and interactions
- Validate specific data transformations

**Property-Based Tests** (20% of test suite):
- Validate universal properties across all inputs
- Test with randomly generated data (minimum 100 iterations per property)
- Catch edge cases that manual test cases might miss
- Verify mathematical properties (monotonicity, idempotence, etc.)
- Ensure business rules hold for all valid inputs

**End-to-End Tests** (10% of test suite):
- Validate complete user workflows
- Test cross-component integration
- Verify deployment and production configuration

### Property-Based Testing Configuration

**Framework**: fast-check (TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: aditya-tours-travels, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check';

describe('Property 1: Reference Number Uniqueness', () => {
  it('should generate unique reference numbers', async () => {
    // Feature: aditya-tours-travels, Property 1: Reference Number Uniqueness
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constant(null), { minLength: 100, maxLength: 100 }),
        async (arr) => {
          const refs = arr.map(() => generateReferenceNumber());
          const uniqueRefs = new Set(refs);
          
          expect(uniqueRefs.size).toBe(refs.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 36: Fare Monotonicity with Distance', () => {
  it('should increase fare with distance', () => {
    // Feature: aditya-tours-travels, Property 36: Fare Monotonicity with Distance
    fc.assert(
      fc.property(
        fc.float({ min: 1, max: 500 }),
        fc.float({ min: 1, max: 500 }),
        (distance1, distance2) => {
          fc.pre(distance1 < distance2);
          
          const fare1 = calculateFare({ distanceKm: distance1, tripType: 'ONE_WAY' });
          const fare2 = calculateFare({ distanceKm: distance2, tripType: 'ONE_WAY' });
          
          expect(fare2.total).toBeGreaterThan(fare1.total);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Targets

- Overall code coverage: 80%
- Business logic coverage: 90%
- Utility functions coverage: 95%
- API endpoints coverage: 85%
- UI components coverage: 70%

### Testing Tools

- **Unit Testing**: Vitest
- **Property-Based Testing**: fast-check
- **Integration Testing**: Vitest + Supertest
- **E2E Testing**: Playwright
- **Coverage**: Vitest coverage (c8)
- **Mocking**: Vitest mocks
- **Test Database**: PostgreSQL test instance

### Continuous Integration

All tests run automatically on:
- Every pull request
- Every commit to main branch
- Nightly full test suite run

Tests must pass before deployment to production.

---

## Summary

This design document provides a complete technical specification for the Aditya Tours and Travels booking system. The architecture supports:

- Guest booking without authentication
- Single-vehicle availability management with multi-vehicle scalability
- Mobile-first responsive design
- Local SEO optimization for Thane
- Comprehensive admin panel
- Automated email notifications
- Secure payment handling (offline)
- Performance optimization
- Production-ready deployment

The system is built with modern technologies (React, TypeScript, Node.js, PostgreSQL) and follows best practices for security, performance, and maintainability. All 52 correctness properties ensure the system behaves correctly across all valid inputs, while the comprehensive testing strategy validates both specific examples and universal behaviors.
