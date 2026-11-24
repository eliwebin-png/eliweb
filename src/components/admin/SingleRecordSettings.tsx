'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './ToastContext';

interface SettingRow {
  id?: string;
  key: string;
  value: string;
}

const KNOWN_SETTINGS = [
  { key: 'brand_tagline', label: 'Brand Tagline', group: 'general', type: 'textarea' },
  { key: 'copyright_year', label: 'Copyright Year', group: 'general', type: 'text' },
  { key: 'hello_email', label: 'Public Contact Email', group: 'contact', type: 'text' },
  { key: 'email', label: 'Secondary / Internal Email', group: 'contact', type: 'text' },
  { key: 'phone', label: 'Phone Number', group: 'contact', type: 'text' },
  { key: 'whatsapp_url', label: 'WhatsApp URL / Direct Chat', group: 'contact', type: 'text' },
  { key: 'location', label: 'Studio Location / Jurisdiction', group: 'contact', type: 'text' },
  { key: 'response_time', label: 'Response Time Promise', group: 'contact', type: 'text' },
  { key: 'instagram_url', label: 'Instagram Profile URL', group: 'social', type: 'text' },
  { key: 'linkedin_url', label: 'LinkedIn Profile URL', group: 'social', type: 'text' },
  { key: 'youtube_url', label: 'YouTube Channel URL', group: 'social', type: 'text' },
];

export default function SingleRecordSettings() {
  const { showToast } = useToast();
  const [settingsMap, setSettingsMap] = useState<Record<string, { id?: string; value: string }>>({});
  const [customKeys, setCustomKeys] = useState<string[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'custom'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-settings');
      if (res.ok) {
        const rows: SettingRow[] = await res.json();
        const map: Record<string, { id?: string; value: string }> = {};
        const knownSet = new Set(KNOWN_SETTINGS.map((s) => s.key));
        const extraKeys: string[] = [];

        rows.forEach((r) => {
          map[r.key] = { id: r.id, value: r.value };
          if (!knownSet.has(r.key)) {
            extraKeys.push(r.key);
          }
        });

        // Initialize known settings with blanks if missing
        KNOWN_SETTINGS.forEach((s) => {
          if (!map[s.key]) {
            map[s.key] = { value: '' };
          }
        });

        setSettingsMap(map);
        setCustomKeys(extraKeys);
      }
    } catch {
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setSettingsMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleAddCustom = () => {
    const trimmedKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!trimmedKey) return;
    if (settingsMap[trimmedKey]) {
      showToast(`Key "${trimmedKey}" already exists`, 'error');
      return;
    }
    setSettingsMap((prev) => ({
      ...prev,
      [trimmedKey]: { value: newVal },
    }));
    setCustomKeys((prev) => [...prev, trimmedKey]);
    setNewKey('');
    setNewVal('');
  };

  const handleDeleteCustom = async (key: string) => {
    const existing = settingsMap[key];
    if (existing?.id) {
      try {
        await fetch(`/api/admin/site-settings/${existing.id}`, { method: 'DELETE' });
      } catch {
        showToast(`Failed to delete "${key}"`, 'error');
        return;
      }
    }
    setSettingsMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setCustomKeys((prev) => prev.filter((k) => k !== key));
    showToast(`Setting "${key}" removed`, 'info');
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let successCount = 0;

    try {
      const keysToSave = Object.keys(settingsMap);
      for (const k of keysToSave) {
        const item = settingsMap[k];
        if (!item) continue;
        const value = item.value || '';

        if (item.id) {
          // Update
          const res = await fetch(`/api/admin/site-settings/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: k, value }),
          });
          if (res.ok) successCount++;
        } else if (value.trim()) {
          // Create
          const res = await fetch('/api/admin/site-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: k, value }),
          });
          if (res.ok) {
            const created = await res.json();
            setSettingsMap((prev) => ({
              ...prev,
              [k]: { id: created.id, value: created.value },
            }));
            successCount++;
          }
        }
      }

      showToast(`Site settings updated! (${successCount} saved)`, 'success');
    } catch {
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.loadingBox}>Loading Site Settings...</div>;
  }

  const currentSettings = KNOWN_SETTINGS.filter((s) => s.group === activeTab);

  return (
    <form onSubmit={handleSaveAll} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cardTitle}>Global Site Settings</h2>
          <p style={styles.cardSub}>
            Configure company identity, contact addresses, social media profiles, and live footer settings.
          </p>
        </div>
        <button type="submit" disabled={saving} style={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          style={{ ...styles.tabBtn, ...(activeTab === 'general' ? styles.tabBtnActive : {}) }}
        >
          General &amp; Branding
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          style={{ ...styles.tabBtn, ...(activeTab === 'contact' ? styles.tabBtnActive : {}) }}
        >
          Contact &amp; Support
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          style={{ ...styles.tabBtn, ...(activeTab === 'social' ? styles.tabBtnActive : {}) }}
        >
          Social Channels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('custom')}
          style={{ ...styles.tabBtn, ...(activeTab === 'custom' ? styles.tabBtnActive : {}) }}
        >
          Custom Variables ({customKeys.length})
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabBody}>
        {activeTab !== 'custom' ? (
          <div style={styles.grid}>
            {currentSettings.map((s) => {
              const val = settingsMap[s.key]?.value || '';
              return (
                <div key={s.key} style={s.type === 'textarea' ? styles.fieldFull : styles.fieldHalf}>
                  <label style={styles.label}>{s.label}</label>
                  <span style={styles.keyTag}>key: {s.key}</span>
                  {s.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleValueChange(s.key, e.target.value)}
                      style={styles.textarea}
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleValueChange(s.key, e.target.value)}
                      style={styles.input}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.customWrap}>
            <div style={styles.addCustomBar}>
              <input
                type="text"
                placeholder="new_setting_key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Setting value"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                style={{ ...styles.input, flex: 2 }}
              />
              <button
                type="button"
                onClick={handleAddCustom}
                style={styles.addCustomBtn}
              >
                + Add Variable
              </button>
            </div>

            {customKeys.length === 0 ? (
              <p style={{ color: '#777', fontSize: '0.85rem' }}>No custom variables defined yet.</p>
            ) : (
              <div style={styles.customList}>
                {customKeys.map((k) => (
                  <div key={k} style={styles.customRow}>
                    <div style={{ minWidth: '180px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{k}</strong>
                    </div>
                    <input
                      type="text"
                      value={settingsMap[k]?.value || ''}
                      onChange={(e) => handleValueChange(k, e.target.value)}
                      style={styles.input}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteCustom(k)}
                      style={styles.deleteCustomBtn}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.footerBar}>
        <button type="submit" disabled={saving} style={styles.saveBtn}>
          {saving ? 'Saving...' : 'Save All Settings'}
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
    gap: '20px',
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
  },
  tabsRow: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #222',
    paddingBottom: '8px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabBtnActive: {
    background: '#1c1c1c',
    color: '#0066FF',
    border: '1px solid #2a2a2a',
  },
  tabBody: {
    paddingTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },
  fieldFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldHalf: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#ccc',
  },
  keyTag: {
    fontSize: '0.7rem',
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: '4px',
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
  customWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  addCustomBar: {
    display: 'flex',
    gap: '10px',
  },
  addCustomBtn: {
    padding: '0 20px',
    background: '#0066FF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  customList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  customRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: '#161616',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #262626',
  },
  deleteCustomBtn: {
    padding: '6px 12px',
    background: '#2f1515',
    color: '#f87171',
    border: '1px solid #4a1c1c',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
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

