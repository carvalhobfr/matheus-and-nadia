import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';
import './Navbar.scss';

const Navbar = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isGiftsPage = location.pathname === '/gifts';

  useEffect(() => {
    // Aplica o efeito scrolled imediatamente quando estiver na página de gifts
    if (isGiftsPage) {
      setScrolled(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        // Mantém scrolled=true na página de gifts mesmo quando no topo
        setScrolled(isGiftsPage ? true : false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger o handleScroll imediatamente para aplicar o estado correto
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isGiftsPage]); // Adiciona isGiftsPage como dependência

  const scrollToSection = (id) => {
    if (!isHomePage) {
      return; // Don't scroll if not on home page
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">M&N</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/" 
                onClick={() => isHomePage && scrollToSection('home')}
              >
                {t('navbar.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/" 
                onClick={() => isHomePage && scrollToSection('story')}
              >
                {t('navbar.story')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/" 
                onClick={() => isHomePage && scrollToSection('details')}
              >
                {t('navbar.details')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}
                to={isHomePage ? "/" : "/gallery"}
                onClick={() => isHomePage && scrollToSection('gallery')}
              >
                {t('navbar.gallery')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/gifts' ? 'active' : ''}`} 
                to="/gifts"
              >
                {t('navbar.gifts')}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                to="/" 
                onClick={() => isHomePage && scrollToSection('message')}
              >
                {t('navbar.message')}
              </Link>
            </li>
            <li className="nav-item language-selector d-flex align-items-center">
              <button 
                className={`${currentLanguage === 'en' ? 'active' : ''}`} 
                onClick={() => changeLanguage('en')}
              >
                🇬🇧
              </button>
              <button 
                className={`${currentLanguage === 'pt' ? 'active' : ''}`} 
                onClick={() => changeLanguage('pt')}
              >
                🇵🇹
              </button>
              <button 
                className={`${currentLanguage === 'es' ? 'active' : ''}`} 
                onClick={() => changeLanguage('es')}
              >
                🇪🇸
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;