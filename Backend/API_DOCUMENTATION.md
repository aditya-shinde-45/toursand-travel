# Aditya Tours & Travels - API Documentation

Base URL: `http://localhost:5000/api`

## Public Endpoints

### 1. Create Booking
**POST** `/bookings`

Create a new booking.

**Request Body:**
```json
{
  "tripType": "ONE_WAY",
  "pickupAddress": "Thane Station, Thane West, Thane, Maharashtra 400601, India",
  "pickupLat": 19.1864,
  "pickupLng": 72.9766,
  "dropAddress": "Mumbai Airport, Mumbai, Maharashtra 400099, India",
  "dropLat": 19.0896,
  "dropLng": 72.8656,
  "distanceKm": 32.5,
  "travelTimeMinutes": 65,
  "departureDateTime": "2024-03-15T10:00:00Z",
  "returnDateTime": null,
  "customerName": "Rajesh Kumar",
  "customerPhone": "+919876543210",
  "customerEmail": "rajesh@example.com",
  "passengerCount": 2,
  "specialInstructions": "Please call 15 minutes before arrival",
  "totalFare": 1350
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reference_number": "ATT-A7K9M2",
    "status": "PENDING",
    ...
  },
  "message": "Booking created successfully"
}
```

---

### 2. Check Availability
**POST** `/bookings/check-availability`

Check if vehicles are available for a time slot.

**Request Body:**
```json
{
  "startDateTime": "2024-03-15T10:00:00Z",
  "endDateTime": "2024-03-15T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

---

### 3. Get Popular Routes
**GET** `/content/popular-routes`

Get all active popular routes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "pickup_location": "Thane Station",
      "pickup_address": "...",
      "destination_name": "Mumbai Airport",
      "destination_address": "...",
      "distance_km": 32.5,
      "travel_time_minutes": 65,
      "estimated_fare": 1350
    }
  ]
}
```

---

### 5. Get Testimonials
**GET** `/content/testimonials?approved=true`

Get customer testimonials.

**Query Parameters:**
- `approved` (optional): `true` to get only approved testimonials (default: true)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "customer_name": "Rajesh Kumar",
      "review_text": "Excellent service!",
      "rating": 5,
      "review_date": "2024-01-15"
    }
  ]
}
```

---

### 6. Get FAQs
**GET** `/content/faqs`

Get all active FAQs.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "How do I book a cab?",
      "answer": "You can book...",
      "category": "Booking"
    }
  ]
}
```

---

### 7. Get Pricing
**GET** `/content/pricing`

Get all pricing packages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "package_name": "4 Hours / 40 Km",
      "duration_hours": 4,
      "included_km": 40,
      "package_price": 1400
    }
  ]
}
```

---

### 8. Submit Contact Form
**POST** `/content/contact`

Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "subject": "Inquiry about outstation trips",
  "message": "I would like to know..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    ...
  },
  "message": "Contact form submitted successfully"
}
```

---

## Admin Endpoints

### 9. Admin Login
**POST** `/admin/login`

Authenticate admin user and get JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "uuid",
      "username": "admin",
      "name": "Admin User",
      "email": "admin@adityatours.com"
    }
  }
}
```

---

### 10. Get All Bookings (Protected)
**GET** `/admin/bookings`

Get all bookings with filters.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `startDate` (optional): Filter bookings from this date
- `endDate` (optional): Filter bookings until this date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 11. Update Booking Status (Protected)
**PATCH** `/admin/bookings/:id/status`

Update booking status.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "status": "CONFIRMED",
  "reason": "Payment verified"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "CONFIRMED",
    ...
  },
  "message": "Booking status updated successfully"
}
```

---

### 12. Get Dashboard Stats (Protected)
**GET** `/admin/dashboard/stats`

Get dashboard statistics.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `startDate` (optional): Stats from this date
- `endDate` (optional): Stats until this date

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "pendingBookings": 5,
    "confirmedBookings": 120,
    "completedBookings": 20,
    "cancelledBookings": 5,
    "totalRevenue": 450000
  }
}
```

---

### 13. Get Booking History (Protected)
**GET** `/admin/bookings/:id/history`

Get status change history for a booking.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "previous_status": "PENDING",
      "new_status": "CONFIRMED",
      "changed_at": "2024-03-15T10:00:00Z",
      "notes": "Payment verified",
      "changed_by": "uuid"
    }
  ]
}
```

---

### 14. Get Contact Submissions (Protected)
**GET** `/admin/contacts?unreadOnly=true`

Get contact form submissions.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `unreadOnly` (optional): Get only unread submissions (default: false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "subject": "Inquiry",
      "message": "...",
      "is_read": false,
      "created_at": "2024-03-15T10:00:00Z"
    }
  ]
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `409` - Conflict (e.g., vehicle not available)
- `500` - Internal Server Error

---

## Testing with cURL

### Create a booking:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": "ONE_WAY",
    "pickupAddress": "Thane Station",
    "pickupLat": 19.1864,
    "pickupLng": 72.9766,
    "dropAddress": "Mumbai Airport",
    "dropLat": 19.0896,
    "dropLng": 72.8656,
    "distanceKm": 32.5,
    "travelTimeMinutes": 65,
    "departureDateTime": "2024-03-15T10:00:00Z",
    "customerName": "Test User",
    "customerPhone": "+919876543210",
    "customerEmail": "test@example.com",
    "passengerCount": 2,
    "totalFare": 1350
  }'
```

### Admin login:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get bookings (admin):
```bash
curl http://localhost:5000/api/admin/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
