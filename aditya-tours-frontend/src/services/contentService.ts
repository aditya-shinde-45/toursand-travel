import type { FAQ, PopularRoute, Testimonial } from '../types/content';
import { FAQS, POPULAR_ROUTES, TESTIMONIALS } from '../utils/constants';
import { apiRequest } from './api';

export async function getPopularRoutes() {
  try {
    return await apiRequest<PopularRoute[]>('/popular-routes');
  } catch {
    return POPULAR_ROUTES;
  }
}

export async function getTestimonials() {
  try {
    return await apiRequest<Testimonial[]>('/testimonials');
  } catch {
    return TESTIMONIALS;
  }
}

export async function getFaqs() {
  try {
    return await apiRequest<FAQ[]>('/faqs');
  } catch {
    return FAQS;
  }
}

export async function submitContact(data: { name: string; email: string; phone: string; message: string }) {
  return apiRequest<{ message: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
