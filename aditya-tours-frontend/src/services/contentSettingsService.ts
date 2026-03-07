import type { PopularRoutesSectionContent } from '../types/content';

const POPULAR_ROUTES_SECTION_KEY = 'home.popular-routes.section-content';

const DEFAULT_POPULAR_ROUTES_SECTION_CONTENT: PopularRoutesSectionContent = {
  title: 'Popular Routes from Thane',
  subtitle: 'Book your most common destinations at fixed rates',
};

export function getPopularRoutesSectionContent(): PopularRoutesSectionContent {
  if (typeof window === 'undefined') {
    return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
  }

  try {
    const raw = window.localStorage.getItem(POPULAR_ROUTES_SECTION_KEY);
    if (!raw) {
      return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
    }

    const parsed = JSON.parse(raw) as Partial<PopularRoutesSectionContent>;
    if (!parsed.title || !parsed.subtitle) {
      return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
    }

    return {
      title: parsed.title,
      subtitle: parsed.subtitle,
    };
  } catch {
    return DEFAULT_POPULAR_ROUTES_SECTION_CONTENT;
  }
}

export function savePopularRoutesSectionContent(content: PopularRoutesSectionContent) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POPULAR_ROUTES_SECTION_KEY, JSON.stringify(content));
}

export function resetPopularRoutesSectionContent() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(POPULAR_ROUTES_SECTION_KEY);
}

export { DEFAULT_POPULAR_ROUTES_SECTION_CONTENT };
