import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
}

function ensureMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function ensurePropertyMeta(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

const OG_IMAGE = 'https://adityatourstravel.com/logo.png';

function SEOHead({ title, description, keywords, canonicalPath }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    ensureMeta('description', description);
    if (keywords) ensureMeta('keywords', keywords);
    ensureMeta('robots', 'index, follow');
    ensureMeta('geo.region', 'IN-MH');
    ensureMeta('geo.placename', 'Mumbai, Thane, Navi Mumbai, Maharashtra');

    const absoluteUrl = `https://adityatourstravel.com${canonicalPath || window.location.pathname}`;

    ensurePropertyMeta('og:title', title);
    ensurePropertyMeta('og:description', description);
    ensurePropertyMeta('og:type', 'website');
    ensurePropertyMeta('og:url', absoluteUrl);
    ensurePropertyMeta('og:image', OG_IMAGE);
    ensurePropertyMeta('og:site_name', 'Aditya Tours & Travels');
    ensurePropertyMeta('og:locale', 'en_IN');

    ensureMeta('twitter:card', 'summary_large_image');
    ensureMeta('twitter:title', title);
    ensureMeta('twitter:description', description);
    ensureMeta('twitter:image', OG_IMAGE);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', absoluteUrl);
  }, [canonicalPath, description, keywords, title]);

  return null;
}

export default SEOHead;
