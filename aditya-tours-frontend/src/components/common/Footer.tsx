import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FooterSectionContent } from '../../types/content';
import { DEFAULT_FOOTER_SECTION_CONTENT } from '../../services/contentSettingsService';
import { getContentSection } from '../../services/contentService';

function Footer() {
  const [content, setContent] = useState<FooterSectionContent>(DEFAULT_FOOTER_SECTION_CONTENT);

  useEffect(() => {
    let mounted = true;

    async function loadFooterContent() {
      const data = await getContentSection<FooterSectionContent>('footer_section');
      if (mounted && data) {
        setContent(data);
      }
    }

    loadFooterContent();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{content.brandTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">{content.brandDescription}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{content.quickLinksTitle}</h3>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <Link to="/">{content.linkHomeLabel}</Link>
            <Link to="/book">{content.linkBookLabel}</Link>
            <Link to="/privacy-policy">{content.linkPrivacyLabel}</Link>
            <Link to="/terms-of-service">{content.linkTermsLabel}</Link>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">{content.contactTitle}</h3>
          <div className="mt-2 grid gap-1 text-sm text-slate-600">
            <a href={`tel:${content.contactPhone}`}>{content.contactPhone}</a>
            <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
            <p>Business Hours: {content.businessHours}</p>
            <p>Response Time: {content.responseTime}</p>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
