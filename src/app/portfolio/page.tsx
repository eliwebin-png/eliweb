import type { Metadata } from 'next';
import React from 'react';
import HeaderNav from '@/components/HeaderNav';
import PortfolioShowcaseView from '@/components/PortfolioShowcaseView';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio | EliWeb.in — We Build Timeless Experiences',
  description: 'Explore the EliWeb.in selected works: Bespoke web applications, luxury digital commerce platforms, and cinematic brand narratives.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio | EliWeb.in — We Build Timeless Experiences',
    description: 'Explore the EliWeb.in selected works: Bespoke web applications, luxury digital commerce platforms, and cinematic brand narratives.',
    url: '/portfolio',
  },
};

export default async function PortfolioPage() {
  const [projectsData, siteSettingsData, footerLinksData] = await Promise.all([
    dbQuery(() => prisma.project.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.siteSettings.findMany(), []),
    dbQuery(() => prisma.footerLink.findMany({ orderBy: { order: 'asc' } }), []),
  ]);

  const settings: Record<string, string> = {};
  siteSettingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

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

  const footerLinks = footerLinksData.length > 0 ? footerLinksData : [
    { id: 'fl1', column: 'services', label: 'Website Development', url: '/services' },
    { id: 'fl2', column: 'services', label: 'Video Editing', url: '/services' },
    { id: 'fl3', column: 'services', label: 'UI/UX Design', url: '/services' },
    { id: 'fl4', column: 'company', label: 'About & Approach', url: '/about' },
    { id: 'fl5', column: 'company', label: 'Portfolio Archives', url: '/portfolio' },
    { id: 'fl6', column: 'company', label: 'Direct Consultation', url: '/contact' },
  ];

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'EliWeb.in Selected Works Portfolio',
    description: 'Archive of high-performance web products, digital commerce platforms, and brand systems.',
    url: `${siteUrl}/portfolio`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <HeaderNav alwaysVisible={true} />
      <main>
        <PortfolioShowcaseView projects={projects} />
      </main>
      <SiteFooter settings={settings} footerLinks={footerLinks} />
    </>
  );
}
