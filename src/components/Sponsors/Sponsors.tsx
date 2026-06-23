'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import styles from './Sponsors.module.css';

export default function Sponsors() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { t, isLoading } = useTranslations();

  const title = isLoading ? 'Our Partners' : (t('partners.title') !== 'partners.title' ? t('partners.title') : 'Our Partners');

  return (
    <>
      <section className={styles.section} aria-label="Partners">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.accentLine} aria-hidden="true" />
            <h2 className={styles.title}>{title}</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 md:flex md:flex-row md:flex-wrap md:justify-center md:items-center md:gap-24 py-8 px-4 justify-items-center items-center w-full max-w-7xl mx-auto">
            <img 
              src="/sponsor1.jpeg" 
              alt="Sponsor 1" 
              className={`${styles.logo} cursor-pointer w-full h-32 md:h-48 md:w-auto object-contain mx-auto`} 
              onClick={() => setActiveImage('/sponsor1.jpeg')}
            />
            <img 
              src="/sponsor2.jpeg" 
              alt="Sponsor 2" 
              className={`${styles.logo} cursor-pointer w-full h-32 md:h-48 md:w-auto object-contain mx-auto`} 
              onClick={() => setActiveImage('/sponsor2.jpeg')}
            />
            <img 
              src="/partner3.jpg" 
              alt="Sponsor 3" 
              className={`${styles.logo} cursor-pointer w-full h-32 md:h-48 md:w-auto object-contain mx-auto`} 
              onClick={() => setActiveImage('/partner3.jpg')}
            />
            <img 
              src="/partner4.jpg" 
              alt="Sponsor 4" 
              className={`${styles.logo} cursor-pointer w-full h-32 md:h-48 md:w-auto object-contain mx-auto`} 
              onClick={() => setActiveImage('/partner4.jpg')}
            />
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className={`${styles.modal} fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm`}
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <img 
            src={activeImage} 
            alt="Expanded sponsor" 
            className={`${styles.modalImage} max-h-[80vh] max-w-[90vw] object-contain`}
          />
        </div>
      )}
    </>
  );
}
