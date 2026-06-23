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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4 items-center justify-items-center">
            <div className="w-full flex justify-center">
              <img src="/sponsor1.jpeg" alt="Sponsor 1" className="max-w-full h-auto object-contain rounded-md shadow-sm cursor-pointer" onClick={() => setActiveImage('/sponsor1.jpeg')} />
            </div>
            <div className="w-full flex justify-center">
              <img src="/sponsor2.jpeg" alt="Sponsor 2" className="max-w-full h-auto object-contain rounded-md shadow-sm cursor-pointer" onClick={() => setActiveImage('/sponsor2.jpeg')} />
            </div>
            <div className="w-full flex justify-center">
              <img src="/partner3.jpg" alt="Partner 3" className="max-w-full h-auto object-contain rounded-md shadow-sm cursor-pointer" onClick={() => setActiveImage('/partner3.jpg')} />
            </div>
            <div className="w-full flex justify-center">
              <img src="/partner4.jpg" alt="Partner 4" className="max-w-full h-auto object-contain rounded-md shadow-sm cursor-pointer" onClick={() => setActiveImage('/partner4.jpg')} />
            </div>
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
