'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

type ActiveTab = 'story' | 'values' | 'team' | 'stats';

export default function AdminAboutPageEditor() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('story');
  const { showToast } = useToast();

  // Story & Philosophy form state
  const [aboutEntries, setAboutEntries] = useState<Record<string, string>>({
    story_heading: '',
    story_body: '',
    mission: '',
    vision: '',
  });
  const [savingStory, setSavingStory] = useState(false);

  // List states
  const [values, setValues] = useState<Record<string, unknown>[]>([]);
  const [team, setTeam] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<string>('value');
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'story') {
        const res = await fetch('/api/admin/about-content');
        if (res.ok) {
          const list = await res.json();
          const map: Record<string, string> = {
            story_heading: '',
            story_body: '',
            mission: '',
            vision: '',
          };
          if (Array.isArray(list)) {
            list.forEach((item: any) => {
              map[item.key] = item.value;
            });
          }
          setAboutEntries(map);
        }
      } else if (activeTab === 'values') {
        const res = await fetch('/api/admin/value');
        if (res.ok) setValues(await res.json());
      } else if (activeTab === 'team') {
        const res = await fetch('/api/admin/team-member');
        if (res.ok) setTeam(await res.json());
      } else if (activeTab === 'stats') {
        const res = await fetch('/api/admin/stat');
        if (res.ok) setStats(await res.json());
      }
    } catch {
      showToast('Failed to load section data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStory(true);
    try {
      const keys = ['story_heading', 'story_body', 'mission', 'vision'];
      for (const key of keys) {
        await fetch('/api/admin/about-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: aboutEntries[key] || '' }),
        });
      }
      showToast('About Story & Philosophy updated successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update story', 'error');
    } finally {
      setSavingStory(false);
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

  const currentConfig = modelConfigsMap[currentModel] || modelConfigsMap['team-member'];

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>About Us Page</h1>
          <p style={styles.subtitle}>
            Manage our agency story, founding philosophy, core values, leadership team, and credentials.
          </p>
        </div>
        <Link href="/about" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live About Page ↗
        </Link>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('story')}
          style={{ ...styles.tabBtn, ...(activeTab === 'story' ? styles.tabBtnActive : {}) }}
        >
          📖 Story &amp; Philosophy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('team')}
          style={{ ...styles.tabBtn, ...(activeTab === 'team' ? styles.tabBtnActive : {}) }}
        >
          👥 Leadership Team ({team.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('values')}
          style={{ ...styles.tabBtn, ...(activeTab === 'values' ? styles.tabBtnActive : {}) }}
        >
          💎 Core Values ({values.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          style={{ ...styles.tabBtn, ...(activeTab === 'stats' ? styles.tabBtnActive : {}) }}
        >
          📈 About Stats ({stats.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div style={styles.contentCard}>
        {activeTab === 'story' && (
          <form onSubmit={handleSaveStory} style={styles.formCard}>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Philosophy, Mission &amp; Vision</h2>
              <p style={styles.sectionDesc}>
                These paragraphs appear directly in the &quot;OUR PHILOSOPHY&quot; section on the live About page.
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Story Section Heading</label>
              <input
                type="text"
                value={aboutEntries.story_heading}
                onChange={(e) => setAboutEntries({ ...aboutEntries, story_heading: e.target.value })}
                placeholder="Where Software Architecture Meets Design Elegance"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Main Story Body (Paragraph 1)</label>
              <textarea
                rows={4}
                value={aboutEntries.story_body}
                onChange={(e) => setAboutEntries({ ...aboutEntries, story_body: e.target.value })}
                placeholder="Founded in 2024, EliWeb was created with a clear thesis..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mission Statement (Paragraph 2)</label>
              <textarea
                rows={4}
                value={aboutEntries.mission}
                onChange={(e) => setAboutEntries({ ...aboutEntries, mission: e.target.value })}
                placeholder="Every line of code we push to Neon PostgreSQL and Next.js..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Vision Statement (Optional)</label>
              <input
                type="text"
                value={aboutEntries.vision}
                onChange={(e) => setAboutEntries({ ...aboutEntries, vision: e.target.value })}
                placeholder="To be India's most trusted creative agency for web and video."
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={savingStory} style={styles.saveBtn}>
              {savingStory ? 'Saving Story...' : 'Save Philosophy & Story Changes'}
            </button>
          </form>
        )}

        {activeTab === 'team' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Leadership &amp; Craft Team</h2>
              <p style={styles.sectionDesc}>
                Profiles displayed in the &quot;Meet the Minds Behind the Architecture&quot; grid on the About page.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['team-member']}
              data={team}
              loading={loading}
              onAdd={() => handleOpenAdd('team-member')}
              onEdit={(rec) => handleOpenEdit('team-member', rec)}
              onDelete={(id) => handleDelete('team-member', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'values' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>Core Values &amp; Pillars</h2>
              <p style={styles.sectionDesc}>
                The value icons and statements displayed under the philosophy section (e.g. &quot;Passion&quot;, &quot;Precision&quot;, &quot;Speed&quot;).
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['value']}
              data={values}
              loading={loading}
              onAdd={() => handleOpenAdd('value')}
              onEdit={(rec) => handleOpenEdit('value', rec)}
              onDelete={(id) => handleDelete('value', id)}
              onRefresh={fetchTabData}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <div style={styles.sectionInfo}>
              <h2 style={styles.sectionHeading}>About Page Numbers &amp; Metrics</h2>
              <p style={styles.sectionDesc}>
                The horizontal stats cards featured above the story section on the About page.
              </p>
            </div>
            <ModelTable
              config={modelConfigsMap['stat']}
              data={stats}
              loading={loading}
              onAdd={() => handleOpenAdd('stat')}
              onEdit={(rec) => handleOpenEdit('stat', rec)}
              onDelete={(id) => handleDelete('stat', id)}
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
  formCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    lineHeight: 1.6,
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

