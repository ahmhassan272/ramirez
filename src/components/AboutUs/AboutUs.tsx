'use client';

import { useTranslations } from '@/lib/useTranslations';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  const { t, isLoading } = useTranslations();

  const title = isLoading ? 'About Us' : t('aboutUs.title') !== 'aboutUs.title' ? t('aboutUs.title') : 'About Us';
  const description = isLoading ? 'Loading...' : t('aboutUs.description') !== 'aboutUs.description' ? t('aboutUs.description') : '';

  return (
    <section className={styles.section} id="about">
      <title>{`${title} - Ramirez Éttermek Siófok`}</title>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Image */}
          <div className={styles.imageColumn}>
            <img 
              src="/background2.jpeg" 
              alt="Ramirez Restaurant Interior" 
              className={styles.image} 
              loading="lazy" 
            />
          </div>
          
          {/* Column 2: Text */}
          <div className={styles.textColumn}>
            <div className={styles.accentLine} aria-hidden="true" />
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
