import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import DigitalServicesSection from '@/components/DigitalServicesSection';
import TrustAndVerification from '@/components/TrustAndVerification';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us | EliWeb.in — Digital Engineering & Creative Atelier',
  description: 'Learn about EliWeb.in — our story, values, executive leadership, and full-stack engineering ethos.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | EliWeb.in — Digital Engineering & Creative Atelier',
    description: 'Learn about EliWeb.in — our story, values, executive leadership, and full-stack engineering ethos.',
    url: '/about',
  },
};

export default async function AboutPage() {
  const [statsRaw, teamMembersRaw, valuesRaw, settingsData, aboutContentRaw, servicesRaw] = await Promise.all([
    dbQuery(() => prisma.stat.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.teamMember.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.value.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.siteSettings.findMany(), []),
    dbQuery(() => prisma.aboutContent.findMany(), []),
    dbQuery(() => prisma.service.findMany({ orderBy: { order: 'asc' } }), []),
  ]);

  const settings: Record<string, string> = {};
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  const aboutMap: Record<string, string> = {};
  aboutContentRaw.forEach((item) => {
    aboutMap[item.key] = item.value;
  });

  const fallbackStats = [
    { id: '1', value: '50+', label: 'Delivered Projects' },
    { id: '2', value: '30+', label: 'Global Clients' },
    { id: '3', value: '100%', label: 'Retention Rate' },
  ];

  const stats = statsRaw.length > 0 ? statsRaw : fallbackStats;

  const fallbackValues = [
    { id: 'v1', icon: '🏛️', label: 'Architectural Rigor & Engineering Precision' },
    { id: 'v2', icon: '⚡', label: 'Performance-First, Millisecond Latency' },
    { id: 'v3', icon: '🎨', label: 'Editorial Design & Brand Distinction' },
    { id: 'v4', icon: '🔒', label: 'Enterprise Security & Neon Serverless Scale' },
  ];

  const displayValues = valuesRaw.length > 0 ? valuesRaw : fallbackValues;

  const fallbackTeam = [
    {
      id: 't1',
      name: 'Arjun Sharma',
      role: 'Founder & CEO',
      imageUrl: 'https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg',
    },
    {
      id: 't2',
      name: 'Neha Kapoor',
      role: 'Creative Director',
      imageUrl: 'https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg',
    },
    {
      id: 't3',
      name: 'Vikram Bose',
      role: 'Lead Developer',
      imageUrl: 'https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg',
    },
  ];

  const displayTeam = teamMembersRaw.length > 0 ? teamMembersRaw : fallbackTeam;

  const services = servicesRaw.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    items: (s.items as string[]) || [],
    ctaLabel: s.ctaLabel,
  }));

  const storyHeading = aboutMap.story_heading || 'Where Software Architecture Meets Design Elegance';
  const storyBody = aboutMap.story_body || 'Founded in 2014, EliWeb was created with a clear thesis: digital experiences must never force brands to choose between uncompromising technical speed and visual distinction.';
  const missionText = aboutMap.mission || 'Every line of code we push to Neon PostgreSQL and Next.js App Router is optimized for extreme resilience, microsecond data hydration, and seamless cross-platform rendering.';

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About EliWeb.in',
    description: 'Learn about EliWeb.in — our story, values, executive leadership, and full-stack engineering ethos.',
    url: `${siteUrl}/about`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <HeaderNav alwaysVisible={true} />

      <main className="subpage-main">
        {/* Subpage Hero */}
        <section className="subpage-hero">
          <div className="container subpage-hero-inner">
            <div className="subpage-badge">
              <span>✦ WHO WE ARE &bull; EST. 2014</span>
            </div>
            <h1 className="subpage-title">
              Engineering Digital Architecture &amp; Brand Elegance
            </h1>
            <p className="subpage-lead">
              EliWeb is a digital engineering atelier and creative consultancy. We architect high-performance web products, scalable cloud platforms, and magnetic digital brand ecosystems for ambitious companies worldwide.
            </p>
          </div>
        </section>

        {/* Digital Services Showcase Component connected to DB */}
        <DigitalServicesSection services={services} />

        {/* Stats Strip */}
        <section className="subpage-stats-section">
          <div className="container">
            <div className="subpage-stats-grid">
              {stats.map((s) => (
                <div key={s.id} className="subpage-stat-card">
                  <span className="subpage-stat-num">{s.value}</span>
                  <span className="subpage-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="subpage-story-section">
          <div className="container">
            <div className="subpage-story-grid">
              <div className="story-content">
                <span className="section-eyebrow">OUR PHILOSOPHY</span>
                <h2 className="section-title">{storyHeading}</h2>
                <p>{storyBody}</p>
                <p>{missionText}</p>
                <div className="values-list">
                  {displayValues.map((v) => (
                    <div key={v.id} className="value-item">
                      <span className="value-icon">{v.icon}</span>
                      <span className="value-text">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="story-media">
                <div className="story-img-card">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                    alt="EliWeb Studio"
                    width={600}
                    height={700}
                    className="story-image"
                  />
                  <div className="story-floating-badge">
                    <strong>10+ Years</strong>
                    <span>Pioneering Digital Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="subpage-team-section">
          <div className="container">
            <div className="section-header-centered">
              <span className="section-eyebrow">LEADERSHIP &amp; CRAFT</span>
              <h2 className="section-title">Meet the Minds Behind the Architecture</h2>
              <p className="section-subtitle">
                Engineers, creative technologists, and brand strategists collaborating with singular focus.
              </p>
            </div>

            <div className="team-grid">
              {displayTeam.map((m) => (
                <div key={m.id} className="team-card">
                  <div className="team-img-wrapper">
                    <Image
                      src={m.imageUrl || 'https://i.pinimg.com/1200x/e2/b7/ff/e2b7ffc36abbaea0f0a1d5dba1a5ed74.jpg'}
                      alt={m.name}
                      width={400}
                      height={460}
                      className="team-photo"
                      unoptimized
                    />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{m.name}</h3>
                    <p className="team-role">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <TrustAndVerification />
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
