import React from 'react';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Privacy Policy | EliWeb.in',
  description: 'Understand how EliWeb.in collects, protects, and handles your personal and project information.',
};

export default async function PrivacyPolicyPage() {
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
                  <span>Legal &amp; Compliance</span>
                </div>
                <h1 className="legal-title">Privacy Policy</h1>
                <p className="legal-meta">Last Updated: October 2026 &bull; EliWeb.in Data Governance</p>
              </header>

              <div className="legal-body">
                <p>
                  At <strong>EliWeb.in</strong>, we take the confidentiality and privacy of our visitors, partners, and clients with paramount engineering rigor. This Privacy Policy details the types of information we collect, how it is secured, and your rights concerning your personal data.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                  We collect information necessary to deliver bespoke software engineering, brand development, and digital marketing services:
                </p>
                <ul>
                  <li><strong>Direct Communications:</strong> Information submitted via contact forms, project briefs, demo requests, and newsletter forms (including name, email address, phone number, and project scopes).</li>
                  <li><strong>Technical Telemetry:</strong> Log data including IP address, browser type, device identifiers, referring URLs, and diagnostic performance metrics to guarantee sub-second load times.</li>
                  <li><strong>Payment &amp; Billing Data:</strong> Transaction metadata handled securely through certified payment gateways (e.g., Razorpay, Stripe, UPI). We do not store full credit card numbers or banking secrets on our servers.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>The information we collect is utilized strictly to:</p>
                <ul>
                  <li>Deliver, optimize, and maintain high-performance digital products and custom web platforms.</li>
                  <li>Respond to consultation inquiries and schedule technical demo walk-throughs within 24 hours.</li>
                  <li>Dispatch technical journals, product advisories, and architecture case studies with explicit consent.</li>
                  <li>Comply with statutory legal obligations and protect against cyber-threats or fraudulent activities.</li>
                </ul>

                <h2>3. Data Protection &amp; Retention</h2>
                <p>
                  All data in transit is encrypted using modern TLS 1.3 cryptographic suites, and data at rest is housed in SOC 2 Type II compliant serverless infrastructure. We retain client data only as long as necessary to fulfill contractual commitments and legal compliance.
                </p>

                <h2>4. Third-Party Sharing</h2>
                <p>
                  We never sell, rent, or trade your personal information to third parties. We share data only with verified infrastructure providers (e.g., hosting, database, email transit) bound by strict confidentiality agreements.
                </p>

                <h2>5. Your Privacy Rights</h2>
                <p>
                  You hold full rights to access, rectify, or request deletion of any personal data stored with us. For inquiries or data subject requests, please contact our privacy desk.
                </p>

                <div className="legal-contact-callout">
                  <strong>Privacy &amp; Data Protection Officer</strong>
                  <p style={{ margin: '6px 0 0', color: '#4B5563' }}>
                    Email: <a href={`mailto:${contactEmail}`} style={{ color: '#0066FF', fontWeight: 600 }}>{contactEmail}</a><br />
                    Direct Phone: +91 79 7385 1691<br />
                    Operating Headquarters: India (Remote-First, Serving Worldwide)
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
