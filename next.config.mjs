import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only static-export for production builds. Dev keeps middleware working
  // so locale negotiation handles bare paths like /cloud or /code.
  output: isProd ? 'export' : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  // Hide the floating Next.js dev-tools button in the corner (dev only).
  devIndicators: false,
  // Bundle whitepaper markdown into the build artifact so static export can
  // read them at prerender time.
  outputFileTracingIncludes: {
    '/[locale]/whitepaper/**/*': ['./content/whitepaper/**/*'],
  },
};

export default withNextIntl(nextConfig);
