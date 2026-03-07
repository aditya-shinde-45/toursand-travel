import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '../../types/content';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1B3A5F]">Customer Testimonials</h2>
        <p className="mt-2 text-slate-600">What our customers say about us</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.slice(0, 3).map((item) => (
          <article 
            key={item.id} 
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
              <Quote className="h-12 w-12 text-[#FF9933]" />
            </div>
            
            <div className="relative">
              <div className="mb-3 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < item.rating
                        ? 'fill-[#FF9933] text-[#FF9933]'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                "{item.reviewText}"
              </p>
              
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1B3A5F] text-sm font-bold text-white">
                  {item.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#1B3A5F]">{item.customerName}</p>
                  <p className="text-xs text-slate-500">Verified Customer</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
