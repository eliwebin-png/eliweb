'use client';

import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DigitalServicesSectionProps {
  onOpenContact?: () => void;
  services?: Array<{
    id: string;
    title: string;
    description: string;
    category?: string;
    items?: string[];
    ctaLabel?: string;
  }>;
}

interface ServiceCardData {
  id: string;
  tag: string;
  title: string;
  desc: string;
  features: string[];
  ctaText: string;
  iconWrapClass: string;
  icon: React.ReactNode;
}

const SERVICES: {
  pair0: { left: ServiceCardData; right: ServiceCardData };
  pair1: { left: ServiceCardData; right: ServiceCardData };
} = {
  pair0: {
    left: {
      id: 'web-dev',
      tag: 'Full-Stack Web',
      title: 'Web Development',
      desc: 'Modern, fast, and scalable web applications.',
      features: [
        'Next.js / React.js',
        'Node.js & Express.js',
        'RESTful APIs',
        'Database & ORM',
        'Deployment & DevOps',
      ],
      ctaText: 'Build Your Website',
      iconWrapClass: 'icon-blue',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" stroke="#0066FF" strokeOpacity="0.6" />
        </svg>
      ),
    },
    right: {
      id: 'app-dev',
      tag: 'iOS & Android',
      title: 'App Development',
      desc: 'Native-quality, cross-platform mobile experiences.',
      features: [
        'React Native Development',
        'Cross-platform performance',
        'App Store / Google Play deployment',
        'APIs & backend integration',
        'Push notifications & offline sync',
      ],
      ctaText: 'Build Your App',
      iconWrapClass: 'icon-cyan',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C2CB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
        </svg>
      ),
    },
  },
  pair1: {
    left: {
      id: 'web-design',
      tag: 'UI/UX & Creative',
      title: 'Web Designing',
      desc: 'Stunning, responsive, and high-converting website designs.',
      features: [
        'Figma & UI/UX Wireframing',
        'Modern Responsive Layouts',
        'Interactive Micro-Animations',
        'Design Systems & UI Kits',
        'Conversion-Focused Architecture',
      ],
      ctaText: 'Design Your Website',
      iconWrapClass: 'icon-blue',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    right: {
      id: 'digital-marketing',
      tag: 'Growth & Reach',
      title: 'Digital Marketing',
      desc: 'Build your brand. Get noticed. Drive real results.',
      features: [
        'Social Media Marketing',
        'SEO (On-Page & Off-Page)',
        'Content Creation & Strategy',
        'Branding & Visual Design',
        'Lead Generation & Growth',
      ],
      ctaText: 'Grow Your Brand',
      iconWrapClass: 'icon-mint',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D084" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l18-5v12L3 13v-2z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      ),
    },
  },
};

export default function DigitalServicesSection({ onOpenContact, services }: DigitalServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [activePair, setActivePair] = useState<0 | 1>(0);
  const [cycle, setCycle] = useState(0);
  const chartGradientId = useId();

  // Scroll Entrance Intersection Observer
  useEffect(() => {
    setIsVisible(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Fire once
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Unstoppable auto-change every 5 seconds (5000ms) - completely ignores hover
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePair((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [cycle]);

  // Desktop Pointer Parallax Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / 38;
    const deltaY = (e.clientY - centerY) / 38;

    setParallax({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    if (onOpenContact) {
      e.preventDefault();
      onOpenContact();
    }
  };

  const handleManualSwitch = (pairIndex: 0 | 1) => {
    setActivePair(pairIndex);
    setCycle((c) => c + 1);
  };

  const currentPair = useMemo(() => {
    if (activePair === 0) {
      return {
        left: (services && services[0]) ? {
          ...SERVICES.pair0.left,
          title: services[0].title || SERVICES.pair0.left.title,
          desc: services[0].description || SERVICES.pair0.left.desc,
          tag: services[0].category || SERVICES.pair0.left.tag,
          features: (services[0].items && services[0].items.length > 0) ? services[0].items : SERVICES.pair0.left.features,
          ctaText: services[0].ctaLabel || SERVICES.pair0.left.ctaText,
        } : SERVICES.pair0.left,
        right: (services && services[1]) ? {
          ...SERVICES.pair0.right,
          title: services[1].title || SERVICES.pair0.right.title,
          desc: services[1].description || SERVICES.pair0.right.desc,
          tag: services[1].category || SERVICES.pair0.right.tag,
          features: (services[1].items && services[1].items.length > 0) ? services[1].items : SERVICES.pair0.right.features,
          ctaText: services[1].ctaLabel || SERVICES.pair0.right.ctaText,
        } : SERVICES.pair0.right,
      };
    } else {
      return {
        left: (services && services[2]) ? {
          ...SERVICES.pair1.left,
          title: services[2].title || SERVICES.pair1.left.title,
          desc: services[2].description || SERVICES.pair1.left.desc,
          tag: services[2].category || SERVICES.pair1.left.tag,
          features: (services[2].items && services[2].items.length > 0) ? services[2].items : SERVICES.pair1.left.features,
          ctaText: services[2].ctaLabel || SERVICES.pair1.left.ctaText,
        } : SERVICES.pair1.left,
        right: (services && services[3]) ? {
          ...SERVICES.pair1.right,
          title: services[3].title || SERVICES.pair1.right.title,
          desc: services[3].description || SERVICES.pair1.right.desc,
          tag: services[3].category || SERVICES.pair1.right.tag,
          features: (services[3].items && services[3].items.length > 0) ? services[3].items : SERVICES.pair1.right.features,
          ctaText: services[3].ctaLabel || SERVICES.pair1.right.ctaText,
        } : SERVICES.pair1.right,
      };
    }
  }, [activePair, services]);

  const renderServiceCard = (card: ServiceCardData, slotSide: 'left' | 'right') => (
    <div
      key={`${card.id}-${activePair}`}
      className={`dss-service-card dss-card-${slotSide} dss-card-swap-in`}
    >
      <div className="dss-card-glow" />
      <div className="dss-card-header">
        <div className={`dss-card-icon-wrap ${card.iconWrapClass}`} title={card.title}>
          {card.icon}
        </div>
        <span className="dss-card-tag">{card.tag}</span>
      </div>

      <div className="dss-card-title-wrap">
        <h3 className="dss-card-title">
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>
            {card.title}
          </Link>
        </h3>
        <p className="dss-card-desc">{card.desc}</p>
      </div>

      <ul className="dss-card-features">
        {card.features.map((feature, idx) => (
          <li key={idx}>
            <span className="dss-check-bullet">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D084" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="dss-card-footer">
        <Link href="/services" className="dss-card-cta" aria-label={card.ctaText}>
          <span>{card.ctaText}</span>
          <span className="dss-cta-circle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="digital-services"
      className={`dss-section ${isVisible ? 'dss-is-visible' : ''}`}
      aria-label="Complete Digital Presence Services"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Subtle Ambience with Brand Logo Colors */}
      <div className="dss-bg-layer" aria-hidden="true">
        <div className="dss-bg-radial" />
      </div>

      <div className="dss-container">
        {/* ====================================================================
            MAIN STAGE: 2 ROTATING CARD SLOTS + CENTER IMAGE COMPOSITION
            ==================================================================== */}
        <div className="dss-stage-grid">
          {/* Connector Lines Layer (Desktop SVG Canvas in Logo Cyan/Blue) */}
          <svg className="dss-connectors-canvas" viewBox="0 0 1200 700" fill="none" aria-hidden="true">
            {/* Left Connector to Left Card */}
            <path
              d="M 520 340 C 440 340, 400 310, 340 310"
              stroke="rgba(0, 194, 203, 0.4)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              className="dss-dash-flow"
            />
            <circle cx="340" cy="310" r="3.5" fill="#00C2CB" />

            {/* Right Connector to Right Card */}
            <path
              d="M 680 340 C 760 340, 800 310, 860 310"
              stroke="rgba(0, 194, 203, 0.4)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              className="dss-dash-flow-reverse"
            />
            <circle cx="860" cy="310" r="3.5" fill="#00C2CB" />
          </svg>

          {/* ================================================================
              C. LEFT CARD SLOT (Rotates: Web Dev <-> Web Designing)
              ================================================================ */}
          <div className="dss-slot-wrapper dss-slot-left dss-anim dss-delay-3">
            {renderServiceCard(currentPair.left, 'left')}
          </div>

          {/* ================================================================
              D. CENTRAL IMAGE COMPOSITION (Centerpiece)
              ================================================================ */}
          <div
            className="dss-composition-center dss-anim dss-delay-2"
            style={{
              transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 0)`,
            }}
          >
            {/* Subtle Cyan / Blue Radial Glow behind Image (Matching Logo) */}
            <div className="dss-radial-glow" aria-hidden="true" />

            {/* Orbital Rings with Minimal Dashed Lines */}
            <div className="dss-orbital-stage" aria-hidden="true">
              <div className="dss-orbital-ring dss-ring-outer">
                <span className="dss-orbit-dot dot-1" />
                <span className="dss-orbit-dot dot-2" />
              </div>
              <div className="dss-orbital-ring dss-ring-inner">
                <span className="dss-orbit-dot dot-3" />
              </div>
            </div>

            {/* Central Developer Girl Image (Preserving proportions & transparency) */}
            <div className="dss-image-frame">
              <Image
                src="/herogirl.avif"
                alt="Professional Digital Presence Architect & Full-Stack Developer"
                width={560}
                height={680}
                priority
                className="dss-person-image"
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>

            {/* Floating Annotation: "Your Success Is My Priority" (Upper-Right - Completely Unobstructed) */}
            <div className="dss-handwritten-note" aria-hidden="true">
              <span className="dss-note-text">&ldquo;Your Success Is My Priority&rdquo;</span>
              <svg className="dss-note-arrow" width="54" height="42" viewBox="0 0 54 42" fill="none">
                <path
                  d="M48 4 C36 16, 20 28, 6 26 M6 26 L15 20 M6 26 L13 33"
                  stroke="#0066FF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Floating Widget 1: Compact Mobile Mockup (Lower-Right) */}
            <div className="dss-floating-widget dss-widget-mobile" aria-label="Mobile Application Mockup">
              <div className="dss-mobile-speaker" />
              <div className="dss-mobile-screen">
                <div className="dss-mobile-header">
                  <div className="dss-mobile-notch" />
                </div>
                <div className="dss-mobile-card">
                  <span className="dss-mobile-badge">Native 60FPS</span>
                  <div className="dss-mobile-metric">99.8% Uptime</div>
                </div>
              </div>
            </div>

            {/* Floating Widget 2: Compact Analytics Widget (Lower-Left) in Brand Cyan/Blue */}
            <div className="dss-floating-widget dss-widget-analytics" aria-label="Performance Analytics">
              <div className="dss-analytics-header">
                <span className="dss-analytics-title">Live Performance</span>
                <span className="dss-analytics-pill">Active</span>
              </div>
              {/* Rising Vector Chart in Brand Cyan */}
              <div className="dss-chart-wrap">
                <svg width="140" height="42" viewBox="0 0 140 42" fill="none">
                  <defs>
                    <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C2CB" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#00C2CB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 38 Q 30 32, 50 24 T 95 14 T 140 4 L 140 42 L 0 42 Z"
                    fill={`url(#${chartGradientId})`}
                  />
                  <path
                    d="M 0 38 Q 30 32, 50 24 T 95 14 T 140 4"
                    stroke="#00C2CB"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="dss-chart-line"
                  />
                  <circle cx="140" cy="4" r="3.2" fill="#00D084" />
                </svg>
              </div>
              <div className="dss-metrics-row">
                <div className="dss-metric-item">
                  <span className="metric-val">+128%</span>
                  <span className="metric-lbl">Visitors</span>
                </div>
                <div className="dss-metric-item">
                  <span className="metric-val">84.6%</span>
                  <span className="metric-lbl">Engage</span>
                </div>
                <div className="dss-metric-item">
                  <span className="metric-val">3.8x</span>
                  <span className="metric-lbl">Leads</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              E. RIGHT CARD SLOT (Rotates: App Dev <-> Digital Marketing)
              ================================================================ */}
          <div className="dss-slot-wrapper dss-slot-right dss-anim dss-delay-4">
            {renderServiceCard(currentPair.right, 'right')}
          </div>
        </div>

        {/* ====================================================================
            F. 5-SECOND ROTATOR CONTROLS (Pills with live auto-timer indicator)
            ==================================================================== */}
        <div className="dss-rotator-container">
          <div className="dss-rotator-bar" role="tablist" aria-label="Digital Services Switcher">
            <button
              type="button"
              role="tab"
              aria-selected={activePair === 0}
              className={`dss-rotator-btn ${activePair === 0 ? 'is-active' : ''}`}
              onClick={() => handleManualSwitch(0)}
            >
              <span className="dss-rotator-pill-dot" />
              <span className="dss-rotator-text">
                <strong>01</strong> Web &amp; App Development
              </span>
              {activePair === 0 && (
                <span key={`timer-0-${cycle}`} className="dss-rotator-timer-bar" />
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activePair === 1}
              className={`dss-rotator-btn ${activePair === 1 ? 'is-active' : ''}`}
              onClick={() => handleManualSwitch(1)}
            >
              <span className="dss-rotator-pill-dot" />
              <span className="dss-rotator-text">
                <strong>02</strong> Web Designing &amp; Marketing
              </span>
              {activePair === 1 && (
                <span key={`timer-1-${cycle}`} className="dss-rotator-timer-bar" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
