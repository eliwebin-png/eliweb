import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import FaqAccordion from '@/components/FaqAccordion';
import DigitalEcosystemShowcase from '@/components/DigitalEcosystemShowcase';
import ServicesHeroSection from '@/components/ServicesHeroSection';
import TechnologyTicker from '@/components/TechnologyTicker';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services | EliWeb.in — Digital Engineering, Web & Video Craft',
  description: 'Explore EliWeb.in services: Modern Web & App Development, Brand Building, Performance Digital Marketing, and Video Craft.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | EliWeb.in — Digital Engineering, Web & Video Craft',
    description: 'Explore EliWeb.in services: Modern Web & App Development, Brand Building, Performance Digital Marketing, and Video Craft.',
    url: '/services',
  },
};

const fallbackServices = [
  {
    id: 'service-web',
    title: 'Software Development',
    description:
      'We build powerful, scalable digital products — from modern web applications to complex enterprise cloud architectures.',
    category: 'Software',
    imageUrl:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80',
    tags: ['Web Development', 'App Development', 'Next.js', 'APIs'],
    items: ['Modern Web Applications (Next.js & React)', 'Cross-Platform Mobile Apps (iOS & Android)', 'High-Performance APIs', 'Cloud Scalability'],
    steps: ['Discovery', 'Design', 'Develop', 'Launch'],
    ctaLabel: 'Start Your Software Project',
  },
  {
    id: 'service-marketing',
    title: 'Digital Marketing',
    description:
      'Grow your brand online with data-driven strategies that get real results. We manage your entire digital presence — from social media to search visibility.',
    category: 'Marketing',
    imageUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=900&q=80',
    tags: ['Social Media', 'Brand Building', 'Paid Ads', 'SEO'],
    items: ['Social Media Management', 'Paid Ads & Meta Marketing', 'Technical SEO', 'Conversion Optimization'],
    steps: ['Audit', 'Strategy', 'Execute', 'Report'],
    ctaLabel: 'Start Growing Your Brand',
  },
  {
    id: 'service-creative',
    title: 'Cinematic Media & Brand Storytelling',
    description:
      'High-retention commercial video production, brand architecture, and interactive design systems built to turn audiences into evangelists.',
    category: 'Creative',
    imageUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    tags: ['Brand Video', 'Storytelling', 'Commercials'],
    items: ['Commercial Video Production', 'Motion Graphics', 'Brand Identity Systems'],
    steps: ['Scripting', 'Production', 'Editing', 'Mastering'],
    ctaLabel: 'Explore Creative Scope',
  },
  {
    id: 'service-design',
    title: 'UI/UX & Product Design Systems',
    description:
      'Human-centered interfaces, intuitive interactive prototyping, and design systems built for friction-free digital experiences.',
    category: 'Design',
    imageUrl:
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=80',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
    items: ['Design Systems & UI Kits', 'Interface Prototyping', 'User Research & Wireframing'],
    steps: ['Research', 'Wireframe', 'Visual Design', 'Handoff'],
    ctaLabel: 'Explore Design Scope',
  },
  {
    id: 'service-cloud',
    title: 'Cloud Infrastructure & DevOps',
    description:
      'Resilient microservices, automated CI/CD pipelines, and high-availability architecture engineered for 99.99% uptime.',
    category: 'Architecture',
    imageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    items: ['Cloud Migration & Setup', 'DevOps Automation', 'Security & Infrastructure Audits'],
    steps: ['Architecture Review', 'Setup', 'Deploy', 'Monitor'],
    ctaLabel: 'Explore Infrastructure',
  },
];

const fallbackTechTools = [
  { id: 't1', name: 'Next.js 15' },
  { id: 't2', name: 'React 19' },
  { id: 't3', name: 'TypeScript' },
  { id: 't4', name: 'Node.js' },
  { id: 't5', name: 'PostgreSQL' },
  { id: 't6', name: 'Prisma' },
  { id: 't7', name: 'AWS Cloud' },
  { id: 't8', name: 'Docker' },
  { id: 't9', name: 'Figma' },
];

const fallbackFaqs = [
  { id: 'sf1', question: 'What technologies do you specialize in?', answer: 'We specialize in Next.js, React, Node.js, TypeScript, PostgreSQL, and modern cloud deployment architectures.', order: 0 },
  { id: 'sf2', question: 'How quickly can you start a project?', answer: 'We can typically kick off new client engagements within 1 to 2 weeks following initial discovery and scoping.', order: 1 },
  { id: 'sf3', question: 'Do you provide post-launch support?', answer: 'Yes, we provide ongoing maintenance, cloud monitoring, and feature iteration packages for all delivered solutions.', order: 2 },
];

export default async function ServicesPage() {
  const [servicesDataRaw, techToolsRaw, faqsDataRaw, settingsData] = await Promise.all([
    dbQuery(() => prisma.service.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.techTool.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.faq.findMany({ orderBy: { order: 'asc' } }), []),
    dbQuery(() => prisma.siteSettings.findMany(), []),
  ]);

  const servicesData = servicesDataRaw.length > 0 ? servicesDataRaw : fallbackServices;
  const techTools = techToolsRaw.length > 0 ? techToolsRaw : fallbackTechTools;
  const faqsData = faqsDataRaw.length > 0 ? faqsDataRaw : fallbackFaqs;

  const settings: Record<string, string> = {};
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  const siteUrl = (process.env.NEXTAUTH_URL || 'https://eliweb.in').replace(/\/$/, '');
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'EliWeb.in Core Digital Services',
    itemListElement: servicesData.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        provider: {
          '@type': 'Organization',
          name: 'EliWeb.in',
          url: siteUrl,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <HeaderNav alwaysVisible={true} />

      <main className="subpage-main">
        {/* Page Hero: Reference Design Match */}
        <ServicesHeroSection />

        {/* Featured Interactive Multi-Device Ecosystem Showcase */}
        <DigitalEcosystemShowcase />

        {/* Services List Section */}
        <section className="subpage-services-list">
          <div className="container">
            <div className="services-vertical-stack">
              {servicesData.map((service, index) => {
                const tags = (service.tags as string[]) || [];
                const items = (service.items as string[]) || [];
                const steps = (service.steps as string[]) || [];

                return (
                  <div key={service.id} className="service-detail-block">
                    <div className="service-detail-grid">
                      <div className="service-detail-info">
                        <div className="service-meta-row">
                          <span className="service-number">0{index + 1}</span>
                          <span className="service-category-tag">{service.category}</span>
                        </div>
                        <h2 className="service-detail-title">{service.title}</h2>
                        <p className="service-detail-desc">{service.description}</p>

                        <div className="service-tags-wrap">
                          {tags.map((tag, tIdx) => (
                            <span key={tIdx} className="service-pill-tag">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {items.length > 0 && (
                          <div className="service-deliverables">
                            <h4 className="deliverables-heading">Core Deliverables:</h4>
                            <ul className="deliverables-list">
                              {items.map((item, iIdx) => (
                                <li key={iIdx}>
                                  <span className="checkmark-icon">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="service-action-row">
                          <Link href="/contact" className="btn-brand-solid">
                            Get a Free Demo &rarr;
                          </Link>
                        </div>
                      </div>

                      <div className="service-detail-visual">
                        <div className="service-img-frame">
                          <Image
                            src={service.imageUrl}
                            alt={service.title}
                            width={640}
                            height={460}
                            className="service-img"
                            unoptimized
                          />
                        </div>

                        {steps.length > 0 && (
                          <div className="service-workflow-steps">
                            <span className="workflow-title">Execution Workflow</span>
                            <div className="workflow-steps-list">
                              {steps.map((step, sIdx) => (
                                <div key={sIdx} className="workflow-step-badge">
                                  <span className="step-num">{sIdx + 1}</span>
                                  <span className="step-text">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack Strip (Two-Row Continuous Marquee) */}
        <section className="subpage-tech-section" aria-label="Technologies & Infrastructure">
          <div className="container">
            <div className="section-header-centered" style={{ marginBottom: '28px' }}>
              <span className="section-eyebrow">MODERN INFRASTRUCTURE</span>
              <h2 className="section-title">Built on Today&apos;s Most Reliable Frameworks</h2>
            </div>
          </div>
          <TechnologyTicker tools={techTools} />
        </section>

        {/* FAQs */}
        {faqsData.length > 0 && (
          <section className="subpage-faq-section">
            <div className="container">
              <div className="section-header-centered">
                <span className="section-eyebrow">COMMON INQUIRIES</span>
                <h2 className="section-title">Frequently Asked Questions</h2>
              </div>
              <div className="subpage-faq-wrapper">
                <FaqAccordion items={faqsData} />
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
