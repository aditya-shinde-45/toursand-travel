declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(path: string, title: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: path,
    });
  }
}

export function trackBookingStep(step: number) {
  if (window.gtag) {
    window.gtag('event', 'booking_step_view', {
      step,
    });
  }
}
