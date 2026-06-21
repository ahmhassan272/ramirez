'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import styles from './BookingForm.module.css';

interface FormData {
  restaurant: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function BookingForm() {
  const { t } = useTranslations();

  const [form, setForm] = useState<FormData>({
    restaurant: 'premium',
    name: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    time: '19:00',
  });

  const [status, setStatus] = useState<FormStatus>('idle');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setStatus('submitting');

      try {
        const res = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [form]
  );

  const resetForm = useCallback(() => {
    setForm({ restaurant: 'premium', name: '', email: '', phone: '', guests: '2', date: '', time: '19:00' });
    setStatus('idle');
  }, []);

  // Today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Time slot options
  const timeSlots = [];
  for (let h = 9; h <= 23; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 23) timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // ── Success State ─────────────────────────────────────
  if (status === 'success') {
    return (
      <section className={styles.section} id="reservation">
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon} aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.successTitle}>{t('booking.successTitle')}</h3>
            <p className={styles.successMessage}>{t('booking.successMessage')}</p>
            <button className={`btn btn-secondary ${styles.successBtn}`} onClick={resetForm}>
              {t('booking.successBack')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="reservation">
      <div className={styles.container}>
        {/* ── Header ──────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.accentLine} aria-hidden="true" />
          <h2 className={styles.title}>{t('booking.title')}</h2>
          <p className={styles.subtitle}>{t('booking.subtitle')}</p>
        </div>

        {/* ── Form Card ───────────────────────────────── */}
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <div className={styles.grid}>
            {/* Restaurant */}
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="booking-restaurant">
                {t('booking.selectRestaurant')} <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                id="booking-restaurant"
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                required
              >
                <option value="premium">{t('branches.premium')}</option>
                <option value="etterem">{t('branches.etterem')}</option>
                <option value="halaszle">{t('branches.halaszle')}</option>
              </select>
            </div>

            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-name">
                {t('booking.name')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                id="booking-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-email">
                {t('booking.email')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="email"
                id="booking-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-phone">
                {t('booking.phone')}
              </label>
              <input
                className={styles.input}
                type="tel"
                id="booking-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+36 30 123 4567"
                autoComplete="tel"
              />
            </div>

            {/* Guests */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-guests">
                {t('booking.guests')} <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                id="booking-guests"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
                <option value="10+">10+</option>
              </select>
            </div>

            {/* Date */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-date">
                {t('booking.date')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="date"
                id="booking-date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            {/* Time */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="booking-time">
                {t('booking.time')} <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                id="booking-time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error message */}
          {status === 'error' && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{t('booking.errorMessage')}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                {t('booking.submitting')}
              </>
            ) : (
              t('booking.submit')
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
