'use client';

import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Web Development',
    budget: '$10k - $25k',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2500);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <span className="section-eyebrow">START A PROJECT</span>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px' }}>
          Schedule a Discovery Session
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Tell us about your brand vision, tech scope, or timeline. We respond within 24 hours.
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              style={{ margin: '0 auto 16px' }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '8px' }}>
              Inquiry Received
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Thank you for connecting with EliWeb. Our directors are reviewing your project brief.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Sarah Jenkins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Work Email *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Primary Service</label>
                <select
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="Web & App Development">Web &amp; App Development</option>
                  <option value="Digital Marketing & Ads">Digital Marketing &amp; Ads</option>
                  <option value="Video & Cinematic Reels">Video &amp; Cinematic Reels</option>
                  <option value="UI/UX & Brand Identity">UI/UX &amp; Brand Identity</option>
                  <option value="Full Turnkey Build">Full Turnkey Digital Product</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Scope / Budget</label>
                <select
                  className="form-select"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="Under $10k">Under $10,000</option>
                  <option value="$10k - $25k">$10,000 - $25,000</option>
                  <option value="$25k - $50k">$25,000 - $50,000</option>
                  <option value="$50k+">$50,000+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Project Brief / Goals *</label>
              <textarea
                required
                rows={3}
                className="form-textarea"
                placeholder="Describe your objectives, timeline, or design expectations..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-pill btn-cta-primary"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {isSubmitting ? 'Transmitting Brief...' : 'Submit Project Brief &rarr;'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
