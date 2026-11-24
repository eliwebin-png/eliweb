'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type CategoryFilter = 'All' | 'Websites' | 'Branding' | 'Applications' | 'Marketing';

interface PortfolioItem {
  id: string;
  category: CategoryFilter;
  categoryLabel: string;
  title: string;
  description: string;
  bgColor: string;
  textColor?: string;
  mockupType: 'tablet-mobile' | 'dual-desktop' | 'mobile-pair' | 'browser-window' | 'photo-hero' | 'brand-minimal';
  primaryImg: string;
  secondaryImg?: string;
  brandText?: string;
}

const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  // Row 1
  {
    id: 'apex-commerce',
    category: 'Websites',
    categoryLabel: 'Web Platform & Architecture',
    title: 'Apex Commerce Engine',
    description: 'High-throughput headless commerce system with sub-second page transitions, dynamic inventory synchronization, and frictionless one-click checkout.',
    bgColor: '#ECECEC',
    mockupType: 'dual-desktop',
    primaryImg: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'studio-ma',
    category: 'Websites',
    categoryLabel: 'Editorial Web Experience',
    title: 'Studio M+A Atelier',
    description: 'Minimalist portfolio and virtual architectural gallery showcasing bespoke commercial interiors, material palettes, and interactive 3D floorplan tours.',
    bgColor: '#DDD4C8',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  },

  // Row 2
  {
    id: 'vortex-network',
    category: 'Applications',
    categoryLabel: 'Cross-Platform Mobile App',
    title: 'Vortex Play Network',
    description: 'Interactive gaming and esports portal built for 500k+ concurrent gaming enthusiasts with live tournament brackets, low-latency chats, and digital rewards.',
    bgColor: '#C7DECB',
    mockupType: 'tablet-mobile',
    primaryImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'pulseledger-saas',
    category: 'Applications',
    categoryLabel: 'Fintech & SaaS Platform',
    title: 'PulseLedger Analytics',
    description: 'Real-time institutional financial dashboard streaming global FX, automated accounting reconciliation, and algorithmic compliance reporting.',
    bgColor: '#D4DCE5',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
  },

  // Row 3
  {
    id: 'maison-nectar',
    category: 'Branding',
    categoryLabel: 'Brand Identity & eCommerce',
    title: 'Maison Nectar Parfums',
    description: 'Sensory digital boutique with interactive fragrance profiling, custom unboxing visuals, and seamless worldwide shipping integration.',
    bgColor: '#F3DFD1',
    mockupType: 'tablet-mobile',
    primaryImg: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'freightflow-logistics',
    category: 'Websites',
    categoryLabel: 'Enterprise Web Architecture',
    title: 'FreightFlow Global',
    description: 'Autonomous freight coordination portal featuring telemetry tracking, algorithmic route optimization, and carrier bidding engine.',
    bgColor: '#FBF1DF',
    mockupType: 'dual-desktop',
    primaryImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
  },

  // Row 4
  {
    id: 'koro-expeditions',
    category: 'Branding',
    categoryLabel: 'Cinematic Brand Direction',
    title: 'Koro Expeditions',
    description: 'Complete visual identity, campaign documentaries, and booking atelier for premier high-altitude mountaineering expeditions worldwide.',
    bgColor: '#EAEAEA',
    mockupType: 'photo-hero',
    primaryImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'aquatrack-oceanics',
    category: 'Applications',
    categoryLabel: 'IoT & Mobile Telemetry',
    title: 'AquaTrack Oceanics',
    description: 'Decentralized marine sensor tracking system providing real-time ocean current telemetry, water purity diagnostics, and automated alerts.',
    bgColor: '#BBE0D2',
    mockupType: 'tablet-mobile',
    primaryImg: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },

  // Row 5
  {
    id: 'cinemasphere-media',
    category: 'Marketing',
    categoryLabel: 'Media Streaming Platform',
    title: 'CinemaSphere Atelier',
    description: 'On-demand indie film streaming network with high-bitrate adaptive HLS video, curator interviews, and ticketed virtual premiere rooms.',
    bgColor: '#C5E3FB',
    mockupType: 'dual-desktop',
    primaryImg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'nocturne-prime',
    category: 'Websites',
    categoryLabel: 'High-End Real Estate Portal',
    title: 'Nocturne Prime Estates',
    description: 'Immersive architectural real estate platform featuring high-res night panoramas, confidential inquiry vaults, and private buyer salons.',
    bgColor: '#14253E',
    textColor: '#FFFFFF',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  },

  // Row 6
  {
    id: 'borealis-tonic',
    category: 'Branding',
    categoryLabel: 'Brand Narrative & Video Craft',
    title: 'Borealis Botanical Tonic',
    description: 'Artisan beverage brand campaign including 4K commercial films, print typography, and direct-to-consumer subscription commerce.',
    bgColor: '#E5EBF0',
    mockupType: 'photo-hero',
    primaryImg: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'salt-capital',
    category: 'Branding',
    categoryLabel: 'Brand System & Tech Identity',
    title: 'Salt Capital Partners',
    description: 'Comprehensive brand ecosystem, corporate type design, and investor pitch portal for early-stage generative AI venture funds.',
    bgColor: '#0B0F2A',
    textColor: '#FFFFFF',
    mockupType: 'brand-minimal',
    brandText: 'Salt.',
    primaryImg: '',
  },

  // Row 7
  {
    id: 'modus-magazine',
    category: 'Websites',
    categoryLabel: 'Digital Editorial Publication',
    title: 'Modus Magazine Online',
    description: 'Digital-first quarterly publication with custom typography, responsive editorial columns, and animated interactive photo spreads.',
    bgColor: '#EEEEEE',
    mockupType: 'dual-desktop',
    primaryImg: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'umami-craft',
    category: 'Marketing',
    categoryLabel: 'Culinary Brand & Ordering',
    title: 'Umami Craft Kitchen',
    description: 'Vibrant culinary web presence, live chef table reservation system, and branded delivery ordering architecture.',
    bgColor: '#FCECA1',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  },

  // Row 8
  {
    id: 'aura-speakeasy',
    category: 'Websites',
    categoryLabel: 'Hospitality & Event Portal',
    title: 'Aura Speakeasy Lounge',
    description: 'Exclusive membership booking app, VIP table concierge, and experiential cocktail menu with interactive flavor notes.',
    bgColor: '#DFCCA2',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'vanguard-firm',
    category: 'Branding',
    categoryLabel: 'Executive Personal Brand',
    title: 'Vanguard Leadership Firm',
    description: 'Distinguished personal brand website for global thought leaders, keynote speakers, and private equity advisors.',
    bgColor: '#1A1A1E',
    textColor: '#FFFFFF',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },

  // Row 9
  {
    id: 'verdant-harvest',
    category: 'Applications',
    categoryLabel: 'Consumer Mobile Application',
    title: 'Verdant Harvest Grocers',
    description: 'Farm-to-door organic grocery delivery app with real-time freshness ratings, recurring harvest subscriptions, and instant UPI checkout.',
    bgColor: '#CDEED5',
    mockupType: 'mobile-pair',
    primaryImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'solstice-festival',
    category: 'Marketing',
    categoryLabel: 'Entertainment & Festival Web',
    title: 'Solstice Music Festival',
    description: 'High-energy festival experience site with dynamic festival lineup schedule, interactive 3D stage map, and ticket resale exchange.',
    bgColor: '#28272F',
    textColor: '#FFFFFF',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80',
  },

  // Row 10
  {
    id: 'villa-paradiso',
    category: 'Websites',
    categoryLabel: 'Boutique Travel & Hospitality',
    title: 'Villa Paradiso Riviera',
    description: 'Luxury resort experience featuring suite customizer, personalized itinerary builder, and multi-currency secure deposit system.',
    bgColor: '#C37871',
    textColor: '#FFFFFF',
    mockupType: 'browser-window',
    primaryImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'zenith-mindfulness',
    category: 'Applications',
    categoryLabel: 'Health & Wellness Mobile App',
    title: 'Zenith Mindfulness Coach',
    description: 'Guided audio meditation and biometrics tracking platform with personalized breathing pacing and sleep ambient soundscapes.',
    bgColor: '#DEE0F3',
    mockupType: 'tablet-mobile',
    primaryImg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    secondaryImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  },
];

const FILTER_OPTIONS: CategoryFilter[] = ['All', 'Websites', 'Branding', 'Applications', 'Marketing'];

interface PortfolioShowcaseViewProps {
  projects?: Array<{
    id: string;
    name: string;
    category: string;
    tags?: string[];
    description: string;
    imageUrl: string;
    featured?: boolean;
    homepageTeaser?: boolean;
  }>;
}

export default function PortfolioShowcaseView({ projects }: PortfolioShowcaseViewProps = {}) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');

  const mappedProjects: PortfolioItem[] = useMemo(() => {
    if (projects && projects.length > 0) {
      const palette = ['#ECECEC', '#DDD4C8', '#C7DECB', '#D4DCE5', '#F3DFD1', '#FBF1DF', '#EAEAEA', '#BBE0D2', '#C5E3FB', '#CDEED5'];
      return projects.map((p, idx) => {
        // Map category string to valid CategoryFilter
        const rawCat = (p.category || '').toLowerCase();
        let cat: CategoryFilter = 'Websites';
        if (rawCat.includes('app') || rawCat.includes('mobile')) cat = 'Applications';
        else if (rawCat.includes('brand') || rawCat.includes('creative')) cat = 'Branding';
        else if (rawCat.includes('market') || rawCat.includes('video')) cat = 'Marketing';

        return {
          id: p.id,
          category: cat,
          categoryLabel: p.category || 'Digital Architecture',
          title: p.name,
          description: p.description,
          bgColor: palette[idx % palette.length],
          mockupType: 'browser-window' as const,
          primaryImg: p.imageUrl,
        };
      });
    }
    return PORTFOLIO_PROJECTS;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return mappedProjects;
    return mappedProjects.filter((p) => p.category === activeFilter);
  }, [activeFilter, mappedProjects]);

  const renderCardVisual = (project: PortfolioItem) => {
    switch (project.mockupType) {
      case 'brand-minimal':
        return (
          <div className="ps-mockup-brand-box">
            <span className="ps-brand-symbol">&#9670;</span>
            <span className="ps-brand-wordmark">{project.brandText || 'Salt.'}</span>
          </div>
        );

      case 'photo-hero':
        return (
          <div className="ps-mockup-photo-box">
            <img
              src={project.primaryImg}
              alt={project.title}
              className="ps-photo-img"
              loading="lazy"
            />
          </div>
        );

      case 'tablet-mobile':
        return (
          <div className="ps-mockup-dual-devices">
            {/* Tablet Mockup */}
            <div className="ps-device-tablet">
              <div className="ps-device-tablet-notch" />
              <img
                src={project.primaryImg}
                alt={project.title}
                className="ps-device-img"
                loading="lazy"
              />
            </div>
            {/* Phone Mockup overlapping on right */}
            {project.secondaryImg && (
              <div className="ps-device-phone">
                <div className="ps-device-phone-notch" />
                <img
                  src={project.secondaryImg}
                  alt={`${project.title} Mobile`}
                  className="ps-device-img"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        );

      case 'mobile-pair':
        return (
          <div className="ps-mockup-mobile-pair">
            <div className="ps-device-phone-lead">
              <div className="ps-device-phone-notch" />
              <img
                src={project.primaryImg}
                alt={project.title}
                className="ps-device-img"
                loading="lazy"
              />
            </div>
            {project.secondaryImg && (
              <div className="ps-device-phone-secondary">
                <div className="ps-device-phone-notch" />
                <img
                  src={project.secondaryImg}
                  alt={`${project.title} Second Screen`}
                  className="ps-device-img"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        );

      case 'dual-desktop':
        return (
          <div className="ps-mockup-dual-desktop">
            <div className="ps-browser-window-main">
              <div className="ps-browser-header">
                <span className="ps-dot ps-dot-red" />
                <span className="ps-dot ps-dot-yellow" />
                <span className="ps-dot ps-dot-green" />
              </div>
              <img
                src={project.primaryImg}
                alt={project.title}
                className="ps-browser-img"
                loading="lazy"
              />
            </div>
            {project.secondaryImg && (
              <div className="ps-browser-window-side">
                <div className="ps-browser-header">
                  <span className="ps-dot ps-dot-red" />
                  <span className="ps-dot ps-dot-yellow" />
                  <span className="ps-dot ps-dot-green" />
                </div>
                <img
                  src={project.secondaryImg}
                  alt={`${project.title} Secondary`}
                  className="ps-browser-img"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        );

      case 'browser-window':
      default:
        return (
          <div className="ps-mockup-browser-single">
            <div className="ps-browser-header">
              <span className="ps-dot ps-dot-red" />
              <span className="ps-dot ps-dot-yellow" />
              <span className="ps-dot ps-dot-green" />
            </div>
            <img
              src={project.primaryImg}
              alt={project.title}
              className="ps-browser-img"
              loading="lazy"
            />
          </div>
        );
    }
  };

  return (
    <div className="ps-page-wrapper">
      <div className="ps-container">
        {/* Editorial Headline Hero */}

        {/* Modern Portfolio Hero */}
        <section className="ps-hero-section">

          <div className="ps-hero-layout">

            {/* Left Content */}
            <div className="ps-hero-content">

              <div className="ps-hero-eyebrow">
                <span className="ps-eyebrow-dot" />
                <span>✦ Selected Works Archive • 2024–2026</span>
              </div>

              <h1 className="ps-hero-headline">
                Crafting Timeless{' '}
                <span className="ps-gradient-text">Digital Standards</span>
              </h1>

              <p className="ps-hero-description">
                From high-performance headless architectures to cinematic media systems,
                we partner with visionary enterprises across the USA, UK, and India to engineer
                experiences that elevate market value.
              </p>

              <div className="ps-hero-actions">
                <a href="#portfolio-grid" className="ps-hero-btn-primary">
                  <span>Explore Projects</span>
                  <span className="ps-btn-arrow">↓</span>
                </a>

                <Link href="/contact" className="ps-hero-btn-secondary">
                  <span>Initiate a Project</span>
                  <span className="ps-btn-arrow">→</span>
                </Link>
              </div>

              <div className="ps-hero-metrics">
                <div className="ps-metric-item">
                  <strong>50+</strong>
                  <span>High-Scale Builds</span>
                </div>
                <div className="ps-metric-sep" />
                <div className="ps-metric-item">
                  <strong>99.9%</strong>
                  <span>Lighthouse Score</span>
                </div>
                <div className="ps-metric-sep" />
                <div className="ps-metric-item">
                  <strong>Global</strong>
                  <span>USA • UK • India</span>
                </div>
              </div>

            </div>

            {/* Right Visual Showcase */}
            <div className="ps-hero-visual">

              <div className="ps-stage-glow" />

              {/* Floating KPI Badges */}
              <div className="ps-stage-chip-top">
                <span>⚡</span>
                <span>Sub-Second Speed &bull; Next.js 15</span>
              </div>

              <div className="ps-stage-chip-bottom">
                <span>✦</span>
                <span>Enterprise Grade Architecture</span>
              </div>

              {/* Main Desktop Browser Frame */}
              <div className="ps-stage-macbook">
                <div className="ps-browser-bar">
                  <div className="ps-browser-traffic">
                    <span className="ps-dot ps-dot-red" />
                    <span className="ps-dot ps-dot-yellow" />
                    <span className="ps-dot ps-dot-green" />
                  </div>
                  <div className="ps-browser-url">
                    <span>🔒 eliweb.in/showcase/production</span>
                  </div>
                  <div className="ps-browser-status">
                    <span>● Live</span>
                  </div>
                </div>

                <div className="ps-browser-screen">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85"
                    alt="High-Scale Digital Product Architecture"
                  />
                </div>
              </div>

              {/* Overlapping Smartphone Showcase */}
              <div className="ps-stage-phone">
                <div className="ps-phone-notch" />
                <div className="ps-phone-screen">
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=85"
                    alt="Mobile App Architecture Preview"
                  />
                  <div className="ps-phone-badge">
                    <span><span className="ps-phone-pulse" />Fluid UI</span>
                    <span>60 FPS</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Existing Portfolio Filters */}
          <div className="ps-filter-pills-row" role="tablist" aria-label="Portfolio Filters">
            {FILTER_OPTIONS.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`ps-filter-pill ${isActive ? 'ps-filter-pill-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>

        </section>


        {/* 2-Column Responsive Portfolio Showcase Grid */}
        <section className="ps-grid-section" id="portfolio-grid">
          <div className="ps-showcase-grid">
            {filteredProjects.map((project) => (
              <article key={project.id} className="ps-project-card">
                <Link
                  href="/contact"
                  className="ps-card-media-box"
                  style={{ backgroundColor: project.bgColor }}
                  aria-label={`View details for ${project.title}`}
                >
                  {renderCardVisual(project)}
                </Link>

                <div className="ps-card-info">
                  <div className="ps-card-meta">
                    <Link href="/services" className="ps-category-link">
                      {project.categoryLabel}
                    </Link>
                    <span className="ps-meta-sep">&bull;</span>
                    <strong className="ps-project-title">{project.title}</strong>
                  </div>
                  <p className="ps-project-desc">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Editorial Call-To-Action (Matching Image) */}
        <section className="ps-cta-section">
          <h2 className="ps-cta-headline">Let&apos;s get to work.</h2>
          <Link href="/contact" className="ps-cta-link">
            Start a Project &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
}

