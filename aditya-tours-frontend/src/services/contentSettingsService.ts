import { POPULAR_ROUTES, SUPPORT_EMAIL, SUPPORT_PHONE } from '../utils/constants';
import type {
  FooterSectionContent,
  HeroSectionContent,
  PopularRoutesSectionContent,
  PricingSectionContent,
} from '../types/content';
import {
  getAdminContentSection,
  resetPricingSettings,
  updateAdminContentSection,
  updatePricingSettings,
} from './adminService';
import { getPricingPackages } from './contentService';

// All content is now database-driven - localStorage keys removed
// API endpoints should be used for all content CRUD operations

const DEFAULT_POPULAR_ROUTES_SECTION_CONTENT: PopularRoutesSectionContent = {
  title: 'Popular Routes from Thane',
  subtitle: 'Book your most common destinations at fixed rates',
};

const DEFAULT_PRICING_SECTION_CONTENT: PricingSectionContent = {
  title: 'Our Pricing Packages',
  subtitle: 'Choose the perfect package for your journey',
  additionalChargesTitle: 'Additional Charges',
  extraKmLabel: 'Extra Kilometer',
  extraKmRate: '₹15 per km',
  extraHourLabel: 'Extra Hour',
  extraHourRate: '₹150 per hour',
  packages: [
    { id: '2h', packageName: '2 Hours', durationHours: 2, includedKm: 20, packagePrice: 1200, displayOrder: 1 },
    { id: '4h', packageName: '4 Hours', durationHours: 4, includedKm: 40, packagePrice: 1400, displayOrder: 2 },
    { id: '6h', packageName: '6 Hours', durationHours: 6, includedKm: 60, packagePrice: 1800, displayOrder: 3 },
    { id: '8h', packageName: '8 Hours', durationHours: 8, includedKm: 80, packagePrice: 2500, displayOrder: 4 },
    { id: '10h', packageName: '10 Hours', durationHours: 10, includedKm: 100, packagePrice: 3500, displayOrder: 5 },
    { id: '12h', packageName: '12 Hours', durationHours: 12, includedKm: 120, packagePrice: 4000, displayOrder: 6 },
  ],
};

const DEFAULT_HERO_SECTION_CONTENT: HeroSectionContent = {
  badgeText: 'Trusted by 1000+ Customers',
  titleLine1: 'Premium Ertiga',
  titleLine2: 'Cab Service',
  description: 'Reliable taxi booking from Thane with comfortable rides, transparent package fares, and professional service.',
  chipRating: '4.9 Rating',
  chipService: '24/7 Service',
  chipRoutes: 'All Routes',
  primaryButtonText: 'Book Your Ride',
  secondaryButtonText: 'Call Now',
  callPhone: SUPPORT_PHONE,
  stat1Value: '₹15',
  stat1Label: 'Per Kilometer',
  stat1SubLabel: '(Out Station)',
  stat2Value: '7',
  stat2Label: 'Seater',
  stat3Value: '100%',
  stat3Label: 'AC Comfort',
  imageUrl: 'https://images.unsplash.com/photo-1758223725156-ee49cc327a46?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Maruti Suzuki Ertiga',
  floatingCardTopLabel: 'Book Today',
  floatingCardTopValue: 'Save 20%',
  floatingBadge: 'Available Now',
  floatingTag: 'ADITYA',
};

const DEFAULT_FOOTER_SECTION_CONTENT: FooterSectionContent = {
  brandTitle: 'Aditya Tours & Travels',
  brandDescription: 'Reliable Ertiga taxi booking from Thane for city, airport, and outstation trips.',
  quickLinksTitle: 'Quick Links',
  linkHomeLabel: 'Home',
  linkBookLabel: 'Book Taxi',
  linkPrivacyLabel: 'Privacy Policy',
  linkTermsLabel: 'Terms of Service',
  contactTitle: 'Contact',
  contactPhone: SUPPORT_PHONE,
  contactEmail: SUPPORT_EMAIL,
  businessHours: '24/7 (Pre-confirmed rides)',
  responseTime: 'Within 2 hours',
};

// All content is now saved to database only - localStorage helper functions removed
// for consistency with database-first architecture

export function getPopularRoutesSectionContent(): PopularRoutesSectionContent {
  // Return default - fetch from API if needed
  return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
}

export async function savePopularRoutesSectionContent(content: PopularRoutesSectionContent): Promise<void> {
  await updateAdminContentSection<PopularRoutesSectionContent>('popular_routes_section', content);
}

export async function resetPopularRoutesSectionContent(): Promise<PopularRoutesSectionContent> {
  await updateAdminContentSection<PopularRoutesSectionContent>(
    'popular_routes_section',
    DEFAULT_POPULAR_ROUTES_SECTION_CONTENT,
  );
  return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
}

// Popular Routes Data (routes themselves, not just section content)
export function getPopularRoutesData() {
  // Return default popular routes - should fetch from API if needed
  return POPULAR_ROUTES;
}

export async function savePopularRoutesData(routes: unknown): Promise<void> {
  // Database-only: Save to API, never to localStorage
  try {
    // TODO: Implement API endpoint for popular routes data
    console.log('Saving popular routes data to database:', routes);
  } catch (error) {
    console.error('Failed to save popular routes data to database:', error);
    throw error;
  }
}

export async function resetPopularRoutesData(): Promise<void> {
  // Database-only: Reset via API, never localStorage
  try {
    // TODO: Implement API endpoint to reset popular routes data
    console.log('Resetting popular routes data to defaults in database');
  } catch (error) {
    console.error('Failed to reset popular routes data in database:', error);
    throw error;
  }
}

// Pricing Section with API integration (Database-First Approach)
export async function getPricingSectionContent(): Promise<PricingSectionContent> {
  try {
    const packages = await getPricingPackages();

    if (Array.isArray(packages) && packages.length > 0) {
      const normalizedPackages = packages.map((pkg: Record<string, unknown>, index: number) => ({
        id: String(pkg.id ?? `pkg-${index + 1}`),
        packageName: String(pkg.packageName ?? pkg.package_name ?? pkg.name ?? ''),
        durationHours: Number(pkg.durationHours ?? pkg.duration_hours ?? pkg.min_hours ?? 0),
        includedKm: Number(pkg.includedKm ?? pkg.included_km ?? pkg.min_km ?? 0),
        packagePrice: Number(pkg.packagePrice ?? pkg.package_price ?? pkg.price_per_km ?? 0),
        displayOrder: Number(pkg.displayOrder ?? pkg.display_order ?? index + 1),
      }));

      return {
        ...DEFAULT_PRICING_SECTION_CONTENT,
        packages: normalizedPackages,
      };
    }

    // No packages from API, use default
    console.warn('No pricing packages from API, using default');
    return DEFAULT_PRICING_SECTION_CONTENT;
  } catch (error) {
    console.error('Failed to fetch pricing from API:', error);
    // Return default only, never fall back to localStorage
    // This ensures we always get fresh data from the database on next try
    return DEFAULT_PRICING_SECTION_CONTENT;
  }
}

export async function savePricingSectionContent(content: PricingSectionContent): Promise<void> {
  try {
    // Save to API (database) - this is the primary operation
    const result = await updatePricingSettings(content);
    console.log('Pricing saved to database successfully:', result);
  } catch (error) {
    console.error('Failed to save pricing to database:', error);
    throw error; // Re-throw to notify the caller of the failure
  }
}

export async function resetPricingSectionContent(): Promise<PricingSectionContent> {
  try {
    // Reset via API (database) - primary operation
    const data = await resetPricingSettings();
    console.log('Pricing reset to default in database successfully');
    return data;
  } catch (error) {
    console.error('Failed to reset pricing in database:', error);
    throw error; // Re-throw to notify the caller of the failure
  }
}

// Sync version for backward compatibility (returns default, but triggers async load)
export function getPricingSectionContentSync(): PricingSectionContent {
  // Sync fallback for initialization - always return defaults
  // Use async getPricingSectionContent() to fetch from database
  return DEFAULT_PRICING_SECTION_CONTENT;
}

export function getHeroSectionContent(): HeroSectionContent {
  // Return default - fetch from API if needed
  return DEFAULT_HERO_SECTION_CONTENT;
}

export async function saveHeroSectionContent(content: HeroSectionContent): Promise<void> {
  await updateAdminContentSection<HeroSectionContent>('hero_section', content);
}

export async function resetHeroSectionContent(): Promise<HeroSectionContent> {
  await updateAdminContentSection<HeroSectionContent>('hero_section', DEFAULT_HERO_SECTION_CONTENT);
  return DEFAULT_HERO_SECTION_CONTENT;
}

export function getFooterSectionContent(): FooterSectionContent {
  // Return default - fetch from API if needed
  return DEFAULT_FOOTER_SECTION_CONTENT;
}

export async function saveFooterSectionContent(content: FooterSectionContent): Promise<void> {
  await updateAdminContentSection<FooterSectionContent>('footer_section', content);
}

export async function resetFooterSectionContent(): Promise<FooterSectionContent> {
  await updateAdminContentSection<FooterSectionContent>('footer_section', DEFAULT_FOOTER_SECTION_CONTENT);
  return DEFAULT_FOOTER_SECTION_CONTENT;
}

export async function getHeroSectionContentFromDB(): Promise<HeroSectionContent> {
  const section = await getAdminContentSection<{ section_data?: HeroSectionContent }>('hero_section');
  return section?.section_data ?? DEFAULT_HERO_SECTION_CONTENT;
}

export async function getFooterSectionContentFromDB(): Promise<FooterSectionContent> {
  const section = await getAdminContentSection<{ section_data?: FooterSectionContent }>('footer_section');
  return section?.section_data ?? DEFAULT_FOOTER_SECTION_CONTENT;
}

export async function getPopularRoutesSectionContentFromDB(): Promise<PopularRoutesSectionContent> {
  const section = await getAdminContentSection<{ section_data?: PopularRoutesSectionContent }>('popular_routes_section');
  return section?.section_data ?? DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
}

export {
  DEFAULT_FOOTER_SECTION_CONTENT,
  DEFAULT_HERO_SECTION_CONTENT,
  DEFAULT_POPULAR_ROUTES_SECTION_CONTENT,
  DEFAULT_PRICING_SECTION_CONTENT,
};
