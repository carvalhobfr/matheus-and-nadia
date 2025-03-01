import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    // Set the language from localStorage on initial load
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 