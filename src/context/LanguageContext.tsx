'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface LanguageOption {
  code: string;
  googleCode: string;
  name: string;
  flag: string;
}

export const supportedLanguages: LanguageOption[] = [
  { code: 'EN', googleCode: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  { code: 'DE', googleCode: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w40/de.png' },
  { code: 'FR', googleCode: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: 'ES', googleCode: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
  { code: 'HI', googleCode: 'hi', name: 'हिन्दी / Hindi', flag: 'https://flagcdn.com/w40/in.png' },
];

// No hardcoded dictionary — Google Translate handles all translations on the DOM.

interface LanguageContextType {
  currentLang: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: supportedLanguages[0],
  setLanguage: () => {},
  t: (_key, fallback) => fallback || '',
});

/**
 * Triggers Google Translate by finding the hidden .goog-te-combo <select>
 * and dispatching a native change event on it.
 */
function triggerGoogleTranslate(langCode: string) {
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<LanguageOption>(supportedLanguages[0]);

  // On mount, restore the saved language preference from cookie or localStorage
  useEffect(() => {
    try {
      // 1. Check active Google Translate cookie first
      const cookieMatch = document.cookie.match(/googtrans=\/(?:auto|en)\/([a-zA-Z-]+)/i);
      const activeCode = cookieMatch ? cookieMatch[1].toLowerCase() : null;

      // 2. Check localStorage
      const savedCode = localStorage.getItem('eliweb_lang');

      const match = supportedLanguages.find(
        (l) =>
          (activeCode && l.googleCode.toLowerCase() === activeCode) ||
          (savedCode && l.code.toUpperCase() === savedCode.toUpperCase())
      );

      if (match) {
        setCurrentLangState(match);
      }
    } catch {
      // ignore in environments without localStorage
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageOption) => {
    setCurrentLangState(lang);
    try {
      localStorage.setItem('eliweb_lang', lang.code);

      const host = window.location.hostname;
      const domainParts = host.split('.');
      const rootDomain = domainParts.length > 1 ? '.' + domainParts.slice(-2).join('.') : '';

      const clearAllGoogTrans = () => {
        const paths = ['/', ''];
        const domains = ['', host, `.${host}`];
        if (rootDomain) domains.push(rootDomain);

        paths.forEach((p) => {
          domains.forEach((d) => {
            const domainAttr = d ? `; domain=${d}` : '';
            const pathAttr = p ? `; path=${p}` : '; path=/';
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathAttr}${domainAttr};`;
          });
        });
      };

      if (lang.googleCode === 'en') {
        clearAllGoogTrans();
        document.cookie = 'googtrans=/en/en; path=/;';
        window.location.reload();
        return;
      }

      clearAllGoogTrans();
      const googleTransVal = `/en/${lang.googleCode}`;
      document.cookie = `googtrans=${googleTransVal}; path=/;`;
      if (rootDomain) {
        document.cookie = `googtrans=${googleTransVal}; domain=${rootDomain}; path=/;`;
      }

      // Trigger translate combo if mounted
      triggerGoogleTranslate(lang.googleCode);

      // Reload to ensure Google Translate processes the entire DOM from the top
      window.location.reload();
    } catch (err) {
      console.error('Error changing language:', err);
    }
  }, []);

  // t() just returns the English fallback — Google Translate translates the rendered DOM text
  const t = useCallback((_key: string, fallback?: string): string => {
    return fallback || _key;
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
