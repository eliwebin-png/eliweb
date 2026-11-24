'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageChanger from './LanguageChanger';

interface HeaderNavProps {
  onOpenModal?: () => void;
  alwaysVisible?: boolean;
}

export default function HeaderNav({ onOpenModal, alwaysVisible = false }: HeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If not always visible and not scrolled, do not render
  if (!alwaysVisible && !scrolled) {
    return null;
  }

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className={`site-header scrolled ${alwaysVisible ? 'always-visible' : ''}`} id="header">
      <div className="container header-inner">
        {/* 1. Left: Standalone Logo */}
        <Link href="/" className="hero-nav-logo-standalone" aria-label="EliWeb Home">
          <div style={{ position: 'relative', width: 52, height: 52 }}>
            <Image
              src="/eliweb-logo.png"
              alt="EliWeb Logo"
              fill
              sizes="52px"
              className="logo-img"
              priority
            />
          </div>
        </Link>

        {/* 2. Center: Clean Navigation Links (About us, Service, Portfolio, Blog) */}
        <nav className={`scrolled-nav-links ${mobileOpen ? 'is-open' : ''}`} aria-label="Main Navigation">
          <Link
            href="/about"
            className={`scrolled-nav-link ${isLinkActive('/about') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {t('nav.about', 'About us')}
          </Link>
          <Link
            href="/services"
            className={`scrolled-nav-link ${isLinkActive('/services') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {t('nav.services', 'Service')}
          </Link>
          <Link
            href="/portfolio"
            className={`scrolled-nav-link ${isLinkActive('/portfolio') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {t('nav.portfolio', 'Portfolio')}
          </Link>
          <Link
            href="/blog"
            className={`scrolled-nav-link ${isLinkActive('/blog') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {t('nav.blog', 'Blog')}
          </Link>
          <Link
            href="/contact"
            className="scrolled-quote-btn"
            onClick={() => setMobileOpen(false)}
          >
            <span>{t('nav.demo', 'Get a Free Demo')}</span>
            <span className="quote-arrow-icon">&rarr;</span>
          </Link>
        </nav>

        {/* 3. Right: Language Changer */}
        <div className="header-actions">
          <div className="hero-nav-lang-slot">
            <LanguageChanger />
          </div>

          <button
            className={`mobile-toggle ${mobileOpen ? 'is-active' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
