import React from 'react';
import HeaderNav from '@/components/HeaderNav';
import SiteFooter from '@/components/SiteFooter';
import { prisma } from '@/lib/prisma';
import { dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Terms of Engagement | EliWeb.in',
  description: 'Review the contractual terms and engagement standards for digital engineering and design services at EliWeb.in.',
};

export default async function TermsPage() {
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
                  <span>Contractual Framework</span>
                </div>
                <h1 className="legal-title">Terms of Engagement</h1>
                <p className="legal-meta">Effective Date: October 2026 &bull; EliWeb.in Client Agreements</p>
              </header>

              <div className="legal-body">
                <p>
                  These Terms of Engagement govern the provision of digital design, web engineering, mobile application development, video production, and performance marketing services by <strong>EliWeb.in</strong> to its clients and partners.
                </p>

                <h2>1. Scope of Work &amp; Sprint Milestones</h2>
                <p>
                  All client initiatives are executed based on structured Statements of Work (SOW) or sprint milestone agreements. Scope modifications, architectural shifts, or additional deliverables are documented via transparent change requests.
                </p>

                <h2>2. Intellectual Property Rights</h2>
                <p>
                  Upon settlement of project invoicing, all bespoke custom software source code, creative brand assets, and digital design collateral developed specifically for the client transfer entirely to client ownership, excluding pre-existing open-source libraries or proprietary core frameworks.
                </p>

                <h2>3. Client Satisfaction &amp; Review Cycles</h2>
                <p>
                  Every milestone delivery includes designated review cycles to ensure full alignment with architectural expectations and design standards before staging or production sign-off.
                </p>

                <h2>4. Payment Terms &amp; Invoicing</h2>
                <p>
                  Project engagements follow scheduled stage-gate disbursements (e.g., discovery deposit, design approval milestone, and final release hydration). Invoices are payable within 7 business days via certified domestic or international banking channels.
                </p>

                <h2>5. Confidentiality &amp; Non-Disclosure</h2>
                <p>
                  Both parties commit to preserving the utmost confidentiality regarding proprietary algorithms, business roadmaps, trade secrets, and non-public codebases disclosed during the engagement.
                </p>

                <h2>6. Limitation of Liability</h2>
                <p>
                  EliWeb.in shall not be liable for indirect, incidental, or consequential damages arising from third-party hosting downtime, external API deprecations, or unauthorized client modifications post-handover.
                </p>

                <div className="legal-contact-callout">
                  <strong>Corporate Legal Desk</strong>
                  <p style={{ margin: '6px 0 0', color: '#4B5563' }}>
                    Email: <a href={`mailto:${contactEmail}`} style={{ color: '#0066FF', fontWeight: 600 }}>{contactEmail}</a><br />
                    Phone: +91 79 7385 1691<br />
                    EliWeb Technologies &bull; Registered in India
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
