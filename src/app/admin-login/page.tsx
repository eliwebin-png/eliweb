'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push('/admin');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoText}>ELIWEB</span>
          <span style={styles.badge}>ADMIN</span>
        </div>
        <h1 style={styles.heading}>Sign in to Dashboard</h1>
        <p style={styles.sub}>Enter your admin credentials to continue.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="admin@eliweb.in"
              autoComplete="email"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#111',
    border: '1px solid #222',
    borderRadius: 12,
    padding: '2.5rem 2rem',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '0.05em',
  },
  badge: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#0066FF',
    background: 'rgba(0,102,255,0.12)',
    padding: '2px 8px',
    borderRadius: 4,
    letterSpacing: '0.08em',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 6px',
  },
  sub: {
    fontSize: '0.875rem',
    color: '#888',
    margin: '0 0 24px',
  },
  error: {
    background: 'rgba(255,59,48,0.1)',
    border: '1px solid rgba(255,59,48,0.3)',
    color: '#ff6b6b',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: '0.85rem',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#ccc',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #333',
    background: '#0a0a0a',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
  },
  button: {
    marginTop: 8,
    padding: '12px',
    borderRadius: 8,
    border: 'none',
    background: '#0066FF',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

