import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import GoogleTranslateScript from '@/components/GoogleTranslateScript';

const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EliWeb.in | Modern Digital Engineering, Architecture & Video Craft',
    template: '%s | EliWeb.in',
  },
  description:
    'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.',
  keywords: [
    'Web Development',
    'Next.js Agency',
    'Software Architecture',
    'Digital Marketing',
    'App Development',
    'Video Production',
    'UI/UX Design',
    'Full-Stack Engineering',
    'SEO Optimization',
    'EliWeb',
    'EliWeb.in',
  ],
  authors: [{ name: 'EliWeb.in Team', url: siteUrl }],
  creator: 'EliWeb.in',
  publisher: 'EliWeb.in',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'EliWeb.in',
    title: 'EliWeb.in | Modern Digital Engineering, Architecture & Video Craft',
    description:
      'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.',
    images: [
      {
        url: '/eliweb-logo.png',
        width: 1200,
        height: 630,
        alt: 'EliWeb.in — Modern Digital Engineering & Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EliWeb.in | Modern Digital Engineering, Architecture & Video Craft',
    description:
      'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.',
    images: ['/eliweb-logo.png'],
    creator: '@eliweb_in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon1.png',
    shortcut: '/favicon1.png',
    apple: '/favicon1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EliWeb.in',
    alternateName: 'EliWeb Studio',
    url: siteUrl,
    logo: `${siteUrl}/eliweb-logo.png`,
    image: `${siteUrl}/eliweb-logo.png`,
    description:
      'End-to-end digital engineering and software architecture partner building bespoke web apps, digital products, and brand media systems.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    areaServed: [
      'Worldwide',
      'India',
      'United States',
      'United Kingdom',
      'United Arab Emirates',
      'Canada',
      'Australia',
    ],
    knowsAbout: [
      'Web Development',
      'Next.js Full-Stack Architecture',
      'Software Architecture',
      'Commercial Video Production',
      'Digital Marketing & Brand Strategy',
      'SEO & Generative Engine Optimization',
      'UI/UX Design Systems',
      'Cloud DevOps & Security',
    ],
    sameAs: [
      'https://www.instagram.com/eliweb.in/',
      'https://twitter.com/eliweb_in',
      'https://www.linkedin.com/company/eliweb',
      'https://wa.me/917973851691',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+91-7973851691',
      email: 'admin@eliweb.in',
      url: `${siteUrl}/contact`,
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon1.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
          <GoogleTranslateScript />
        </LanguageProvider>

        {/* Collect.chat Interactive Chatbot Widget */}
        <Script
          id="collect-chat-launcher"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w, d) { w.CollectId = "6ae622526b71bfd0484cb359"; var h = d.head || d.getElementsByTagName("head")[0]; var s = d.createElement("script"); s.setAttribute("type", "text/javascript"); s.async=true; s.setAttribute("src", "https://collectcdn.com/launcher.js"); h.appendChild(s); })(window, document);`,
          }}
        />
      </body>
    </html>
  );
}
