import { Clock3, Car, ShieldCheck, BadgeIndianRupee } from 'lucide-react';

const points = [
  { icon: Clock3, title: 'Reliable Scheduling', desc: 'Timely pickup and trip coordination.' },
  { icon: Car, title: 'Comfortable Ertiga', desc: 'Spacious 7-seater for family and group rides.' },
  { icon: ShieldCheck, title: 'Professional Driver', desc: 'Safe, courteous, and experienced driving.' },
  { icon: BadgeIndianRupee, title: 'Transparent Pricing', desc: 'Clear fare calculation with package details.' },
];

function WhyChooseUs() {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1B3A5F]">Why Choose Us</h2>
        <p className="mt-2 text-slate-600">Discover what makes Aditya Tours your ideal travel partner</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(({ icon: Icon, title, desc }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF9933]/10">
                <Icon className="h-6 w-6 text-[#FF9933]" />
              </div>
              <h3 className="font-semibold text-[#1B3A5F]">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
