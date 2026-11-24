'use client';

import React, { useState, useEffect } from 'react';
import RepeaterInput from './RepeaterInput';
import { useToast } from './ToastContext';

interface HeroData {
  id?: string;
  headline: string;
  subtitle: string;
  cta1Label: string;
  cta1Url: string;
  cta2Label: string;
  cta2Url: string;
  trustPills: string[];
  tickerItems: string[];
}

const DEFAULT_HERO: HeroData = {
  headline: 'We Build Websites. / We Craft Videos. / We Grow Brands.',
  subtitle:
    'EliWeb.in is your end-to-end digital partner — building powerful software products and growing your brand with data-driven digital marketing.',
  cta1Label: 'Start Your Project',
  cta1Url: '#contact',
  cta2Label: 'Watch Our Projects',
  cta2Url: '#portfolio',
  trustPills: [
    '10+ Projects Delivered',
    '100% Client Satisfaction',
    '5★ Rated Agency',
  ],
  tickerItems: [
    'Software Development',
    'Digital Marketing',
    'Web & App Development',
    'Brand Building',
    'SEO & Search Visibility',
    'Paid Ads & Promotion',
    'Content Strategy',
    'Graphic Designing',
  ],
};

export default function SingleRecordHero() {
  const { showToast } = useToast();
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    try {
      const res = await fetch('/api/admin/hero-content', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          const first = list[0];
          setData({
            id: first.id,
            headline: first.headline || DEFAULT_HERO.headline,
            subtitle: first.subtitle || DEFAULT_HERO.subtitle,
            cta1Label: first.cta1Label || DEFAULT_HERO.cta1Label,
            cta1Url: first.cta1Url || DEFAULT_HERO.cta1Url,
            cta2Label: first.cta2Label || DEFAULT_HERO.cta2Label,
            cta2Url: first.cta2Url || DEFAULT_HERO.cta2Url,
            trustPills: Array.isArray(first.trustPills) && first.trustPills.length > 0 ? first.trustPills : DEFAULT_HERO.trustPills,
            tickerItems: Array.isArray(first.tickerItems) && first.tickerItems.length > 0 ? first.tickerItems : DEFAULT_HERO.tickerItems,
          });
        }
      }
    } catch {
      // Kept fallback data
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isUpdate = Boolean(data.id);
      const url = isUpdate ? `/api/admin/hero-content/${data.id}` : '/api/admin/hero-content';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const saved = await res.json();
      if (saved.id) {
        setData((prev) => ({ ...prev, id: saved.id }));
      }
      showToast('Hero content updated successfully! Live page refreshed.', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save hero content';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={styles.cardTitle}>Homepage Hero Section</h2>
            {loading && <span style={{ fontSize: '0.75rem', color: '#00C2CB' }}>Syncing latest...</span>}
          </div>
          <h2 style={styles.cardTitle}>Homepage Hero Section</h2>
          <p style={styles.cardSub}>
            Edit the main headline, rotating lines, call-to-action buttons, trust indicators, and ticker banner.
          </p>
        </div>
        <button type="submit" disabled={saving} style={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save Live Changes'}
        </button>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.fieldGroupFull}>
          <label style={styles.label}>
            Main Headline (Use &quot; / &quot; to separate rotating lines)
          </label>
          <input
            type="text"
            required
            value={data.headline}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
            placeholder="We Build Websites. / We Craft Videos. / We Grow Brands."
            style={styles.input}
          />
          <span style={styles.hint}>
            Tip: The EliWeb home page will automatically animate each slash-separated segment in sequence!
          </span>
        </div>

        <div style={styles.fieldGroupFull}>
          <label style={styles.label}>Subtitle / Lead Description</label>
          <textarea
            rows={3}
            required
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            placeholder="EliWeb.in is your end-to-end digital partner..."
            style={styles.textarea}
          />
        </div>

        <div style={styles.fieldGroupHalf}>
          <label style={styles.label}>CTA 1 Button Label</label>
          <input
            type="text"
            required
            value={data.cta1Label}
            onChange={(e) => setData({ ...data, cta1Label: e.target.value })}
            placeholder="Start Your Project"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroupHalf}>
          <label style={styles.label}>CTA 1 Destination URL</label>
          <input
            type="text"
            required
            value={data.cta1Url}
            onChange={(e) => setData({ ...data, cta1Url: e.target.value })}
            placeholder="/contact or #contact"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroupHalf}>
          <label style={styles.label}>CTA 2 Button Label</label>
          <input
            type="text"
            required
            value={data.cta2Label}
            onChange={(e) => setData({ ...data, cta2Label: e.target.value })}
            placeholder="Watch Our Projects"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroupHalf}>
          <label style={styles.label}>CTA 2 Destination URL</label>
          <input
            type="text"
            required
            value={data.cta2Url}
            onChange={(e) => setData({ ...data, cta2Url: e.target.value })}
            placeholder="/portfolio or #portfolio"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldGroupFull}>
          <RepeaterInput
            label="Trust Badges & Pills"
            value={data.trustPills}
            onChange={(items) => setData({ ...data, trustPills: items })}
            placeholder="e.g. 50+ Projects Delivered"
          />
        </div>

        <div style={styles.fieldGroupFull}>
          <RepeaterInput
            label="Marquee Ticker Items"
            value={data.tickerItems}
            onChange={(items) => setData({ ...data, tickerItems: items })}
            placeholder="e.g. Software Development"
          />
        </div>
      </div>

      <div style={styles.footerBar}>
        <button type="submit" disabled={saving} style={styles.saveBtn}>
          {saving ? 'Saving Changes...' : 'Save Live Changes'}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    borderBottom: '1px solid #222',
    paddingBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 6px',
  },
  cardSub: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.4,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  fieldGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldGroupHalf: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#bbb',
  },
  hint: {
    fontSize: '0.75rem',
    color: '#666',
    marginTop: '2px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#0a0a0a',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#0a0a0a',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    background: '#0066FF',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  footerBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #222',
    paddingTop: '20px',
  },
  loadingBox: {
    padding: '48px',
    textAlign: 'center',
    color: '#888',
  },
};

