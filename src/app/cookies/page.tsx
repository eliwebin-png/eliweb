import React from 'react';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cookie Policy & Settings | EliWeb.in',
  description: 'Manage cookie preferences and understand how EliWeb.in uses essential telemetry and analytics.',
};

export default async function CookieSettingsPage() {
  const siteSettingsData = await dbQuery(() => prisma.siteSettings.findMany(), []);
  const settings: Record<string, string> = {};
  siteSettingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  const contactEmail = settings.hello_email || 'eliweb.in@gmail.com';

  return (
    <>
      <HeaderNav alwaysVisible={true} />
      <main className="subpage-main">
        <section className="legal-page-section">
          <div className="container">
            <article className="legal-article-card">
              <header className="legal-article-header">
                <div className="legal-badge">
                  <span className="pulse-dot"></span>
                  <span>Transparency &amp; Cookies</span>
                </div>
                <h1 className="legal-title">Cookie Policy &amp; Settings</h1>
                <p className="legal-meta">Updated: October 2026 &bull; EliWeb.in Web Transparency</p>
              </header>

              <div className="legal-body">
                <p>
                  <strong>EliWeb.in</strong> uses cookies and similar client-side storage technologies to deliver essential website functionality, preserve user preferences, and analyze anonymized performance metrics.
                </p>

                <h2>1. What Are Cookies?</h2>
                <p>
                  Cookies are compact text files placed onto your device when accessing web applications. They allow our systems to recognize your browser, remember preferred settings, and optimize page rendering speeds.
                </p>

                <h2>2. Categories of Cookies We Use</h2>
                <ul>
                  <li><strong>Strictly Necessary Cookies:</strong> Essential for platform navigation, security checks, CSRF protection, and session stability. These cannot be disabled without disrupting site operation.</li>
                  <li><strong>Functional Cookies:</strong> Retain user preferences such as interface language selections (e.g., via our Google Translate integration) and theme state.</li>
                  <li><strong>Performance &amp; Telemetry Cookies:</strong> Provide aggregate diagnostics to measure load times, bounce rates, and browser compatibility so our engineering team can eliminate performance bottlenecks.</li>
                </ul>

                <h2>3. Managing Your Preferences</h2>
                <p>
                  Most web browsers provide tools to inspect, manage, or delete cookies via browser settings. Please note that blocking essential cookies may impact specific interactive functionalities on our digital atelier.
                </p>

                <div className="legal-contact-callout">
                  <strong>Questions About Our Cookie Policy?</strong>
                  <p style={{ margin: '6px 0 0', color: '#4B5563' }}>
                    Email: <a href={`mailto:${contactEmail}`} style={{ color: '#0066FF', fontWeight: 600 }}>{contactEmail}</a><br />
                    EliWeb Technologies &bull; India
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
