'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import styles from './Hero.module.css';

const HERO_IMAGES = ['/opener1.jpg', '/opener2.jpg', '/opener3.jpg'];

export default function Hero() {
  const { t, isLoading } = useTranslations();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Localized content with fallbacks while loading
  const headline = isLoading
    ? 'Classical Elegance in the Heart of Siófok Harbor'
    : t('hero.headline') !== 'hero.headline'
      ? t('hero.headline')
      : 'Classical Elegance in the Heart of Siófok Harbor';

  const subtitle = isLoading
    ? 'Welcome to Ramirez — where authentic flavours, warm hospitality, and a breathtaking lakeside setting create an unforgettable dining experience.'
    : t('hero.subtitle') !== 'hero.subtitle'
      ? t('hero.subtitle')
      : 'Welcome to Ramirez — where authentic flavours, warm hospitality, and a breathtaking lakeside setting create an unforgettable dining experience.';

  const menuBtnText = isLoading ? 'View Menu' : t('hero.viewMenu') !== 'hero.viewMenu' ? t('hero.viewMenu') : 'View Menu';
  const bookBtnText = isLoading ? 'Book a Table' : t('hero.bookTable') !== 'hero.bookTable' ? t('hero.bookTable') : 'Book a Table';

  return (
    <section className={styles.hero} id="hero">
      {/* Background image with overlay */}
      <div className={styles.bgWrapper}>
        {HERO_IMAGES.map((src, idx) => (
          <img
            key={src}
            className={`${styles.bgImage} ${idx === currentImageIndex ? styles.active : styles.inactive}`}
            src={src}
            alt="Vibrant Ramirez restaurant interior"
            loading={idx === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.overline}>Ramirez Étterem Siófok</p>
        
        {/* Decorative accent line */}
        <div className={styles.accentLine} aria-hidden="true" />

        <h1 className={styles.headline}>{headline}</h1>

        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.actions}>
          <a href="#menu" className={`btn btn-hero-primary ${styles.btnPrimary}`}>
            <svg
              className={styles.btnIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            {menuBtnText}
          </a>
          <a href="#reservation" className={`btn btn-hero-secondary ${styles.btnSecondary}`}>
            {bookBtnText}
          </a>
        </div>

        {/* Scroll hint */}
        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollMouse}>
            <div className={styles.scrollDot} />
          </div>
        </div>
      </div>
    </section>
  );
}
