import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'node:url';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');
const whitepaperContentDir = fileURLToPath(new URL('./content/whitepaper', import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      include: [whitepaperContentDir],
      type: 'asset/source',
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
