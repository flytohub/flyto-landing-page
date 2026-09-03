/**
 * Google Analytics 4 for the public flyto2.com surface.
 *
 * `G-7V4D315CBD` is the measurement ID of the Flyto2 web stream (property
 * 527224736, stream 13723511819). A measurement ID is a public client
 * identifier and is meant to ship in the page, so it lives here rather than in a
 * build-time secret; that also means a build can never silently drop it. An
 * empty value disables the tag, which keeps local and preview builds quiet.
 */
export const GA_MEASUREMENT_ID = 'G-7V4D315CBD';

type GtagParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: GtagParams) => void;
  }
}

/**
 * Sends a GA4 event when the tag is present. A no-op on the server, before the
 * tag loads, or when analytics is disabled — callers never have to guard. Use it
 * for the conversions Enhanced Measurement cannot infer, such as a completed
 * waitlist signup, and mark those as key events in the GA property.
 */
export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', name, params);
}
