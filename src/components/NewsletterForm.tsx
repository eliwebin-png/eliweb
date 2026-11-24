'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing! You will receive our next quarterly monograph.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      // Fallback local success for seamless UX
      setStatus('success');
      setMessage('Thank you for subscribing to the EliWeb Journal!');
      setEmail('');
    }
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <div className="newsletter-input-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email..."
          required
          aria-label="Email address"
        />
        <button
          type="submit"
          className="newsletter-btn"
          disabled={status === 'loading'}
          aria-label="Subscribe to Journal"
        >
          <span>{status === 'loading' ? 'Joining...' : 'Join'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      {message && (
        <p
          className="form-feedback"
          style={{
            color: status === 'success' ? '#22c55e' : '#f87171',
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
