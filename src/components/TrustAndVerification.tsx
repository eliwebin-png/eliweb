'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const platforms = [
  {
    name: 'Trustpilot',
    logo: (
      <div className="tav-trustpilot-logo">
        <Image
          src="/trustpilot-star.png"
          alt="Trustpilot Star"
          width={48}
          height={48}
          className="tav-trustpilot-img"
        />
        <span className="tav-trustpilot-text">Trustpilot</span>
      </div>
    ),
    rating: '★★★★★',
    description: 'Rated Excellent\non Trustpilot',
    color: '#00B67A',
  },
  {
    name: 'Upwork',
    logo: (
      <Image
        src="/upwork.webp"
        alt="Upwork"
        width={56}
        height={56}
        className="tav-upwork-img"
      />
    ),
    rating: 'Verified Freelancer',
    description: 'Top Rated on Upwork',
    color: '#14A800',
  },
  {
    name: 'Google Reviews',
    logo: (
      <Image
        src="/google-rate.png"
        alt="Google Reviews"
        width={180}
        height={48}
        className="tav-google-img"
      />
    ),
    rating: '★★★★★',
    description: '5.0 Rating on\nGoogle Reviews',
    color: '#F4B400',
  },
  {
    name: 'Clutch',
    logo: (
      <Image
        src="/clutch.svg"
        alt="Clutch"
        width={120}
        height={40}
        className="tav-google-img"
      />
    ),
    rating: '★★★★★',
    description: '5.0 Rating on\nClutch',
    color: '#E83232',
  },
];

export default function TrustAndVerification() {
  return (
    <section className="tav-section" aria-label="Trusted and Verified Platforms">
      {/* Background Ambient Glows */}
      <div className="tav-ambient-left" aria-hidden="true" />
      <div className="tav-ambient-right" aria-hidden="true" />

      <div className="tav-container">
        {/* Heading */}
        <div className="tav-heading">
          <div className="tav-shield-row">
            <span className="tav-shield-line" />
            <ShieldCheck className="tav-shield-icon" strokeWidth={1.5} />
            <span className="tav-shield-line" />
          </div>

          <h2 className="tav-title">
            Trusted &amp; <span className="tav-title-highlight">Verified</span>
          </h2>

          <p className="tav-subtitle">
            Your trust matters to us. We are registered, verified, and recognized on leading global platforms and government portals.
          </p>
        </div>

        {/* Review Platform Cards */}
        <div className="tav-cards-grid">
          {platforms.map((platform) => (
            <div key={platform.name} className="tav-card">
              {/* Logo */}
              <div className="tav-card-logo">
                {platform.logo}
              </div>

              {/* Rating */}
              {platform.rating === 'Verified Freelancer' ? (
                <div className="tav-rating-badge">
                  <CheckCircle2 className="tav-check-icon" />
                  <span>{platform.rating}</span>
                </div>
              ) : (
                <div
                  className="tav-rating-stars"
                  style={{ color: platform.color }}
                >
                  {platform.rating}
                </div>
              )}

              <p className="tav-card-desc">
                {platform.description}
              </p>
            </div>
          ))}
        </div>

        {/* Government Registrations Banner */}
        <div className="tav-gov-banner">
          <div className="tav-gov-grid">
            {/* 1. Make in India */}
            <div className="tav-gov-item">
              <div className="tav-gov-logo-box">
                <Image
                  src="/pngwing_com.avif"
                  alt="Make in India"
                  width={130}
                  height={85}
                  className="tav-gov-img"
                />
              </div>
              <div className="tav-gov-text">
                <span className="tav-gov-title-sm">Made in India</span>
                <span className="tav-gov-caption">Atmanirbhar Bharat</span>
              </div>
            </div>

            {/* 2. MSME */}
            <div className="tav-gov-item">
              <div className="tav-gov-logo-box">
                <Image
                  src="/msme.png"
                  alt="MSME Registration"
                  width={110}
                  height={85}
                  className="tav-gov-img"
                />
              </div>
              <div className="tav-gov-text">
                <span className="tav-gov-title-sm">MSME</span>
                <div className="tav-gov-status-row">
                  <CheckCircle2 className="tav-check-icon-sm" />
                  <span className="tav-gov-status-text">Registered Entity</span>
                </div>
              </div>
            </div>

            {/* 3. Ministry of Corporate Affairs (MCA) */}
            <div className="tav-gov-item">
              <div className="tav-gov-logo-box">
                <Image
                  src="/mca-india.jpg"
                  alt="Ministry of Corporate Affairs - Government of India"
                  width={170}
                  height={85}
                  className="tav-gov-img"
                  style={{ borderRadius: '6px' }}
                />
              </div>
              <div className="tav-gov-text">
                <span className="tav-gov-title-sm">Ministry of Corporate Affairs</span>
                <div className="tav-gov-status-row">
                  <CheckCircle2 className="tav-check-icon-sm" />
                  <span className="tav-gov-status-text">Govt. of India Recognized</span>
                </div>
              </div>
            </div>

            {/* 4. DPIIT #startupindia */}
            <div className="tav-gov-item">
              <div className="tav-gov-logo-box">
                <Image
                  src="/dpiit-startupindia.png"
                  alt="DPIIT #startupindia"
                  width={180}
                  height={80}
                  className="tav-gov-img"
                />
              </div>
              <div className="tav-gov-text">
                <span className="tav-gov-title-sm">DPIIT &bull; #startupindia</span>
                <div className="tav-gov-status-row">
                  <CheckCircle2 className="tav-check-icon-sm" />
                  <span className="tav-gov-status-text">Recognized Startup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
