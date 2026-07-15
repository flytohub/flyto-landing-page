import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import {
  FLYTO2_HOME_DESCRIPTION,
  FLYTO2_HOME_FULL_TITLE,
  FLYTO2_SEO_KEYWORDS,
} from '@/lib/seo';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://flyto2.com'),
  applicationName: 'Flyto2',
  title: {
    default: FLYTO2_HOME_FULL_TITLE,
    template: '%s - Flyto2',
  },
  description: FLYTO2_HOME_DESCRIPTION,
  keywords: [...FLYTO2_SEO_KEYWORDS],
  authors: [{ name: 'Flyto2 Team', url: 'https://flyto2.com' }],
  creator: 'Flyto2',
  publisher: 'Flyto2',
  category: 'Security Software',
  openGraph: {
    type: 'website',
    url: 'https://flyto2.com',
    siteName: 'Flyto2',
    title: FLYTO2_HOME_FULL_TITLE,
    description: FLYTO2_HOME_DESCRIPTION,
    images: [
      {
        url: '/assets/img/warroom/01-projects-home.webp',
        width: 1200,
        height: 630,
        alt: 'Flyto2 evidence-backed security war room',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: FLYTO2_HOME_FULL_TITLE,
    description: FLYTO2_HOME_DESCRIPTION,
    images: ['/assets/img/warroom/01-projects-home.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#06030f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
