'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { useToast } from '@/components/admin/ToastContext';

interface PageProps {
  params: Promise<{ type: string }>;
}

interface Submission {
  id: string;
  name?: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  projectType?: string | null;
  message?: string;
  read: boolean;
  createdAt: string;
}

const TYPE_TITLES: Record<string, { title: string; desc: string }> = {
  contact: {
    title: 'Contact Form Submissions',
    desc: 'Prospective clients who requested a demo or consultation through the contact page.',
  },
  enquiry: {
    title: 'General Project Enquiries',
    desc: 'Quick consultation enquiries and project scope submissions.',
  },
  newsletter: {
    title: 'Newsletter Subscribers',
    desc: 'Subscribers registered for the quarterly Digital Journal and architecture digest.',
  },
};

export default function SubmissionsPage({ params }: PageProps) {
  const { type } = use(params);
  const info = TYPE_TITLES[type];
  const { showToast } = useToast();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!info) {
    notFound();
  }

  useEffect(() => {
    fetchSubmissions();
  }, [type]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${type}`);
      if (!res.ok) throw new Error('Failed to load submissions');
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (sub: Submission) => {
    try {
      const nextRead = !sub.read;
      const res = await fetch(`/api/admin/submissions/${type}/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: nextRead }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setSubmissions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, read: nextRead } : item))
      );
      if (selectedSub?.id === sub.id) {
        setSelectedSub((prev) => prev ? { ...prev, read: nextRead } : null);
      }
      showToast(`Marked as ${nextRead ? 'read' : 'unread'}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${type}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete submission');

      setSubmissions((prev) => prev.filter((item) => item.id !== id));
      if (selectedSub?.id === id) setSelectedSub(null);
      setDeletingId(null);
      showToast('Submission deleted successfully', 'success');
    } catch {
      showToast('Failed to delete submission', 'error');
    }
  };

  const filtered = submissions.filter((sub) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (sub.name && sub.name.toLowerCase().includes(term)) ||
      sub.email.toLowerCase().includes(term) ||
      (sub.phone && sub.phone.includes(term)) ||
      (sub.message && sub.message.toLowerCase().includes(term))
    );
  });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{info.title}</h1>
          <p style={styles.subtitle}>{info.desc}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or content..."
          style={styles.searchInput}
        />
        <button type="button" onClick={fetchSubmissions} style={styles.refreshBtn}>
          ↻ Refresh
        </button>
      </div>

      {/* Table Card */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.loadingBox}>Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={{ color: '#888', margin: 0 }}>
              {search ? 'No matching submissions found.' : 'No submissions received yet.'}
            </p>
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>STATUS</th>
                  <th style={styles.th}>DATE</th>
                  {type !== 'newsletter' && <th style={styles.th}>NAME</th>}
                  <th style={styles.th}>EMAIL</th>
                  {type === 'contact' && (
                    <>
                      <th style={styles.th}>SERVICE</th>
                      <th style={styles.th}>BUDGET</th>
                    </>
                  )}
                  {type === 'enquiry' && <th style={styles.th}>PROJECT TYPE</th>}
                  {type !== 'newsletter' && <th style={styles.th}>MESSAGE</th>}
                  <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    style={{
                      ...styles.tr,
                      background: sub.read ? 'transparent' : 'rgba(0, 102, 255, 0.05)',
                    }}
                  >
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: sub.read ? 'rgba(156, 163, 175, 0.15)' : 'rgba(0, 102, 255, 0.2)',
                          color: sub.read ? '#9ca3af' : '#60a5fa',
                        }}
                      >
                        {sub.read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: '#999', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatDate(sub.createdAt)}
                    </td>
                    {type !== 'newsletter' && (
                      <td style={{ ...styles.td, fontWeight: 600, color: '#fff' }}>
                        {sub.name || '—'}
                      </td>
                    )}
                    <td style={styles.td}>
                      <a href={`mailto:${sub.email}`} style={{ color: '#00C2CB', textDecoration: 'none' }}>
                        {sub.email}
                      </a>
                    </td>
                    {type === 'contact' && (
                      <>
                        <td style={styles.td}>{sub.service || '—'}</td>
                        <td style={styles.td}>{sub.budget || '—'}</td>
                      </>
                    )}
                    {type === 'enquiry' && <td style={styles.td}>{sub.projectType || '—'}</td>}
                    {type !== 'newsletter' && (
                      <td style={{ ...styles.td, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.message || '—'}
                      </td>
                    )}
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={styles.actionsCell}>
                        {type !== 'newsletter' && (
                          <button
                            type="button"
                            onClick={() => setSelectedSub(sub)}
                            style={styles.viewBtn}
                          >
                            View
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleToggleRead(sub)}
                          style={styles.toggleBtn}
                          title={sub.read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {sub.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(sub.id)}
                          style={styles.deleteBtn}
                        >
                          Delete
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

      {/* Detail Modal */}
      {selectedSub && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedSub(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                Submission Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Received:</span>
                <span style={styles.detailVal}>{formatDate(selectedSub.createdAt)}</span>
              </div>
              {selectedSub.name && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Name:</span>
                  <span style={styles.detailVal}>{selectedSub.name}</span>
                </div>
              )}
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email:</span>
                <a href={`mailto:${selectedSub.email}`} style={{ color: '#00C2CB' }}>
                  {selectedSub.email}
                </a>
              </div>
              {selectedSub.phone && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Phone:</span>
                  <span style={styles.detailVal}>{selectedSub.phone}</span>
                </div>
              )}
              {selectedSub.service && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Service:</span>
                  <span style={styles.detailVal}>{selectedSub.service}</span>
                </div>
              )}
              {selectedSub.budget && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Budget:</span>
                  <span style={styles.detailVal}>{selectedSub.budget}</span>
                </div>
              )}
              {selectedSub.projectType && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Project Type:</span>
                  <span style={styles.detailVal}>{selectedSub.projectType}</span>
                </div>
              )}
              {selectedSub.message && (
                <div style={{ marginTop: '12px' }}>
                  <span style={styles.detailLabel}>Full Message:</span>
                  <div style={styles.messageBox}>{selectedSub.message}</div>
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => handleToggleRead(selectedSub)}
                style={styles.toggleBtn}
              >
                {selectedSub.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                style={styles.closeModalBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div style={styles.modalBackdrop} onClick={() => setDeletingId(null)}>
          <div style={{ ...styles.modal, maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px', color: '#fff' }}>Delete Submission?</h3>
            <p style={{ color: '#aaa', fontSize: '0.875rem', margin: '0 0 20px' }}>
              Are you sure you want to permanently delete this submission record?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                style={styles.closeModalBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                style={{ ...styles.deleteBtn, padding: '8px 16px' }}
              >
                Delete Permanently
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
    gap: '20px',
  },
  header: {
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#888',
    margin: 0,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
  searchInput: {
    maxWidth: '380px',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#141414',
    border: '1px solid #282828',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  refreshBtn: {
    padding: '9px 16px',
    borderRadius: '8px',
    background: '#1a1a1a',
    border: '1px solid #333',
    color: '#ccc',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  tableCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableResponsive: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 18px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#888',
    background: '#161616',
    borderBottom: '1px solid #222',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #1a1a1a',
    transition: 'background 0.15s',
  },
  td: {
    padding: '14px 18px',
    fontSize: '0.875rem',
    color: '#ddd',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  actionsCell: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  viewBtn: {
    padding: '5px 10px',
    borderRadius: '6px',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#38bdf8',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  toggleBtn: {
    padding: '5px 10px',
    borderRadius: '6px',
    background: '#1f2937',
    border: '1px solid #374151',
    color: '#9ca3af',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '5px 10px',
    borderRadius: '6px',
    background: '#2f1515',
    border: '1px solid #552020',
    color: '#f87171',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  loadingBox: {
    padding: '48px',
    textAlign: 'center',
    color: '#888',
  },
  emptyBox: {
    padding: '48px',
    textAlign: 'center',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '16px',
  },
  modal: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    maxWidth: '560px',
    width: '100%',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #242424',
    paddingBottom: '12px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.9rem',
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
  },
  detailLabel: {
    color: '#888',
    width: '110px',
    fontWeight: 600,
    fontSize: '0.8rem',
  },
  detailVal: {
    color: '#eee',
    flex: 1,
  },
  messageBox: {
    marginTop: '6px',
    padding: '14px',
    background: '#0d0d0d',
    border: '1px solid #262626',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    borderTop: '1px solid #242424',
    paddingTop: '16px',
  },
  closeModalBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    background: 'transparent',
    border: '1px solid #333',
    color: '#ccc',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

