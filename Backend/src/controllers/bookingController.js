const bookingRepository = require('../repositories/bookingRepository');
const { sendBookingConfirmationEmail, sendAdminNewBookingNotification } = require('../services/emailService');

/**
 * Create a new booking
 * POST /api/bookings
 */
async function createBooking(req, res) {
  try {
    const bookingData = req.body;

    // Validate required fields
    const requiredFields = [
      'tripType', 'pickupAddress', 'pickupLat', 'pickupLng',
      'dropAddress', 'dropLat', 'dropLng', 'distanceKm',
      'travelTimeMinutes', 'departureDatetime', 'customerName',
      'customerPhone', 'customerEmail', 'totalFare'
    ];

    const missingFields = requiredFields.filter(field => !bookingData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check availability
    const endDateTime = bookingData.returnDatetime || 
      new Date(new Date(bookingData.departureDatetime).getTime() + (bookingData.travelTimeMinutes * 60000));
    
    const isAvailable = await bookingRepository.checkAvailability(
      bookingData.departureDatetime,
      endDateTime
    );

    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        error: 'No vehicles available for the selected time slot'
      });
    }

    // Create booking
    const booking = await bookingRepository.createBooking(bookingData);

    const emailResults = await Promise.allSettled([
      sendBookingConfirmationEmail(booking),
      sendAdminNewBookingNotification(booking),
    ]);

    if (emailResults[0].status === 'rejected') {
      console.error('Failed to send confirmation email:', emailResults[0].reason);
    }

    if (emailResults[1].status === 'rejected') {
      console.error('Failed to send admin notification:', emailResults[1].reason);
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
}

/**
 * Track booking by reference number
 * GET /api/bookings/track/:reference
 */
async function trackBooking(req, res) {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'Reference number is required'
      });
    }

    const booking = await bookingRepository.findBookingByReference(reference);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error tracking booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track booking'
    });
  }
}

/**
 * Check vehicle availability
 * POST /api/bookings/check-availability
 */
async function checkAvailability(req, res) {
  try {
    const { startDateTime, endDateTime } = req.body;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({
        success: false,
        error: 'Start and end date/time are required'
      });
    }

    const isAvailable = await bookingRepository.checkAvailability(
      startDateTime,
      endDateTime
    );

    res.json({
      success: true,
      data: { available: isAvailable }
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check availability'
    });
  }
}

module.exports = {
  createBooking,
  trackBooking,
  checkAvailability
};
