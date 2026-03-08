import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Clock, MapPin, ArrowRight, Phone, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import type { HeroSectionContent } from '../../types/content';
import { DEFAULT_HERO_SECTION_CONTENT } from '../../services/contentSettingsService';
import { getContentSection } from '../../services/contentService';

function HeroSection() {
  const [content, setContent] = useState<HeroSectionContent>(DEFAULT_HERO_SECTION_CONTENT);

  useEffect(() => {
    let mounted = true;

    async function loadHeroContent() {
      const data = await getContentSection<HeroSectionContent>('hero_section');
      if (mounted && data) {
        setContent(data);
      }
    }

    loadHeroContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-5.5rem)] items-center overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white p-4 sm:min-h-[calc(100svh-6rem)] sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF9933]/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#1B3A5F]/10 blur-3xl" />

      <div className="relative grid w-full max-w-full items-center gap-8 lg:grid-cols-2">
        <div className="min-w-0 max-w-full">
          <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 px-4 py-2">
            <Shield className="h-4 w-4 text-[#FF9933]" />
            <span className="text-sm font-semibold text-[#1B3A5F]">{content.badgeText}</span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-[#1B3A5F] sm:text-5xl">
            {content.titleLine1}
            <span className="block text-[#FF9933]">{content.titleLine2}</span>
          </h1>

          <p className="mt-4 w-full break-words text-base text-gray-600 sm:text-lg lg:pr-8">
            {content.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><Star className="h-4 w-4 text-[#FF9933]" />{content.chipRating}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><Clock className="h-4 w-4 text-[#FF9933]" />{content.chipService}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><MapPin className="h-4 w-4 text-[#FF9933]" />{content.chipRoutes}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/book">
              <Button className="group">
                {content.primaryButtonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href={`tel:${content.callPhone}`}>
              <Button variant="secondary">
                <Phone className="h-4 w-4" />
                {content.secondaryButtonText}
              </Button>
            </a>
          </div>

          <div className="mt-6 grid max-w-md grid-cols-3 gap-4 text-[#1B3A5F]">
            <div>
              <p className="text-3xl font-bold text-[#FF9933]">{content.stat1Value}</p>
              <p className="text-xs text-gray-500">{content.stat1Label} <span className="text-[10px]">{content.stat1SubLabel}</span></p>
            </div>
            <div className="border-x border-gray-200 pl-3">
              <p className="text-3xl font-bold text-[#FF9933]">{content.stat2Value}</p>
              <p className="text-xs text-gray-500">{content.stat2Label}</p>
            </div>
            <div className="pl-3">
              <p className="text-3xl font-bold text-[#FF9933]">{content.stat3Value}</p>
              <p className="text-xs text-gray-500">{content.stat3Label}</p>
            </div>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#1B3A5F] to-[#2a4a70] p-4 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#FF9933]/20 to-transparent" />
            <img
              src={content.imageUrl}
              alt={content.imageAlt}
              className="relative z-10 h-[300px] w-full rounded-2xl object-cover lg:h-[360px]"
            />

            <div className="absolute -bottom-5 -left-4 z-20 rounded-2xl border border-[#FF9933]/20 bg-white p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-[#FF9933]/10 p-2">
                  <Calendar className="h-4 w-4 text-[#FF9933]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{content.floatingCardTopLabel}</p>
                  <p className="text-sm font-bold text-[#1B3A5F]">{content.floatingCardTopValue}</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 -top-4 z-20 rotate-12 rounded-full bg-[#FF9933] px-5 py-2 text-sm font-bold text-white">
              {content.floatingBadge}
            </div>

            <div className="absolute -bottom-8 right-3 z-20 rounded-2xl border border-[#FF9933]/20 bg-white px-4 py-3 shadow-xl">
              <p className="text-xs font-semibold text-[#1B3A5F]">{content.floatingTag}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
