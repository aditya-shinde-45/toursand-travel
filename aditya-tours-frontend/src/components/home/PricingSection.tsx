import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/formatting';
import { getPricingSectionContent, getPricingSectionContentSync } from '../../services/contentSettingsService';

function PricingSection() {
  const [sectionContent, setSectionContent] = useState(getPricingSectionContentSync());

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getPricingSectionContent();
        setSectionContent(data);
      } catch (error) {
        console.error('Failed to load pricing content:', error);
      }
    }
    loadContent();
  }, []);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1B3A5F]">{sectionContent.title}</h2>
        <p className="mt-2 text-slate-600">{sectionContent.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="bg-[#1B3A5F] text-white">
                <th className="px-6 py-4 text-left font-semibold">Package</th>
                <th className="px-6 py-4 text-left font-semibold">Time</th>
                <th className="px-6 py-4 text-left font-semibold">Km Limit</th>
                <th className="px-6 py-4 text-left font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {sectionContent.packages.map((pkg, index) => (
                <tr key={pkg.id} className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200 last:border-b-0`}>
                  <td className="px-6 py-4 font-semibold text-[#1B3A5F]">{pkg.packageName}</td>
                  <td className="px-6 py-4 text-slate-600">{pkg.durationHours} hrs</td>
                  <td className="px-6 py-4 text-slate-600">{pkg.includedKm} km</td>
                  <td className="px-6 py-4 font-bold text-[#FF9933]">{formatCurrency(pkg.packagePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#1B3A5F]">{sectionContent.additionalChargesTitle}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF9933]">
              <span className="text-sm font-bold text-white">•</span>
            </div>
            <div>
              <p className="font-semibold text-[#1B3A5F]">{sectionContent.extraKmLabel}</p>
              <p className="text-sm text-slate-600">{sectionContent.extraKmRate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF9933]">
              <span className="text-sm font-bold text-white">•</span>
            </div>
            <div>
              <p className="font-semibold text-[#1B3A5F]">{sectionContent.extraHourLabel}</p>
              <p className="text-sm text-slate-600">{sectionContent.extraHourRate}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
