'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  title: string;
  shortLabel: string;
  category: string;
  color: string;
  accentBg: string;
  tagline: string;
  statsPill: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    shortLabel: 'Website',
    category: 'Next.js & Modern Web',
    color: '#2563EB',
    accentBg: 'rgba(37, 99, 235, 0.1)',
    tagline: 'High-Converting Responsive Web Platforms',
    statsPill: '⚡ 99 PageSpeed Score',
  },
  {
    id: 'software-dev',
    title: 'Software Development',
    shortLabel: 'Software',
    category: 'Cloud APIs & Architecture',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.1)',
    tagline: 'Scalable Distributed Cloud Microservices',
    statsPill: '🛡️ 99.99% Uptime SLA',
  },
  {
    id: 'crm-dev',
    title: 'CRM Development',
    shortLabel: 'CRM & Sales',
    category: 'Sales Automation & Pipelines',
    color: '#8B5CF6',
    accentBg: 'rgba(139, 92, 246, 0.1)',
    tagline: 'Automated Lead Funnels & Pipeline Intelligence',
    statsPill: '📈 3.4x Faster Closures',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    shortLabel: 'Mobile Apps',
    category: 'iOS & Android Native',
    color: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.1)',
    tagline: 'Fluid 60FPS Cross-Platform Experiences',
    statsPill: '📱 60 FPS Native UI',
  },
  {
    id: 'biz-solutions',
    title: 'Business Solutions',
    shortLabel: 'Business Intelligence',
    category: 'Analytics & Automation',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.1)',
    tagline: 'Executive Analytics & Operational Command',
    statsPill: '🚀 +42% Efficiency Gain',
  },
];

const AUTOPLAY_INTERVAL = 4500; // 4.5s per transition

export default function DigitalEcosystemShowcase() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const activeService = SERVICES[activeIndex];

  // Automated Cycling
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="digital-ecosystem-section"
      id="digital-ecosystem"
      aria-label="Automated Interactive Ecosystem Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Section Header */}
        <div className="ecosystem-header-block">
          <div className="ecosystem-eyebrow-pill">
            <span className="pulse-dot"></span>
            <span>UNIFIED PLATFORM &bull; MULTI-DEVICE AUTOMATION</span>
          </div>
          <h2 className="ecosystem-main-title">
            All Your Digital Solutions <span className="headline-cyan whitespace-nowrap">In One Place</span>
          </h2>
          <p className="ecosystem-lead-desc">
            Explore our automated ecosystem in real time. We build seamless digital solutions across web, software architecture, sales CRMs, native mobile apps, and enterprise analytics.
          </p>
        </div>

        {/* Heroic Centerpiece Stage: ONLY Laptop and Phone Mockups */}
        <div className="ecosystem-showcase-stage">
          {/* Ambient Colorful Background Glows */}
          <div
            className="stage-glow glow-dynamic"
            style={{ backgroundColor: activeService.color }}
            aria-hidden="true"
          />

          <div className="devices-theatrical-canvas">
            {/* =========================================================================
                THE LAPTOP DISPLAY (Widescreen, Rich Graphics & Diagrams)
               ========================================================================= */}
            <div className="theatrical-laptop">
              <div className="laptop-outer-frame">
                {/* Camera Notch */}
                <div className="laptop-top-bezel">
                  <span className="laptop-webcam-dot" />
                </div>

                {/* Laptop Screen Inside */}
                <div className="laptop-display-panel">
                  {/* Browser Window Header */}
                  <div className="screen-browser-bar">
                    <div className="browser-traffic-dots">
                      <span className="b-dot close-dot" />
                      <span className="b-dot min-dot" />
                      <span className="b-dot max-dot" />
                    </div>
                    <div className="browser-address-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="lock-icon">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="address-text">eliweb.in/solutions/{activeService.id}</span>
                    </div>
                    <div className="browser-active-tag">
                      <span className="live-pulse" style={{ backgroundColor: activeService.color }} />
                      <span>{activeService.statsPill}</span>
                    </div>
                  </div>

                  {/* Graphic Workspace (Unobstructed: padded left of phone) */}
                  <div className="screen-inner-workspace" key={activeService.id}>
                    {/* Top Status Bar inside workspace */}
                    <div className="workspace-top-meta">
                      <div>
                        <span className="meta-eyebrow" style={{ color: activeService.color }}>
                          {activeService.category}
                        </span>
                        <h3 className="meta-headline">{activeService.tagline}</h3>
                      </div>
                      <div className="meta-brand-badge">
                        <span className="brand-dot-logo">EW</span>
                        <span>EliWeb Platform</span>
                      </div>
                    </div>

                    {/* GRAPHIC MODULE 1: Website Development */}
                    {activeService.id === 'web-dev' && (
                      <div className="graphic-module-wrap anim-fade-in">
                        <div className="web-graphic-layout">
                          {/* Visual Web Showcase Canvas */}
                          <div className="web-preview-card">
                            <div className="wpc-header">
                              <span className="wpc-logo">EliWeb Storefront</span>
                              <div className="wpc-nav-links">
                                <span>Products</span>
                                <span>Features</span>
                                <span>Pricing</span>
                              </div>
                              <span className="wpc-cart-pill">🛒 3 Items</span>
                            </div>
                            <div className="wpc-hero-banner">
                              <div className="wpc-hero-text">
                                <span className="wpc-badge">Next.js 15 &bull; Server Actions</span>
                                <h4>Blazing Fast Digital Experiences</h4>
                                <p>Engineered for 99+ Core Web Vitals and 3x conversion lift.</p>
                                <div className="wpc-cta-row">
                                  <span className="wpc-btn-primary">Explore Products</span>
                                  <span className="wpc-btn-secondary">Case Study</span>
                                </div>
                              </div>
                              <div className="wpc-hero-art">
                                <div className="art-floating-cube">
                                  <span className="cube-tag">⚡ 0.2s LCP</span>
                                  <div className="cube-bars">
                                    <span className="c-bar b1" />
                                    <span className="c-bar b2" />
                                    <span className="c-bar b3" />
                                    <span className="c-bar b4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2 Visible Metric Graphic Cards */}
                          <div className="web-metric-cards-row">
                            <div className="w-card">
                              <span className="wc-icon">🚀</span>
                              <strong>99/100</strong>
                              <span className="wc-sub">Mobile Speed</span>
                            </div>
                            <div className="w-card">
                              <span className="wc-icon">🔒</span>
                              <strong>A+ Grade</strong>
                              <span className="wc-sub">SEO &amp; SSL</span>
                            </div>
                            <div className="w-card">
                              <span className="wc-icon">📈</span>
                              <strong>+48%</strong>
                              <span className="wc-sub">Checkout Lift</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GRAPHIC MODULE 2: Software Development */}
                    {activeService.id === 'software-dev' && (
                      <div className="graphic-module-wrap anim-fade-in">
                        <div className="software-graphic-layout">
                          {/* Visual Distributed Architecture Flow Diagram */}
                          <div className="arch-diagram-card">
                            <div className="arch-header">
                              <span className="arch-title">🌐 Live Cloud Architecture &bull; Distributed Microservices</span>
                              <span className="arch-status-pill">All Nodes Healthy</span>
                            </div>

                            {/* Node Graph SVG with Animated Signal Dots */}
                            <div className="arch-nodes-grid">
                              <div className="arch-node client-node">
                                <span className="n-icon">💻</span>
                                <strong>Clients</strong>
                                <span className="n-sub">Global CDN</span>
                              </div>
                              <div className="arch-wire wire-1">
                                <span className="data-packet p1" />
                              </div>
                              <div className="arch-node gateway-node">
                                <span className="n-icon">🛡️</span>
                                <strong>API Gateway</strong>
                                <span className="n-sub">Proxy &amp; Auth</span>
                              </div>
                              <div className="arch-wire wire-2">
                                <span className="data-packet p2" />
                              </div>
                              <div className="arch-node cluster-node">
                                <span className="n-icon">⚙️</span>
                                <strong>Microservices</strong>
                                <span className="n-sub">Cluster Nodes</span>
                              </div>
                              <div className="arch-wire wire-3">
                                <span className="data-packet p3" />
                              </div>
                              <div className="arch-node db-node">
                                <span className="n-icon">🗄️</span>
                                <strong>PostgreSQL</strong>
                                <span className="n-sub">Replicas</span>
                              </div>
                            </div>

                            {/* Telemetry Wave Monitor Chart */}
                            <div className="arch-telemetry-strip">
                              <div className="telemetry-stat">
                                <span className="t-lbl">Cluster Latency</span>
                                <strong className="t-val text-green">14ms</strong>
                              </div>
                              <div className="telemetry-chart">
                                <svg viewBox="0 0 240 32" className="telemetry-svg">
                                  <path
                                    d="M 0 22 Q 30 4, 60 18 T 120 12 T 180 6 T 240 16"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="2.5"
                                  />
                                </svg>
                              </div>
                              <div className="telemetry-stat">
                                <span className="t-lbl">Throughput</span>
                                <strong className="t-val text-blue">14.8k req/s</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GRAPHIC MODULE 3: CRM Development */}
                    {activeService.id === 'crm-dev' && (
                      <div className="graphic-module-wrap anim-fade-in">
                        <div className="crm-graphic-layout">
                          {/* Visual Sales Pipeline Kanban */}
                          <div className="crm-pipeline-card">
                            <div className="crm-header-row">
                              <span className="crm-board-title">💼 Sales Pipeline &bull; Automated Deal Flow</span>
                              <span className="crm-total-badge">$248,500 In Flight</span>
                            </div>

                            {/* Pipeline Stage Columns with Graphic Cards */}
                            <div className="crm-columns-grid">
                              <div className="crm-col">
                                <div className="col-pill lead-col">
                                  <span>Inbound (12)</span>
                                </div>
                                <div className="deal-card">
                                  <div className="deal-title">Fintech SaaS</div>
                                  <div className="deal-val">$32,000</div>
                                  <span className="deal-tag auto-tag">⚡ Automated</span>
                                </div>
                              </div>

                              <div className="crm-col">
                                <div className="col-pill qual-col">
                                  <span>Qualified (8)</span>
                                </div>
                                <div className="deal-card highlight-deal">
                                  <div className="deal-title">HealthTech AI</div>
                                  <div className="deal-val">$58,000</div>
                                  <span className="deal-tag demo-tag">📅 Demo Set</span>
                                </div>
                              </div>

                              <div className="crm-col">
                                <div className="col-pill won-col">
                                  <span>Won ($84k)</span>
                                </div>
                                <div className="deal-card won-card">
                                  <div className="deal-title">Apex Media</div>
                                  <div className="deal-val">$84,000</div>
                                  <span className="deal-tag won-tag">🎉 Closed Won</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GRAPHIC MODULE 4: Mobile App Development */}
                    {activeService.id === 'mobile-app' && (
                      <div className="graphic-module-wrap anim-fade-in">
                        <div className="mobile-studio-graphic">
                          <div className="studio-canvas-card">
                            <div className="studio-header">
                              <span className="studio-title">📱 Native Mobile Architecture (React Native &amp; Swift)</span>
                              <span className="studio-fps-tag">60 FPS Native Sync</span>
                            </div>

                            {/* Split Artboard Visualization */}
                            <div className="studio-artboards-grid">
                              <div className="mini-artboard">
                                <div className="artboard-screen">
                                  <div className="art-top-bar">
                                    <span>Discover</span>
                                    <span>🔍</span>
                                  </div>
                                  <div className="art-hero-pill">
                                    <div className="hero-pill-graphic" />
                                    <span>Featured Drop</span>
                                  </div>
                                  <div className="art-cards-row">
                                    <div className="art-item-tile" />
                                    <div className="art-item-tile" />
                                  </div>
                                </div>
                                <span className="artboard-lbl">Home Feed UI</span>
                              </div>

                              <div className="art-flow-indicator">
                                <span>&rarr;</span>
                                <span className="flow-text">Fluid Transition</span>
                              </div>

                              <div className="mini-artboard">
                                <div className="artboard-screen checkout-screen">
                                  <div className="art-top-bar">
                                    <span>Instant Pay</span>
                                    <span>✓</span>
                                  </div>
                                  <div className="art-checkout-card">
                                    <div className="card-mock-chip" />
                                    <span>$129.00</span>
                                  </div>
                                  <div className="art-action-btn">One-Tap Confirm</div>
                                </div>
                                <span className="artboard-lbl">1-Tap Checkout UI</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GRAPHIC MODULE 5: Business Solutions & Analytics */}
                    {activeService.id === 'biz-solutions' && (
                      <div className="graphic-module-wrap anim-fade-in">
                        <div className="biz-graphic-layout">
                          <div className="biz-analytics-card">
                            <div className="analytics-header-row">
                              <div>
                                <span className="analytics-title">📊 Executive Business Intelligence &bull; Real-Time Revenue</span>
                                <div className="analytics-big-metric">
                                  <strong>$384,250</strong>
                                  <span className="growth-indicator">&uarr; +42.8% YOY</span>
                                </div>
                              </div>
                              <div className="analytics-actions">
                                <span className="analytics-timeframe">This Quarter</span>
                              </div>
                            </div>

                            {/* High Fidelity Multi-Bar & Area Chart */}
                            <div className="analytics-visual-chart">
                              <div className="chart-bars-group">
                                <div className="c-bar-col"><div className="c-fill" style={{ height: '45%' }} /><span>Jan</span></div>
                                <div className="c-bar-col"><div className="c-fill" style={{ height: '60%' }} /><span>Feb</span></div>
                                <div className="c-bar-col"><div className="c-fill" style={{ height: '75%' }} /><span>Mar</span></div>
                                <div className="c-bar-col"><div className="c-fill" style={{ height: '90%' }} /><span>Apr</span></div>
                                <div className="c-bar-col"><div className="c-fill is-peak" style={{ height: '100%' }} /><span>May</span></div>
                              </div>

                              {/* Donut and KPI Badges */}
                              <div className="analytics-donut-summary">
                                <div className="donut-circle-wrap">
                                  <svg viewBox="0 0 36 36" className="donut-svg">
                                    <path
                                      className="donut-bg"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                      fill="none"
                                      stroke="#E2E8F0"
                                      strokeWidth="3.5"
                                    />
                                    <path
                                      className="donut-fg"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                      fill="none"
                                      stroke="#F59E0B"
                                      strokeWidth="3.8"
                                      strokeDasharray="88, 100"
                                    />
                                  </svg>
                                  <div className="donut-text">
                                    <strong>88%</strong>
                                    <span>Target</span>
                                  </div>
                                </div>
                                <div className="donut-labels">
                                  <div className="d-lbl-item"><span className="dot dot-amber" /> <span>Enterprise: 64%</span></div>
                                  <div className="d-lbl-item"><span className="dot dot-blue" /> <span>Growth: 24%</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Aluminum Base */}
              <div className="laptop-hardware-chassis">
                <div className="chassis-notch" />
              </div>
              <div className="laptop-ambient-shadow" />
            </div>

            {/* =========================================================================
                THE SMARTPHONE DISPLAY (Standing in Lower Right Foreground)
               ========================================================================= */}
            <div className="theatrical-smartphone">
              <div className="phone-outer-chassis">
                {/* Dynamic Island Camera Notch */}
                <div className="phone-dynamic-island">
                  <span className="camera-lens-dot" />
                </div>

                {/* Phone High-Res Screen */}
                <div className="phone-screen-glass" key={activeService.id}>
                  {/* Status Bar */}
                  <div className="phone-top-status">
                    <span>9:41</span>
                    <div className="phone-signals">
                      <span>5G</span>
                      <span className="battery-mini" />
                    </div>
                  </div>

                  {/* Phone Graphical UI Syncing with Active Service */}
                  <div className="phone-screen-body anim-fade-in">
                    {/* Header */}
                    <div className="phone-brand-header">
                      <span className="phone-greeting">EliWeb Mobile</span>
                      <strong className="phone-screen-title">{activeService.shortLabel}</strong>
                    </div>

                    {/* Graphic Card on Phone */}
                    <div className="phone-featured-card" style={{ borderColor: activeService.color }}>
                      <div className="p-card-top">
                        <span className="p-card-dot" style={{ backgroundColor: activeService.color }} />
                        <span className="p-card-badge">{activeService.category}</span>
                      </div>
                      <div className="p-card-visual-art">
                        {/* Dynamic mini graphic inside phone */}
                        {activeService.id === 'web-dev' && (
                          <div className="mini-web-preview">
                            <div className="mw-bar" />
                            <div className="mw-box" />
                          </div>
                        )}
                        {activeService.id === 'software-dev' && (
                          <div className="mini-server-preview">
                            <span className="ms-pulse" />
                            <span className="ms-text">All 4 Clusters Live</span>
                          </div>
                        )}
                        {activeService.id === 'crm-dev' && (
                          <div className="mini-crm-preview">
                            <strong>+$32k Deal</strong>
                            <span>Ready to Sign</span>
                          </div>
                        )}
                        {activeService.id === 'mobile-app' && (
                          <div className="mini-app-preview">
                            <div className="ma-tile t1" />
                            <div className="ma-tile t2" />
                          </div>
                        )}
                        {activeService.id === 'biz-solutions' && (
                          <div className="mini-biz-preview">
                            <div className="mb-bar h30" />
                            <div className="mb-bar h60" />
                            <div className="mb-bar h90" />
                          </div>
                        )}
                      </div>
                      <div className="p-card-metric">{activeService.statsPill}</div>
                    </div>

                    {/* 2 Quick Action Buttons */}
                    <div className="phone-quick-actions">
                      <div className="p-action-item">
                        <span className="p-act-icon">⚡</span>
                        <span>Deploy</span>
                      </div>
                      <div className="p-action-item">
                        <span className="p-act-icon">📊</span>
                        <span>Insights</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/contact" className="phone-launch-cta" style={{ backgroundColor: activeService.color }}>
                      Explore Solutions &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Interactive Progress Filter Bar */}
        <div className="ecosystem-autoplay-bar" role="tablist" aria-label="Ecosystem Automated Tabs">
          {SERVICES.map((service, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={service.id}
                id={`tab-${service.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`autoplay-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="tab-dot" style={{ backgroundColor: service.color }} />
                <span className="tab-title">{service.title}</span>
                {/* Visual Progress Bar Countdown on Active Tab */}
                {isActive && (
                  <span
                    key={`progress-${activeIndex}`}
                    className={`tab-progress-line ${isPaused ? 'is-paused' : ''}`}
                    style={{ backgroundColor: service.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
