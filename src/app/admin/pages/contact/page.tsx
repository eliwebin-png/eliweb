'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

type ActiveTab = 'channels' | 'faqs';

export default function AdminContactPageEditor() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('channels');
  const { showToast } = useToast();

  const [contactSettings, setContactSettings] = useState<Record<string, string>>({
    email: 'eliweb.in@gmail.com',
    hello_email: 'eliweb.in@gmail.com',
    phone: '+91 79 7385 1691',
    whatsapp_url: 'https://wa.me/917973851691',
    location: 'Delhi • NCR, India (Remote-First)',
    working_hours: 'Mon – Sat • 9:00 AM – 8:00 PM IST',
    response_time: 'Reply within 24 hours',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // FAQs
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'channels') {
        const res = await fetch('/api/admin/site-settings');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const map: Record<string, string> = { ...contactSettings };
            list.forEach((s: any) => {
              if (s.key in map) {
                map[s.key] = s.value;
              }
            });
            setContactSettings(map);
          }
        }
      } else if (activeTab === 'faqs') {
        setLoadingFaqs(true);
        const res = await fetch('/api/admin/faq');
        if (res.ok) {
          const list = await res.json();
          setFaqs(Array.isArray(list) ? list.filter((f: any) => f.page === 'contact' || !f.page) : []);
        }
        setLoadingFaqs(false);
      }
    } catch {
      showToast('Failed to load contact settings', 'error');
    }
  };

  const handleSaveChannels = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const keys = Object.keys(contactSettings);
      for (const key of keys) {
        await fetch('/api/admin/site-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: contactSettings[key] || '' }),
        });
      }
      showToast('Contact channels and details updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update contact settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord({ page: 'contact' });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: Record<string, unknown>) => {
    setEditingRecord(rec);
    setModalOpen(true);
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('FAQ deleted successfully', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete FAQ', 'error');
    }
  };

  const handleSaveFaq = async (formData: Record<string, unknown>) => {
    setSavingFaq(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate ? `/api/admin/faq/${editingRecord!.id}` : '/api/admin/faq';
      const method = isUpdate ? 'PUT' : 'POST';

      const payload = { ...formData, page: 'contact' };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      showToast('FAQ saved successfully!', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err?.error || 'Failed to save FAQ', 'error');
      throw err;
    } finally {
      setSavingFaq(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>Contact &amp; Demo Request Page</h1>
          <p style={styles.subtitle}>
            Manage direct inquiry channels, studio phone, email, WhatsApp link, physical headquarters, and demo FAQs.
          </p>
        </div>
        <Link href="/contact" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live Contact Page ↗
        </Link>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('channels')}
          style={{ ...styles.tabBtn, ...(activeTab === 'channels' ? styles.tabBtnActive : {}) }}
        >
          📞 Direct Communication Channels &amp; Office
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{ ...styles.tabBtn, ...(activeTab === 'faqs' ? styles.tabBtnActive : {}) }}
        >
          ❓ Contact FAQs ({faqs.length})
        </button>
      </div>

      {activeTab === 'channels' && (
        <form onSubmit={handleSaveChannels} style={styles.formCard}>
          <div style={styles.sectionInfo}>
            <h2 style={styles.sectionHeading}>Official Studio Channels &amp; Fast Reach</h2>
            <p style={styles.sectionDesc}>
              These channels appear directly in the right column of the Contact page, in the site footer, and in header contact badges.
            </p>
          </div>

          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Direct Hotline / Phone</label>
              <input
                type="text"
                value={contactSettings.phone}
                onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                placeholder="+91 79 7385 1691"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>General &amp; Demo Email</label>
              <input
                type="email"
                value={contactSettings.email}
                onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value, hello_email: e.target.value })}
                placeholder="eliweb.in@gmail.com"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>WhatsApp Direct Chat URL</label>
            <input
              type="text"
              value={contactSettings.whatsapp_url}
              onChange={(e) => setContactSettings({ ...contactSettings, whatsapp_url: e.target.value })}
              placeholder="https://wa.me/917973851691"
              style={styles.input}
            />
            <span style={styles.hint}>Links directly to your WhatsApp Business / Architect Team chat.</span>
          </div>

          <div style={styles.grid2}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Headquarters Address / City</label>
              <input
                type="text"
                value={contactSettings.location}
                onChange={(e) => setContactSettings({ ...contactSettings, location: e.target.value })}
                placeholder="Delhi • NCR, India"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Working Hours</label>
              <input
                type="text"
                value={contactSettings.working_hours}
                onChange={(e) => setContactSettings({ ...contactSettings, working_hours: e.target.value })}
                placeholder="Mon – Sat • 9:00 AM – 8:00 PM IST"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Guaranteed Response Time</label>
            <input
              type="text"
              value={contactSettings.response_time}
              onChange={(e) => setContactSettings({ ...contactSettings, response_time: e.target.value })}
              placeholder="Reply within 24 hours"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={savingSettings} style={styles.saveBtn}>
            {savingSettings ? 'Saving Details...' : 'Save Contact Channels Changes'}
          </button>
        </form>
      )}

      {activeTab === 'faqs' && (
        <div>
          <div style={styles.sectionInfo}>
            <h2 style={styles.sectionHeading}>Contact &amp; Onboarding FAQs</h2>
            <p style={styles.sectionDesc}>
              Frequently asked questions specific to project kickoff, pricing, payment terms, and demo deliverables.
            </p>
          </div>
          <ModelTable
            config={modelConfigsMap['faq']}
            data={faqs}
            loading={loadingFaqs}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteFaq}
            onRefresh={fetchData}
          />
        </div>
      )}

      {modalOpen && (
        <ModelFormModal
          title={editingRecord?.id ? 'Edit FAQ' : 'Add New Contact FAQ'}
          fields={modelConfigsMap['faq'].fields}
          initialData={editingRecord}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveFaq}
          loading={savingFaq}
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
  hint: {
    fontSize: '0.75rem',
    color: '#666',
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

