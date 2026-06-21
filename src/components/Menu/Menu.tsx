'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import styles from './Menu.module.css';

export default function Menu() {
  const { translations, isLoading } = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const categories = translations?.menu?.categories ?? [];
  const pageTitle = translations?.menu?.pageTitle ?? 'Our Menu';
  const disclaimer = translations?.menu?.disclaimer ?? 'A 12% service charge will be added to your final bill.';

  // Scroll active tab into view within the horizontal scroller
  const scrollActiveTabIntoView = useCallback(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tab = activeTabRef.current;
      const container = tabsRef.current;
      const tabLeft = tab.offsetLeft;
      const tabWidth = tab.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;

      // Center the tab in the visible area
      const targetScroll = tabLeft - containerWidth / 2 + tabWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollActiveTabIntoView();
  }, [activeIndex, scrollActiveTabIntoView]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (isLoading || categories.length === 0) {
    return (
      <section className={styles.section} id="menu">
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        </div>
      </section>
    );
  }

  const activeCategory = categories[activeIndex];

  return (
    <section className={styles.section} id="menu">
      <div className={styles.container}>
        {/* ── Original Menus ─────────────────────────── */}
        <div className={styles.originalMenusSection}>
          <h3 className={styles.originalMenusTitle}>{translations?.menu?.originalMenusTitle || 'Our Original Menus'}</h3>
          <div className={styles.pdfDownloadWrapper}>
            <a href="/Ramirez_Premium_Restaurant_Etlap_web.pdf" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
              Ramirez Premium Menu
            </a>
            <a href="/Ramirez-ETLAP_2025.02.25_OK_web.pdf" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
              Ramirez Étterem Menu
            </a>
            <a href="/halasetlap.jpg" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
              Ramirez Halászlé Menu
            </a>
          </div>
        </div>

        {/* ── Section Header ─────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h2 className={styles.title}>{pageTitle}</h2>
          <p className={styles.subtitle}>
            {categories.length} {translations?.meta?.locale === 'hu' ? 'kategória' : translations?.meta?.locale === 'de' ? 'Kategorien' : 'categories'} · {categories.reduce((sum, c) => sum + c.items.length, 0)} {translations?.meta?.locale === 'hu' ? 'étel' : translations?.meta?.locale === 'de' ? 'Gerichte' : 'dishes'}
          </p>
        </div>

        {/* ── Category Tabs ──────────────────────────── */}
        <div className={styles.tabsWrapper}>
          {/* Left fade */}
          <div className={styles.tabsFadeLeft} aria-hidden="true" />

          <div className={styles.tabs} ref={tabsRef} role="tablist" aria-label="Menu categories">
            {categories.map((cat, index) => (
              <button
                key={cat.slug}
                ref={index === activeIndex ? activeTabRef : null}
                className={`${styles.tab} ${index === activeIndex ? styles.tabActive : ''}`}
                onClick={() => handleTabClick(index)}
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={`panel-${cat.slug}`}
                id={`tab-${cat.slug}`}
              >
                {cat.name}
                <span className={styles.tabCount}>{cat.items.length}</span>
              </button>
            ))}
          </div>

          {/* Right fade */}
          <div className={styles.tabsFadeRight} aria-hidden="true" />
        </div>

        {/* ── Menu Items Grid ────────────────────────── */}
        <div
          className={styles.panel}
          role="tabpanel"
          id={`panel-${activeCategory.slug}`}
          aria-labelledby={`tab-${activeCategory.slug}`}
        >
          <div className={styles.grid}>
            {activeCategory.items.map((item, idx) => (
              <div className={styles.item} key={`${activeCategory.slug}-${idx}`}>
                <div className={styles.itemContent}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemDots} aria-hidden="true" />
                  <span className={styles.itemPrice}>{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ─────────────────────────────── */}
        <div className={styles.disclaimer}>
          <svg
            className={styles.disclaimerIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className={styles.disclaimerText}>{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
