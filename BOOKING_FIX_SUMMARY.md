# Booking Not Saving to Database - Root Cause & Fix

## Issue
Bookings were not being saved to the database because the frontend was not calling the actual backend API.

## Root Cause
In `src/components/booking/BookingFlow.tsx`, the booking submission code was using a **mock/placeholder booking** instead of calling the actual backend API. The real code was commented out with a note "Uncomment when backend is ready".

### What Was Happening (Before Fix):
1. User fills out booking form
2. Clicks "Confirm Booking"
3. Frontend generates a fake booking reference: `BK + timestamp`
4. Shows success message with fake reference
5. **Data is never sent to backend** ❌
6. No database record is created

### Why Bookings Appeared to Work:
- Frontend showed a success message with a "booking reference"
- Users thought booking was submitted
- But no data reached the database

## Root Cause Analysis

**File**: `aditya-tours-frontend/src/components/booking/BookingFlow.tsx`  
**Lines**: 49-79

```tsx
// OLD CODE (Mock Booking)
const onConfirmBooking = form.handleSubmit(async (data) => {
  // Mock booking submission until backend is ready
  const mockRef = 'BK' + Date.now().toString().slice(-8);
  setReferenceNumber(mockRef);
  showToast('success', `Booking submitted. Reference: ${mockRef}`);
  // Real API call was commented out...
});
```

## The Fix

### 1. Import the useBooking Hook
Added missing import in BookingFlow.tsx:
```typescript
import { useBooking } from '../../hooks/useBooking';
```

### 2. Use Real Booking Hook
Changed the submission handler to call actual backend:
```tsx
const booking = useBooking();

const onConfirmBooking = form.handleSubmit(async (data) => {
  try {
    const result = await booking.mutateAsync({
      // ... form data
    });
    setReferenceNumber(result.referenceNumber);
    showToast('success', `Booking submitted successfully. Reference: ${result.referenceNumber}`);
  } catch (error) {
    showToast('error', 'Failed to submit booking. Please try again.');
    console.error('Booking error:', error);
  }
});
```

### 3. Added Missing totalFare Field
Backend requires `totalFare` field which frontend wasn't sending.

**Files Modified**:
- `src/hooks/useBooking.ts` - Added fare calculation function
- `src/services/bookingService.ts` - Added totalFare to BookingPayload interface

**Fare Calculation Logic**:
```typescript
function calculateFare(distanceKm: number, passengerCount: number, tripType: string): number {
  const baseRate = 100;           // Base rate in currency units
  const perKmRate = 15;            // Rate per km
  let fare = (baseRate + distanceKm * perKmRate) * passengerCount;
  
  // 10% discount for round trips
  if (tripType === 'ROUND_TRIP') {
    fare = fare * 0.9;
  }
  
  return Math.round(fare);
}
```

## Files Modified

1. **aditya-tours-frontend/src/components/booking/BookingFlow.tsx**
   - Added import for `useBooking` hook
   - Replaced mock booking with real API call
   - Added error handling

2. **aditya-tours-frontend/src/hooks/useBooking.ts**
   - Added `calculateFare()` function
   - Updated mutation to calculate and send `totalFare`

3. **aditya-tours-frontend/src/services/bookingService.ts**
   - Updated `BookingPayload` interface to include `totalFare`

## Flow Now Works As Expected

```
User submits booking
    ↓
Frontend validates form (bookingSchema)
    ↓
useBooking hook calculates totalFare
    ↓
Sends POST request to /api/bookings with all required fields
    ↓
Backend bookingController receives request
    ↓
Validates all required fields (including totalFare)
    ↓
Creates booking record in database
    ↓
Returns referenceNumber to frontend
    ↓
Shows success message with real reference number
    ↓
User can now track booking
    ✅ Booking is saved in database
```

## Required Fields Now Sent

✅ tripType  
✅ pickupAddress, pickupLat, pickupLng  
✅ dropAddress, dropLat, dropLng  
✅ distanceKm  
✅ travelTimeMinutes  
✅ departureDatetime  
✅ returnDatetime (if round trip)  
✅ customerName  
✅ customerPhone  
✅ customerEmail  
✅ passengerCount  
✅ specialInstructions  
✅ **totalFare** (newly added)

## Testing Steps

1. **Run frontend**: `npm run dev`
2. **Run backend**: `npm run dev` in Backend folder
3. Navigate to `/book` page
4. Fill out booking form completely
5. Click "Confirm Booking"
6. Should see success message with reference number
7. Check database: `SELECT * FROM bookings;` should show new record
8. Try tracking the booking at `/track` page - should work now

## Fare Calculation Examples

| Distance | Passengers | Trip Type | Fare |
|----------|-----------|-----------|------|
| 20 km | 1 | ONE_WAY | 400 |
| 20 km | 2 | ONE_WAY | 800 |
| 20 km | 2 | ROUND_TRIP | 720 (10% discount) |
| 50 km | 1 | ONE_WAY | 850 |

Base Formula: `(100 + (distanceKm × 15)) × passengerCount × (1 - 0.1 if ROUND_TRIP)`

## Next Steps (Optional Improvements)

1. Implement dynamic pricing based on surge rates, vehicle type
2. Add promo code support
3. Implement payment integration before booking confirmation
4. Add booking cancellation logic
5. Send SMS confirmation in addition to email
