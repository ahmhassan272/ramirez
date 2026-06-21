'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import { i18nConfig, type Locale } from '@/lib/i18n';
import styles from './Header.module.css';

export default function Header() {
  const { locale, setLocale, t } = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      setLocale(newLocale);
      closeMobileMenu();
    },
    [setLocale, closeMobileMenu]
  );

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
        id="site-header"
      >
        <div className={styles.inner}>
          {/* Logos */}
          <a href="/" className={`${styles.logo} flex flex-row items-center gap-2 md:gap-4`} aria-label="Ramirez Éttermek Siófok Home">
            <img src="/ramirez-logo.png" alt="Ramirez Logo 1" className={`${styles.logoImage} h-10 md:h-20 w-auto`} />
            <img src="/logo2.png" alt="Ramirez Logo 2" className={`${styles.logoImage} h-10 md:h-20 w-auto`} />
            <img src="/logo3.png" alt="Ramirez Logo 3" className={`${styles.logoImage} h-10 md:h-20 w-auto`} />
          </a>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <a href="#menu" className={styles.navLink}>
              {t('nav.menu')}
            </a>
            <a href="#about" className={styles.navLink}>
              {t('nav.about')}
            </a>
            <a href="#contact" className={styles.navLink}>
              {t('nav.contact')}
            </a>
          </nav>

          {/* Desktop Right Section */}
          <div className={styles.desktopActions}>
            {/* Language Toggle */}
            <div className={styles.langToggle} role="group" aria-label="Language selector">
              {i18nConfig.locales.map((loc, index) => (
                <span key={loc}>
                  <button
                    className={`${styles.langBtn} ${locale === loc ? styles.langBtnActive : ''}`}
                    onClick={() => handleLocaleChange(loc)}
                    aria-label={`Switch to ${i18nConfig.localeNames[loc]}`}
                    aria-current={locale === loc ? 'true' : undefined}
                  >
                    {loc.toUpperCase()}
                  </button>
                  {index < i18nConfig.locales.length - 1 && (
                    <span className={styles.langSeparator} aria-hidden="true">|</span>
                  )}
                </span>
              ))}
            </div>

            {/* Book a Table CTA */}
            <a href="#reservation" className={`btn btn-primary ${styles.ctaBtn}`}>
              {t('nav.reservation')}
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            id="hamburger-toggle"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.mobileOverlayOpen : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <nav
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        id="mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={styles.mobileMenuInner}>
          <div className={styles.mobileLinks}>
            <a href="#menu" className={styles.mobileLink} onClick={closeMobileMenu}>
              {t('nav.menu')}
            </a>
            <a href="#about" className={styles.mobileLink} onClick={closeMobileMenu}>
              {t('nav.about')}
            </a>
            <a href="#contact" className={styles.mobileLink} onClick={closeMobileMenu}>
              {t('nav.contact')}
            </a>
          </div>

          {/* Mobile Language Selector */}
          <div className={styles.mobileLangSection}>
            <span className={styles.mobileLangLabel}>Language</span>
            <div className={styles.mobileLangToggle}>
              {i18nConfig.locales.map((loc) => (
                <button
                  key={loc}
                  className={`${styles.mobileLangBtn} ${locale === loc ? styles.mobileLangBtnActive : ''}`}
                  onClick={() => handleLocaleChange(loc)}
                  aria-label={`Switch to ${i18nConfig.localeNames[loc]}`}
                >
                  <span className={styles.mobileLangFlag}>
                    {i18nConfig.localeFlags[loc]}
                  </span>
                  {i18nConfig.localeNames[loc]}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile CTA */}
          <a
            href="#reservation"
            className={`btn btn-primary ${styles.mobileCta}`}
            onClick={closeMobileMenu}
          >
            {t('nav.reservation')}
          </a>
        </div>
      </nav>
    </>
  );
}
