import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ as FAQType } from '../../types/content';

interface FAQProps {
  faqs: FAQType[];
}

function FAQ({ faqs }: FAQProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1B3A5F]">Frequently Asked Questions</h2>
        <p className="mt-2 text-slate-600">Common questions about our services</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = active === faq.id;
          return (
            <article key={faq.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
              <button
                type="button"
                onClick={() => setActive(isOpen ? null : faq.id)}
                className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="font-semibold text-[#1B3A5F]">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-[#FF9933] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                  <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
