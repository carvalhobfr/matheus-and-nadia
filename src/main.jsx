import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import './i18n.js'
import { LanguageProvider } from './contexts/LanguageContext'
import AOS from 'aos'

// Initialize AOS animation library
const AppWithInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<AppWithInit />);
