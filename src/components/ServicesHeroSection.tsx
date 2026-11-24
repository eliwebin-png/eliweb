'use client';

import React from 'react';
import Link from 'next/link';

export default function ServicesHeroSection() {
  return (
    <section className="srv-hero-section" aria-label="Services Platform Hero">
      {/* Ambient Radial Background Glows */}
      <div className="srv-ambient-glow srv-glow-blue" aria-hidden="true" />
      <div className="srv-ambient-glow srv-glow-mint" aria-hidden="true" />

      <div className="container srv-hero-container">
        <div className="srv-hero-grid">

          {/* Left Column: Headlines & Actions */}
          <div className="srv-hero-left">
            {/* Version 2.0 Pill Badge */}
            <div className="srv-hero-pill">
              <span className="srv-pill-dot" />
              <span className="srv-pill-badge">New</span>
              <span className="srv-pill-text">Version 2.0 is here!</span>
              <span className="srv-pill-chevron">&rsaquo;</span>
            </div>

            {/* Main Headline */}
            <h1 className="srv-hero-title">
              Organize your work,
              <br />
              <span className="srv-hero-title-blue">Get more done.</span>
            </h1>

            {/* Subtitle */}
            <p className="srv-hero-desc">
              The all-in-one productivity platform to manage tasks, collaborate with your team and achieve more.
            </p>

            {/* Action Buttons */}
            <div className="srv-hero-ctas">
              <Link href="/contact" className="srv-btn-primary">
                <span>Start Free Trial</span>
                <span className="srv-btn-arrow">&rarr;</span>
              </Link>

              <Link href="#digital-ecosystem" className="srv-btn-secondary">
                <span className="srv-play-icon">▶</span>
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Social Proof Avatars */}
            <div className="srv-hero-social">
              <div className="srv-avatar-stack">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Team User 1"
                  className="srv-avatar"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Team User 2"
                  className="srv-avatar"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Team User 3"
                  className="srv-avatar"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Team User 4"
                  className="srv-avatar"
                  loading="lazy"
                />
              </div>
              <div className="srv-social-text">
                <div className="srv-stars">★★★★★</div>
                <span>4.9/5 from 200+ fast-growing teams</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Laptop, Phone & Floating 3D Badges */}
          <div className="srv-hero-visual-stage">

            {/* Soft Ambient Stage Glow */}
            <div className="srv-stage-backdrop-glow" aria-hidden="true" />

            {/* 1. Floating 3D Checkmark Badge (Top-Left above laptop) */}
            <div className="srv-floating-card card-check" title="Verified Execution">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* 2. Floating 3D Growth Chart Badge (Top-Right above laptop) */}
            <div className="srv-floating-card card-chart" title="Analytics & Growth">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="6" y1="20" x2="6" y2="15" />
              </svg>
            </div>

            {/* 3. Floating 3D Team Collaboration Badge (Bottom-Left of laptop) */}
            <div className="srv-floating-card card-team" title="Team Collaboration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            {/* Central Laptop Showcase */}
            <div className="srv-laptop-wrapper">
              <div className="srv-laptop-chassis">

                {/* Laptop Bezel Top with Webcam */}
                <div className="srv-laptop-topbar">
                  <span className="srv-webcam-dot" />
                </div>

                {/* Laptop Screen Dashboard Display */}
                <div className="srv-laptop-screen">
                  {/* Dashboard Sidebar */}
                  <div className="srv-dash-sidebar">
                    <div className="srv-dash-brand-icon">E</div>
                    <div className="srv-dash-nav-icon active">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </div>
                    <div className="srv-dash-nav-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="srv-dash-nav-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <div className="srv-dash-nav-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                  </div>

                  {/* Dashboard Main Workspace */}
                  <div className="srv-dash-main">
                    {/* Top Navigation Row */}
                    <div className="srv-dash-header">
                      <div className="srv-dash-search">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span>Search tasks or projects...</span>
                      </div>
                      <div className="srv-dash-header-actions">
                        <span className="srv-status-chip">● Live Production</span>
                        <div className="srv-user-avatar">EB</div>
                      </div>
                    </div>

                    {/* Dashboard Workspace Grid */}
                    <div className="srv-dash-body">
                      {/* Left: Wave Chart Card */}
                      <div className="srv-dash-chart-card">
                        <div className="srv-card-title-row">
                          <div>
                            <span className="srv-card-label">Workflow Velocity</span>
                            <div className="srv-card-val">84.2% <small>↗ +14%</small></div>
                          </div>
                          <span className="srv-card-tag">Monthly</span>
                        </div>

                        {/* Interactive Vector Curve */}
                        <svg className="srv-dash-svg-chart" viewBox="0 0 240 70" fill="none">
                          <defs>
                            <linearGradient id="srvWaveGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0 50 Q 30 30, 60 42 T 120 22 T 180 32 T 240 12"
                            stroke="#2563eb"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                          <path
                            d="M0 50 Q 30 30, 60 42 T 120 22 T 180 32 T 240 12 L 240 70 L 0 70 Z"
                            fill="url(#srvWaveGrad)"
                          />
                        </svg>
                      </div>

                      {/* Right: Dark Heroic Feature Tile (Matches reference!) */}
                      <div className="srv-dash-hero-tile">
                        <div className="srv-hero-tile-badge">★ Pro Features</div>
                        <div className="srv-hero-tile-title">Automate Everything</div>
                        <div className="srv-hero-tile-bars">
                          <span style={{ width: '85%' }} />
                          <span style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Modern Task & Status Cards */}
                    <div className="srv-dash-bottom-row">
                      <div className="srv-task-pill">
                        <span className="srv-task-check">✓</span>
                        <span className="srv-task-name">Web Architecture & Deployment</span>
                        <span className="srv-tag-success">Complete</span>
                      </div>
                      <div className="srv-task-pill">
                        <span className="srv-task-dot" />
                        <span className="srv-task-name">Cloud Microservices Scaling</span>
                        <span className="srv-tag-progress">In Sprint</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Silver Base Lip & Hinge */}
              <div className="srv-laptop-base">
                <div className="srv-laptop-notch" />
              </div>
            </div>

            {/* Overlapping Smartphone Mockup (Right Foreground) */}
            <div className="srv-phone-mockup">
              <div className="srv-phone-bezel">
                {/* Speaker Notch */}
                <div className="srv-phone-notch" />

                {/* Phone Screen */}
                <div className="srv-phone-screen">
                  {/* Phone Top Header */}
                  <div className="srv-phone-header">
                    <span>9:41</span>
                    <div className="srv-phone-icons">
                      <span>●●●</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Phone Inner Cards */}
                  <div className="srv-phone-content">
                    <div className="srv-phone-user-chip">
                      <div className="srv-phone-avatar">JD</div>
                      <div>
                        <strong>Alex Morgan</strong>
                        <small>Product Lead</small>
                      </div>
                    </div>

                    <div className="srv-phone-card">
                      <span className="srv-phone-card-label">Active Sprint</span>
                      <strong className="srv-phone-card-metric">18 / 20 Tasks</strong>
                      <div className="srv-phone-bar">
                        <div className="srv-phone-bar-fill" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div className="srv-phone-card">
                      <span className="srv-phone-card-label">Conversion Rate</span>
                      <strong className="srv-phone-card-metric">+34.8%</strong>
                    </div>

                    {/* Green Action Button (Matches reference screenshot!) */}
                    <div className="srv-phone-cta-button">
                      <span>Complete Task</span>
                      <span>✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

