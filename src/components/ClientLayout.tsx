'use client';

import { I18nProvider } from '@/lib/useTranslations';
import Header from '@/components/Header/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Header />
      {children}
    </I18nProvider>
  );
}
