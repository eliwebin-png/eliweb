'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/admin/ToastContext';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div style={styles.shell}>
          <AdminSidebar />
          <main style={styles.mainContent}>
            <div style={styles.contentInner}>{children}</div>
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f5f5f5',
    fontFamily: 'inherit',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '100vh',
    background: '#0a0a0a',
  },
  contentInner: {
    padding: '32px 40px',
    maxWidth: '1280px',
    margin: '0 auto',
  },
};
