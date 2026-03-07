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

function SEOHead({ title, description, keywords, canonicalPath }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;
    ensureMeta('description', description);
    if (keywords) ensureMeta('keywords', keywords);

    const absoluteUrl = `${window.location.origin}${canonicalPath || window.location.pathname}`;
    ensurePropertyMeta('og:title', title);
    ensurePropertyMeta('og:description', description);
    ensurePropertyMeta('og:type', 'website');
    ensurePropertyMeta('og:url', absoluteUrl);

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
