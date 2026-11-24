import React from 'react';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Security Standards | EliWeb.in',
  description: 'Learn about our infrastructure security, encryption protocols, and zero-trust engineering standards.',
};

export default async function SecurityStandardsPage() {
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
                  <span>Architecture &amp; Defense</span>
                </div>
                <h1 className="legal-title">Security Standards</h1>
                <p className="legal-meta">Engineered for Resilience &bull; Modern DevSecOps Framework</p>
              </header>

              <div className="legal-body">
                <p>
                  Security is not an afterthought at <strong>EliWeb.in</strong>; it is woven into every layer of our software architecture, database design, and operational workflows. We adhere to industry-leading standards to safeguard client platforms and customer data.
                </p>

                <h2>1. Infrastructure &amp; Cloud Security</h2>
                <p>
                  Our applications leverage enterprise-grade cloud platforms (including AWS, Vercel, and Neon Serverless PostgreSQL) backed by automated DDOS mitigation, global edge firewalls, and multi-region redundancy.
                </p>
                <ul>
                  <li><strong>TLS 1.3 Encryption:</strong> All HTTP traffic is forced to HTTPS with HSTS headers, secure cipher suites, and modern certificates.</li>
                  <li><strong>Data Isolation:</strong> Database storage employs strict connection pooler security, role-based database access, and encrypted rest volumes (AES-256).</li>
                  <li><strong>Zero-Trust Architecture:</strong> Microservices and administrative panels require least-privilege authenticated tokens and multi-factor authentication.</li>
                </ul>

                <h2>2. Code Quality &amp; Vulnerability Management</h2>
                <p>
                  Every codebase developed by EliWeb undergoes automated static code analysis, dependency vulnerability scans (Snyk, npm audit), and rigorous peer reviews before entering production pipelines.
                </p>

                <h2>3. Payment &amp; Financial Security</h2>
                <p>
                  All commercial transactions comply with <strong>PCI-DSS Level 1</strong> standards through certified payment processors. Sensitive credential artifacts never touch client-facing browsers or insecure logs.
                </p>

                <h2>4. Responsible Vulnerability Disclosure</h2>
                <p>
                  We welcome vulnerability reports from ethical security researchers. If you identify an issue affecting an EliWeb property, please disclose it responsibly to our security desk for immediate triage.
                </p>

                <div className="legal-contact-callout">
                  <strong>Security Incident &amp; Triage Team</strong>
                  <p style={{ margin: '6px 0 0', color: '#4B5563' }}>
                    Email: <a href={`mailto:${contactEmail}`} style={{ color: '#0066FF', fontWeight: 600 }}>{contactEmail}</a><br />
                    Response Window: Immediate acknowledgment within 12 hours.<br />
                    GPG Key available upon request.
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
