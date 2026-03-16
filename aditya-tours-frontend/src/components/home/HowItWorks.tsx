import { Calendar, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: 'Select Location',
      description: 'Choose your pickup and drop-off locations with our easy-to-use map interface',
      step: '01',
    },
    {
      icon: Calendar,
      title: 'Choose Date & Time',
      description: 'Pick your preferred date and time for your journey',
      step: '02',
    },
    {
      icon: CreditCard,
      title: 'Make Payment',
      description: 'Confirm your booking details and make a secure payment',
      step: '03',
    },
    {
      icon: CheckCircle2,
      title: 'Enjoy Your Ride',
      description: 'Sit back and enjoy a comfortable ride in our well-maintained vehicles',
      step: '04',
    },
  ];

  return (
    <section className="space-y-8 rounded-2xl bg-gradient-to-br from-[#1B3A5F] to-[#2a4f7a] p-8 text-white md:p-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold">How Booking Works</h2>
        <p className="mt-2 text-gray-200">Simple and hassle-free booking process in just 4 steps</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="group relative rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              {/* Step Number */}
              <div className="absolute right-4 top-4 text-6xl font-bold text-white/10">
                {step.step}
              </div>

              {/* Icon */}
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF9933] text-white transition-transform group-hover:scale-110">
                <Icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-200">{step.description}</p>

              {/* Connector Arrow (hidden on last item and on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1B3A5F] bg-[#FF9933] shadow-md">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <a
          href="/book"
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF9933] px-8 py-3 font-semibold text-white transition-all hover:bg-[#e68929] hover:shadow-lg"
        >
          Start Booking Now
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}

export default HowItWorks;
