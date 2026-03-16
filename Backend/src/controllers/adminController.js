const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminRepository = require('../repositories/adminRepository');
const bookingRepository = require('../repositories/bookingRepository');
const contentRepository = require('../repositories/contentRepository');
const { sendBookingStatusUpdateEmail, sendAdminStatusUpdateNotification } = require('../services/emailService');
const { JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL } = require('../config/env');

/**
 * Admin login
 * POST /api/admin/login
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    let admin;

    // Preferred authentication source: .env credentials
    if (ADMIN_USERNAME && ADMIN_PASSWORD) {
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Try to load admin profile from database, otherwise create a minimal admin object
      try {
        admin = await adminRepository.findAdminByUsername(ADMIN_USERNAME);
      } catch (dbError) {
        console.log('Admin not found in database, using .env credentials');
        // Create a temporary admin object from .env
        admin = {
          id: 'admin-1',
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          name: 'Administrator'
        };
      }

      // If admin exists in DB, use it; otherwise use the env-based object
      if (!admin) {
        admin = {
          id: 'admin-1',
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          name: 'Administrator'
        };
      }
    } else {
      // Fallback authentication via database hash
      admin = await adminRepository.findAdminByUsername(username);

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const isValid = await bcrypt.compare(password, admin.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email
        }
      }
    });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}

/**
 * Get all bookings (with filters)
 * GET /api/admin/bookings
 */
async function getBookings(req, res) {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    filters.page = parseInt(page);
    filters.limit = parseInt(limit);

    const result = await bookingRepository.getBookings(filters);

    res.json({
      success: true,
      data: {
        items: result.bookings,
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
}

/**
 * Update booking status
 * PATCH /api/admin/bookings/:id/status
 */
async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminId = req.admin.id; // From auth middleware

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Get the booking before update to capture old status
    const oldBooking = await bookingRepository.findBookingById(id);
    if (!oldBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const oldStatus = oldBooking.status;

    // Update booking status
    const booking = await bookingRepository.updateBookingStatus(
      id,
      status,
      adminId,
      reason
    );

    // Wait for email attempts so Lambda does not finish before SMTP sends complete.
    if (oldStatus !== status) {
      const adminName = req.admin.name || req.admin.username || 'Admin';
      const emailResults = await Promise.allSettled([
        sendBookingStatusUpdateEmail(booking, oldStatus, status),
        sendAdminStatusUpdateNotification(booking, oldStatus, status, adminName),
      ]);

      if (emailResults[0].status === 'fulfilled') {
        console.log(`Status update email sent to ${booking.customer_email}`);
      } else {
        console.error('Failed to send status update email:', emailResults[0].reason);
      }

      if (emailResults[1].status === 'fulfilled') {
        console.log('Admin status update notification sent');
      } else {
        console.error('Failed to send admin notification:', emailResults[1].reason);
      }
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
}

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
async function getDashboardStats(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await bookingRepository.getDashboardStats(startDate, endDate);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
}

/**
 * Get booking history
 * GET /api/admin/bookings/:id/history
 */
async function getBookingHistory(req, res) {
  try {
    const { id } = req.params;
    
    const history = await bookingRepository.getBookingHistory(id);

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking history'
    });
  }
}

/**
 * Get contact form submissions
 * GET /api/admin/contacts
 */
async function getContactSubmissions(req, res) {
  try {
    const { unreadOnly = 'false' } = req.query;
    
    const submissions = await contentRepository.getContactSubmissions(
      unreadOnly === 'true'
    );

    res.json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact submissions'
    });
  }
}

/**
 * Get pricing settings and packages
 * GET /api/admin/settings/pricing
 */
async function getPricingSettings(req, res) {
  try {
    const packages = await contentRepository.getPricingPackages();
    const settings = await contentRepository.getAllPricingSettings();

    res.json({
      success: true,
      data: {
        packages,
        settings
      }
    });

  } catch (error) {
    console.error('Error fetching pricing settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pricing settings'
    });
  }
}

/**
 * Update pricing settings and packages
 * PUT /api/admin/settings/pricing
 */
async function updatePricingSettings(req, res) {
  try {
    const { title, subtitle, additionalChargesTitle, extraKmLabel, extraKmRate, extraHourLabel, extraHourRate, packages } = req.body;

    console.log('🔄 Updating pricing settings:', { title, subtitle, numPackages: packages?.length || 0 });

    // Validate required fields
    if (!title || !subtitle) {
      return res.status(400).json({
        success: false,
        error: 'Title and subtitle are required'
      });
    }

    // Update settings - using UPSERT (INSERT ... ON CONFLICT)
    if (title) {
      const result = await contentRepository.updatePricingSetting('pricing_title', title);
      console.log('✅ Updated pricing_title');
    }
    if (subtitle) {
      const result = await contentRepository.updatePricingSetting('pricing_subtitle', subtitle);
      console.log('✅ Updated pricing_subtitle');
    }
    if (additionalChargesTitle !== undefined) {
      const result = await contentRepository.updatePricingSetting('additional_charges_title', additionalChargesTitle);
      console.log('✅ Updated additional_charges_title');
    }
    if (extraKmLabel !== undefined) {
      const result = await contentRepository.updatePricingSetting('extra_km_label', extraKmLabel);
      console.log('✅ Updated extra_km_label');
    }
    if (extraKmRate !== undefined) {
      const result = await contentRepository.updatePricingSetting('extra_km_rate', extraKmRate);
      console.log('✅ Updated extra_km_rate');
    }
    if (extraHourLabel !== undefined) {
      const result = await contentRepository.updatePricingSetting('extra_hour_label', extraHourLabel);
      console.log('✅ Updated extra_hour_label');
    }
    if (extraHourRate !== undefined) {
      const result = await contentRepository.updatePricingSetting('extra_hour_rate', extraHourRate);
      console.log('✅ Updated extra_hour_rate');
    }

    // Update packages if provided
    if (Array.isArray(packages) && packages.length > 0) {
      console.log(`📦 Updating ${packages.length} packages...`);
      for (const pkg of packages) {
        if (pkg.id) {
          const result = await contentRepository.updatePricingPackage(pkg.id, pkg);
          console.log(`✅ Updated package ${pkg.id}`);
        }
      }
    }

    // Return updated data
    const updatedPackages = await contentRepository.getPricingPackages();
    const updatedSettings = await contentRepository.getAllPricingSettings();

    console.log('✅ Pricing settings updated successfully');
    res.json({
      success: true,
      message: 'Pricing settings updated successfully',
      data: {
        packages: updatedPackages,
        settings: updatedSettings
      }
    });

  } catch (error) {
    console.error('❌ Error updating pricing settings:', error.message);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to update pricing settings',
      details: error.message
    });
  }
}

/**
 * Reset pricing settings to defaults
 * POST /api/admin/settings/pricing/reset
 */
async function resetPricingSettings(req, res) {
  try {
    // Reset to default values
    const defaults = {
      pricing_title: 'Our Pricing Packages',
      pricing_subtitle: 'Choose the perfect package for your journey',
      additional_charges_title: 'Additional Charges',
      extra_km_label: 'Extra Kilometer',
      extra_km_rate: '₹15 per km',
      extra_hour_label: 'Extra Hour',
      extra_hour_rate: '₹150 per hour'
    };

    for (const [key, value] of Object.entries(defaults)) {
      await contentRepository.updatePricingSetting(key, value);
    }

    const packages = await contentRepository.getPricingPackages();
    const settings = await contentRepository.getAllPricingSettings();

    res.json({
      success: true,
      message: 'Pricing settings reset to defaults',
      data: {
        packages,
        settings
      }
    });

  } catch (error) {
    console.error('Error resetting pricing settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset pricing settings'
    });
  }
}

/**
 * Get admin pricing ranges
 * GET /api/admin/pricing-ranges
 */
async function getAdminPricingRanges(req, res) {
  try {
    const [ranges, section] = await Promise.all([
      contentRepository.getPricingRanges(true),
      contentRepository.getContentSection('price_ranges_section')
    ]);

    res.json({
      success: true,
      data: {
        title: section?.title || 'Distance Based Price Ranges',
        subtitle: section?.subtitle || 'Set fare by distance slab (from km to km).',
        ranges
      }
    });
  } catch (error) {
    console.error('Error fetching pricing ranges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pricing ranges'
    });
  }
}

/**
 * Replace admin pricing ranges
 * PUT /api/admin/pricing-ranges
 */
async function updateAdminPricingRanges(req, res) {
  try {
    const { title, subtitle, ranges } = req.body || {};

    if (!Array.isArray(ranges) || ranges.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one pricing range is required'
      });
    }

    const normalizedRanges = ranges.map((range, index) => ({
      id: typeof range.id === 'string' ? range.id : null,
      fromKm: Number(range.fromKm ?? range.from_km ?? 0),
      toKm: Number(range.toKm ?? range.to_km ?? 0),
      price: Number(range.price ?? 0),
      displayOrder: Number(range.displayOrder ?? range.display_order ?? index + 1),
      isActive: range.isActive ?? range.is_active ?? true,
    }));

    const hasInvalidRange = normalizedRanges.some(
      (range) => Number.isNaN(range.fromKm)
        || Number.isNaN(range.toKm)
        || Number.isNaN(range.price)
        || range.fromKm < 0
        || range.toKm < range.fromKm
        || range.price < 0,
    );

    if (hasInvalidRange) {
      return res.status(400).json({
        success: false,
        error: 'One or more ranges are invalid'
      });
    }

    const savedRanges = await contentRepository.replacePricingRanges(normalizedRanges);

    const meta = {
      title: typeof title === 'string' && title.trim() ? title.trim() : 'Distance Based Price Ranges',
      subtitle: typeof subtitle === 'string' && subtitle.trim() ? subtitle.trim() : 'Set fare by distance slab (from km to km).',
    };

    await contentRepository.updateContentSection('price_ranges_section', meta, req.admin?.id || null);

    res.json({
      success: true,
      message: 'Pricing ranges updated successfully',
      data: {
        ...meta,
        ranges: savedRanges,
      }
    });
  } catch (error) {
    console.error('Error updating pricing ranges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pricing ranges'
    });
  }
}

/**
 * Get admin content section by key
 * GET /api/admin/content/section/:key
 */
async function getAdminContentSection(req, res) {
  try {
    const { key } = req.params;
    const section = await contentRepository.getContentSection(key);

    res.json({
      success: true,
      data: section || null
    });
  } catch (error) {
    console.error('Error fetching admin content section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin content section'
    });
  }
}

/**
 * Upsert admin content section by key
 * PUT /api/admin/content/section/:key
 */
async function upsertAdminContentSection(req, res) {
  try {
    const { key } = req.params;
    const sectionData = req.body;

    if (!sectionData || typeof sectionData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Section data is required'
      });
    }

    const updatedBy = req.admin?.id || null;
    const updated = await contentRepository.updateContentSection(key, sectionData, updatedBy);

    res.json({
      success: true,
      message: 'Content section updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating admin content section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update admin content section'
    });
  }
}

module.exports = {
  login,
  getBookings,
  updateBookingStatus,
  getDashboardStats,
  getBookingHistory,
  getContactSubmissions,
  getPricingSettings,
  updatePricingSettings,
  resetPricingSettings,
  getAdminPricingRanges,
  updateAdminPricingRanges,
  getAdminContentSection,
  upsertAdminContentSection
};
