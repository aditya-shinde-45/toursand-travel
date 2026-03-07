import type { FAQ, PopularRoute, Testimonial } from '../types/content';
import type { PricingPackage } from '../types/pricing';

export const APP_NAME = 'Aditya Tours & Travels';
export const SUPPORT_PHONE = '+919876543210';
export const SUPPORT_EMAIL = 'support@adityatours.com';
export const WHATSAPP_NUMBER = '919876543210';

export const PRICING_PACKAGES: PricingPackage[] = [
  { id: '2h', packageName: '2 Hours', durationHours: 2, includedKm: 20, packagePrice: 1200, displayOrder: 1 },
  { id: '4h', packageName: '4 Hours', durationHours: 4, includedKm: 40, packagePrice: 1400, displayOrder: 2 },
  { id: '6h', packageName: '6 Hours', durationHours: 6, includedKm: 60, packagePrice: 1800, displayOrder: 3 },
  { id: '8h', packageName: '8 Hours', durationHours: 8, includedKm: 80, packagePrice: 2500, displayOrder: 4 },
  { id: '10h', packageName: '10 Hours', durationHours: 10, includedKm: 100, packagePrice: 3500, displayOrder: 5 },
  { id: '12h', packageName: '12 Hours', durationHours: 12, includedKm: 120, packagePrice: 4000, displayOrder: 6 },
];

export const EXTRA_KM_RATE = 15;
export const EXTRA_HOUR_RATE = 150;

export const POPULAR_ROUTES: PopularRoute[] = [
  { id: '1', destinationName: 'Mumbai Airport T2', destinationAddress: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai', distanceKm: 35, travelTimeMinutes: 75, estimatedFare: 1400, displayOrder: 1 },
  { id: '2', destinationName: 'Pune', destinationAddress: 'Pune, Maharashtra', distanceKm: 151, travelTimeMinutes: 220, estimatedFare: 2500, displayOrder: 2 },
  { id: '3', destinationName: 'Nashik', destinationAddress: 'Nashik, Maharashtra', distanceKm: 165, travelTimeMinutes: 240, estimatedFare: 3500, displayOrder: 3 },
  { id: '4', destinationName: 'Lonavala', destinationAddress: 'Lonavala, Maharashtra', distanceKm: 96, travelTimeMinutes: 160, estimatedFare: 2500, displayOrder: 4 },
  { id: '5', destinationName: 'Igatpuri', destinationAddress: 'Igatpuri, Maharashtra', distanceKm: 95, travelTimeMinutes: 145, estimatedFare: 1800, displayOrder: 5 },
  { id: '6', destinationName: 'Navi Mumbai', destinationAddress: 'Navi Mumbai, Maharashtra', distanceKm: 24, travelTimeMinutes: 55, estimatedFare: 1200, displayOrder: 6 },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: '1', customerName: 'Rahul S.', reviewText: 'Very punctual and clean Ertiga. Smooth airport transfer from Thane.', rating: 5, reviewDate: '2026-01-12' },
  { id: '2', customerName: 'Priya M.', reviewText: 'Professional driver and transparent fare. Highly recommended.', rating: 5, reviewDate: '2026-01-20' },
  { id: '3', customerName: 'Amit K.', reviewText: 'Booked for Pune round trip. Great comfort and coordination.', rating: 4, reviewDate: '2026-02-01' },
  { id: '4', customerName: 'Sneha P.', reviewText: 'Quick response and easy booking flow on mobile.', rating: 5, reviewDate: '2026-02-10' },
  { id: '5', customerName: 'Nikhil J.', reviewText: 'Driver called before pickup and arrived on time.', rating: 5, reviewDate: '2026-02-14' },
  { id: '6', customerName: 'Megha D.', reviewText: 'Good for family travel. Spacious and comfortable.', rating: 4, reviewDate: '2026-02-22' },
];

export const FAQS: FAQ[] = [
  { id: '1', question: 'Do you provide airport pickup and drop in Navi Mumbai?', answer: 'Yes, Aditya Tours & Travels provides reliable airport pickup and drop services from Navi Mumbai to Mumbai Airport (T1 & T2). We ensure on-time service with professional drivers.', displayOrder: 1 },
  { id: '2', question: 'What types of cars are available?', answer: 'We provide clean and well-maintained vehicles including Ertiga 7-seater cars with driver, suitable for family trips, airport transfers, and outstation travel.', displayOrder: 2 },
  { id: '3', question: 'Do you provide 24/7 service?', answer: 'Yes, our airport taxi and car rental services in Navi Mumbai are available 24/7, including early morning and late-night pickups.', displayOrder: 3 },
  { id: '4', question: 'What are your car rental charges in Navi Mumbai?', answer: 'Our charges depend on the type of service (airport drop, local hourly rental, or outstation trip). We offer affordable and transparent pricing with no hidden charges. Contact us for the latest fare details.', displayOrder: 4 },
  { id: '5', question: 'Do you offer outstation car rental from Navi Mumbai?', answer: 'Yes, we provide outstation taxi services to Pune, Lonavala, Shirdi, Nashik, Satara, and other cities. Both one-way and round-trip options are available.', displayOrder: 5 },
  { id: '6', question: 'How can I book a car with Aditya Tours & Travels?', answer: 'You can book by: Calling us directly, Sending a WhatsApp message, or Filling out the contact form on our website. Advance booking is recommended for airport transfers.', displayOrder: 6 },
  { id: '7', question: 'Is your driver professional and verified?', answer: 'Yes, all our drivers are experienced, trained, and verified to ensure safe and comfortable travel for our customers.', displayOrder: 7 },
  { id: '8', question: 'Do you provide hourly car rental in Navi Mumbai?', answer: 'Yes, we offer flexible hourly car rental packages for business meetings, shopping, events, and local travel in Navi Mumbai and Mumbai.', displayOrder: 8 },
  { id: '9', question: 'Are there any hidden charges?', answer: 'No, we maintain transparent pricing. All charges are clearly informed before booking confirmation.', displayOrder: 9 },
  { id: '10', question: 'Why should I choose Aditya Tours & Travels?', answer: 'On-time airport service, Affordable pricing, Clean & sanitized vehicles, Professional drivers, and 24/7 customer support.', displayOrder: 10 },
];
