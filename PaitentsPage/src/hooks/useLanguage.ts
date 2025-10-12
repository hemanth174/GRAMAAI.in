
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    const langCode = getLanguageCode(language);
    i18n.changeLanguage(langCode);
    localStorage.setItem('selectedLanguage', language);
    localStorage.setItem('selectedLanguageCode', langCode);
  };

  const getLanguageCode = (language: string): string => {
    const languageMap: Record<string, string> = {
      'English': 'en',
      'Telugu': 'te',
      'Hindi': 'hi'
    };
    return languageMap[language] || 'en';
  };

  const getLanguageName = (code: string): string => {
    const codeMap: Record<string, string> = {
      'en': 'English',
      'te': 'Telugu',
      'hi': 'Hindi'
    };
    return codeMap[code] || 'English';
  };

  const getCurrentLanguage = (): string => {
    return getLanguageName(i18n.language);
  };

  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedLanguageCode = localStorage.getItem('selectedLanguageCode');
    
    if (savedLanguage && savedLanguageCode) {
      i18n.changeLanguage(savedLanguageCode);
    }
  };

  useEffect(() => {
    initializeLanguage();
  }, []);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    currentLanguageCode: i18n.language
  };
};

export default useLanguage;
