'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/ToastContext';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import { modelConfigsMap } from '@/lib/admin/fields';

export default function AdminPortfolioPageEditor() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/project');
      if (res.ok) {
        setProjects(await res.json());
      }
    } catch {
      showToast('Failed to load portfolio projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (record: Record<string, unknown>) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/project/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Project deleted successfully', 'success');
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaving(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate
        ? `/api/admin/project/${editingRecord!.id}`
        : `/api/admin/project`;
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

      showToast(`Project ${isUpdate ? 'updated' : 'created'} successfully!`, 'success');
      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      showToast(err?.error || 'Failed to save project', 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const config = modelConfigsMap['project'];

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.badge}>PAGE BUILDER</div>
          <h1 style={styles.title}>Portfolio &amp; Showcase Page</h1>
          <p style={styles.subtitle}>
            Manage all selected works, case studies, client platforms, and high-definition project visuals.
          </p>
        </div>
        <Link href="/portfolio" target="_blank" rel="noopener noreferrer" style={styles.viewLiveBtn}>
          👁️ View Live Portfolio Page ↗
        </Link>
      </div>

      <div style={styles.sectionInfo}>
        <h2 style={styles.sectionHeading}>Selected Client Works &amp; Case Studies ({projects.length})</h2>
        <p style={styles.sectionDesc}>
          Set <strong>Featured</strong> to highlight a project with a prominent spotlight tag. Set <strong>Homepage Teaser</strong> to mirror the project directly onto the front page carousel.
        </p>
      </div>

      <ModelTable
        config={config}
        data={projects}
        loading={loading}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onRefresh={fetchProjects}
      />

      {modalOpen && (
        <ModelFormModal
          title={editingRecord ? 'Edit Project' : 'Add New Portfolio Project'}
          fields={config.fields}
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
  sectionInfo: {
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

