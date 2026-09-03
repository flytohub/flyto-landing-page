import Script from 'next/script';

import { GA_MEASUREMENT_ID } from '@/lib/analytics';

/**
 * Loads Google Analytics 4 once from the root layout, after the page is
 * interactive so it never blocks first paint. `afterInteractive` keeps the tag
 * off the critical path while still firing on every route. Renders nothing when
 * the measurement ID is absent, so preview builds stay clean.
 */
export function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
