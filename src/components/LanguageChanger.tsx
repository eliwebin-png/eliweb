'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, supportedLanguages, LanguageOption } from '@/context/LanguageContext';

export default function LanguageChanger() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="language-changer-container" ref={containerRef}>
      <button
        type="button"
        className="language-trigger-pill"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${currentLang.name}. Click to change language.`}
      >
        <span className="lang-flag-frame">
          <img
            src={currentLang.flag}
            alt={currentLang.name}
            className="lang-flag-img"
            width={20}
            height={14}
          />
        </span>
        <span className="lang-current-code">{currentLang.code}</span>
        <svg
          className={`lang-chevron ${isOpen ? 'is-open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown-menu" role="listbox">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={currentLang.code === lang.code}
              className={`lang-option-row ${currentLang.code === lang.code ? 'is-active' : ''}`}
              onClick={() => handleSelect(lang)}
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="lang-option-flag"
                width={18}
                height={13}
              />
              <span className="lang-option-name">{lang.name}</span>
              <span className="lang-option-code">{lang.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
