'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnread();
  }, [pathname]);

  const fetchUnread = async () => {
    try {
      const [cRes, eRes, nRes] = await Promise.all([
        fetch('/api/admin/submissions/contact'),
        fetch('/api/admin/submissions/enquiry'),
        fetch('/api/admin/submissions/newsletter'),
      ]);
      const [c, e, n] = await Promise.all([cRes.json(), eRes.json(), nRes.json()]);
      const total =
        (Array.isArray(c) ? c.filter((x: any) => !x.read).length : 0) +
        (Array.isArray(e) ? e.filter((x: any) => !x.read).length : 0) +
        (Array.isArray(n) ? n.filter((x: any) => !x.read).length : 0);
      setUnreadCount(total);
    } catch {
      // Ignore
    }
  };

  const isCurrent = (path: string) => {
    if (path.includes('?')) {
      const [base, query] = path.split('?');
      if (typeof window !== 'undefined') {
        return pathname === base && window.location.search.includes(query);
      }
      return false;
    }
    if (path === '/admin') return pathname === '/admin';
    if (path === '/admin/pages/home') {
      if (typeof window !== 'undefined' && window.location.search.includes('tab=clients')) {
        return false;
      }
      return pathname === '/admin/pages/home';
    }
    return pathname.startsWith(path);
  };

  const pageLinks = [
    { href: '/admin/pages/home', label: 'Home Page', icon: '🏠' },
    { href: '/admin/pages/home?tab=clients', label: 'Our Clients', icon: '🤝' },
    { href: '/admin/pages/about', label: 'About Page', icon: '🏢' },
    { href: '/admin/pages/services', label: 'Service Page', icon: '⚡' },
    { href: '/admin/pages/portfolio', label: 'Portfolio Page', icon: '💼' },
    { href: '/admin/pages/blog', label: 'Blog Page', icon: '📝' },
    { href: '/admin/pages/contact', label: 'Contact Page', icon: '📞' },
    { href: '/admin/pages/footer', label: 'Footer Section', icon: '📑' },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandRow}>
        <div style={styles.brandTitle}>
          <span style={styles.logoBadge}>CMS</span>
          <span style={styles.brandName}>ELIWEB</span>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.liveLink}
          title="Open live website in a new tab"
        >
          Live Site ↗
        </Link>
      </div>

      {/* Nav List */}
      <nav style={styles.nav}>
        {/* Main Dashboard Link */}
        <div style={styles.navSection}>
          <Link
            href="/admin"
            style={{
              ...styles.navItem,
              ...(isCurrent('/admin') && pathname === '/admin' ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>📊</span>
            <span>Dashboard Overview</span>
          </Link>
        </div>

        {/* Website Pages */}
        <div style={styles.navSection}>
          <div style={styles.groupLabel}>WEBSITE PAGES</div>
          <div style={styles.groupItems}>
            {pageLinks.map((item) => {
              const active = isCurrent(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.navItem,
                    ...(active ? styles.navItemActive : {}),
                  }}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <span style={styles.activeDot} />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Messages & Inbox */}
        <div style={styles.navSection}>
          <div style={styles.groupLabel}>COMMUNICATION</div>
          <div style={styles.groupItems}>
            <Link
              href="/admin/messages"
              style={{
                ...styles.navItem,
                ...(isCurrent('/admin/messages') || isCurrent('/admin/submissions') ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>📬</span>
              <span style={{ flex: 1 }}>Message Page</span>
              {unreadCount > 0 && (
                <span style={styles.badgeCount}>{unreadCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Global Settings */}
        <div style={styles.navSection}>
          <div style={styles.groupLabel}>GLOBAL SETTINGS</div>
          <div style={styles.groupItems}>
            <Link
              href="/admin/site-settings"
              style={{
                ...styles.navItem,
                ...(isCurrent('/admin/site-settings') ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>⚙️</span>
              <span>Site Settings &amp; SEO</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {(session?.user?.email?.[0] || 'A').toUpperCase()}
          </div>
          <div style={styles.userMeta}>
            <span style={styles.userRole}>Administrator</span>
            <span style={styles.userEmail} title={session?.user?.email || ''}>
              {session?.user?.email || 'admin@eliweb.in'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          style={styles.logoutBtn}
          title="Sign out of Admin Panel"
        >
          Sign Out ↪
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '260px',
    background: '#0d0d0d',
    borderRight: '1px solid #1f1f1f',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
  },
  brandRow: {
    padding: '20px',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoBadge: {
    fontSize: '0.65rem',
    fontWeight: 800,
    background: '#0066FF',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  brandName: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '0.04em',
  },
  liveLink: {
    fontSize: '0.75rem',
    color: '#00C2CB',
    textDecoration: 'none',
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: '4px',
    background: 'rgba(0,194,203,0.1)',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  groupLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    color: '#555',
    letterSpacing: '0.08em',
    padding: '4px 10px',
  },
  groupItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: '#181818',
    color: '#fff',
    fontWeight: 700,
    borderLeft: '3px solid #0066FF',
    borderRadius: '0 8px 8px 0',
  },
  navIcon: {
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
  },
  activeDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#0066FF',
  },
  badgeCount: {
    padding: '2px 7px',
    borderRadius: '10px',
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 800,
  },
  footer: {
    padding: '16px',
    borderTop: '1px solid #1f1f1f',
    background: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0066FF, #00C2CB)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userRole: {
    fontSize: '0.65rem',
    color: '#00C2CB',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: '#bbb',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
    background: '#141414',
    color: '#f87171',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.15s',
  },
};
