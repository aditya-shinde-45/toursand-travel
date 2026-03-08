const { pool } = require('../config/db');
const { generateBookingReference } = require('../utils/referenceGenerator');

/**
 * Create a new booking
 */
async function createBooking(bookingData) {
  const referenceNumber = await generateBookingReference();
  
  const query = `
    INSERT INTO bookings (
      reference_number, status, trip_type,
      pickup_address, pickup_lat, pickup_lng,
      drop_address, drop_lat, drop_lng,
      distance_km, travel_time_minutes,
      departure_datetime, return_datetime,
      customer_name, customer_phone, customer_email,
      passenger_count, special_instructions, total_fare
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *
  `;

  const values = [
    referenceNumber,
    'PENDING',
    bookingData.tripType,
    bookingData.pickupAddress,
    bookingData.pickupLat,
    bookingData.pickupLng,
    bookingData.dropAddress,
    bookingData.dropLat,
    bookingData.dropLng,
    bookingData.distanceKm,
    bookingData.travelTimeMinutes,
    bookingData.departureDatetime,
    bookingData.returnDatetime || null,
    bookingData.customerName,
    bookingData.customerPhone,
    bookingData.customerEmail,
    bookingData.passengerCount,
    bookingData.specialInstructions || null,
    bookingData.totalFare,
  ];

  const result = await pool.query(query, values);
  
  // Add initial history entry
  await addBookingHistory(result.rows[0].id, null, 'PENDING', null, 'Booking created');
  
  return result.rows[0];
}

/**
 * Find booking by reference number and email
 */
async function findBookingByReference(referenceNumber, email) {
  const query = `
    SELECT * FROM bookings
    WHERE reference_number = $1 AND customer_email = $2
  `;
  
  const result = await pool.query(query, [referenceNumber, email]);
  return result.rows[0];
}

/**
 * Find booking by ID
 */
async function findBookingById(id) {
  const query = `SELECT * FROM bookings WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

/**
 * Get all bookings with filters
 */
async function getBookings(filters = {}) {
  let query = `
    SELECT * FROM bookings
    WHERE 1=1
  `;
  const values = [];
  let paramCount = 1;

  if (filters.status) {
    query += ` AND status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  if (filters.startDate) {
    query += ` AND departure_datetime >= $${paramCount}`;
    values.push(filters.startDate);
    paramCount++;
  }

  if (filters.endDate) {
    query += ` AND departure_datetime <= $${paramCount}`;
    values.push(filters.endDate);
    paramCount++;
  }

  query += ` ORDER BY created_at DESC`;

  // Get total count first
  const total = await getBookingsCount(filters);

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  query += ` LIMIT $${paramCount}`;
  values.push(limit);
  paramCount++;

  query += ` OFFSET $${paramCount}`;
  values.push(offset);

  const result = await pool.query(query, values);
  
  return {
    bookings: result.rows,
    page: page,
    limit: limit,
    total: total
  };
}

/**
 * Get booking count with filters
 */
async function getBookingsCount(filters = {}) {
  let query = `SELECT COUNT(*) as count FROM bookings WHERE 1=1`;
  const values = [];
  let paramCount = 1;

  if (filters.status) {
    query += ` AND status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  if (filters.startDate) {
    query += ` AND departure_datetime >= $${paramCount}`;
    values.push(filters.startDate);
    paramCount++;
  }

  if (filters.endDate) {
    query += ` AND departure_datetime <= $${paramCount}`;
    values.push(filters.endDate);
  }

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count);
}

/**
 * Update booking status
 */
async function updateBookingStatus(bookingId, newStatus, adminId, notes) {
  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  const previousStatus = booking.status;
  const timestampField = {
    CONFIRMED: 'confirmed_at',
    CANCELLED: 'cancelled_at',
    COMPLETED: 'completed_at',
  }[newStatus];

  let query = `
    UPDATE bookings 
    SET status = $1, updated_at = NOW()
  `;
  
  const values = [newStatus];
  let paramCount = 2;

  if (timestampField) {
    query += `, ${timestampField} = NOW()`;
  }

  if (notes) {
    query += `, admin_notes = $${paramCount}`;
    values.push(notes);
    paramCount++;
  }

  query += ` WHERE id = $${paramCount} RETURNING *`;
  values.push(bookingId);

  const result = await pool.query(query, values);

  // Add history entry
  await addBookingHistory(bookingId, previousStatus, newStatus, adminId, notes);

  return result.rows[0];
}

/**
 * Add booking history entry
 */
async function addBookingHistory(bookingId, previousStatus, newStatus, changedBy, notes) {
  const query = `
    INSERT INTO booking_history (booking_id, previous_status, new_status, changed_by, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [bookingId, previousStatus, newStatus, changedBy, notes];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Get booking history
 */
async function getBookingHistory(bookingId) {
  const query = `
    SELECT bh.*, au.name as changed_by_name
    FROM booking_history bh
    LEFT JOIN admin_users au ON bh.changed_by = au.id
    WHERE bh.booking_id = $1
    ORDER BY bh.changed_at DESC
  `;

  const result = await pool.query(query, [bookingId]);
  return result.rows;
}

/**
 * Check vehicle availability
 */
async function checkAvailability(startDatetime, endDatetime) {
  const query = `
    SELECT COUNT(*) as count FROM vehicle_blocks
    WHERE (start_datetime, end_datetime) OVERLAPS ($1, $2)
  `;

  const result = await pool.query(query, [startDatetime, endDatetime]);
  return parseInt(result.rows[0].count) === 0;
}

/**
 * Create vehicle block for confirmed booking
 */
async function createVehicleBlock(bookingId, startDatetime, endDatetime) {
  const query = `
    INSERT INTO vehicle_blocks (booking_id, start_datetime, end_datetime)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [bookingId, startDatetime, endDatetime]);
  return result.rows[0];
}

/**
 * Get dashboard statistics
 */
async function getDashboardStats(startDate, endDate) {
  let query = `SELECT * FROM dashboard_stats`;
  
  // If date range specified, get custom stats
  if (startDate || endDate) {
    query = `
      SELECT
        COUNT(*) FILTER (WHERE status = 'PENDING') as pending_requests,
        COUNT(*) FILTER (WHERE status = 'CONFIRMED') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_bookings,
        COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled_bookings,
        COUNT(*) as total_bookings,
        COALESCE(SUM(total_fare) FILTER (WHERE status = 'COMPLETED'), 0) as total_revenue
      FROM bookings
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND created_at >= $${paramCount}`;
      values.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND created_at <= $${paramCount}`;
      values.push(endDate);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  const result = await pool.query(query);
  return result.rows[0];
}

module.exports = {
  createBooking,
  findBookingByReference,
  findBookingById,
  getBookings,
  getBookingsCount,
  updateBookingStatus,
  addBookingHistory,
  getBookingHistory,
  checkAvailability,
  createVehicleBlock,
  getDashboardStats,
};
