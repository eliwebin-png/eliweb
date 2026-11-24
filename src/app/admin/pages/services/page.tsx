'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

type ActiveTab = 'services' | 'tech' | 'faqs';

export default function AdminServicesPageEditor() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const { showToast } = useToast();

  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [techTools, setTechTools] = useState<Record<string, unknown>[]>([]);
  const [faqs, setFaqs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('service');
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await fetch('/api/admin/service');
        if (res.ok) setServices(await res.json());
      } else if (activeTab === 'tech') {
        const res = await fetch('/api/admin/tech-tool');
        if (res.ok) setTechTools(await res.json());
      } else if (activeTab === 'faqs') {
        const res = await fetch('/api/admin/faq');
        if (res.ok) setFaqs(await res.json());
      }
    } catch {
      showToast('Failed to load section data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = (model: string) => {
    setCurrentModel(model);
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (model: string, record: Record<string, unknown>) => {
    setCurrentModel(model);
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (model: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/${model}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Item deleted successfully', 'success');
      fetchTabData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaving(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate
        ? `/api/admin/${currentModel}/${editingRecord!.id}`
        : `/api/admin/${currentModel}`;
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

      showToast(`Saved successfully!`, 'success');
      setModalOpen(false);
      fetchTabData();
    } catch (err: any) {
      showToast(err?.error || 'Failed to save', 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = modelConfigsMap[currentModel] || modelConfigsMap['service'];

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>Services &amp; Capabilities Page</h1>
          <p style={styles.subtitle}>
            Manage all digital engineering services, deliverables, execution workflows, modern tech stack, and service FAQs.
          </p>
        </div>
        <Link href="/services" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live Services Page ↗
        </Link>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          style={{ ...styles.tabBtn, ...(activeTab === 'services' ? styles.tabBtnActive : {}) }}
        >
          ⚡ Services Catalog ({services.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tech')}
          style={{ ...styles.tabBtn, ...(activeTab === 'tech' ? styles.tabBtnActive : {}) }}
        >
          🛠️ Modern Tech Stack ({techTools.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{ ...styles.tabBtn, ...(activeTab === 'faqs' ? styles.tabBtnActive : {}) }}
        >
          ❓ Inquiries &amp; FAQs ({faqs.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div style={styles.contentCard}>
        {activeTab === 'services' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Full Services Catalog</h2>
              <p style={styles.sectionDesc}>
                Detailed capability blocks including category, cover visual, bulleted deliverables, and numbered execution workflows.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['service']}
              data={services}
              loading={loading}
              onAdd={() => handleOpenAdd('service')}
              onEdit={(rec) => handleOpenEdit('service', rec)}
              onDelete={(id) => handleDelete('service', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'tech' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Modern Infrastructure &amp; Tech Stack Strip</h2>
              <p style={styles.sectionDesc}>
                Logos and tool pills displayed under &quot;Built on Today&apos;s Most Reliable Frameworks&quot; (e.g. Next.js, React, Node, PostgreSQL, Docker).
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['tech-tool']}
              data={techTools}
              loading={loading}
              onAdd={() => handleOpenAdd('tech-tool')}
              onEdit={(rec) => handleOpenEdit('tech-tool', rec)}
              onDelete={(id) => handleDelete('tech-tool', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Common Inquiries &amp; FAQs Accordion</h2>
              <p style={styles.sectionDesc}>
                Frequently asked questions shown at the bottom of the services page.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['faq']}
              data={faqs}
              loading={loading}
              onAdd={() => handleOpenAdd('faq')}
              onEdit={(rec) => handleOpenEdit('faq', rec)}
              onDelete={(id) => handleDelete('faq', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}
      </div>

      {modalOpen && (
        <ModelFormModal
          title={editingRecord ? `Edit ${currentConfig.singular}` : `Create New ${currentConfig.singular}`}
          fields={currentConfig.fields}
          initialData={editingRecord}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          loading={saving}
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
  contentCard: {
    minHeight: '400px',
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
};

