'use client';

import React from 'react';
import Image from 'next/image';

export interface TechItem {
  id?: string;
  name: string;
  logoUrl?: string;
}

// Built-in SVG logos for top tools
function TechLogo({ name }: { name: string }) {
  const lower = name.toLowerCase().trim();

  if (lower.includes('html')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#E34F26" d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" />
        <path fill="#EF652A" d="M12 3.7v16.9l5.8-1.8 1.4-15.1H12z" />
        <path fill="#EBEBEB" d="M12 8.1H8.5l-.2-2.4H12V3.7H6.2l.7 8.2H12V8.1zm0 6.6l-3.3-1-.2-2.3H6.4l.4 4.5L12 17.5v-2.8z" />
        <path fill="#FFFFFF" d="M12 8.1h3.5l-.3 3.8H12v2.4h3.2l-.3 3.6-2.9.9v2.7l5.2-1.6.7-8.1H12V8.1zm0-4.4v2H17.8l.2-2H12z" />
      </svg>
    );
  }

  if (lower.includes('css')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#1572B6" d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" />
        <path fill="#33A9DC" d="M12 3.7v16.9l5.8-1.8 1.4-15.1H12z" />
        <path fill="#EBEBEB" d="M12 8.1H8.5l-.2-2.4H12V3.7H6.2l.7 8.2H12V8.1zm0 6.6l-3.3-1-.2-2.3H6.4l.4 4.5L12 17.5v-2.8z" />
        <path fill="#FFFFFF" d="M12 8.1h3.5l-.3 3.8H12v2.4h3.2l-.3 3.6-2.9.9v2.7l5.2-1.6.7-8.1H12V8.1zm0-4.4v2H17.8l.2-2H12z" />
      </svg>
    );
  }

  if (lower.includes('javascript') || lower === 'js') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path fill="#000000" d="M6.5 17.2l1.7-1c.4.7.7 1.2 1.5 1.2.8 0 1.3-.3 1.3-1.5v-6.3h2.1v6.3c0 2.3-1.3 3.3-3.2 3.3-1.7 0-2.8-.9-3.4-2zm8.5-.1l1.7-1c.5.8 1.1 1.4 2.2 1.4 1 0 1.6-.5 1.6-1.2 0-.8-.7-1.1-1.8-1.6l-.6-.3c-1.8-.8-3-1.7-3-3.7 0-1.8 1.4-3.3 3.6-3.3 1.6 0 2.7.5 3.5 1.9l-1.6 1c-.4-.7-.8-1-1.8-1-.8 0-1.4.5-1.4 1.1 0 .7.5 1 1.6 1.5l.6.3c2.1.9 3.3 1.8 3.3 3.9 0 2.2-1.7 3.5-3.9 3.5-2.2 0-3.5-1.1-4.1-2.5z" />
      </svg>
    );
  }

  if (lower.includes('react')) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.6" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2.2" fill="#00D8FF" />
      </svg>
    );
  }

  if (lower.includes('canva')) {
    return (
      <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#00C4CC" />
        <text x="12" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontStyle="italic">
          Canva
        </text>
      </svg>
    );
  }

  if (lower.includes('wordpress')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#21759B" />
        <path fill="#FFFFFF" d="M3.2 12c0 3.7 2.3 6.9 5.6 8.2L4.6 8.7C3.7 9.7 3.2 10.8 3.2 12zm13.1-.6c0-1.2-.4-2-.8-2.7-.5-.8-1-1.5-1-2.3 0-.9.7-1.8 1.7-1.8.1 0 .2 0 .3.1C15 3.6 13.6 3.1 12 3.1c-2.9 0-5.5 1.5-7 3.8.3 0 .7.1 1 .1 1.6 0 4.1-.2 4.1-.2.8-.1.9 1.1.1 1.2 0 0-.8.1-1.7.1l5.4 16.1 3.2-9.7-2.3-6.4c-.8 0-1.5-.1-1.5-.1-.8-.1-.7-1.3.1-1.2 0 0 2.5.2 4 .2 1.6 0 4.1-.2 4.1-.2.8-.1.9 1.1.1 1.2 0 0-.8.1-1.7.1l5.3 15.9c2.3-1.6 3.8-4.3 3.8-7.3 0-1.8-.5-3.5-1.4-4.9z" />
      </svg>
    );
  }

  if (lower.includes('photoshop')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#001E36" />
        <path fill="#31A8FF" d="M6.5 7h4c1.8 0 3.2 1.1 3.2 2.8 0 1.8-1.4 2.9-3.2 2.9H8.7v4.3H6.5V7zm2.2 4h1.7c.8 0 1.4-.4 1.4-1.2 0-.7-.6-1.1-1.4-1.1H8.7V11zm7.7 3.5c.7.4 1.6.7 2.4.7.9 0 1.4-.4 1.4-.9 0-.6-.5-.8-1.5-1.2-1.4-.5-2.3-1.2-2.3-2.4 0-1.5 1.2-2.5 3-2.5.9 0 1.7.2 2.3.6l-.6 1.4c-.5-.3-1.1-.5-1.8-.5-.8 0-1.2.4-1.2.8 0 .5.5.8 1.5 1.2 1.4.5 2.3 1.2 2.3 2.5 0 1.6-1.2 2.6-3.2 2.6-1 0-2.1-.3-2.8-.8l.5-1.5z" />
      </svg>
    );
  }

  if (lower.includes('figma')) {
    return (
      <svg width="18" height="24" viewBox="0 0 38 57" aria-hidden="true">
        <path fill="#F24E1E" d="M19 28.5A9.5 9.5 0 0 1 9.5 19 9.5 9.5 0 0 1 19 9.5h9.5v19H19z" />
        <path fill="#FF7262" d="M9.5 9.5A9.5 9.5 0 0 1 19 0h9.5v19H19a9.5 9.5 0 0 1-9.5-9.5z" />
        <path fill="#A259FF" d="M9.5 28.5A9.5 9.5 0 0 1 19 19h9.5v19H19a9.5 9.5 0 0 1-9.5-9.5z" />
        <path fill="#1ABCFE" d="M9.5 47.5A9.5 9.5 0 0 1 0 38a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 0 1-9.5 9.5z" />
        <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 0 9.5 57 9.5 9.5 0 0 0 19 47.5V38H9.5A9.5 9.5 0 0 0 0 47.5z" />
      </svg>
    );
  }

  if (lower.includes('after effects')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#00005B" />
        <path fill="#9999FF" d="M5.5 17l3.6-10h1.8l3.6 10h-2.1l-.8-2.4H8.4L7.6 17H5.5zm3.5-4h2l-1-3.2-1 3.2zm6.7-.4c0-2.4 1.6-3.8 3.8-3.8 2 0 3.4 1.3 3.6 3.1h-5.4c.1 1.2.9 2 2.1 2 .8 0 1.5-.3 2-.8l1.1 1.1c-.8.9-2 1.4-3.3 1.4-2.4 0-3.9-1.4-3.9-3zm5.4-1.2c-.1-1-.8-1.6-1.7-1.6-.9 0-1.6.6-1.7 1.6h3.4z" />
      </svg>
    );
  }

  if (lower.includes('illustrator')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#330000" />
        <path fill="#FF9A00" d="M5.5 17l3.6-10h1.8l3.6 10h-2.1l-.8-2.4H8.4L7.6 17H5.5zm3.5-4h2l-1-3.2-1 3.2zm7.2-6.5h2.2V8h-2.2V6.5zm0 3.5h2.2v7h-2.2v-7z" />
      </svg>
    );
  }

  if (lower.includes('next.js') || lower === 'next') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#000000" />
        <path fill="#FFFFFF" d="M14.9 16.5l-5.7-7.4v7.4H7.4V7.5h1.8l5.7 7.4V7.5h1.8v9h-1.8z" />
      </svg>
    );
  }

  if (lower.includes('typescript') || lower === 'ts') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path fill="#FFFFFF" d="M5 8h6v1.8H8.9v6.7H7.1V9.8H5V8zm7.5 5.5l1.6-.9c.4.6.9 1 1.7 1 .7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.3-1.1-1.3-.5-2.1-1.1-2.1-2.2 0-1.2 1-2.1 2.5-2.1 1.1 0 1.9.4 2.5 1.3l-1.4.9c-.3-.5-.7-.7-1.1-.7-.5 0-.8.3-.8.6 0 .4.4.6 1.3.9 1.4.5 2.2 1.1 2.2 2.3 0 1.4-1.1 2.3-2.7 2.3-1.6 0-2.6-.7-3.1-1.6z" />
      </svg>
    );
  }

  // Default fallback badge
  return (
    <div style={{ width: 22, height: 22, borderRadius: 6, background: '#0066FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// Single Pill Card
function TechCard({ item }: { item: TechItem }) {
  return (
    <div className="tech-marquee-card">
      <div className="tech-marquee-icon">
        {item.logoUrl ? (
          <Image
            src={item.logoUrl}
            alt={item.name}
            width={24}
            height={24}
            className="tech-custom-logo"
            unoptimized
          />
        ) : (
          <TechLogo name={item.name} />
        )}
      </div>
      <span className="tech-marquee-name">{item.name}</span>
    </div>
  );
}

// Default items matching user's exact uploaded image
const DEFAULT_ROW_1: TechItem[] = [
  { name: 'Illustrator' },
  { name: 'Canva' },
  { name: 'HTML' },
  { name: 'CSS' },
  { name: 'JavaScript' },
  { name: 'React' },
  { name: 'WordPress' },
  { name: 'Next.js' },
];

const DEFAULT_ROW_2: TechItem[] = [
  { name: 'Illustrator' },
  { name: 'Photoshop' },
  { name: 'Figma' },
  { name: 'After Effects' },
  { name: 'WordPress' },
  { name: 'React' },
  { name: 'JavaScript' },
  { name: 'TypeScript' },
];

export default function TechnologyTicker({ tools }: { tools?: TechItem[] }) {
  // If custom tools passed from database, split into two rows
  let row1 = DEFAULT_ROW_1;
  let row2 = DEFAULT_ROW_2;

  if (tools && tools.length >= 4) {
    const half = Math.ceil(tools.length / 2);
    row1 = tools.slice(0, half);
    row2 = tools.slice(half);
  }

  // Duplicate for seamless infinite loop
  const loopRow1 = [...row1, ...row1, ...row1];
  const loopRow2 = [...row2, ...row2, ...row2];

  return (
    <div className="tech-ticker-container" aria-label="Technology & Tool Stack">
      {/* Edge Gradient Mask Overlays */}
      <div className="tech-ticker-mask">
        {/* Row 1 (Scrolls Left) */}
        <div className="tech-ticker-row tech-scroll-left">
          <div className="tech-ticker-track">
            {loopRow1.map((item, idx) => (
              <TechCard key={`r1-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2 (Scrolls Right / Offset Left) */}
        <div className="tech-ticker-row tech-scroll-right">
          <div className="tech-ticker-track">
            {loopRow2.map((item, idx) => (
              <TechCard key={`r2-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

