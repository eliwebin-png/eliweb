'use client';

import React, { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { modelPageConfigs } from '@/lib/admin/fields';
import ModelTable from '@/components/admin/ModelTable';
import ModelFormModal from '@/components/admin/ModelFormModal';
import SingleRecordHero from '@/components/admin/SingleRecordHero';
import SingleRecordSettings from '@/components/admin/SingleRecordSettings';
import { useToast } from '@/components/admin/ToastContext';

interface PageProps {
  params: Promise<{ model: string }>;
}

export default function AdminModelPage({ params }: PageProps) {
  const { model } = use(params);
  const config = modelPageConfigs[model];
  const { showToast } = useToast();

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config && !config.singleRecord && model !== 'site-settings') {
      fetchData();
    }
  }, [model]);

  if (!config) {
    notFound();
  }

  // Handle single-record specialized editors
  if (model === 'hero-content') {
    return <SingleRecordHero />;
  }

  if (model === 'site-settings') {
    return <SingleRecordSettings />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${model}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      showToast(`Failed to load ${config.title.toLowerCase()}`, 'error');
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

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaving(true);
    try {
      const isUpdate = Boolean(editingRecord && editingRecord.id);
      const url = isUpdate
        ? `/api/admin/${model}/${editingRecord!.id}`
        : `/api/admin/${model}`;
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw result;
      }

      showToast(
        `${config.singular} ${isUpdate ? 'updated' : 'created'} successfully!`,
        'success'
      );
      setModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'details' in err) {
        showToast('Please correct validation errors', 'error');
        throw err; // rethrow to ModelFormModal for field highlighting
      } else {
        const msg = err && typeof err === 'object' && 'error' in err ? String((err as { error: unknown }).error) : 'Failed to save record';
        showToast(msg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/${model}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete');
      }

      showToast(`${config.singular} deleted successfully!`, 'success');
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete item';
      showToast(msg, 'error');
    }
  };

  const handleSeedDefaults = model === 'post' ? async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/seed-posts', { method: 'POST' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to import starter posts');
      showToast(`Successfully imported ${result.count} starter articles!`, 'success');
      fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import articles';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  } : undefined;

  return (
    <div>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{config.title}</h1>
          <p style={styles.subtitle}>
            Manage and update {config.title.toLowerCase()} for the live website. Changes publish immediately.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <ModelTable
        config={config}
        data={data}
        loading={loading}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onRefresh={fetchData}
        onSeedDefaults={handleSeedDefaults}
      />

      {/* Create / Edit Form Modal */}
      <ModelFormModal
        title={editingRecord ? `Edit ${config.singular}` : `Create New ${config.singular}`}
        fields={config.fields}
        initialData={editingRecord}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '28px',
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
};
