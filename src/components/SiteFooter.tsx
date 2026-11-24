'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';

interface SiteFooterProps {
  settings?: Record<string, string>;
  footerLinks?: Array<{ id: string; column: string; label: string; url: string }>;
  onOpenModal?: () => void;
}

export default function SiteFooter({
  settings = {},
  footerLinks = [],
  onOpenModal,
}: SiteFooterProps) {
  const defaultLinks = [
    { id: 'fl1', label: 'About us', url: '/about' },
    { id: 'fl2', label: 'Services', url: '/services' },
    { id: 'fl3', label: 'Portfolio', url: '/portfolio' },
    { id: 'fl4', label: 'Blog & Articles', url: '/blog' },
    { id: 'fl5', label: 'Contact & Demo', url: '/contact' },
  ];

  const linksToRender = footerLinks.length > 0 ? footerLinks : defaultLinks;

  return (
    <>
      {/* Architectural Blueprint / Map Visual Before Footer */}
      <div className="footer-blueprint-banner" style={{ paddingBottom: '2rem' }}>
        <div className="blueprint-overlay">
          <div className="blueprint-tag">DISCOVERY &amp; PROTOTYPING LAB</div>
          <h3 className="blueprint-title">Crafting Tomorrow&apos;s Digital Standards</h3>
          <p className="blueprint-desc">
            From headless commerce architectures to cinematic video production, we partner with visionary brands across the globe.
          </p>
          {onOpenModal ? (
            <button
              type="button"
              className="btn btn-pill btn-secondary-light"
              onClick={onOpenModal}
            >
              Schedule Technical Review &rarr;
            </button>
          ) : (
            <Link
              href="/contact"
              className="btn btn-pill btn-secondary-light"
            >
              Schedule Technical Review &rarr;
            </Link>
          )}
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

          {/* Column 2: Quick Links */}
          <div className="footer-col col-links">
            <h4 className="footer-col-title">Navigation &amp; Services</h4>
            <ul className="footer-nav">
              {linksToRender.map((link) => (
                <li key={link.id}>
                  <Link href={link.url}>{link.label}</Link>
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
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-cyan)' }}>
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

      </div>
    </footer>
  </>
  );
}
