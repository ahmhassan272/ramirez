'use client';

import styles from './InteractiveGallery.module.css';

export default function InteractiveGallery() {
  return (
    <section className={styles.section} aria-label="Gallery">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.imageWrapper} relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer`}>
            <img 
              src="/food1.jpg" 
              alt="Ramirez signature dish 1" 
              className={`${styles.image} transition-transform duration-700 ease-out group-hover:scale-110 object-cover w-full h-full`}
              loading="lazy"
            />
          </div>
          <div className={`${styles.imageWrapper} relative overflow-hidden rounded-2xl shadow-xl group cursor-pointer`}>
            <img 
              src="/food2.jpg" 
              alt="Ramirez signature dish 2" 
              className={`${styles.image} transition-transform duration-700 ease-out group-hover:scale-110 object-cover w-full h-full`}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
