'use client';

import React, { useState, useEffect } from 'react';
import { FieldConfig } from '@/lib/admin/fields';
import RepeaterInput from './RepeaterInput';

interface ModelFormModalProps {
  title: string;
  fields: FieldConfig[];
  initialData?: Record<string, unknown> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

export default function ModelFormModal({
  title,
  fields,
  initialData,
  isOpen,
  onClose,
  onSave,
  loading = false,
}: ModelFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults: Record<string, unknown> = {};
      fields.forEach((f) => {
        if (f.type === 'array') defaults[f.name] = [];
        else if (f.type === 'boolean') defaults[f.name] = false;
        else if (f.type === 'number') defaults[f.name] = 0;
        else defaults[f.name] = '';
      });
      setFormData(defaults);
    }
    setFieldErrors({});
  }, [initialData, fields, isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'details' in err) {
        const fieldDetails = (err as { details?: { fieldErrors?: Record<string, string[]> } }).details?.fieldErrors;
        if (fieldDetails) {
          const mapped: Record<string, string> = {};
          Object.entries(fieldDetails).forEach(([k, msgs]) => {
            if (msgs && msgs[0]) mapped[k] = msgs[0];
          });
          setFieldErrors(mapped);
        }
      }
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button type="button" onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldsContainer}>
            {fields.map((f) => {
              const val = formData[f.name];
              const error = fieldErrors[f.name];

              if (f.type === 'array') {
                return (
                  <div key={f.name} style={styles.fieldGroup}>
                    <RepeaterInput
                      label={f.label}
                      value={(val as string[]) || []}
                      onChange={(arr) => handleChange(f.name, arr)}
                      placeholder={f.placeholder}
                    />
                    {error && <span style={styles.errorText}>{error}</span>}
                  </div>
                );
              }

              if (f.type === 'boolean') {
                const checked = Boolean(val);
                return (
                  <div key={f.name} style={{ ...styles.fieldGroup, ...styles.checkboxGroup }}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleChange(f.name, e.target.checked)}
                        style={styles.checkbox}
                      />
                      <span>{f.label}</span>
                    </label>
                    {error && <span style={styles.errorText}>{error}</span>}
                  </div>
                );
              }

              if (f.type === 'select') {
                return (
                  <div key={f.name} style={styles.fieldGroup}>
                    <label style={styles.label}>{f.label}</label>
                    <select
                      value={(val as string) || ''}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      style={styles.select}
                    >
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {error && <span style={styles.errorText}>{error}</span>}
                  </div>
                );
              }

              if (f.type === 'textarea') {
                return (
                  <div key={f.name} style={styles.fieldGroup}>
                    <label style={styles.label}>{f.label}</label>
                    <textarea
                      rows={3}
                      value={(val as string) || ''}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      style={styles.textarea}
                    />
                    {error && <span style={styles.errorText}>{error}</span>}
                  </div>
                );
              }

              const isImageField =
                f.name.toLowerCase().includes('url') &&
                (f.name.toLowerCase().includes('image') ||
                  f.name.toLowerCase().includes('avatar') ||
                  f.name.toLowerCase().includes('logo') ||
                  f.name.toLowerCase().includes('photo') ||
                  f.name.toLowerCase().includes('cover'));

              if (isImageField) {
                const strVal = typeof val === 'string' ? val : '';
                return (
                  <div key={f.name} style={styles.fieldGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={styles.label}>{f.label}</label>
                      <label style={styles.uploadTriggerLabel}>
                        📁 Choose Image File
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append('file', file);
                            try {
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: fd,
                              });
                              if (res.ok) {
                                const data = await res.json();
                                handleChange(f.name, data.url);
                              }
                            } catch (err) {
                              console.error('Upload failed', err);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={strVal}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      placeholder={f.placeholder || 'Paste any image link (https://... or /uploads/...)'}
                      style={styles.input}
                    />
                    {error && <span style={styles.errorText}>{error}</span>}

                    {/* Live Image Preview Thumbnail */}
                    {strVal && (
                      <div style={styles.imagePreviewContainer}>
                        <div style={styles.imagePreviewThumbWrap}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={strVal}
                            alt="Live Preview"
                            style={styles.imagePreviewThumb}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            onLoad={(e) => {
                              (e.target as HTMLElement).style.display = 'block';
                            }}
                          />
                        </div>
                        <span style={styles.previewCaption}>
                          Live Preview &bull; Renders from link
                        </span>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={f.name} style={styles.fieldGroup}>
                  <label style={styles.label}>{f.label}</label>
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={val !== undefined && val !== null ? String(val) : ''}
                    onChange={(e) => {
                      const nextVal = f.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
                      handleChange(f.name, nextVal);
                    }}
                    placeholder={f.placeholder}
                    style={styles.input}
                  />
                  {error && <span style={styles.errorText}>{error}</span>}
                </div>
              );
            })}
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={styles.saveBtn}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '14px',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  header: {
    padding: '18px 24px',
    borderBottom: '1px solid #242424',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  fieldsContainer: {
    padding: '20px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flex: 1,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#bbb',
    letterSpacing: '0.02em',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#ddd',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#0066FF',
    cursor: 'pointer',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#0d0d0d',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#0d0d0d',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: '#0d0d0d',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #242424',
    background: '#111',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: 'transparent',
    color: '#aaa',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 22px',
    borderRadius: '8px',
    border: 'none',
    background: '#0066FF',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  uploadTriggerLabel: {
    fontSize: '0.75rem',
    color: '#00C2CB',
    cursor: 'pointer',
    background: 'rgba(0,194,203,0.1)',
    padding: '3px 8px',
    borderRadius: '5px',
    fontWeight: 600,
  },
  imagePreviewContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#181818',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #282828',
    marginTop: '4px',
  },
  imagePreviewThumbWrap: {
    width: '54px',
    height: '40px',
    borderRadius: '6px',
    overflow: 'hidden',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #333',
    flexShrink: 0,
  },
  imagePreviewThumb: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewCaption: {
    fontSize: '0.75rem',
    color: '#888',
  },
};

