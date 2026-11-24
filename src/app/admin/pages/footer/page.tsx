'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

type ActiveTab = 'brand' | 'links';

export default function AdminFooterSectionEditor() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('brand');
  const { showToast } = useToast();

  const [footerSettings, setFooterSettings] = useState<Record<string, string>>({
    brand_tagline: 'We Build. We Edit. We Elevate. Premium websites and cinematic video content for ambitious brands.',
    copyright_year: '2026',
    instagram_url: 'https://www.instagram.com/eliweb.in/',
    linkedin_url: 'https://www.linkedin.com/company/eliweb',
    youtube_url: 'https://youtube.com',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Footer Links list
  const [footerLinks, setFooterLinks] = useState<Record<string, unknown>[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [savingLink, setSavingLink] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'brand') {
        const res = await fetch('/api/admin/site-settings');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const map: Record<string, string> = { ...footerSettings };
            list.forEach((s: any) => {
              if (s.key in map) {
                map[s.key] = s.value;
              }
            });
            setFooterSettings(map);
          }
        }
      } else if (activeTab === 'links') {
        setLoadingLinks(true);
        const res = await fetch('/api/admin/footer-link');
        if (res.ok) {
          setFooterLinks(await res.json());
        }
        setLoadingLinks(false);
      }
    } catch {
      showToast('Failed to load footer configuration', 'error');
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const keys = Object.keys(footerSettings);
      for (const key of keys) {
        await fetch('/api/admin/site-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: footerSettings[key] || '' }),
        });
      }
      showToast('Footer brand tagline and social links updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update footer settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: Record<string, unknown>) => {
    setEditingRecord(rec);
    setModalOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/footer-link/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Footer link deleted successfully', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete link', 'error');
    }
  };

  const handleSaveLink = async (formData: Record<string, unknown>) => {
    setSavingLink(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate ? `/api/admin/footer-link/${editingRecord!.id}` : '/api/admin/footer-link';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      showToast('Footer link saved successfully!', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err?.error || 'Failed to save footer link', 'error');
      throw err;
    } finally {
      setSavingLink(false);
    }
  };

  const config = modelConfigsMap['footer-link'];

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>Footer Section &amp; Global Links</h1>
          <p style={styles.subtitle}>
            Control brand copy, newsletter widget tagline, social channel profiles, and multi-column navigation links across all pages.
          </p>
        </div>
        <Link href="/" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live Footer ↗
        </Link>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          style={{ ...styles.tabBtn, ...(activeTab === 'brand' ? styles.tabBtnActive : {}) }}
        >
          🏷️ Brand Copy &amp; Social Links
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('links')}
          style={{ ...styles.tabBtn, ...(activeTab === 'links' ? styles.tabBtnActive : {}) }}
        >
          🔗 Navigation Columns &amp; Links ({footerLinks.length})
        </button>
      </div>

      {activeTab === 'brand' && (
        <form onSubmit={handleSaveBrand} style={styles.formCard}>
          <div style={styles.sectionInfo}>
            <h2 style={styles.sectionHeading}>Global Footer Brand Information</h2>
            <p style={styles.sectionDesc}>
              This description and copyright appear at the bottom of every page on the live website.
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Brand Statement &amp; Tagline</label>
            <textarea
              rows={3}
              value={footerSettings.brand_tagline}
              onChange={(e) => setFooterSettings({ ...footerSettings, brand_tagline: e.target.value })}
              placeholder="We Build. We Edit. We Elevate. Premium websites..."
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Copyright Year</label>
            <input
              type="text"
              value={footerSettings.copyright_year}
              onChange={(e) => setFooterSettings({ ...footerSettings, copyright_year: e.target.value })}
              placeholder="2026"
              style={styles.input}
            />
          </div>

          <div style={styles.sectionInfo}>
            <h2 style={styles.sectionHeading}>Social Channels &amp; Profiles</h2>
            <p style={styles.sectionDesc}>
              Links connected to the social icons in the footer and floating contact pills.
            </p>
          </div>

          <div style={styles.grid3}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Instagram Profile URL</label>
              <input
                type="text"
                value={footerSettings.instagram_url}
                onChange={(e) => setFooterSettings({ ...footerSettings, instagram_url: e.target.value })}
                placeholder="https://www.instagram.com/eliweb.in/"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>LinkedIn Company URL</label>
              <input
                type="text"
                value={footerSettings.linkedin_url}
                onChange={(e) => setFooterSettings({ ...footerSettings, linkedin_url: e.target.value })}
                placeholder="https://www.linkedin.com/company/eliweb"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>YouTube Channel URL</label>
              <input
                type="text"
                value={footerSettings.youtube_url}
                onChange={(e) => setFooterSettings({ ...footerSettings, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@eliweb"
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={savingSettings} style={styles.saveBtn}>
            {savingSettings ? 'Saving...' : 'Save Footer Brand & Social Links'}
          </button>
        </form>
      )}

      {activeTab === 'links' && (
        <div>
          <div style={styles.sectionInfo}>
            <h2 style={styles.sectionHeading}>Footer Column Navigation Links</h2>
            <p style={styles.sectionDesc}>
              Links displayed under <strong>Navigation &amp; Services</strong> and <strong>Company</strong> in the footer.
            </p>
          </div>
          <ModelTable
            config={config}
            data={footerLinks}
            loading={loadingLinks}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteLink}
            onRefresh={fetchData}
          />
        </div>
      )}

      {modalOpen && (
        <ModelFormModal
          title={editingRecord ? 'Edit Footer Link' : 'Add New Footer Link'}
          fields={config.fields}
          initialData={editingRecord}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveLink}
          loading={savingLink}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#00C2CB',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0,
    maxWidth: '650px',
    lineHeight: 1.5,
  },
  viewLiveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '8px',
    background: 'rgba(0, 194, 203, 0.1)',
    border: '1px solid rgba(0, 194, 203, 0.3)',
    color: '#00C2CB',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  tabsWrap: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #222',
    paddingBottom: '10px',
    overflowX: 'auto',
  },
  tabBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    background: '#141414',
    border: '1px solid #262626',
    color: '#aaa',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  tabBtnActive: {
    background: '#0066FF',
    borderColor: '#0066FF',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0, 102, 255, 0.35)',
  },
  sectionInfo: {
    marginBottom: '20px',
    padding: '16px 20px',
    background: '#121212',
    border: '1px solid #222',
    borderRadius: '10px',
  },
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 4px',
  },
  sectionDesc: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
    lineHeight: 1.5,
  },
  formCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#ccc',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    background: '#181818',
    border: '1px solid #333',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '8px',
    background: '#181818',
    border: '1px solid #333',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.5,
  },
  saveBtn: {
    alignSelf: 'flex-start',
    padding: '12px 24px',
    borderRadius: '8px',
    background: '#0066FF',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0, 102, 255, 0.35)',
  },
};

