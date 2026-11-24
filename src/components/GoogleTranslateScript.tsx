'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Keep body at top: 0 if Google Translate tries to push it down
    const resetBodyTop = () => {
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
    };

    const observer = new MutationObserver(resetBodyTop);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    // Define global initialization function for Google Translate
    (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit = function () {
      const win = window as unknown as {
        google?: {
          translate?: {
            TranslateElement?: {
              new (
                options: {
                  pageLanguage: string;
                  includedLanguages: string;
                  layout?: unknown;
                  autoDisplay: boolean;
                },
                elementId: string
              ): unknown;
              InlineLayout?: { SIMPLE: unknown };
            };
          };
        };
      };

      if (win.google?.translate?.TranslateElement) {
        new win.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,de,fr,es,hi',
            layout: win.google.translate.TranslateElement.InlineLayout?.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Positioned off-screen instead of display:none so Google Translate computes layout and mounts the .goog-te-combo dropdown */}
      <div
        id="google_translate_element"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
