import { z } from 'zod';
import { isReturnAfterDeparture } from './dateTime';

export const locationSchema = z.object({
  address: z.string().min(1, 'Location is required'),
  lat: z.number(),
  lng: z.number(),
});

export const bookingSchema = z
  .object({
    pickupLocation: locationSchema,
    dropLocation: locationSchema,
    tripType: z.enum(['ONE_WAY', 'ROUND_TRIP']),
    departureDate: z.string().min(1, 'Departure date is required'),
    departureTime: z.string().min(1, 'Departure time is required'),
    returnDate: z.string().optional().default(''),
    returnTime: z.string().optional().default(''),
    customerName: z.string().min(2, 'Name is required'),
    customerPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10 digit phone number'),
    customerEmail: z.string().email('Enter valid email'),
    passengerCount: z.coerce.number().min(1).max(7),
    specialInstructions: z.string().max(500).optional().default(''),
    distanceKm: z.coerce.number().min(0.1),
    travelTimeMinutes: z.coerce.number().min(1),
    agreeTerms: z.boolean().refine((value) => value, { message: 'Please accept Terms & Conditions' }),
    honeypot: z.string().optional().default(''),
  })
  .superRefine((values, ctx) => {
    if (values.tripType === 'ROUND_TRIP') {
      if (!values.returnDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['returnDate'],
          message: 'Return date is required',
        });
      }
      if (!values.returnTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['returnTime'],
          message: 'Return time is required',
        });
      }
      if (
        values.returnDate
        && values.returnTime
        && !isReturnAfterDeparture(values.departureDate, values.departureTime, values.returnDate, values.returnTime)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['returnTime'],
          message: 'Return must be after departure',
        });
      }
    }

    if (values.honeypot) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['honeypot'],
        message: 'Spam detected',
      });
    }
  });

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  message: z.string().min(10).max(1000),
});
