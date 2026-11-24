'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface ClientItem {
  id: string;
  name: string;
  logoUrl: string;
}

const DEFAULT_CLIENTS: ClientItem[] = [
  {
    id: 'client-college-education',
    name: 'College of Education Aligarh',
    logoUrl: '/clients/college-of-education.png',
  },
  {
    id: 'client-bfs',
    name: 'Bihar Fashion Science Institute',
    logoUrl: '/clients/bfs-institute.png',
  },
  {
    id: 'client-phular',
    name: 'Phular IVF',
    logoUrl: '/clients/phular-ivf.png',
  },
  {
    id: 'client-udayani',
    name: 'Udayani Hospital',
    logoUrl: '/clients/udayani-hospital.png',
  },
  {
    id: 'client-tvs',
    name: 'TVS Motor',
    logoUrl: '/clients/tvs-motor.png',
  },
  {
    id: 'client-shaktisudha',
    name: 'Shaktisudha Gorgonnut',
    logoUrl: '/clients/shaktisudha.png',
  },
  {
    id: 'client-gaharwar',
    name: 'Gaharwar Global',
    logoUrl: '/clients/gaharwar-global.png',
  },
  {
    id: 'client-gidhaur',
    name: 'Gidhaur Central School',
    logoUrl: '/clients/gidhaur-central-school.jpg',
  },
];

interface PreviousClientsSectionProps {
  clients?: ClientItem[];
  onOpenModal?: () => void;
}

export default function PreviousClientsSection({
  clients: customClients,
  onOpenModal,
}: PreviousClientsSectionProps) {
  const clientsList = customClients && customClients.length > 0 ? customClients : DEFAULT_CLIENTS;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll indicators and active dot on scroll
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      if (progress < 0.33) {
        setActiveDot(0);
      } else if (progress < 0.66) {
        setActiveDot(1);
      } else {
        setActiveDot(2);
      }
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToDot = (dotIndex: number) => {
    if (!trackRef.current) return;
    const { scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (maxScroll / 2) * dotIndex;
    trackRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(dotIndex);
  };

  // Auto-scroll carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trackRef.current.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="our-clients-modern-section" id="clients" aria-label="Our Clients">
      {/* Background Decorative Ambient Shapes */}
      <div className="clients-ambient-glow-tl" aria-hidden="true" />
      <div className="clients-ambient-glow-br" aria-hidden="true" />
      <div className="clients-dot-matrix-tr" aria-hidden="true" />
      <div className="clients-dot-matrix-bl" aria-hidden="true" />

      <div className="our-clients-container">
        {/* Top Centered Header with Flanking Divider Lines */}
        <div className="clients-top-header-row">
          <div className="clients-header-line-left" />
          
          <div className="clients-trust-pill-badge">
            <span className="clients-trust-handshake" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 17a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1h-4Z" />
                <path d="m18 10 3.5-3.5a2.12 2.12 0 0 0-3-3L15 7" />
                <path d="m6 10-3.5-3.5a2.12 2.12 0 0 1 3-3L9 7" />
                <path d="M14 11V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2" />
                <path d="M10 21v-2" />
                <path d="M14 21v-2" />
              </svg>
            </span>
            <span className="clients-trust-text">Trusted by Leading Organizations</span>
          </div>

          <div className="clients-header-line-right" />
        </div>

        {/* Section Heading: Our Clients */}
        <h2 className="our-clients-title">
          Our <span className="clients-title-gradient">Clients</span>
        </h2>

        {/* Carousel Slider with Navigation Arrows */}
        <div className="our-clients-slider-wrapper">
          {/* Left Arrow Button */}
          <button
            type="button"
            className={`clients-arrow-btn clients-arrow-prev ${!canScrollLeft ? 'arrow-inactive' : ''}`}
            onClick={() => scrollByDirection('left')}
            aria-label="Previous clients"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Cards Scroll Track */}
          <div className="our-clients-scroll-track" ref={trackRef}>
            {clientsList.map((client) => (
              <div key={client.id} className="client-white-card" title={client.name}>
                <div className="client-white-card-inner">
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    width={130}
                    height={100}
                    className="client-card-logo-img"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            className={`clients-arrow-btn clients-arrow-next ${!canScrollRight ? 'arrow-inactive' : ''}`}
            onClick={() => scrollByDirection('right')}
            aria-label="Next clients"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots (3 Dots matching the design) */}
        <div className="clients-pagination-dots" role="tablist" aria-label="Client slides">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              className={`clients-dot ${activeDot === idx ? 'clients-dot-active' : ''}`}
              onClick={() => scrollToDot(idx)}
              aria-label={`Go to slide group ${idx + 1}`}
              aria-selected={activeDot === idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
