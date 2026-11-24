'use client';

import React, { useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  // Default first item open
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-list" id="faqAccordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const numberFormatted = String(index + 1).padStart(2, '0');

        return (
          <div key={item.id} className={`accordion-item ${isOpen ? 'is-open' : ''}`}>
            <button
              className="accordion-trigger"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-number">{numberFormatted}</span>
              <span className="accordion-title">{item.question}</span>
              <span className="accordion-icon" aria-hidden="true">
                <svg
                  className="icon-plus"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <svg
                  className="icon-minus"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </button>
            <div className="accordion-panel">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
