'use client';

import { useTranslations } from '@/lib/useTranslations';
import styles from './Footer.module.css';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Ramirez+Restaurant/@46.9054,18.0488,17z/data=!3m1!4b1!4m6!3m5!1s0x47691997e14b35e1:0x9c68bce3d7295d8e!8m2!3d46.9054!4d18.0488!16s';

export default function Footer() {
  const { t } = useTranslations();

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      {/* ── Main Content ─────────────────────────────── */}
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Column 1 — Brand */}
            <div className={styles.brand}>
              <span className={styles.logo}>Ramirez</span>
              <p className={styles.tagline}>{t('footer.tagline')}</p>


            </div>

            {/* Column 2 — Branch 1 */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>
                {t('branches.premium')}
              </h4>
              <p className={styles.columnText}>8600 Siófok, Fő u. 43.</p>
              <div className={styles.contactLinks}>
                <a href="tel:+3684330323" className={styles.contactLink}>
                  06 84 330 323
                </a>
                <a href="mailto:ramirezsiofok11@gmail.com" className={styles.contactLink}>
                  ramirezsiofok11@gmail.com
                </a>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramirez+Premium+Siofok+Fo+u+43"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.directionsBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {t('footer.directions')}
              </a>
            </div>

            {/* Column 3 — Branch 2 */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>
                {t('branches.etterem')}
              </h4>
              <p className={styles.columnText}>Siófok, Mártírok útja 15.</p>
              <div className={styles.contactLinks}>
                <a href="tel:+3684503333" className={styles.contactLink}>
                  06 84 503 333
                </a>
                <a href="mailto:ramirezsiofok11@gmail.com" className={styles.contactLink}>
                  ramirezsiofok11@gmail.com
                </a>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramirez+Etterem+Siofok+Martirok+utja+15"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.directionsBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {t('footer.directions')}
              </a>
            </div>

            {/* Column 4 — Branch 3 */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>
                {t('branches.halaszle')}
              </h4>
              <p className={styles.columnText}>Siófok, Petőfi Sétány 1-3.<br/><span style={{ fontSize: '0.8em', opacity: 0.8 }}>(Strand bejárat mellett)</span></p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramirez+Halaszle+Siofok+Petofi+Setany+1-3"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.directionsBtn}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                {t('footer.directions')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────── */}
      <div className={styles.bottom}>
        <div className={styles.container}>
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {currentYear} Ramirez Restaurant. {t('footer.rights')}
            </p>
            <p className={styles.madeWith}>{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
