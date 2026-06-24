'use client';

import { useTranslations } from '@/lib/useTranslations';
import styles from './Menu.module.css';

export default function Menu() {
  const { translations, isLoading } = useTranslations();

  const pageTitle = translations?.menu?.pageTitle ?? 'Our Menu';

  if (isLoading) {
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

  return (
    <section className={styles.section} id="menu">
      <div className={styles.container}>
        {/* ── Section Header ─────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h2 className={styles.title}>{pageTitle}</h2>
        </div>

        {/* ── Original Menus ─────────────────────────── */}
        <div className={styles.pdfDownloadWrapper}>
          <a href="/Ramirez_Premium_Restaurant_Etlap_web.pdf" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
            Ramirez Premium Menu
          </a>
          <a href="/Ramirez-ETLAP_2025.02.25_OK_web.pdf" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
            Ramirez Éttermek Menu
          </a>
          <a href="/halasetlap.jpg" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
            Ramirez Halászlé Menu
          </a>
          <a href="/menu4.pdf?v=2" target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.pdfButton}`}>
            Ramirez Prémium Cukrászda
          </a>
        </div>
      </div>
    </section>
  );
}
