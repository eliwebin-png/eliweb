'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    const modelsToFetch = [
      'service',
      'project',
      'post',
      'faq',
      'team-member',
      'stat',
      'tech-tool',
      'footer-link',
    ];
    const results: Record<string, number> = {};

    await Promise.all(
      modelsToFetch.map(async (m) => {
        try {
          const res = await fetch(`/api/admin/${m}`);
          if (res.ok) {
            const list = await res.json();
            results[m] = Array.isArray(list) ? list.length : 0;
          }
        } catch {
          results[m] = 0;
        }
      })
    );

    // Also fetch unread messages count
    try {
      const [cRes, eRes, nRes] = await Promise.all([
        fetch('/api/admin/submissions/contact'),
        fetch('/api/admin/submissions/enquiry'),
        fetch('/api/admin/submissions/newsletter'),
      ]);
      const [c, e, n] = await Promise.all([cRes.json(), eRes.json(), nRes.json()]);
      results['unread'] =
        (Array.isArray(c) ? c.filter((x: any) => !x.read).length : 0) +
        (Array.isArray(e) ? e.filter((x: any) => !x.read).length : 0) +
        (Array.isArray(n) ? n.filter((x: any) => !x.read).length : 0);
    } catch {
      results['unread'] = 0;
    }

    setCounts(results);
    setLoading(false);
  };

  const pages = [
    {
      title: 'Home Page',
      href: '/admin/pages/home',
      liveUrl: '/',
      icon: '🏠',
      desc: 'Hero headlines, rotating titles, trust badges, featured services, and homepage FAQs.',
      stats: `${counts['service'] ?? 0} Services • ${counts['project'] ?? 0} Projects`,
    },
    {
      title: 'About Page',
      href: '/admin/pages/about',
      liveUrl: '/about',
      icon: '🏢',
      desc: 'Company philosophy, mission statement, core values, leadership team, and credentials.',
      stats: `${counts['team-member'] ?? 0} Team Members • ${counts['stat'] ?? 0} Stats`,
    },
    {
      title: 'Service Page',
      href: '/admin/pages/services',
      liveUrl: '/services',
      icon: '⚡',
      desc: 'Full services catalog, execution workflows, deliverables checklist, tech tools, and service FAQs.',
      stats: `${counts['service'] ?? 0} Services • ${counts['tech-tool'] ?? 0} Tech Tools`,
    },
    {
      title: 'Portfolio Page',
      href: '/admin/pages/portfolio',
      liveUrl: '/portfolio',
      icon: '💼',
      desc: 'Client case studies, web and video showcase works, tags, and spotlight highlights.',
      stats: `${counts['project'] ?? 0} Projects Published`,
    },
    {
      title: 'Blog Page',
      href: '/admin/pages/blog',
      liveUrl: '/blog',
      icon: '📝',
      desc: 'Digital engineering articles, architecture deep-dives, covers, excerpts, and markdown copy.',
      stats: `${counts['post'] ?? 0} Articles in DB`,
    },
    {
      title: 'Contact Page',
      href: '/admin/pages/contact',
      liveUrl: '/contact',
      icon: '📞',
      desc: 'Hotline number, support email, WhatsApp chat URL, physical address, and demo request options.',
      stats: 'Instant WhatsApp & Hotline',
    },
    {
      title: 'Footer Section',
      href: '/admin/pages/footer',
      liveUrl: '/',
      icon: '📑',
      desc: 'Brand tagline, copyright year, social media profiles (IG, LinkedIn, YouTube), and multi-column links.',
      stats: `${counts['footer-link'] ?? 0} Navigation Links`,
    },
    {
      title: 'Message Page',
      href: '/admin/messages',
      liveUrl: '/contact',
      icon: '📬',
      desc: 'Inquiries submitted through contact forms, product demo requests, and newsletter subscriber list.',
      stats: `${counts['unread'] ?? 0} Unread Messages`,
      isUrgent: (counts['unread'] ?? 0) > 0,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <span style={styles.eyebrow}>CONTENT MANAGEMENT SYSTEM</span>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {session?.user?.email?.split('@')[0] || 'Admin'}
          </h1>
          <p style={styles.welcomeSub}>
            Click on any page below to manage its content, text copy, images, and configuration. Every change updates the live website immediately.
          </p>
        </div>
        <div style={styles.bannerActions}>
          <Link href="/admin/pages/home" style={styles.primaryActionBtn}>
            Edit Home Page 🏠
          </Link>
          <Link href="/" target="_blank" rel="noopener noreferrer" style={styles.secondaryActionBtn}>
            View Live Site ↗
          </Link>
        </div>
      </div>

      {/* Pages Grid */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Website Pages &amp; Sections</h2>
        <span style={styles.sectionCount}>{pages.length} Pages Available</span>
      </div>

      <div style={styles.pagesGrid}>
        {pages.map((p) => (
          <div key={p.title} style={styles.pageCard}>
            <div style={styles.cardTop}>
              <span style={styles.pageIcon}>{p.icon}</span>
              <div style={styles.cardActions}>
                <Link
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.livePill}
                  title="View this page live"
                >
                  Live ↗
                </Link>
              </div>
            </div>

            <h3 style={styles.pageCardTitle}>{p.title}</h3>
            <p style={styles.pageCardDesc}>{p.desc}</p>

            <div style={styles.cardFooter}>
              <span
                style={{
                  ...styles.cardStats,
                  color: p.isUrgent ? '#ef4444' : '#00C2CB',
                  fontWeight: p.isUrgent ? 700 : 500,
                }}
              >
                {loading ? 'Loading...' : p.stats}
              </span>
              <Link href={p.href} style={styles.editBtn}>
                Edit Page &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  welcomeBanner: {
    background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #0a0a0a 100%)',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#00C2CB',
    letterSpacing: '0.1em',
  },
  welcomeTitle: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#fff',
    margin: '6px 0 8px',
    letterSpacing: '-0.02em',
  },
  welcomeSub: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    margin: 0,
    maxWidth: '560px',
    lineHeight: 1.5,
  },
  bannerActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    padding: '12px 22px',
    borderRadius: '8px',
    background: '#0066FF',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    boxShadow: '0 4px 14px rgba(0, 102, 255, 0.4)',
  },
  secondaryActionBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
  },
  sectionCount: {
    fontSize: '0.8rem',
    color: '#666',
    fontWeight: 600,
  },
  pagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  pageCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '14px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.15s ease',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  pageIcon: {
    fontSize: '1.75rem',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  livePill: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#888',
    textDecoration: 'none',
    padding: '3px 8px',
    borderRadius: '4px',
    background: '#1a1a1a',
    border: '1px solid #282828',
  },
  pageCardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
  },
  pageCardDesc: {
    fontSize: '0.85rem',
    color: '#888',
    margin: '0 0 20px',
    lineHeight: 1.5,
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #1a1a1a',
  },
  cardStats: {
    fontSize: '0.75rem',
  },
  editBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    background: '#181818',
    border: '1px solid #333',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.15s',
  },
};
