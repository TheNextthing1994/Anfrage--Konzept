import { useLanguage } from '../../i18n/LanguageContext';

export type LocalizedText = [de: string, ru: string];

export function usePublicText() {
  const { language } = useLanguage();
  return {
    language,
    text: (de: string, ru: string) => language === 'ru' ? ru : de,
    localized: (value: LocalizedText) => value[language === 'ru' ? 1 : 0]
  };
}
