'use client';

import React, { useState } from 'react';
import { ModelPageConfig } from '@/lib/admin/fields';

interface ModelTableProps {
  config: ModelPageConfig;
  data: Record<string, unknown>[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (record: Record<string, unknown>) => void;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  onSeedDefaults?: () => void;
}

export default function ModelTable({
  config,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onSeedDefaults,
}: ModelTableProps) {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter((item) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return Object.values(item).some((val) => {
      if (typeof val === 'string') return val.toLowerCase().includes(term);
      if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(term));
      return false;
    });
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const renderCellValue = (val: unknown) => {
    if (val === null || val === undefined) return <span style={{ color: '#555' }}>—</span>;
    if (typeof val === 'boolean') {
      return (
        <span style={{
          ...styles.badge,
          background: val ? 'rgba(74, 222, 128, 0.15)' : 'rgba(156, 163, 175, 0.15)',
          color: val ? '#4ade80' : '#9ca3af',
        }}>
          {val ? 'Yes' : 'No'}
        </span>
      );
    }
    if (Array.isArray(val)) {
      return (
        <span style={{ ...styles.badge, background: 'rgba(0, 102, 255, 0.12)', color: '#60a5fa' }}>
          {val.length} items
        </span>
      );
    }
    if (typeof val === 'number') {
      return <span style={{ fontWeight: 600, color: '#e5e7eb' }}>{val}</span>;
    }
    const str = String(val);
    const isImageLink =
      (str.startsWith('http') || str.startsWith('/uploads')) &&
      (/\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(str) || str.includes('unsplash') || str.includes('images'));

    if (isImageLink) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={str}
            alt="Thumbnail"
            style={{ width: '36px', height: '26px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#888' }} title={str}>
            {str.substring(0, 30)}...
          </span>
        </div>
      );
    }

    if (str.length > 55) {
      return <span title={str}>{str.substring(0, 52)}...</span>;
    }
    return str;
  };

  return (
    <div style={styles.container}>
      {/* Top action toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.rightButtons}>
          <button
            type="button"
            onClick={onRefresh}
            style={styles.refreshBtn}
            title="Refresh list"
          >
            ↻ Refresh
          </button>
          {onSeedDefaults && data.length === 0 && (
            <button
              type="button"
              onClick={onSeedDefaults}
              style={{ ...styles.addBtn, background: '#059669', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)' }}
              title="Import starter items to database"
            >
              ✨ Import Starters
            </button>
          )}
          <button
            type="button"
            onClick={onAdd}
            style={styles.addBtn}
          >
            + Add {config.singular}
          </button>
        </div>
      </div>

      {/* Table container */}
      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.loadingBox}>Loading {config.title.toLowerCase()}...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#999' }}>
              {search ? 'No matching records found.' : `No ${config.title.toLowerCase()} yet.`}
            </p>
            {!search && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={onAdd}
                  style={styles.addBtn}
                >
                  Create the first one
                </button>
                {onSeedDefaults && (
                  <button
                    type="button"
                    onClick={onSeedDefaults}
                    style={{ ...styles.addBtn, background: '#059669', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)' }}
                  >
                    ✨ Import Starter {config.title}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  {config.listColumns.map((col) => (
                    <th key={col} style={styles.th}>
                      {col.toUpperCase()}
                    </th>
                  ))}
                  <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const id = row.id as string;
                  return (
                    <tr key={id || idx} style={styles.tr}>
                      <td style={styles.tdIndex}>{idx + 1}</td>
                      {config.listColumns.map((col) => (
                        <td key={col} style={styles.td}>
                          {renderCellValue(row[col])}
                        </td>
                      ))}
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionsCell}>
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            style={styles.editBtn}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(id)}
                            style={styles.deleteBtn}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={styles.confirmBackdrop} onClick={() => setDeleteId(null)}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: '#fff' }}>
              Confirm Deletion
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.875rem', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to delete this {config.singular.toLowerCase()}? This action cannot be undone and will immediately update the live website.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                style={styles.confirmDeleteBtn}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
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
    gap: '16px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchWrap: {
    flex: 1,
    minWidth: '240px',
    maxWidth: '380px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#141414',
    border: '1px solid #282828',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  rightButtons: {
    display: 'flex',
    gap: '10px',
  },
  refreshBtn: {
    padding: '9px 14px',
    borderRadius: '8px',
    background: '#1a1a1a',
    border: '1px solid #333',
    color: '#ccc',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  addBtn: {
    padding: '9px 18px',
    borderRadius: '8px',
    background: '#0066FF',
    border: 'none',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
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
  tdIndex: {
    padding: '14px 18px',
    fontSize: '0.8rem',
    color: '#666',
    width: '40px',
  },
  td: {
    padding: '14px 18px',
    fontSize: '0.875rem',
    color: '#ddd',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
  editBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    background: '#1f2937',
    border: '1px solid #374151',
    color: '#93c5fd',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    background: '#2f1515',
    border: '1px solid #552020',
    color: '#fca5a5',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  loadingBox: {
    padding: '48px',
    textAlign: 'center',
    color: '#888',
    fontSize: '0.9rem',
  },
  emptyBox: {
    padding: '48px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  confirmBackdrop: {
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
  confirmModal: {
    background: '#161616',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    background: 'transparent',
    border: '1px solid #333',
    color: '#bbb',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  confirmDeleteBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    background: '#dc2626',
    border: 'none',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

