import React from 'react';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import ContactPageView from '@/components/ContactPageView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact & Demo | EliWeb.in — Direct Consultation & Technical Review',
  description: 'Schedule a tailored demo session or technical review with EliWeb digital architects. Rapid response guaranteed within 24 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & Demo | EliWeb.in — Direct Consultation & Technical Review',
    description: 'Schedule a tailored demo session or technical review with EliWeb digital architects. Rapid response guaranteed within 24 hours.',
    url: '/contact',
  },
};

export default async function ContactPage() {
  const [settingsData, servicesData] = await Promise.all([
    dbQuery(() => prisma.siteSettings.findMany(), []),
    dbQuery(() => prisma.service.findMany({ orderBy: { order: 'asc' } }), []),
  ]);

  const settings: Record<string, string> = {};
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  const services = servicesData.map((s) => ({
    id: s.id,
    title: s.title,
  }));

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact EliWeb.in',
    description: 'Schedule a tailored demo session or technical review with EliWeb digital architects.',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'ProfessionalService',
      name: 'EliWeb.in',
      telephone: settings.company_phone || '+91 99999 99999',
      email: settings.company_email || 'hello@eliweb.in',
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactPageView settings={settings} services={services} />
    </>
  );
}
