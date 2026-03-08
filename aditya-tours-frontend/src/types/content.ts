export interface PopularRoute {
  id: string;
  pickupLocation: string;
  pickupAddress: string;
  destinationName: string;
  destinationAddress: string;
  distanceKm: number;
  travelTimeMinutes: number;
  estimatedFare: number;
  displayOrder: number;
}

export interface PopularRoutesSectionContent {
  title: string;
  subtitle: string;
}

export interface PricingSectionContent {
  title: string;
  subtitle: string;
  additionalChargesTitle: string;
  extraKmLabel: string;
  extraKmRate: string;
  extraHourLabel: string;
  extraHourRate: string;
  packages: Array<{
    id: string;
    packageName: string;
    durationHours: number;
    includedKm: number;
    packagePrice: number;
    displayOrder: number;
  }>;
}

export interface HeroSectionContent {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  chipRating: string;
  chipService: string;
  chipRoutes: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  callPhone: string;
  stat1Value: string;
  stat1Label: string;
  stat1SubLabel: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  imageUrl: string;
  imageAlt: string;
  floatingCardTopLabel: string;
  floatingCardTopValue: string;
  floatingBadge: string;
  floatingTag: string;
}

export interface FooterSectionContent {
  brandTitle: string;
  brandDescription: string;
  quickLinksTitle: string;
  linkHomeLabel: string;
  linkBookLabel: string;
  linkTrackLabel: string;
  linkPrivacyLabel: string;
  linkTermsLabel: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  businessHours: string;
  responseTime: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
}
