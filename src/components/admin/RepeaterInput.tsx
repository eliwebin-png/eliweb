'use client';

import React, { useState } from 'react';

interface RepeaterInputProps {
  value: string[];
  onChange: (items: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function RepeaterInput({
  value = [],
  onChange,
  label,
  placeholder = 'Add new item...',
}: RepeaterInputProps) {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  const handleItemChange = (index: number, newText: string) => {
    const updated = [...value];
    updated[index] = newText;
    onChange(updated);
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.mainLabel}>{label} ({value.length})</label>}

      <div style={styles.addBar}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={styles.addInput}
        />
        <button
          type="button"
          onClick={handleAdd}
          style={styles.addBtn}
        >
          + Add
        </button>
      </div>

      {value.length > 0 && (
        <div style={styles.list}>
          {value.map((item, idx) => (
            <div key={idx} style={styles.row}>
              <div style={styles.indexBadge}>{idx + 1}</div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                style={styles.itemInput}
              />
              <div style={styles.actions}>
                <button
                  type="button"
                  title="Move Up"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, idx - 1)}
                  style={{ ...styles.iconBtn, opacity: idx === 0 ? 0.3 : 1 }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Move Down"
                  disabled={idx === value.length - 1}
                  onClick={() => handleMove(idx, idx + 1)}
                  style={{ ...styles.iconBtn, opacity: idx === value.length - 1 ? 0.3 : 1 }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => handleRemove(idx)}
                  style={{ ...styles.iconBtn, ...styles.deleteBtn }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mainLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#d1d5db',
  },
  addBar: {
    display: 'flex',
    gap: '8px',
  },
  addInput: {
    flex: 1,
    padding: '9px 13px',
    borderRadius: '8px',
    background: '#141414',
    border: '1px solid #2d2d2d',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
  },
  addBtn: {
    padding: '0 16px',
    background: '#0066FF',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
    maxHeight: '220px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#191919',
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #282828',
  },
  indexBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#777',
    width: '20px',
    textAlign: 'center',
  },
  itemInput: {
    flex: 1,
    padding: '6px 10px',
    borderRadius: '5px',
    background: '#121212',
    border: '1px solid #333',
    color: '#f0f0f0',
    fontSize: '0.85rem',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: '4px',
  },
  iconBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '5px',
    background: '#242424',
    border: '1px solid #383838',
    color: '#bbb',
    fontSize: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  deleteBtn: {
    color: '#ff6b6b',
    background: '#2c1515',
    borderColor: '#4d2020',
  },
};

