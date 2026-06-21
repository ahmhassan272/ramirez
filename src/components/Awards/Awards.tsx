'use client';

import { useTranslations } from '@/lib/useTranslations';

export default function Awards() {
  const { t, locale } = useTranslations();

  const title = t('awards.title') !== 'awards.title' 
    ? t('awards.title') 
    : locale === 'hu' 
      ? 'Díjak és Elismerések' 
      : locale === 'de' 
        ? 'Auszeichnungen' 
        : 'Awards & Recognitions';

  return (
    <section className="py-16 bg-[#fdfbf7] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-8 text-[#1b2a4a]">
          {title}
        </h2>
        {/* Restaurant Guru Badge Placeholder */}
        <div 
          className="flex justify-center items-center w-full" 
          dangerouslySetInnerHTML={{ __html: '<!-- Restaurant Guru Badge Placeholder -->' }}
        />
      </div>
    </section>
  );
}
