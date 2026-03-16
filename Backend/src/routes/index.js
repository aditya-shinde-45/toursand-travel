const express = require('express');
const healthRoutes = require('./health');
const bookingController = require('../controllers/bookingController');
const contentController = require('../controllers/contentController');
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');
const {
  authRateLimit,
  contactRateLimit,
} = require('../middleware/rateLimit');

const router = express.Router();

// Root endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'Aditya Tours & Travels API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      bookings: '/api/bookings',
      content: '/api/content',
      admin: '/api/admin'
    }
  });
});

// Health check routes
router.use(healthRoutes);

// ============================================
// PUBLIC ROUTES - Booking
// ============================================
router.post('/bookings', bookingController.createBooking);
router.post('/bookings/check-availability', bookingController.checkAvailability);

// ============================================
// PUBLIC ROUTES - Content
// ============================================
router.get('/content/popular-routes', contentController.getPopularRoutes);
router.get('/content/testimonials', contentController.getTestimonials);
router.get('/content/faqs', contentController.getFAQs);
router.get('/content/pricing', contentController.getPricing);
router.get('/content/section/:key', contentController.getContentSection);
router.post('/content/calculate-fare', contentController.calculateFare);
router.post('/content/contact', contactRateLimit, contentController.submitContact);

// ============================================
// ADMIN ROUTES - Authentication
// ============================================
router.post('/admin/login', authRateLimit, adminController.login);

// ============================================
// ADMIN ROUTES - Protected (Require JWT)
// ============================================
router.get('/admin/bookings', authenticateAdmin, adminController.getBookings);
router.patch('/admin/bookings/:id/status', authenticateAdmin, adminController.updateBookingStatus);
router.get('/admin/bookings/:id/history', authenticateAdmin, adminController.getBookingHistory);
router.get('/admin/dashboard/stats', authenticateAdmin, adminController.getDashboardStats);
router.get('/admin/contacts', authenticateAdmin, adminController.getContactSubmissions);

// Admin Content Management - Pricing
router.put('/admin/settings/pricing', authenticateAdmin, adminController.updatePricingSettings);
router.post('/admin/settings/pricing/reset', authenticateAdmin, adminController.resetPricingSettings);
router.get('/admin/settings/pricing', authenticateAdmin, adminController.getPricingSettings);
router.get('/admin/pricing-ranges', authenticateAdmin, adminController.getAdminPricingRanges);
router.put('/admin/pricing-ranges', authenticateAdmin, adminController.updateAdminPricingRanges);

// Admin Content Management - Generic content_sections
router.get('/admin/content/section/:key', authenticateAdmin, adminController.getAdminContentSection);
router.put('/admin/content/section/:key', authenticateAdmin, adminController.upsertAdminContentSection);

module.exports = router;
