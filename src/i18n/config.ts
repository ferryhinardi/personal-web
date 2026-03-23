import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

const resources = {
  en: {translation: en},
  id: {translation: id},
};

function getSavedLanguage(): string {
  try {
    return (typeof window !== 'undefined' && localStorage.getItem('language')) || 'en';
  } catch {
    return 'en';
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles XSS
  },
  react: {
    useSuspense: false, // Avoid Suspense flicker since translations are bundled
  },
});

export default i18n;

/**
 * Available languages for the language picker.
 */
export const languages = [
  {code: 'en', label: 'English', flag: '🇺🇸'},
  {code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩'},
] as const;

export type LanguageCode = (typeof languages)[number]['code'];
