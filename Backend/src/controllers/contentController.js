const contentRepository = require('../repositories/contentRepository');

/**
 * Get all popular routes
 * GET /api/content/popular-routes
 */
async function getPopularRoutes(req, res) {
  try {
    const routes = await contentRepository.getPopularRoutes();

    res.json({
      success: true,
      data: routes
    });

  } catch (error) {
    console.error('Error fetching popular routes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular routes'
    });
  }
}

/**
 * Get all testimonials
 * GET /api/content/testimonials
 */
async function getTestimonials(req, res) {
  try {
    const approvedOnly = req.query.approved !== 'false';
    const testimonials = await contentRepository.getTestimonials(approvedOnly);

    res.json({
      success: true,
      data: testimonials
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials'
    });
  }
}

/**
 * Get all FAQs
 * GET /api/content/faqs
 */
async function getFAQs(req, res) {
  try {
    const faqs = await contentRepository.getFAQs();

    res.json({
      success: true,
      data: faqs
    });

  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs'
    });
  }
}

/**
 * Get pricing packages
 * GET /api/content/pricing
 */
async function getPricing(req, res) {
  try {
    const packages = await contentRepository.getPricingPackages();

    res.json({
      success: true,
      data: packages
    });

  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pricing'
    });
  }
}

/**
 * Get content section by key
 * GET /api/content/section/:key
 */
async function getContentSection(req, res) {
  try {
    const { key } = req.params;
    const section = await contentRepository.getContentSection(key);

    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Content section not found'
      });
    }

    res.json({
      success: true,
      data: section
    });

  } catch (error) {
    console.error('Error fetching content section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content section'
    });
  }
}

/**
 * Calculate fare based on distance and pricing ranges
 * POST /api/content/calculate-fare
 */
async function calculateFare(req, res) {
  try {
      const { distanceKm, pickupLat, pickupLng, dropLat, dropLng, isRoundTrip } = req.body;

    if (!distanceKm || distanceKm <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid distance in kilometers is required'
      });
    }

      // For round trips, double the distance for pricing
      const effectiveDistance = isRoundTrip ? distanceKm * 2 : distanceKm;

    // Get active pricing ranges
    const ranges = await contentRepository.getPricingRanges(false);
    
    if (!ranges || ranges.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No pricing ranges configured'
      });
    }

    // Find matching price range
    const matchingRange = ranges.find(
        range => effectiveDistance >= range.from_km && effectiveDistance <= range.to_km
    );

    let baseFare = 0;
    let rangeInfo = null;

    if (matchingRange) {
      baseFare = Number(matchingRange.price);
      rangeInfo = {
        fromKm: matchingRange.from_km,
        toKm: matchingRange.to_km,
        price: matchingRange.price
      };
    } else {
      // If no exact match, use the highest range or calculate based on last range
      const sortedRanges = ranges.sort((a, b) => Number(b.to_km) - Number(a.to_km));
      const highestRange = sortedRanges[0];
      
        if (effectiveDistance > Number(highestRange.to_km)) {
        // Calculate based on last range rate
        const ratePerKm = Number(highestRange.price) / Number(highestRange.to_km);
          baseFare = Math.round(ratePerKm * effectiveDistance);
      } else {
        // Use lowest range if distance is below all ranges
        baseFare = Number(sortedRanges[sortedRanges.length - 1].price);
      }
      
      rangeInfo = {
        fromKm: 0,
          toKm: effectiveDistance,
        price: baseFare,
        calculated: true
      };
    }

    // Calculate estimated toll (simplified - you can integrate actual toll API)
    let tollCharges = 0;
    if (pickupLat && pickupLng && dropLat && dropLng) {
      // Estimate toll based on distance (rough approximation)
      // For Mumbai-Thane region: ~₹50-100 for distances > 30km
        // For round trips, double the toll charges
        if (effectiveDistance > 30) {
          tollCharges = Math.round(effectiveDistance / 30) * 50;
      }
    }

    const totalFare = baseFare + tollCharges;

    res.json({
      success: true,
      data: {
        distanceKm: Number(distanceKm),
          effectiveDistance: Number(effectiveDistance),
          isRoundTrip: Boolean(isRoundTrip),
        baseFare,
        tollCharges,
        totalFare,
        rangeInfo,
        breakdown: {
          baseFare: {
            amount: baseFare,
              description: `Base fare for ${distanceKm} km${isRoundTrip ? ' (round trip: ' + effectiveDistance + ' km total)' : ''}`
          },
          tollCharges: {
            amount: tollCharges,
            description: tollCharges > 0 ? 'Estimated toll charges (actual may vary)' : 'No toll charges'
          },
          total: {
            amount: totalFare,
            description: 'Total estimated fare'
          }
        },
          disclaimer: isRoundTrip 
            ? 'Round trip fare calculated. Final fare may include waiting charges, parking fees, and actual toll amounts. Admin will confirm the final amount.'
            : 'Final fare may include waiting charges, parking fees, and actual toll amounts. Admin will confirm the final amount.'
      }
    });

  } catch (error) {
    console.error('Error calculating fare:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate fare'
    });
  }
}

/**
 * Submit contact form
 * POST /api/content/contact
 */
async function submitContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    const submission = await contentRepository.saveContactSubmission({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
}

module.exports = {
  getPopularRoutes,
  getTestimonials,
  getFAQs,
  getPricing,
  getContentSection,
  calculateFare,
  submitContact
};
