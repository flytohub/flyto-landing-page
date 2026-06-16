import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingIncludes: {
    '/[locale]/whitepaper/**/*': ['./content/whitepaper/**/*'],
  },
};

export default withNextIntl(nextConfig);
