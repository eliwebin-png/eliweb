'use client';

import React from 'react';

// ============================================================================
// 1. PAYMENT GATEWAYS & PROVIDER VECTOR BADGES (MATCHING REFERENCE IMAGE 1)
// ============================================================================

export function NetBankingIcon() {
  return (
    <svg viewBox="0 0 92 34" width="92" height="34" aria-label="Net Banking" fill="none">
      <rect x="1" y="2" width="90" height="30" rx="4" fill="#FFFFFF" stroke="#003366" strokeWidth="1.2" />
      {/* Blue 'Net' Box */}
      <rect x="5" y="6" width="34" height="22" rx="2.5" fill="#002D62" />
      <text x="22" y="21.5" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">
        Net
      </text>
      {/* 'Banking' Text */}
      <text x="63" y="21.5" fill="#002D62" fontSize="12" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">
        Banking
      </text>
    </svg>
  );
}

export function MastercardIcon() {
  return (
    <svg viewBox="0 0 58 36" width="58" height="36" aria-label="Mastercard" fill="none">
      <circle cx="21" cy="18" r="14" fill="#EB001B" />
      <circle cx="37" cy="18" r="14" fill="#F79E1B" fillOpacity="0.95" />
      <path
        d="M29 7.64a13.96 13.96 0 0 1 0 20.72 13.96 13.96 0 0 1 0-20.72z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function UpiIcon() {
  return (
    <svg viewBox="0 0 74 34" width="74" height="34" aria-label="UPI (Unified Payments Interface)" fill="none">
      <text x="3" y="25" fill="#2E3842" fontSize="21" fontWeight="900" fontStyle="italic" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">
        UPI
      </text>
      {/* Iconic Indian UPI dual arrow chevrons */}
      <polygon points="56,7 66,17 61,17 51,7" fill="#097939" />
      <polygon points="61,17 71,27 66,27 56,17" fill="#F26522" />
    </svg>
  );
}

export function MaestroIcon() {
  return (
    <svg viewBox="0 0 66 36" width="66" height="36" aria-label="Maestro" fill="none">
      <circle cx="23" cy="18" r="14" fill="#0061A8" />
      <circle cx="43" cy="18" r="14" fill="#EB001B" />
      <path
        d="M33 7.64a13.96 13.96 0 0 1 0 20.72 13.96 13.96 0 0 1 0-20.72z"
        fill="#742A88"
      />
      <text
        x="33"
        y="21"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        letterSpacing="-0.2"
      >
        Maestro
      </text>
    </svg>
  );
}

export function RuPayIcon() {
  return (
    <svg viewBox="0 0 78 34" width="78" height="34" aria-label="RuPay" fill="none">
      <text x="2" y="24" fill="#1C2F6A" fontSize="19" fontWeight="900" fontStyle="italic" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.3">
        RuPay
      </text>
      {/* RuPay green & orange dynamic wedges */}
      <polygon points="66,7 74,18 70,18 62,7" fill="#009E49" />
      <polygon points="70,18 78,28 74,28 66,18" fill="#F15A24" />
    </svg>
  );
}

export function GooglePayIcon() {
  return (
    <svg viewBox="0 0 76 34" width="76" height="34" aria-label="Google Pay" fill="none">
      {/* Google 4-Color 'G' */}
      <g transform="translate(4, 5)">
        <path d="M12 5.09c1.67 0 3.17.57 4.35 1.7l3.26-3.26C17.65 1.73 15.02.7 12 .7 7.42.7 3.5 3.3 1.54 7.07l3.8 2.95C6.23 7.17 8.87 5.09 12 5.09z" fill="#EA4335" />
        <path d="M23.5 12.27c0-.82-.07-1.61-.21-2.37H12v4.58h6.47c-.28 1.48-1.12 2.74-2.39 3.58v2.96h3.86c2.26-2.08 3.56-5.14 3.56-8.75z" fill="#4285F4" />
        <path d="M5.34 14.18c-.24-.71-.37-1.47-.37-2.27s.13-1.56.37-2.27V6.69H1.54C.56 8.64 0 10.85 0 13.18s.56 4.54 1.54 6.49l3.8-2.95-.04-2.54z" fill="#FBBC05" />
        <path d="M12 23.36c3.24 0 5.96-1.07 7.94-2.91l-3.86-2.96c-1.07.72-2.45 1.15-4.08 1.15-3.13 0-5.77-2.08-6.66-4.93H1.54v2.95C3.5 20.76 7.42 23.36 12 23.36z" fill="#34A853" />
      </g>
      {/* 'Pay' Text */}
      <text x="35" y="24" fill="#3C4043" fontSize="18" fontWeight="600" fontFamily="system-ui, -apple-system, sans-serif">
        Pay
      </text>
    </svg>
  );
}

export function PaytmIcon() {
  return (
    <svg viewBox="0 0 74 34" width="74" height="34" aria-label="Paytm" fill="none">
      <text x="2" y="24" fill="#002970" fontSize="21" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">
        pay
      </text>
      <text x="44" y="24" fill="#00BAF2" fontSize="21" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">
        tm
      </text>
    </svg>
  );
}

export function VisaIcon() {
  return (
    <svg viewBox="0 0 74 34" width="74" height="34" aria-label="VISA" fill="none">
      {/* Visa typography with gold wing */}
      <path
        d="M31.2 7.4h-5.2c-1.6 0-2.8.5-3.5 2.1l-9.9 23.6h5.8l1.2-3.3h7.1l.7 3.3h5.1l-4.6-25.7zm-8 17.6l2.9-7.9c-.1.1 1.7 4.6 2 5.5l1.1 2.4h-6zm23.8-17.6h-4.5c-1.4 0-2.5.8-3 2.1l-8.6 20.6h5.8l1.2-3.3h7.1l.7 3.3h5.1l-3.8-22.7zm-26.6 0l-5.6 15.6-.6-3c-1.1-3.6-4.4-7.5-8.2-9.5l5.3 20h5.8l8.6-23.1h-5.3z"
        fill="transparent"
      />
      {/* Clean crisp vector font representation */}
      <text x="6" y="25" fill="#1434CB" fontSize="24" fontWeight="900" fontStyle="italic" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">
        VISA
      </text>
      {/* Yellow wing on V */}
      <polygon points="5,8 10,8 6,15 3,12" fill="#F7B600" />
    </svg>
  );
}

// Payment Methods Grid Array
export const PAYMENT_METHODS = [
  { id: 'netbanking', name: 'Net Banking', component: NetBankingIcon },
  { id: 'mastercard', name: 'Mastercard', component: MastercardIcon },
  { id: 'upi', name: 'UPI', component: UpiIcon },
  { id: 'maestro', name: 'Maestro', component: MaestroIcon },
  { id: 'rupay', name: 'RuPay', component: RuPayIcon },
  { id: 'gpay', name: 'Google Pay', component: GooglePayIcon },
  { id: 'paytm', name: 'Paytm', component: PaytmIcon },
  { id: 'visa', name: 'VISA', component: VisaIcon },
];

export function PaymentBadgesGrid({ className = '' }: { className?: string }) {
  return (
    <div className={`payment-badges-grid ${className}`}>
      {PAYMENT_METHODS.map(({ id, name, component: IconComponent }) => (
        <div key={id} className="payment-badge-card" title={`Accepted: ${name}`}>
          <IconComponent />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 2. OFFICIAL MSME GOVT. OF INDIA BADGE (MATCHING REFERENCE IMAGE 2)
// ============================================================================

export function MsmeBadge({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  return (
    <div className={`msme-official-badge ${isDark ? 'msme-dark-theme' : 'msme-light-theme'}`}>
      {/* Left: State Emblem of India (Lion Capital) */}
      <div className="msme-emblem-wrap" title="State Emblem of India">
        <svg viewBox="0 0 60 76" width="46" height="58" aria-label="State Emblem of India" fill="none">
          {/* Central Ashoka Lions stylized heraldry */}
          <path
            d="M30 4c-3 0-5 2.5-5 5.5v1.2c-1.5-.4-3.2.3-3.8 1.8-.7 1.8-.1 3.8 1.4 4.8-.4 1.2-.2 2.5.5 3.5.8 1.1 2.2 1.7 3.5 1.5 1.2 1.5 3.2 2.4 5.2 2.4 2 0 4-.9 5.2-2.4 1.3.2 2.7-.4 3.5-1.5.7-1 .9-2.3.5-3.5 1.5-1 2.1-3 1.4-4.8-.6-1.5-2.3-2.2-3.8-1.8V9.5C38.6 6.5 36.6 4 30 4z"
            fill="currentColor"
          />
          {/* Left Lion Mane & Profile */}
          <path
            d="M17 14c-2.5 0-4.5 2-4.5 4.5 0 2 1.2 3.6 2.9 4.2-.3.9-.2 1.9.3 2.7.6.9 1.7 1.4 2.8 1.3 1 1.2 2.6 1.9 4.2 1.9V14h-5.7z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Right Lion Mane & Profile */}
          <path
            d="M43 14c2.5 0 4.5 2 4.5 4.5 0 2-1.2 3.6-2.9 4.2.3.9.2 1.9-.3 2.7-.6.9-1.7 1.4-2.8 1.3-1 1.2-2.6 1.9-4.2 1.9V14h5.7z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Abacus / Base platform */}
          <rect x="12" y="32" width="36" height="5" rx="1.5" fill="currentColor" />
          {/* Dharma Chakra (Wheel of Law) with 24 spokes motif */}
          <circle cx="30" cy="45" r="7.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="30" cy="45" r="2.2" fill="currentColor" />
          {/* Galloping Horse (Left) & Humped Bull (Right) motifs */}
          <circle cx="18" cy="45" r="3.2" fill="currentColor" opacity="0.8" />
          <circle cx="42" cy="45" r="3.2" fill="currentColor" opacity="0.8" />
          {/* Lotus Bell Pedestal */}
          <path d="M10 54c3 3 10 5 20 5s17-2 20-5v2c0 2-8 4-20 4s-20-2-20-4v-2z" fill="currentColor" />
          {/* सत्यमेव जयते (Satyameva Jayate) */}
          <text
            x="30"
            y="70"
            fill="currentColor"
            fontSize="6.8"
            fontWeight="700"
            fontFamily="'Noto Sans Devanagari', 'Mangal', system-ui, sans-serif"
            textAnchor="middle"
            letterSpacing="0.4"
          >
            सत्यमेव जयते
          </text>
        </svg>
      </div>

      {/* Right: MSME Stylized Title + Bilingual Ministry Text */}
      <div className="msme-text-wrap">
        <div className="msme-headline-row">
          {/* Iconic bold MSME typography with horizontal accent bars */}
          <span className="msme-brand-code">MSME</span>
        </div>
        <div className="msme-sub-en">MICRO, SMALL &amp; MEDIUM ENTERPRISES</div>
        <div className="msme-sub-hi">सूक्ष्म, लघु एवं मध्यम उद्यम</div>
        <div className="msme-slogan">
          <span>OUR STRENGTH</span>
          <span className="slogan-bullet">•</span>
          <span>हमारी शक्ति</span>
        </div>
        <div className="msme-ministry-tag">
          Ministry of MSME, Govt. of India
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. GOOGLE 5-STAR REVIEWS BADGE (MATCHING REFERENCE IMAGE 3)
// ============================================================================

export function GoogleRatingBadge({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  return (
    <div className={`google-official-badge ${isDark ? 'google-dark-theme' : 'google-light-theme'}`}>
      {/* Google Multicolor Wordmark */}
      <div className="google-wordmark-wrap">
        <svg viewBox="0 0 100 34" width="100" height="34" aria-label="Google" fill="none">
          {/* 'G' */}
          <path d="M15.5 17.5c0-4.8 3.8-8.5 8.5-8.5 2.5 0 4.6 1 6.1 2.4l-2.4 2.4c-1-1-2.2-1.6-3.7-1.6-3 0-5.4 2.5-5.4 5.3s2.4 5.3 5.4 5.3c2 0 3.2-.8 3.9-1.6.7-.7 1.1-1.7 1.3-3.1h-5.2v-3.2h8.3c.1.5.2 1.1.2 1.8 0 2.2-.6 4.9-2.5 6.8-1.9 1.9-4.3 2.9-7.2 2.9-4.7 0-8.5-3.7-8.5-8.5z" fill="#4285F4" />
          {/* 'o' */}
          <path d="M38.5 18.2c0-3.6 2.8-6.2 6.1-6.2s6.1 2.6 6.1 6.2-2.8 6.2-6.1 6.2-6.1-2.6-6.1-6.2zm9.1 0c0-2.3-1.6-3.8-3-3.8s-3 1.5-3 3.8 1.6 3.8 3 3.8 3-1.5 3-3.8z" fill="#EA4335" />
          {/* 'o' */}
          <path d="M52.5 18.2c0-3.6 2.8-6.2 6.1-6.2s6.1 2.6 6.1 6.2-2.8 6.2-6.1 6.2-6.1-2.6-6.1-6.2zm9.1 0c0-2.3-1.6-3.8-3-3.8s-3 1.5-3 3.8 1.6 3.8 3 3.8 3-1.5 3-3.8z" fill="#FBBC05" />
          {/* 'g' */}
          <path d="M66.5 18.2c0-3.6 2.8-6.2 6.1-6.2 3.2 0 5.8 2.6 5.8 6.2v.3c0 3.7-2.6 6.2-5.9 6.2-1.9 0-3.4-.8-4.2-1.8v1.3c0 2.1 1.2 3.3 3 3.3 1.5 0 2.4-1.1 2.8-2l2.7 1.1c-.8 1.9-2.8 3.5-5.5 3.5-3.6 0-6-2.9-6-6.4l1.2-5.5zm8.8 0c0-2.2-1.5-3.8-3-3.8s-3 1.6-3 3.8 1.4 3.8 3 3.8 3-1.6 3-3.8z" fill="#4285F4" />
          {/* 'l' */}
          <path d="M81.5 7.5h3.2v16.7h-3.2V7.5z" fill="#34A853" />
          {/* 'e' */}
          <path d="M96.8 19.3l2.6 1.7c-.8 1.3-2.6 3.4-5.8 3.4-3.7 0-6.1-2.8-6.1-6.2 0-3.7 2.6-6.2 5.8-6.2 3.3 0 4.9 2.5 5.4 3.9l.3.8-8.2 3.4c.6 1.3 1.7 1.9 3.1 1.9 1.4 0 2.4-.7 2.9-1.9zm-4.7-2.7l5.5-2.3c-.3-.8-1.3-1.4-2.3-1.4-1.3 0-2.6 1.2-3.2 2.5v1.2z" fill="#EA4335" />
        </svg>
      </div>

      {/* 5 Vibrant Stars (Matching Orange/Amber Color in Image 3) */}
      <div className="google-stars-row" aria-label="5 out of 5 stars">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="19" height="19" viewBox="0 0 24 24" fill="#FF6D00" aria-hidden="true">
            <path d="M12 2.2l2.9 6.8 7.3.7-5.5 4.8 1.6 7.2L12 17.8 5.7 21.7l1.6-7.2-5.5-4.8 7.3-.7L12 2.2z" />
          </svg>
        ))}
      </div>

      <div className="google-badge-meta">
        <span className="google-score">5.0 Star Rating</span>
        <span className="google-status-pill">100% Verified</span>
      </div>
    </div>
  );
}

// ============================================================================
// 4. HOMEPAGE TRUST & CREDENTIALS BANNER (TOP-TIER SECTION FOR HOMEPAGE)
// ============================================================================

export function HomepageTrustSection() {
  return (
    <section className="homepage-trust-credentials-section" aria-label="Credentials, Accreditations and Accepted Payments">
      <div className="container">
        <div className="trust-credentials-card">
          {/* Top subtle eyebrow header */}
          <div className="trust-card-header">
            <div className="trust-eyebrow">
              <span className="trust-indicator-pulse"></span>
              GOVERNMENT ACCREDITED &bull; TOP-RATED &bull; 100% SECURE PAYMENTS
            </div>
            <h3 className="trust-headline">
              Recognized Excellence. Seamless Indian &amp; Global Transactions.
            </h3>
          </div>

          {/* 3 Pillars Grid */}
          <div className="trust-pillars-grid">
            {/* Pillar 1: MSME Certification */}
            <div className="trust-pillar-item pillar-msme">
              <div className="pillar-tag">GOVERNMENT ACCREDITATION</div>
              <div className="pillar-badge-box">
                <MsmeBadge theme="light" />
              </div>
              <p className="pillar-caption">
                Registered under the <strong>Ministry of Micro, Small &amp; Medium Enterprises</strong>, Government of India.
              </p>
            </div>

            {/* Pillar 2: Google 5-Star Reviews */}
            <div className="trust-pillar-item pillar-google">
              <div className="pillar-tag">CLIENT SATISFACTION</div>
              <div className="pillar-badge-box">
                <GoogleRatingBadge theme="light" />
              </div>
              <p className="pillar-caption">
                Rated <strong>5.0 / 5.0</strong> by founders and leaders worldwide for design excellence and engineering delivery.
              </p>
            </div>

            {/* Pillar 3: Accepted Payment Gateways */}
            <div className="trust-pillar-item pillar-payments">
              <div className="pillar-tag">ACCEPTED PAYMENT MODES</div>
              <div className="pillar-badge-box payments-box">
                <PaymentBadgesGrid />
              </div>
              <p className="pillar-caption">
                Instant UPI, RuPay, Net Banking, Cards &amp; Global Wallets processed via 256-bit encrypted gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 5. FOOTER TRUST & PAYMENT SECTION (INTEGRATED SEAMLESSLY INTO DARK FOOTER)
// ============================================================================

export function FooterTrustAndPaymentBar() {
  return (
    <div className="footer-trust-payment-bar" aria-label="Trust Accreditations and Accepted Payment Modes">
      {/* Top Strip: MSME & Google Badges */}
      {/* <div className="footer-accreditation-row">
        <div className="accreditation-item">
          <div className="accreditation-label">Government Recognized</div>
          <div className="footer-badge-container msme-container">
          <MsmeBadge theme="dark" /> 
          </div>
        </div>

        <div className="accreditation-divider"></div>

        <div className="accreditation-item">
          <div className="accreditation-label">Customer Reviews</div>
          <div className="footer-badge-container google-container">
             <GoogleRatingBadge theme="dark" /> 
          </div>
        </div>
      </div> */}

      {/* Bottom Strip: 100% Secure Payment Gateways */}
      <div className="footer-payment-strip">
        <div className="payment-strip-header">
          <span className="payment-security-shield">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          <span className="payment-strip-title">100% Secure &amp; Encrypted Payments Accepted</span>
        </div>

        {/* The 8 Crisp White Cards from Reference Image 1 */}
        <PaymentBadgesGrid className="footer-payments-grid" />
      </div>
    </div>
  );
}
