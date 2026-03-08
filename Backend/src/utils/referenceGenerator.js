const { pool } = require('../config/db');

/**
 * Generate unique booking reference number
 * Format: ATT-XXXXXX (where X is alphanumeric)
 */
async function generateBookingReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate random 6-character code
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    reference = `ATT-${code}`;

    // Check if reference already exists
    const result = await pool.query(
      'SELECT id FROM bookings WHERE reference_number = $1',
      [reference]
    );

    isUnique = result.rows.length === 0;
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique reference number');
  }

  return reference;
}

module.exports = {
  generateBookingReference,
};
