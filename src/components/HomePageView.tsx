'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import HeaderNav from './HeaderNav';
import FaqAccordion, { FaqItem } from './FaqAccordion';
import NewsletterForm from './NewsletterForm';
import ContactModal from './ContactModal';
import LanguageChanger from './LanguageChanger';
import InstagramFeed from './InstagramFeed';
import DigitalServicesSection from './DigitalServicesSection';
import PreviousClientsSection from './PreviousClientsSection';

interface HomePageViewProps {
  hero: {
    headline: string;
    subtitle: string;
    cta1Label: string;
    cta1Url: string;
    cta2Label: string;
    cta2Url: string;
    trustPills: string[];
    tickerItems: string[];
  };
  stats: Array<{ id: string; value: string; label: string }>;
  services: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    tags: string[];
    items: string[];
    steps: string[];
    ctaLabel: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    category: string;
    tags: string[];
    description: string;
    imageUrl: string;
    featured: boolean;
    homepageTeaser: boolean;
  }>;
  faqs: FaqItem[];
  footerLinks: Array<{ id: string; column: string; label: string; url: string }>;
  settings: Record<string, string>;
}

export default function HomePageView({
  hero,
  stats,
  services,
  projects,
  faqs,
  footerLinks,
  settings,
}: HomePageViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();

  // Single-line rotating headline items with signatures gradients
  const headlineItems = useMemo(() => {
    const rawParts = hero.headline ? hero.headline.split('/') : ['We Build Websites.', 'We Craft Videos.', 'We Grow Brands.'];
    const colorClasses = ['headline-blue', 'headline-cyan', 'headline-mint'];
    return rawParts.map((part, idx) => {
      const text =
        idx === 0
          ? t('hero.line1', part.trim())
          : idx === 1
            ? t('hero.line2', part.trim())
            : t('hero.line3', part.trim());
      return {
        text,
        colorClass: colorClasses[idx % colorClasses.length],
      };
    });
  }, [hero.headline, t]);

  // Clone first item to create infinite upward loop
  const extendedHeadlineItems = useMemo(() => {
    if (headlineItems.length === 0) return [];
    return [...headlineItems, headlineItems[0]];
  }, [headlineItems]);

  const [headlineIdx, setHeadlineIdx] = useState(0);

  // Client partners parsed from DB SiteSettings
  const clientPartners = useMemo(() => {
    if (settings?.client_partners) {
      try {
        const arr = JSON.parse(settings.client_partners);
        if (Array.isArray(arr) && arr.length > 0) {
          return arr;
        }
      } catch (err) {
        console.error('Failed to parse client_partners settings:', err);
      }
    }
    return undefined;
  }, [settings?.client_partners]);
  const [headlineTransition, setHeadlineTransition] = useState(true);
  const [headlinePaused, setHeadlinePaused] = useState(false);

  // Rotate headline every 3.2s
  useEffect(() => {
    if (headlineItems.length <= 1 || headlinePaused) return;

    const timer = setInterval(() => {
      setHeadlineTransition(true);
      setHeadlineIdx((prev) => prev + 1);
    }, 3200);

    return () => clearInterval(timer);
  }, [headlineItems.length, headlinePaused]);

  // Seamless reset when hitting clone item
  useEffect(() => {
    if (headlineIdx === extendedHeadlineItems.length - 1) {
      const timeout = setTimeout(() => {
        setHeadlineTransition(false);
        setHeadlineIdx(0);
      }, 820);
      return () => clearTimeout(timeout);
    }
  }, [headlineIdx, extendedHeadlineItems.length]);

  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playbackRate = 2.0;

    const applyPlaybackRate = () => {
      if (video) video.playbackRate = 2.0;
    };

    video.addEventListener('loadedmetadata', applyPlaybackRate);
    video.addEventListener('canplay', applyPlaybackRate);
    video.addEventListener('play', applyPlaybackRate);

    video.play().catch(() => { });

    return () => {
      video.removeEventListener('loadedmetadata', applyPlaybackRate);
      video.removeEventListener('canplay', applyPlaybackRate);
      video.removeEventListener('play', applyPlaybackRate);
    };
  }, []);

  // Active slide index for services showcase carousel
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);

  // Curated list ensuring at least 4 items so slider navigation works cleanly
  const allServicesList = useMemo(() => {
    const fallbackList = [
      {
        id: 'service-web',
        title: 'Software Development',
        description:
          'We build powerful, scalable digital products — from modern web applications to complex enterprise cloud architectures.',
        category: 'Software',
        imageUrl:
          'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80',
        tags: ['Web Development', 'App Development', 'Next.js'],
        items: ['Web Development', 'App Development', 'APIs'],
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
        items: ['Social Media Management', 'Paid Ads', 'SEO'],
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
        items: ['Commercial Video Production', 'Motion Graphics', 'Brand Identity'],
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
        items: ['Design Systems', 'Interface Prototyping', 'User Research'],
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
        items: ['Cloud Migration', 'DevOps Automation', 'Security Audits'],
        steps: ['Architecture Review', 'Setup', 'Deploy', 'Monitor'],
        ctaLabel: 'Explore Infrastructure',
      },
    ];

    if (services && services.length > 0) {
      return services;
    }
    return fallbackList;
  }, [services]);

  const handlePrevService = () => {
    setServiceSlideIndex((prev) => (prev - 1 + allServicesList.length) % allServicesList.length);
  };

  const handleNextService = () => {
    setServiceSlideIndex((prev) => (prev + 1) % allServicesList.length);
  };

  const displayedServices = useMemo(() => {
    const total = allServicesList.length;
    if (total === 0) return [];
    return [
      allServicesList[(serviceSlideIndex + 0) % total],
      allServicesList[(serviceSlideIndex + 1) % total],
      allServicesList[(serviceSlideIndex + 2) % total],
    ];
  }, [allServicesList, serviceSlideIndex]);

  return (
    <>
      <HeaderNav onOpenModal={() => setModalOpen(true)} />

      <main>
        {/* ==========================================================================
            SECTION 1: HERO SECTION (WIREFRAME EXACT STRUCTURAL MATCH)
            ========================================================================== */}
        <section className="hero-editorial-wrapper" id="hero">
          <div className="container hero-container-box">
            {/* Navbar outside the big video box */}
            <div className="hero-navbar-bar">
              {/* 1. Left: Standalone Logo */}
              <Link href="/" className="hero-nav-logo-standalone" aria-label="EliWeb Home">
                <div style={{ position: 'relative', width: 54, height: 54 }}>
                  <Image
                    src="/eliweb-logo.png"
                    alt="EliWeb Logo"
                    fill
                    sizes="54px"
                    className="logo-img"
                    priority
                  />
                </div>
              </Link>

              {/* 2. Center: Floating Capsule (About us, Service, Portfolio, Blog + Get a Free Demo) */}
              <div className="nav-center-pill-capsule">
                <nav className="nav-capsule-links" aria-label="Main Navigation">
                  <Link href="/about" className="nav-capsule-link">{t('nav.about', 'About us')}</Link>
                  <Link href="/services" className="nav-capsule-link">{t('nav.services', 'Service')}</Link>
                  <Link href="/portfolio" className="nav-capsule-link">{t('nav.portfolio', 'Portfolio')}</Link>
                  <Link href="/blog" className="nav-capsule-link">{t('nav.blog', 'Blog')}</Link>
                </nav>

                <Link
                  href="/contact"
                  className="nav-quote-pill-btn"
                >
                  <span>{t('nav.demo', 'Get a Free Demo')}</span>
                  <span className="quote-arrow-icon">&rarr;</span>
                </Link>
              </div>

              {/* 3. Far Right (in the red box): Language Changer */}
              <div className="hero-nav-lang-slot">
                <LanguageChanger />
              </div>
            </div>

            <div className="hero-dark-canvas">
              {/* Background Video */}
              <div className="hero-video-bg-container" aria-hidden="true">
                <video
                  ref={heroVideoRef}
                  className="bg-video"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={(e) => {
                    e.currentTarget.playbackRate = 2.0;
                  }}
                  onPlay={(e) => {
                    e.currentTarget.playbackRate = 2.0;
                  }}
                >
                  <source
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              {/* Main Content Area */}
              <div className="hero-canvas-body">
                {/* Upper Grid: Left Eyebrow + Huge Headline, Right Subtitle + Mini Pill */}
                <div className="hero-canvas-upper">
                  <div className="hero-upper-left">
                    <div className="hero-eyebrow-pill">
                      <span className="pulse-dot"></span>
                      <span>EST. 2024 &bull; MODERN DIGITAL ATELIER</span>
                    </div>

                    <h1
                      className="hero-giant-headline single-line-rotator"
                      onMouseEnter={() => setHeadlinePaused(true)}
                      onMouseLeave={() => setHeadlinePaused(false)}
                      aria-live="polite"
                    >
                      <div className="headline-rotator-viewport">
                        <div
                          className="headline-rotator-track"
                          style={{
                            transform: `translateY(-${headlineIdx * (100 / extendedHeadlineItems.length)}%)`,
                            transition: headlineTransition ? 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                          }}
                        >
                          {extendedHeadlineItems.map((item, idx) => {
                            const isCurrent =
                              idx === headlineIdx ||
                              (headlineIdx === extendedHeadlineItems.length - 1 && idx === 0);
                            return (
                              <div
                                key={idx}
                                className={`headline-rotator-item ${item.colorClass} ${isCurrent ? 'is-active' : 'is-inactive'
                                  }`}
                              >
                                {item.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </h1>
                  </div>

                  <div className="hero-upper-right">
                    <p className="hero-descriptor-text">
                      {t('hero.subtitle', hero.subtitle)}
                    </p>
                    <button
                      type="button"
                      className="hero-action-pill"
                      onClick={() => setModalOpen(true)}
                    >
                      <span>{t('hero.cta1', hero.cta1Label || 'Start Your Project')}</span>
                      <span className="pill-arrow-circle">&rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Lower Grid: Social Proof / 5-Star Reviews Left, 2 Stacked Cards Right */}
                <div className="hero-canvas-lower">
                  <div className="hero-lower-left">
                    <div className="hero-social-proof-grid">
                      {/* 1. Trustpilot Badge (Top Left) */}
                      <div className="hero-review-card" title="Trustpilot 5.0 Star Rating">
                        <div className="review-card-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect width="24" height="24" rx="6" fill="#00B67A" />
                            <path d="M12 4.5l2.32 7.14H21.8l-6.06 4.4 2.31 7.14L12 18.77l-6.05 4.41 2.31-7.14-6.06-4.4h7.48L12 4.5z" fill="#FFFFFF" />
                          </svg>
                        </div>
                        <div className="review-card-body">
                          <div className="review-card-header">
                            <span className="review-card-score">5.0</span>
                            <div className="review-card-stars" aria-label="5 stars">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} width="11" height="11" viewBox="0 0 20 20" fill="#00B67A" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="review-card-label">Trustpilot 5★</span>
                        </div>
                      </div>

                      {/* 2. Upwork Badge (Top Right) */}
                      <div className="hero-review-card" title="Upwork 5.0 Star Top Rated">
                        <div className="review-card-icon">
                          <Image
                            src="/upwork.webp"
                            alt="Upwork"
                            width={22}
                            height={22}
                            style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '5px' }}
                          />
                        </div>
                        <div className="review-card-body">
                          <div className="review-card-header">
                            <span className="review-card-score">5.0</span>
                            <div className="review-card-stars" aria-label="5 stars">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} width="11" height="11" viewBox="0 0 20 20" fill="#14A800" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="review-card-label">Upwork Top Rated</span>
                        </div>
                      </div>

                      {/* 3. Clutch Review Badge (Bottom Left) */}
                      <div className="hero-review-card" title="Clutch 5.0 Star Rating">
                        <div className="review-card-icon">
                          <Image
                            src="/clutch-small.png"
                            alt="Clutch"
                            width={22}
                            height={22}
                            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                          />
                        </div>
                        <div className="review-card-body">
                          <div className="review-card-header">
                            <span className="review-card-score">5.0</span>
                            <div className="review-card-stars" aria-label="5 stars">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} width="11" height="11" viewBox="0 0 20 20" fill="#EB4A34" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="review-card-label">Clutch Reviews</span>
                        </div>
                      </div>

                      {/* 4. Google Reviews Badge (Bottom Right) */}
                      <div className="hero-review-card" title="Google 5.0 Star Rating">
                        <div className="review-card-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                        <div className="review-card-body">
                          <div className="review-card-header">
                            <span className="review-card-score">5.0</span>
                            <div className="review-card-stars" aria-label="5 stars">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} width="11" height="11" viewBox="0 0 20 20" fill="#FBBC05" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="review-card-label">Google Reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile In-Flow Video (shows directly after Upwork & Review stars on mobile) */}
                  <div className="hero-mobile-video-slot" aria-hidden="true">
                    <div className="hero-mobile-video-card">
                      <video
                        className="hero-mobile-video-element"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onLoadedMetadata={(e) => {
                          e.currentTarget.playbackRate = 2.0;
                        }}
                        onPlay={(e) => {
                          e.currentTarget.playbackRate = 2.0;
                        }}
                      >
                        <source
                          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>

                  {/* 2 Stacked Rounded Cards on Lower Right matching wireframe */}
                  <div className="hero-stacked-cards">
                    <div className="hero-stack-card">
                      <div className="stack-card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="16 18 22 12 16 6"></polyline>
                          <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                      </div>
                      <div className="stack-card-content">
                        <strong>{hero.trustPills[0] || '50+ Web & App Projects'}</strong>
                        <span>{hero.trustPills[1] || 'Full-stack Next.js & Prisma deployments'}</span>
                      </div>
                    </div>

                    <div className="hero-stack-card">
                      <div className="stack-card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                      </div>
                      <div className="stack-card-content">
                        <strong>{hero.trustPills[2] || '100% Client Satisfaction'}</strong>
                        <span>{hero.trustPills[3] || '5★ Rated Agency across US, UK & India'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Architectural Sloped Notch with Pill Button (matching wireframe) */}
              <div className="hero-bottom-shelf-notch" aria-label="Explore Capabilities Navigation">
                <svg
                  className="shelf-wing shelf-wing-left"
                  width="68"
                  height="56"
                  viewBox="0 0 68 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 0 0 C 30 0, 38 56, 68 56 L 68 0 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M 0 0 C 30 0, 38 56, 68 56"
                    stroke="rgba(0, 0, 0, 0.08)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>

                <div className="shelf-center-deck">
                  <a href="#services" className="hero-center-pill-btn">
                    <span className="pill-btn-label">{t('hero.explore', 'Explore Capabilities')}</span>
                    <span className="pill-btn-circle">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </a>
                </div>

                <svg
                  className="shelf-wing shelf-wing-right"
                  width="68"
                  height="56"
                  viewBox="0 0 68 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M 0 56 C 30 56, 38 0, 68 0 L 0 0 Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M 0 56 C 30 56, 38 0, 68 0"
                    stroke="rgba(0, 0, 0, 0.06)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================================================
            WHAT I DO: A TO Z COMPLETE DIGITAL PRESENCE (PREMIUM DIGITAL SERVICES)
            ========================================================================== */}
        <DigitalServicesSection onOpenContact={() => setModalOpen(true)} services={services} />

        {/* ==========================================================================
            SECTION 2: SERVICES SECTION WITH MARQUEE
            ========================================================================== */}
        <section className="services-section" id="services">
          <div className="container">
            {/* Header: Left Eyebrow Pill, Center Headline + Subheadline, Right "View All" Button */}
            <div className="services-header-grid">
              <div className="services-header-left">
                <div className="section-eyebrow-pill">
                  <span>WHAT WE BUILD</span>
                </div>
              </div>

              <div className="services-header-center">
                <h2 className="section-headline">Engineered Products, Flawless Execution.</h2>
                <p className="services-subheadline">
                  We architect and engineer transformative software platforms, scalable web architectures, and magnetic digital brand ecosystems that turn vision into market leadership.
                </p>
              </div>

              <div className="services-header-right">
                <Link
                  href="/services"
                  className="link-view-all"
                >
                  <span>View All Capabilities</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            {/* 3-Column Staggered Grid with Bottom Baseline & Controls above Card 3 */}
            <div className="services-staggered-grid">
              {/* Card 1: Tall (Left) */}
              <div className="service-column service-col-tall">
                {displayedServices[0] && (
                  <Link
                    href="/services"
                    className="service-card card-tall"
                    aria-label={displayedServices[0].title}
                  >
                    <div className="service-img-layer">
                      <img
                        src={displayedServices[0].imageUrl}
                        alt={displayedServices[0].title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="service-img-overlay" />
                    </div>
                    <span className="service-index-badge">01</span>
                    <div className="service-inner-dock">
                      <div className="service-dock-header">
                        <span className="service-dock-category">
                          {displayedServices[0].category.toUpperCase()} &bull; STRATEGY
                        </span>
                        <span className="service-dock-arrow" aria-hidden="true">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </span>
                      </div>
                      <h3 className="service-dock-title">{displayedServices[0].title}</h3>
                      {displayedServices[0].tags && displayedServices[0].tags.length > 0 && (
                        <p className="service-dock-tags">
                          {displayedServices[0].tags.slice(0, 3).join(' \u2022 ')}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>

              {/* Card 2: Medium (Center) */}
              <div className="service-column service-col-medium">
                {displayedServices[1] && (
                  <Link
                    href="/services"
                    className="service-card card-medium"
                    aria-label={displayedServices[1].title}
                  >
                    <div className="service-img-layer">
                      <img
                        src={displayedServices[1].imageUrl}
                        alt={displayedServices[1].title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="service-img-overlay" />
                    </div>
                    <span className="service-index-badge">02</span>
                    <div className="service-inner-dock">
                      <div className="service-dock-header">
                        <span className="service-dock-category">
                          {displayedServices[1].category.toUpperCase()} &bull; STRATEGY
                        </span>
                        <span className="service-dock-arrow" aria-hidden="true">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </span>
                      </div>
                      <h3 className="service-dock-title">{displayedServices[1].title}</h3>
                      {displayedServices[1].tags && displayedServices[1].tags.length > 0 && (
                        <p className="service-dock-tags">
                          {displayedServices[1].tags.slice(0, 3).join(' \u2022 ')}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>

              {/* Card 3: Compact (Right) + Slider Navigation Circles directly above it */}
              <div className="service-column service-col-compact">
                <div className="services-carousel-controls">
                  <button
                    type="button"
                    className="services-nav-circle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevService();
                    }}
                    aria-label="Previous capability"
                    title="Previous"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="services-nav-circle-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextService();
                    }}
                    aria-label="Next capability"
                    title="Next"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                {displayedServices[2] && (
                  <Link
                    href="/services"
                    className="service-card card-compact"
                    aria-label={displayedServices[2].title}
                  >
                    <div className="service-img-layer">
                      <img
                        src={displayedServices[2].imageUrl}
                        alt={displayedServices[2].title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                      <div className="service-img-overlay" />
                    </div>
                    <span className="service-index-badge">03</span>
                    <div className="service-inner-dock">
                      <div className="service-dock-header">
                        <span className="service-dock-category">
                          {displayedServices[2].category.toUpperCase()} &bull; STRATEGY
                        </span>
                        <span className="service-dock-arrow" aria-hidden="true">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </span>
                      </div>
                      <h3 className="service-dock-title">{displayedServices[2].title}</h3>
                      {displayedServices[2].tags && displayedServices[2].tags.length > 0 && (
                        <p className="service-dock-tags">
                          {displayedServices[2].tags.slice(0, 3).join(' \u2022 ')}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Scrolling Marquee Strip Underneath with Partner Logos & Tags */}
          <div className="marquee-strip" aria-label="Ticker & Technology Capabilities">
            <div className="marquee-track">
              {hero.tickerItems.map((item, idx) => (
                <div key={idx} className="marquee-item">
                  <span className="badge-dot"></span> {item.toUpperCase()}
                </div>
              ))}
              {/* Duplicate track for seamless infinite marquee */}
              {hero.tickerItems.map((item, idx) => (
                <div key={`dup-${idx}`} className="marquee-item">
                  <span className="badge-dot"></span> {item.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            SECTION 3: FEATURE SECTION (TWO VARIATIONS)
            ========================================================================== */}
        <section className="feature-section" id="approach">
          <div className="container">
            {/* Variation 1: Two-column Alternating Layout */}
            <div className="feature-split-layout">
              <div className="feature-text-col">
                <span className="section-eyebrow">OUR METHODOLOGY</span>
                <h2 className="section-headline">
                  Obsessive craft from initial conception to high-scale deployment.
                </h2>
                <p className="feature-paragraph">
                  Traditional development suffers from disconnects between design vision and technical execution. At EliWeb, our architects, engineers, and creatives operate as one single agile unit.
                </p>

                <ul className="feature-checklist">
                  <li className="checklist-item">
                    <div className="check-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong>Full-Stack Architectural Precision</strong>
                      <span>Clean Next.js App Router code, robust Prisma schema models, and sub-second page performance.</span>
                    </div>
                  </li>
                  <li className="checklist-item">
                    <div className="check-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong>Data-Driven Growth Integration</strong>
                      <span>Every interface is built conversion-first with SEO metadata, accessibility, and high visual hierarchy.</span>
                    </div>
                  </li>
                  <li className="checklist-item">
                    <div className="check-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <strong>Guaranteed Milestone Delivery</strong>
                      <span>Weekly stage-gate sprints, transparent progress reporting, and zero surprise delays.</span>
                    </div>
                  </li>
                </ul>

                <div className="feature-cta-group">
                  <button
                    type="button"
                    className="btn btn-pill btn-terracotta"
                    onClick={() => setModalOpen(true)}
                  >
                    Start a Consultation
                  </button>
                  <span className="delivery-guarantee">Backed by our 100% Client Satisfaction Guarantee</span>
                </div>
              </div>

              <div className="feature-image-col">
                <div className="framed-image-box">
                  <video
                    src="https://www.glideapps.com/images/new/apps-anywhere/responsive-devices.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="feature-main-video"
                  />
                  <div className="image-floating-badge">
                    <span className="badge-number">100%</span>
                    <span className="badge-caption">In-House Engineering &amp; Creative Strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            OUR CLIENTS SHOWCASE SECTION (JUST AFTER METHODOLOGY)
            ========================================================================== */}
        <PreviousClientsSection
          clients={clientPartners}
          badgeText={settings?.clients_badge || 'Trusted by Leading Organizations'}
          titlePrefix={settings?.clients_title_prefix || 'Our'}
          titleGradient={settings?.clients_title_gradient || 'Clients'}
          onOpenModal={() => setModalOpen(true)}
        />

        {/* ==========================================================================
            PORTFOLIO ARCHIVES
            ========================================================================== */}
        <section className="feature-section feature-section-portfolio" id="portfolio">
          <div className="container">
            {/* Variation 2: Asymmetric Image Grid (8 Tiles across 2 Rows from Wireframe) */}
            <div className="asymmetric-grid-section">
              <div className="grid-section-header">
                <div>
                  <span className="section-eyebrow">PORTFOLIO ARCHIVES</span>
                  <h2 className="section-headline">Form, Code &amp; Visual Resonance</h2>
                </div>
                <p className="grid-subtext">
                  A curated look into our recent web engineering, ecommerce platforms, and digital brand films.
                </p>
              </div>

              <div className="asymmetric-gallery">
                {/* Row 1 Tile 1: Text Accent Card */}
                <div className="gallery-tile tile-text-accent">
                  <span className="tile-tag">THE ARCHIVES</span>
                  <h3 className="tile-headline">Built with Uncompromising Standards</h3>
                  <p className="tile-sub">Crafting digital statements that combine editorial luxury with blazing runtime speed.</p>
                  <div className="tile-stats-mini">
                    <span>{stats[0] ? `${stats[0].value} ${stats[0].label}` : '50+ Projects'}</span>
                    <span>&bull;</span>
                    <span>{stats[1] ? `${stats[1].value} ${stats[1].label}` : '2026 Index'}</span>
                  </div>
                </div>

                {/* Dynamic project tiles from Prisma */}
                {projects.slice(0, 6).map((project, idx) => {
                  // After 4 items, insert quote card in 7th position to match wireframe exactly
                  if (idx === 4) {
                    return (
                      <React.Fragment key={project.id}>
                        <div className="gallery-tile tile-img">
                          <img src={project.imageUrl} alt={project.name} loading="lazy" />
                          <div className="tile-hover-info">
                            <span className="hover-loc">{project.category}</span>
                            <h4 className="hover-title">{project.name}</h4>
                          </div>
                        </div>

                        {/* Wireframe Quote Tile */}
                        <div className="gallery-tile tile-quote" key="quote-tile">
                          <span className="quote-mark">&ldquo;</span>
                          <p className="quote-text">
                            Great software is like iconic architecture: invisible in its complexity, unforgettable in its elegance.
                          </p>
                          <span className="quote-author">&mdash; EliWeb Studio Principles</span>
                        </div>
                      </React.Fragment>
                    );
                  }

                  return (
                    <div key={project.id} className="gallery-tile tile-img">
                      <img src={project.imageUrl} alt={project.name} loading="lazy" />
                      <div className="tile-hover-info">
                        <span className="hover-loc">{project.category}</span>
                        <h4 className="hover-title">{project.name}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>



        {/* ==========================================================================
            INSTAGRAM FEED SHOWCASE (@eliweb.in)
            ========================================================================== */}
        {(() => {
          let instaPosts: any[] | undefined = undefined;
          if (settings.instagram_posts) {
            try {
              const parsed = JSON.parse(settings.instagram_posts);
              if (Array.isArray(parsed) && parsed.length > 0) {
                instaPosts = parsed.map((item: any, idx: number) => {
                  if (typeof item === 'string') {
                    return { id: `insta-${idx}`, url: item };
                  }
                  return {
                    id: `insta-${idx}`,
                    url: item.url,
                    imageUrl: item.imageUrl,
                    videoUrl: item.videoUrl,
                    caption: item.caption,
                    tag: item.tag,
                    duration: item.duration,
                  };
                });
              }
            } catch {
              instaPosts = settings.instagram_posts
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((url, idx) => ({ id: `insta-${idx}`, url }));
            }
          }
          return (
            <InstagramFeed
              handle={settings.instagram_handle}
              title={settings.instagram_title}
              profileUrl={settings.instagram_url}
              posts={instaPosts}
            />
          );
        })()}

        {/* ==========================================================================
            SECTION 5: FAQ SECTION (WIREFRAME EXACT)
            ========================================================================== */}
        <section className="faq-section" id="faq">
          <div className="container faq-grid">
            {/* Left Side: Large Square Image with Inset Caption */}
            <div className="faq-image-column">
              <div className="faq-image-box">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                  alt="Architecture workshop and technical planning"
                  className="faq-img"
                  loading="lazy"
                />
                <div className="faq-image-caption">
                  <span className="caption-tag">CONSULTING &amp; SCOPE</span>
                  <h4>Need custom technical solutions or immediate development?</h4>
                  <p>Our senior architects answer all inquiries directly within 24 hours.</p>
                  <button
                    type="button"
                    className="caption-link"
                    onClick={() => setModalOpen(true)}
                  >
                    Email Our Team Directly &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Numbered Accordion List */}
            <div className="faq-content-column">
              <div className="faq-header-wrap">
                <span className="section-eyebrow">TRANSPARENT ANSWERS</span>
                <h2 className="section-headline">Frequently Asked Questions</h2>
                <p className="faq-intro">
                  Clear answers on how we plan, design, price, and launch high-impact digital solutions.
                </p>
              </div>

              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================================
          SECTION 6: FOOTER (DARK BACKGROUND)
          ========================================================================== */}
      <div className="footer-blueprint-banner " style={{ paddingBottom: '2rem' }}>
        <div className="blueprint-overlay">
          <div className="blueprint-tag">DISCOVERY &amp; PROTOTYPING LAB</div>
          <h3 className="blueprint-title">Crafting Tomorrow&apos;s Digital Standards</h3>
          <p className="blueprint-desc">
            From headless commerce architectures to cinematic video production, we partner with visionary brands across the globe.
          </p>
          <button
            type="button"
            className="btn btn-pill btn-secondary-light"
            onClick={() => setModalOpen(true)}
          >
            Schedule Technical Review &rarr;
          </button>
        </div>
      </div>
      <footer className="site-footer" id="contact">

        <div className="container footer-main">
          <div className="footer-columns-grid">
            {/* Column 1: Brand + Newsletter Signup */}
            <div className="footer-col col-brand">
              <div className="footer-brand-logo">
                <div style={{ position: 'relative', width: 38, height: 38 }}>
                  <Image
                    src="/eliweb-logo.png"
                    alt="EliWeb Logo"
                    fill
                    sizes="38px"
                    className="footer-logo-img"
                  />
                </div>
                <span className="footer-brand-title">ELIWEB.IN</span>
              </div>
              <p className="footer-brand-desc">
                {settings.brand_tagline ||
                  'We Build. We Edit. We Elevate. Premium websites, scalable software, and cinematic video content for ambitious brands.'}
              </p>

              <div className="newsletter-widget">
                <h4 className="newsletter-title">Subscribe to the Digital Journal</h4>
                <p className="newsletter-sub">Quarterly insights on design systems, Next.js architecture, and marketing.</p>
                <NewsletterForm />
              </div>
            </div>

            {/* Column 2: Quick Links from Prisma */}
            <div className="footer-col col-links">
              <h4 className="footer-col-title">Navigation &amp; Services</h4>
              <ul className="footer-nav">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Details & Social Icons */}
            <div className="footer-col col-contact">
              <h4 className="footer-col-title">Global Reach</h4>
              <div className="studio-locations">
                <div className="studio-item">
                  <strong>Headquarters</strong>
                  <p>{settings.location || 'India (Remote-First, Serving Worldwide)'}</p>
                  <a href={`tel:${settings.phone || '+917973851691'}`} className="studio-phone">
                    {settings.phone || '+91 79 7385 1691'}
                  </a>
                </div>

                <div className="studio-item">
                  <strong>Direct Inquiries</strong>
                  <p>{settings.hello_email || 'eliweb.in@gmail.com'}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-terracotta)' }}>
                    {settings.response_time || 'Reply within 24 hours'}
                  </span>
                </div>
              </div>

              <div className="footer-social-wrap">
                <span className="social-label">Follow our updates:</span>
                <div className="social-links">
                  <a
                    href={settings.instagram_url || 'https://www.instagram.com/eliweb.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href={settings.linkedin_url || 'https://www.instagram.com/eliweb.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a
                    href={settings.youtube_url || 'https://www.instagram.com/eliweb.in/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                  <a
                    href={settings.whatsapp_url || 'https://wa.me/917973851691'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Copyright and Legal Links */}
          <div className="footer-bottom-bar">
            <div className="bottom-legal-copy">
              <p>&copy; {settings.copyright_year || '2026'} EliWeb.in &bull; All rights reserved.</p>
            </div>

            <ul className="bottom-legal-links">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Engagement</Link></li>
              <li><Link href="/security">Security Standards</Link></li>
              <li><Link href="/cookies">Cookie Settings</Link></li>
            </ul>
          </div>

          {/* Architectural Blueprint / Map Visual Beneath Footer (from wireframe) */}

        </div>
      </footer>

      {/* Interactive Contact & Discovery Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
