export interface PopularRoute {
  id: string;
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
