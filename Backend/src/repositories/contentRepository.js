const { pool } = require('../config/db');

/**
 * Get popular routes
 */
async function getPopularRoutes() {
  const query = `
    SELECT * FROM popular_routes
    WHERE is_active = true
    ORDER BY display_order ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Create popular route
 */
async function createPopularRoute(routeData) {
  const query = `
    INSERT INTO popular_routes (
      pickup_location, pickup_address, destination_name, destination_address,
      distance_km, travel_time_minutes, estimated_fare, display_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    routeData.pickupLocation,
    routeData.pickupAddress,
    routeData.destinationName,
    routeData.destinationAddress,
    routeData.distanceKm,
    routeData.travelTimeMinutes,
    routeData.estimatedFare,
    routeData.displayOrder || 0,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Update popular route
 */
async function updatePopularRoute(id, routeData) {
  const query = `
    UPDATE popular_routes
    SET pickup_location = $1, pickup_address = $2, destination_name = $3,
        destination_address = $4, distance_km = $5, travel_time_minutes = $6,
        estimated_fare = $7, display_order = $8, updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `;

  const values = [
    routeData.pickupLocation,
    routeData.pickupAddress,
    routeData.destinationName,
    routeData.destinationAddress,
    routeData.distanceKm,
    routeData.travelTimeMinutes,
    routeData.estimatedFare,
    routeData.displayOrder,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Delete popular route
 */
async function deletePopularRoute(id) {
  const query = `DELETE FROM popular_routes WHERE id = $1`;
  await pool.query(query, [id]);
}

/**
 * Get testimonials
 */
async function getTestimonials(onlyApproved = false) {
  let query = `
    SELECT * FROM testimonials
    WHERE 1=1
  `;

  if (onlyApproved) {
    query += ` AND is_approved = true`;
  }

  query += ` ORDER BY display_order ASC, created_at DESC`;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get FAQs
 */
async function getFAQs() {
  const query = `
    SELECT * FROM faqs
    WHERE is_active = true
    ORDER BY display_order ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get content section
 */
async function getContentSection(sectionKey) {
  const query = `
    SELECT section_data FROM content_sections
    WHERE section_key = $1
  `;

  const result = await pool.query(query, [sectionKey]);
  return result.rows[0]?.section_data;
}

/**
 * Update content section
 */
async function updateContentSection(sectionKey, sectionData, updatedBy) {
  const query = `
    INSERT INTO content_sections (section_key, section_data, updated_by)
    VALUES ($1, $2, $3)
    ON CONFLICT (section_key) 
    DO UPDATE SET section_data = $2, updated_at = NOW(), updated_by = $3
    RETURNING *
  `;

  const values = [sectionKey, JSON.stringify(sectionData), updatedBy];
  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Get pricing packages
 */
async function getPricingPackages() {
  const query = `
    SELECT * FROM pricing_packages
    WHERE is_active = true
    ORDER BY display_order ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Get pricing ranges
 */
async function getPricingRanges(includeInactive = true) {
  let query = `
    SELECT id, from_km, to_km, price, display_order, is_active, created_at, updated_at
    FROM pricing_ranges
  `;

  if (!includeInactive) {
    query += ' WHERE is_active = true';
  }

  query += ' ORDER BY display_order ASC, from_km ASC';

  const result = await pool.query(query);
  return result.rows;
}

/**
 * Replace pricing ranges in a single transaction
 */
async function replacePricingRanges(ranges = []) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM pricing_ranges');

    const insertQuery = `
      INSERT INTO pricing_ranges (id, from_km, to_km, price, display_order, is_active)
      VALUES (COALESCE($1::uuid, uuid_generate_v4()), $2, $3, $4, $5, $6)
      RETURNING id, from_km, to_km, price, display_order, is_active, created_at, updated_at
    `;

    const inserted = [];
    // UUID regex pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    for (const range of ranges) {
      // Only use ID if it's a valid UUID, otherwise let DB generate new one
      const idValue = (range.id && uuidPattern.test(range.id)) ? range.id : null;
      
      const values = [
        idValue,
        range.fromKm,
        range.toKm,
        range.price,
        range.displayOrder,
        range.isActive !== false,
      ];
      const result = await client.query(insertQuery, values);
      inserted.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return inserted.sort((a, b) => a.display_order - b.display_order);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get pricing setting
 */
async function getPricingSetting(key) {
  const query = `
    SELECT value FROM pricing_settings
    WHERE key = $1
  `;

  const result = await pool.query(query, [key]);
  return result.rows[0]?.value;
}

/**
 * Get all pricing settings
 */
async function getAllPricingSettings() {
  const query = `SELECT * FROM pricing_settings`;
  const result = await pool.query(query);
  
  const settings = {};
  result.rows.forEach(row => {
    settings[row.key] = row.value;
  });
  
  return settings;
}

/**
 * Update pricing setting (UPSERT - INSERT or UPDATE)
 */
async function updatePricingSetting(key, value) {
  const query = `
    INSERT INTO pricing_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) 
    DO UPDATE SET value = $2, updated_at = NOW()
    RETURNING *
  `;

  const result = await pool.query(query, [key, value]);
  return result.rows[0];
}

/**
 * Update pricing package
 */
async function updatePricingPackage(id, packageData) {
  const query = `
    UPDATE pricing_packages
    SET package_name = $1, duration_hours = $2, included_km = $3,
        package_price = $4, display_order = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *
  `;

  const values = [
    packageData.packageName || packageData.name,
    packageData.durationHours || packageData.duration_hours,
    packageData.includedKm || packageData.included_km,
    packageData.packagePrice || packageData.package_price,
    packageData.displayOrder || packageData.display_order || 0,
    id,
  ];

  const result = await pool.query(query, values);
  if (!result.rows[0]) {
    throw new Error(`Pricing package with id ${id} not found`);
  }
  return result.rows[0];
}

/**
 * Save contact form submission
 */
async function saveContactSubmission(contactData) {
  const query = `
    INSERT INTO contact_submissions (name, email, phone, subject, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    contactData.name,
    contactData.email,
    contactData.phone || null,
    contactData.subject || null,
    contactData.message,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Get contact form submissions
 */
async function getContactSubmissions(unreadOnly = false) {
  let query = `
    SELECT * FROM contact_submissions
  `;

  if (unreadOnly) {
    query += ' WHERE is_read = false';
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query);
  return result.rows;
}

module.exports = {
  getPopularRoutes,
  createPopularRoute,
  updatePopularRoute,
  deletePopularRoute,
  getTestimonials,
  getFAQs,
  getContentSection,
  updateContentSection,
  getPricingPackages,
  getPricingRanges,
  replacePricingRanges,
  getPricingSetting,
  getAllPricingSettings,
  updatePricingSetting,
  updatePricingPackage,
  saveContactSubmission,
  getContactSubmissions,
};
