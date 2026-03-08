const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Find admin user by username
 */
async function findAdminByUsername(username) {
  const query = `
    SELECT * FROM admin_users
    WHERE username = $1 AND is_active = true
  `;

  const result = await pool.query(query, [username]);
  return result.rows[0];
}

/**
 * Find admin user by ID
 */
async function findAdminById(id) {
  const query = `
    SELECT id, username, name, email, is_active, created_at
    FROM admin_users
    WHERE id = $1 AND is_active = true
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
}

/**
 * Create admin user
 */
async function createAdminUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const query = `
    INSERT INTO admin_users (username, password_hash, name, email)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, name, email, created_at
  `;

  const values = [
    userData.username,
    hashedPassword,
    userData.name,
    userData.email,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Verify admin password
 */
async function verifyAdminPassword(username, password) {
  const admin = await findAdminByUsername(username);
  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    return null;
  }

  // Return admin without password hash
  const { password_hash, ...adminData } = admin;
  return adminData;
}

/**
 * Update admin password
 */
async function updateAdminPassword(adminId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const query = `
    UPDATE admin_users
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
  `;

  await pool.query(query, [hashedPassword, adminId]);
}

/**
 * Update admin profile
 */
async function updateAdminProfile(adminId, profileData) {
  const query = `
    UPDATE admin_users
    SET name = $1, email = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING id, username, name, email
  `;

  const values = [profileData.name, profileData.email, adminId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  findAdminByUsername,
  findAdminById,
  createAdminUser,
  verifyAdminPassword,
  updateAdminPassword,
  updateAdminProfile,
};
