import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations, TranslationKey } from './translations';
import { Languages } from 'lucide-react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const STORAGE_KEY = 'dt_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'ru' || stored === 'de') return stored;
    } catch {
      // ignore
    }
    return 'de';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.de;
    let text: string = dict[key] || translations.de[key] || (key as string);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', compact = false }) => {
  const { language, setLanguage, t } = useLanguage();

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setLanguage(language === 'de' ? 'ru' : 'de')}
        className={`dt-lang-toggle-compact flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
          language === 'ru'
            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-sm shadow-cyan-950'
            : 'bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600'
        } ${className}`}
        aria-label={t('langAria')}
        title={`${t('langAria')}: ${language === 'de' ? t('langRuFull') : t('langDeFull')}`}
      >
        <Languages className="w-3.5 h-3.5 opacity-80" />
        <span className="tracking-wide uppercase">{language === 'de' ? 'RU' : 'DE'}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={t('langAria')}
      className={`dt-lang-toggle-capsule inline-flex items-center p-0.5 rounded-full border border-cyan-500/25 bg-[#070D18]/90 backdrop-blur-md shadow-inner text-xs font-mono select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('de')}
        aria-pressed={language === 'de'}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
          language === 'de'
            ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
        title="Deutsch"
      >
        <span>DE</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ru')}
        aria-pressed={language === 'ru'}
        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
          language === 'ru'
            ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
        title="Русский язык"
      >
        <span>RU</span>
      </button>
    </div>
  );
};
