'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/ToastContext';

type TabType = 'contact' | 'enquiry' | 'newsletter';

export default function AdminMessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [counts, setCounts] = useState<{ contact: number; enquiry: number; newsletter: number }>({
    contact: 0,
    enquiry: 0,
    newsletter: 0,
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchSubmissions(activeTab);
    fetchCounts();
  }, [activeTab]);

  const fetchCounts = async () => {
    try {
      const [cRes, eRes, nRes] = await Promise.all([
        fetch('/api/admin/submissions/contact'),
        fetch('/api/admin/submissions/enquiry'),
        fetch('/api/admin/submissions/newsletter'),
      ]);
      const [c, e, n] = await Promise.all([cRes.json(), eRes.json(), nRes.json()]);
      setCounts({
        contact: Array.isArray(c) ? c.filter((x: any) => !x.read).length : 0,
        enquiry: Array.isArray(e) ? e.filter((x: any) => !x.read).length : 0,
        newsletter: Array.isArray(n) ? n.filter((x: any) => !x.read).length : 0,
      });
    } catch {
      // Ignore
    }
  };

  const fetchSubmissions = async (type: TabType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${type}`);
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (item: any) => {
    try {
      const newReadStatus = !item.read;
      const res = await fetch(`/api/admin/submissions/${activeTab}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: newReadStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === item.id ? { ...sub, read: newReadStatus } : sub))
      );
      if (selectedItem?.id === item.id) {
        setSelectedItem({ ...selectedItem, read: newReadStatus });
      }
      showToast(`Marked as ${newReadStatus ? 'read' : 'unread'}`, 'success');
      fetchCounts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/submissions/${activeTab}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      showToast('Deleted successfully', 'success');
      fetchCounts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>COMMUNICATIONS HUB</div>
          <h1 style={styles.title}>Messages, Enquiries &amp; Subscribers</h1>
          <p style={styles.subtitle}>
            Review inquiries submitted through website contact forms, demo booking modals, and newsletter subscriptions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrap}>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          style={{ ...styles.tabBtn, ...(activeTab === 'contact' ? styles.tabBtnActive : {}) }}
        >
          📩 Contact Form Responses
          {counts.contact > 0 && <span style={styles.unreadBadge}>{counts.contact} new</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('enquiry')}
          style={{ ...styles.tabBtn, ...(activeTab === 'enquiry' ? styles.tabBtnActive : {}) }}
        >
          💼 Project &amp; Demo Enquiries
          {counts.enquiry > 0 && <span style={styles.unreadBadge}>{counts.enquiry} new</span>}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('newsletter')}
          style={{ ...styles.tabBtn, ...(activeTab === 'newsletter' ? styles.tabBtnActive : {}) }}
        >
          ✉️ Newsletter Subscribers
          {counts.newsletter > 0 && <span style={styles.unreadBadge}>{counts.newsletter} new</span>}
        </button>
      </div>

      {/* Main Table Card */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.emptyBox}>Loading messages...</div>
        ) : submissions.length === 0 ? (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: '2rem' }}>📭</span>
            <p style={{ margin: '8px 0 0', color: '#888' }}>No submissions received yet in this category.</p>
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  {activeTab !== 'newsletter' && <th style={styles.th}>Name</th>}
                  <th style={styles.th}>Email</th>
                  {activeTab !== 'newsletter' && <th style={styles.th}>Phone</th>}
                  {activeTab === 'contact' && <th style={styles.th}>Service &amp; Budget</th>}
                  {activeTab === 'enquiry' && <th style={styles.th}>Project Type</th>}
                  {activeTab !== 'newsletter' && <th style={styles.th}>Message Preview</th>}
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      ...styles.tr,
                      background: item.read ? 'transparent' : 'rgba(0, 102, 255, 0.05)',
                    }}
                  >
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusDot,
                          background: item.read ? '#4b5563' : '#00C2CB',
                        }}
                        title={item.read ? 'Read' : 'New / Unread'}
                      />
                    </td>
                    <td style={{ ...styles.td, whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#888' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    {activeTab !== 'newsletter' && (
                      <td style={{ ...styles.td, fontWeight: item.read ? 500 : 700, color: '#fff' }}>
                        {item.name}
                      </td>
                    )}
                    <td style={styles.td}>
                      <a href={`mailto:${item.email}`} style={styles.link}>
                        {item.email}
                      </a>
                    </td>
                    {activeTab !== 'newsletter' && (
                      <td style={{ ...styles.td, color: '#aaa', fontSize: '0.85rem' }}>
                        {item.phone || '—'}
                      </td>
                    )}
                    {activeTab === 'contact' && (
                      <td style={styles.td}>
                        <span style={styles.chip}>{item.service || 'General'}</span>{' '}
                        {item.budget && <span style={styles.budgetChip}>{item.budget}</span>}
                      </td>
                    )}
                    {activeTab === 'enquiry' && (
                      <td style={styles.td}>
                        <span style={styles.chip}>{item.projectType || 'Project'}</span>
                      </td>
                    )}
                    {activeTab !== 'newsletter' && (
                      <td style={{ ...styles.td, maxWidth: '240px', color: '#bbb' }}>
                        <span
                          style={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.message}
                        </span>
                      </td>
                    )}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {activeTab !== 'newsletter' && (
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            style={styles.actionBtn}
                            title="View Full Details"
                          >
                            👁️ View
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleRead(item)}
                          style={styles.actionBtn}
                          title={item.read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {item.read ? '✉️' : '✓'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          style={{ ...styles.actionBtn, color: '#f87171' }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Inspection Modal */}
      {selectedItem && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalDialog}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Inquiry Details</h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalMetaRow}>
                <div>
                  <span style={styles.modalLabel}>Submitted By</span>
                  <div style={styles.modalValueName}>{selectedItem.name}</div>
                  <a href={`mailto:${selectedItem.email}`} style={styles.link}>
                    {selectedItem.email}
                  </a>
                  {selectedItem.phone && (
                    <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>
                      📞 {selectedItem.phone}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.modalLabel}>Received Date</span>
                  <div style={{ color: '#ccc', fontSize: '0.85rem' }}>
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {selectedItem.service && (
                <div style={{ marginTop: '16px' }}>
                  <span style={styles.modalLabel}>Service of Interest</span>
                  <div style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedItem.service}</div>
                </div>
              )}

              {selectedItem.budget && (
                <div style={{ marginTop: '12px' }}>
                  <span style={styles.modalLabel}>Estimated Budget</span>
                  <div style={{ color: '#00C2CB', fontWeight: 600 }}>{selectedItem.budget}</div>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <span style={styles.modalLabel}>Full Message</span>
                <div style={styles.modalMessageBox}>{selectedItem.message}</div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <a
                href={`mailto:${selectedItem.email}?subject=Regarding Your EliWeb.in Inquiry`}
                style={styles.replyBtn}
              >
                Reply via Email ✉️
              </a>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={styles.closeBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
  tabsWrap: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid #222',
    paddingBottom: '10px',
    overflowX: 'auto',
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
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
  unreadBadge: {
    padding: '2px 6px',
    borderRadius: '10px',
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 800,
  },
  tableCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  emptyBox: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tableResponsive: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '14px 16px',
    background: '#151515',
    color: '#888',
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #222',
  },
  tr: {
    borderBottom: '1px solid #1a1a1a',
    transition: 'background 0.15s',
  },
  td: {
    padding: '14px 16px',
    fontSize: '0.875rem',
    verticalAlign: 'middle',
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  link: {
    color: '#0066FF',
    textDecoration: 'none',
  },
  chip: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.06)',
    color: '#ccc',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  budgetChip: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    background: 'rgba(0, 194, 203, 0.12)',
    color: '#00C2CB',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  actionBtn: {
    padding: '6px 10px',
    borderRadius: '6px',
    background: '#181818',
    border: '1px solid #333',
    color: '#ccc',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalDialog: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '18px 24px',
    borderBottom: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#fff',
    fontWeight: 700,
  },
  modalCloseBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '24px',
  },
  modalMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #222',
    paddingBottom: '16px',
  },
  modalLabel: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '4px',
  },
  modalValueName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '2px',
  },
  modalMessageBox: {
    background: '#0d0d0d',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '16px',
    color: '#ddd',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  modalFooter: {
    padding: '16px 24px',
    background: '#0f0f0f',
    borderTop: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
  replyBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    background: '#0066FF',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  closeBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    background: '#222',
    border: '1px solid #333',
    color: '#ccc',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

