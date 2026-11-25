import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import HomePageView from '@/components/HomePageView';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [heroData, siteSettingsData] = await Promise.all([
    dbQuery(() => prisma.heroContent.findFirst(), null),
    dbQuery(() => prisma.siteSettings.findMany(), []),
  ]);

  const settingsMap: Record<string, string> = {};
  siteSettingsData.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const title = settingsMap.site_title || 'EliWeb.in | Modern Digital Engineering, Architecture & Video Craft';
  const description =
    settingsMap.site_description ||
    heroData?.subtitle ||
    'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.';

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: 'EliWeb.in',
      images: [
        {
          url: settingsMap.og_image || '/eliweb-logo.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [settingsMap.og_image || '/eliweb-logo.png'],
    },
  };
}

export default async function HomePage() {
  // Parallel fetch with fast timeout to ensure sub-second loads and prevent 500 errors
  const [
    heroData,
    statsData,
    servicesData,
    projectsData,
    faqsData,
    footerLinksData,
    siteSettingsData,
  ] = await Promise.all([
    dbQuery(() => prisma.heroContent.findFirst(), null),
    dbQuery(() => prisma.stat.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.service.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.project.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.faq.findMany({ where: { page: 'homepage' }, orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.footerLink.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.siteSettings.findMany(), []),
  ]);

  const settingsMap: Record<string, string> = {};
  siteSettingsData.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  // Default Fallbacks matching user's seed script
  const hero = {
    headline: heroData?.headline || 'We Build Websites. / We Craft Videos. / We Grow Brands.',
    subtitle:
      heroData?.subtitle ||
      'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.',
    cta1Label: heroData?.cta1Label || 'Start Your Project',
    cta1Url: heroData?.cta1Url || '#contact',
    cta2Label: heroData?.cta2Label || 'Watch Our Projects',
    cta2Url: heroData?.cta2Url || '#portfolio',
    trustPills: (heroData?.trustPills as string[]) || [
      '50+ Projects Delivered',
      '100% Client Satisfaction',
      '5★ Rated Agency',
    ],
    tickerItems: (heroData?.tickerItems as string[]) || [
      'Software Development',
      'Digital Marketing',
      'Web & App Development',
      'Brand Building',
      'SEO & Search Visibility',
      'Paid Ads & Promotion',
      'Content Strategy',
    ],
  };

  const services = servicesData.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    imageUrl: s.imageUrl,
    tags: (s.tags as string[]) || [],
    items: (s.items as string[]) || [],
    steps: (s.steps as string[]) || [],
    ctaLabel: s.ctaLabel,
  }));

  const projects = projectsData.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    tags: (p.tags as string[]) || [],
    description: p.description,
    imageUrl: p.imageUrl,
    featured: p.featured,
    homepageTeaser: p.homepageTeaser,
  }));

  const stats = statsData.length > 0 ? statsData : [
    { id: '1', value: '50+', label: 'Delivered Projects' },
    { id: '2', value: '30+', label: 'Global Clients' },
    { id: '3', value: '100%', label: 'Retention Rate' },
  ];

  const faqs = faqsData.length > 0 ? faqsData : [
    {
      id: 'f1',
      question: 'What services does EliWeb.in offer?',
      answer: 'We offer end-to-end digital services: web development (React, Next.js, WordPress, Shopify), mobile app development, UI/UX design, SEO, social media marketing, paid advertising, content strategy, and brand building.',
      order: 0,
    },
    {
      id: 'f2',
      question: 'How much does a website cost?',
      answer: 'Pricing depends on project scope. We serve startups to enterprises with competitive packages. Book a free call for a custom quote.',
      order: 1,
    },
    {
      id: 'f3',
      question: 'Do you work with international clients?',
      answer: 'Yes! While based in India, we work with clients across the US, UK, UAE, Australia, and beyond.',
      order: 2,
    },
    {
      id: 'f4',
      question: 'How long does a website take to build?',
      answer: 'Most projects are delivered in 2–6 weeks. We prioritise speed without sacrificing quality.',
      order: 3,
    },
  ];

  const footerLinks = footerLinksData.length > 0 ? footerLinksData : [
    { id: 'fl1', column: 'services', label: 'Website Development', url: '#services' },
    { id: 'fl2', column: 'services', label: 'Video Editing', url: '#services' },
    { id: 'fl3', column: 'services', label: 'UI/UX Design', url: '#services' },
    { id: 'fl4', column: 'company', label: 'About & Approach', url: '#approach' },
    { id: 'fl5', column: 'company', label: 'Portfolio Archives', url: '#portfolio' },
    { id: 'fl6', column: 'company', label: 'Direct Consultation', url: '#contact' },
  ];

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EliWeb.in',
    url: siteUrl,
    description: hero.subtitle,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'EliWeb.in — Digital Engineering, Architecture & Video Craft',
    alternateName: 'EliWeb Studio',
    url: siteUrl,
    image: `${siteUrl}/eliweb-logo.png`,
    priceRange: '$$$',
    telephone: settingsMap.phone || '+91-7973851691',
    email: settingsMap.hello_email || 'admin@eliweb.in',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: settingsMap.location || 'India (Remote-First, Worldwide)',
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
      'React & TypeScript Engineering',
      'Commercial Video Production',
      'Digital Marketing & Paid Ads',
      'SEO & Search Engine Visibility',
      'UI/UX Design Systems',
      'Cloud DevOps & Security',
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <HomePageView
        hero={hero}
        stats={stats}
        services={services}
        projects={projects}
        faqs={faqs}
        footerLinks={footerLinks}
        settings={settingsMap}
      />
    </>
  );
}
