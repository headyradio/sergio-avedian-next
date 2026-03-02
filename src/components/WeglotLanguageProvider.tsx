'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface WeglotLanguageContextType {
  lang: string;
}

const WeglotLanguageContext = createContext<WeglotLanguageContextType>({ lang: 'en' });

export function useWeglotLanguage() {
  return useContext(WeglotLanguageContext);
}

export function WeglotLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncLang = () => {
      if ((window as any).Weglot?.initialized) {
        const current = (window as any).Weglot.getCurrentLang();
        if (current) setLang(current);
      }
    };

    const onLanguageChanged = () => {
      // Small delay so Weglot finishes its internal state update first
      setTimeout(() => {
        const current = (window as any).Weglot?.getCurrentLang();
        if (current) setLang(current);
      }, 150);
    };

    let attached = false;
    const attach = () => {
      if (!attached && (window as any).Weglot?.on) {
        try {
          (window as any).Weglot.on('languageChanged', onLanguageChanged);
          attached = true;
          syncLang();
        } catch (_) {
          // ignore
        }
      }
    };

    attach();
    const poll = setInterval(() => {
      attach();
      if (attached) clearInterval(poll);
    }, 300);
    const timeout = setTimeout(() => clearInterval(poll), 6000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <WeglotLanguageContext.Provider value={{ lang }}>
      {children}
    </WeglotLanguageContext.Provider>
  );
}
