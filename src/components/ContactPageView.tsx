'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';

const DEFAULT_SERVICES = [
  { id: 'Web & App Development', label: 'Web & App Dev', icon: '💻' },
  { id: 'Brand Building & Strategy', label: 'Brand Strategy', icon: '🎨' },
  { id: 'Cinematic Video Craft', label: 'Cinematic Video', icon: '🎬' },
  { id: 'Performance Digital Marketing', label: 'Digital Marketing', icon: '📈' },
  { id: 'Full Digital Transformation', label: 'Full Transformation', icon: '⚡' },
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $35,000',
  '$35,000+ (Enterprise)',
];

interface ContactPageViewProps {
  settings?: Record<string, string>;
  services?: Array<{ id: string; title: string }>;
}

export default function ContactPageView({
  settings = {},
  services = [],
}: ContactPageViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  });

  const emailDisplay = settings.email || settings.hello_email || 'eliweb.in@gmail.com';
  const phoneDisplay = settings.phone || '+91 79 7385 1691';
  const whatsappUrl = settings.whatsapp_url || `https://wa.me/${phoneDisplay.replace(/[^0-9]/g, '')}`;

  const servicesList = services.length > 0
    ? services.map((s, idx) => {
        const icons = ['💻', '🎨', '🎬', '📈', '⚡', '🚀'];
        return {
          id: s.title,
          label: s.title,
          icon: icons[idx % icons.length],
        };
      })
    : DEFAULT_SERVICES;

  const handleServiceSelect = (val: string) => {
    setFormData((prev) => ({ ...prev, service: prev.service === val ? '' : val }));
  };

  const handleBudgetSelect = (val: string) => {
    setFormData((prev) => ({ ...prev, budget: prev.budget === val ? '' : val }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          success: true,
          message: 'Thank you! Your demo request has been received. Our team will contact you within 24 hours.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
        });
      } else {
        setStatus({
          success: false,
          message: data.error || 'Failed to submit enquiry. Please try again.',
        });
      }
    } catch {
      setStatus({
        success: false,
        message: 'A network error occurred. Please try again or email us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <HeaderNav alwaysVisible={true} />

      <main className="subpage-main">
        {/* Page Hero */}
        <section className="subpage-hero">
          <div className="container">
            <div className="subpage-hero-inner">
              <div className="subpage-badge">
                <span className="pulse-dot"></span>
                <span>GET A FREE DEMO &bull; DIRECT CONSULTATION</span>
              </div>
              <h1 className="subpage-title">
                Schedule a Demo.<br />
                <span className="headline-cyan">Accelerate Your Vision.</span>
              </h1>
              <p className="subpage-lead">
                Book an interactive product demonstration or technical review with our digital architects. We will walk you through real-world builds, architectural patterns, and a custom roadmap.
              </p>
            </div>
          </div>
        </section>

        {/* Contact & Demo Form Grid */}
        <section className="subpage-contact-section">
          <div className="container">
            <div className="contact-page-grid">
              {/* Left Column: Form */}
              <div className="contact-form-panel">
                <div className="form-header">
                  <span className="section-eyebrow">DIRECT INQUIRY</span>
                  <h2 className="section-title">Request Your Demo Session</h2>
                  <p className="form-subtext">
                    Fill out the form below. We will review your project details and confirm your demo slot within 24 hours.
                  </p>
                </div>

                {status && (
                  <div
                    className={`form-status-alert ${status.success ? 'status-success' : 'status-error'}`}
                    role="alert"
                  >
                    {status.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-page-form">
                  <div className="form-row-duo">
                    <div className="form-group">
                      <div className="form-label-row">
                        <label htmlFor="contact-name">
                          Full Name <span className="required-dot">*</span>
                        </label>
                      </div>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Elena Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <div className="form-label-row">
                        <label htmlFor="contact-email">
                          Work Email <span className="required-dot">*</span>
                        </label>
                      </div>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="elena@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-label-row">
                      <label htmlFor="contact-phone">Phone Number</label>
                      <span className="optional-badge">Optional</span>
                    </div>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label-row">
                      <label>Primary Area of Interest</label>
                      <span className="optional-badge">Optional</span>
                    </div>
                    <div className="interactive-chip-grid">
                      {servicesList.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`interactive-chip ${formData.service === item.id ? 'is-selected' : ''}`}
                          onClick={() => handleServiceSelect(item.id)}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-label-row">
                      <label>Estimated Project Budget</label>
                      <span className="optional-badge">Optional</span>
                    </div>
                    <div className="interactive-budget-grid">
                      {BUDGET_RANGES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={`interactive-chip budget-chip ${formData.budget === b ? 'is-selected' : ''}`}
                          onClick={() => handleBudgetSelect(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-label-row">
                      <label htmlFor="contact-message">
                        Project Description &amp; Goals <span className="required-dot">*</span>
                      </label>
                    </div>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Tell us about your product goals, technical stack preferences, target timeline, or what you'd like to see in your demo..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn"
                  >
                    {submitting ? 'Submitting Demo Request...' : 'Confirm Demo Request →'}
                  </button>

                  <div className="form-trust-banner">
                    <span className="trust-item">
                      <span className="trust-icon-mini">🛡️</span> Confidential &amp; NDA Protected
                    </span>
                    <span className="trust-item">
                      <span className="trust-icon-mini">⚡</span> Guaranteed 24h Response
                    </span>
                    <span className="trust-item">
                      <span className="trust-icon-mini">🤝</span> Zero Obligation
                    </span>
                  </div>
                </form>
              </div>

              {/* Right Column: Demo Expectations & Fast Reach */}
              <div className="contact-info-panel">
                <div className="demo-steps-card">
                  <div className="card-top-tag">
                    <span>30-MINUTES &bull; TAILORED DEMO</span>
                  </div>
                  <h3 className="demo-card-title">What to Expect in Your Demo</h3>
                  <div className="demo-step-list">
                    <div className="demo-step-item">
                      <span className="demo-step-index">01</span>
                      <div className="demo-step-content">
                        <strong>Discovery &amp; System Audit</strong>
                        <p>We review your existing digital presence, technical bottlenecks, and growth opportunities.</p>
                      </div>
                    </div>
                    <div className="demo-step-item">
                      <span className="demo-step-index">02</span>
                      <div className="demo-step-content">
                        <strong>Live Architecture Prototype</strong>
                        <p>We show comparable client implementations, tech stacks, and live Next.js performance benchmarks.</p>
                      </div>
                    </div>
                    <div className="demo-step-item">
                      <span className="demo-step-index">03</span>
                      <div className="demo-step-content">
                        <strong>Timeline &amp; Cost Estimation</strong>
                        <p>You receive an itemized proposal, sprint plan, and exact milestone delivery schedule.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="direct-channels-card">
                  <div className="card-top-tag">
                    <span>INSTANT ASSISTANCE</span>
                  </div>
                  <h3 className="demo-card-title">Direct Communication Channels</h3>
                  <div className="channel-list">
                    <a href={`mailto:${emailDisplay}`} className="channel-card-row">
                      <div className="channel-icon-badge badge-email">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div className="channel-text-wrap">
                        <span className="channel-label-text">General &amp; Demo Inquiries</span>
                        <span className="channel-main-link">{emailDisplay}</span>
                      </div>
                    </a>

                    <a href={`tel:${phoneDisplay.replace(/\s+/g, '')}`} className="channel-card-row">
                      <div className="channel-icon-badge badge-phone">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div className="channel-text-wrap">
                        <span className="channel-label-text">Direct Phone / Hotline</span>
                        <span className="channel-main-link">{phoneDisplay}</span>
                      </div>
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="channel-card-row is-whatsapp"
                    >
                      <div className="channel-icon-badge badge-whatsapp">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.212 8.212 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
                        </svg>
                      </div>
                      <div className="channel-text-wrap">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="channel-label-text">Instant WhatsApp Chat</span>
                          <span className="live-pulse-indicator">
                            <span className="live-dot-green"></span>
                            Online
                          </span>
                        </div>
                        <span className="channel-main-link">Chat with our Architect Team &rarr;</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Presence & Delhi Map Section */}
        <section className="contact-locations-section">
          <div className="container">
            <div className="locations-section-header">
              <div className="subpage-badge">
                <span className="pulse-dot"></span>
                <span>GLOBAL REACH &bull; LOCAL IMPACT</span>
              </div>
              <h2 className="section-title">Where We Build &amp; Whom We Serve</h2>
              <p className="locations-section-lead">
                Headquartered in Delhi, India, with active digital product engineering and dedicated client partnerships across the world.
              </p>
            </div>

            <div className="locations-two-col-grid">
              {/* Left Column: Embedded Google Map for Delhi */}
              <div className="location-card map-location-card">
                <div className="location-card-header">
                  <div className="location-tag">
                    <span className="location-dot-live"></span>
                    HEADQUARTERS &bull; DELHI, INDIA
                  </div>
                  <h3 className="location-card-title">Engineering &amp; Innovation Lab</h3>
                  <p className="location-card-desc">
                    Our primary design studio and technical operations are rooted in Delhi, powering round-the-clock software engineering and global client delivery.
                  </p>
                </div>

                <div className="map-iframe-container">
                  <iframe
                    title="EliWeb Delhi Headquarters Location"
                    src="https://maps.google.com/maps?q=New%20Delhi%2C%20Delhi%2C%20India&t=&z=11&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="location-meta-grid">
                  <div className="meta-pill">
                    <span className="meta-icon">📍</span>
                    <div>
                      <span className="meta-label">Headquarters</span>
                      <strong>{settings.location || 'Delhi • NCR, India'}</strong>
                    </div>
                  </div>
                  <div className="meta-pill">
                    <span className="meta-icon">🕒</span>
                    <div>
                      <span className="meta-label">Working Hours</span>
                      <strong>{settings.working_hours || 'Mon – Sat • 9:00 AM – 8:00 PM IST'}</strong>
                    </div>
                  </div>
                  <div className="meta-pill">
                    <span className="meta-icon">📞</span>
                    <div>
                      <span className="meta-label">Direct Phone</span>
                      <a href={`tel:${phoneDisplay.replace(/\s+/g, '')}`}>{phoneDisplay}</a>
                    </div>
                  </div>
                  <div className="meta-pill">
                    <span className="meta-icon">🗺️</span>
                    <div>
                      <span className="meta-label">Directions</span>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=New+Delhi,+India"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-directions-link"
                      >
                        Open in Google Maps &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Global Reach Card */}
              <div className="location-card global-service-card">
                <div className="location-card-header">
                  <div className="location-tag">
                    <span className="location-dot-blue"></span>
                    GLOBAL SERVICE FOOTPRINT
                  </div>
                  <h3 className="location-card-title">Providing Services in Multiple Countries</h3>
                  <p className="location-card-desc">
                    We deliver premium digital solutions across multiple countries worldwide — specialized and dedicated for visionary brands in the <strong>USA</strong>, <strong>UK</strong>, and <strong>India</strong>.
                  </p>
                </div>

                <div className="global-map-image-container">
                  <Image
                    src="/global-service-map.jpg"
                    alt="EliWeb Global Reach - Providing Services in USA, UK, and India"
                    width={800}
                    height={600}
                    className="global-service-map-img"
                    priority
                  />
                </div>

                {/* Country Breakdown Badges below image */}
                <div className="global-countries-breakdown">
                  <div className="country-reach-item">
                    <div className="country-flag-title">
                      <span className="country-flag">🇺🇸</span>
                      <span className="country-name">United States</span>
                    </div>
                    <p className="country-desc">
                      Enterprise Web Apps, SaaS Architectures &amp; Full-Stack Product Delivery
                    </p>
                  </div>

                  <div className="country-reach-item">
                    <div className="country-flag-title">
                      <span className="country-flag">🇬🇧</span>
                      <span className="country-name">United Kingdom</span>
                    </div>
                    <p className="country-desc">
                      High-Converting Platforms, Brand Systems &amp; Modern E-Commerce
                    </p>
                  </div>

                  <div className="country-reach-item">
                    <div className="country-flag-title">
                      <span className="country-flag">🇮🇳</span>
                      <span className="country-name">India (Headquarters)</span>
                    </div>
                    <p className="country-desc">
                      Global Engineering HQ, Rapid MVP Development &amp; Cinematic Media Lab
                    </p>
                  </div>
                </div>

                {/* Cross-timezone footer banner */}
                <div className="global-timezone-banner">
                  <span className="timezone-icon">🌐</span>
                  <span>Cross-Timezone Collaboration: <strong>EST (USA)</strong> &bull; <strong>GMT (UK)</strong> &bull; <strong>IST (India)</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}

