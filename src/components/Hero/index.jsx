import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Hero.scss';

// Importar imagens do carrossel (comentado até que as imagens sejam adicionadas)
import heroImage1 from '../../assets/hero-bg-1.jpg';
import heroImage2 from '../../assets/hero-bg-2.jpg';
// import heroImage2 from '../../assets/hero/hero-bg-2.jpg';
// import heroImage3 from '../../assets/hero/hero-bg-3.jpg';

// Placeholder para testes - remover quando tiver imagens reais
// const placeholderImages = [
//   'https://via.placeholder.com/1920x1080/FF6B6B/FFFFFF?text=Wedding+Image+1',
//   'https://via.placeholder.com/1920x1080/4ECDC4/FFFFFF?text=Wedding+Image+2',
//   'https://via.placeholder.com/1920x1080/FFE66D/FFFFFF?text=Wedding+Image+3',
// ];

const Hero = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Usar as imagens reais quando disponíveis
  // const images = placeholderImages;
  const images = [heroImage1, heroImage2];
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Iniciar o fade out
      setFadeIn(false);
      
      // Após o fade out, mudar a imagem e iniciar o fade in
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeIn(true);
      }, 1000); // Tempo de transição do fade out
      
    }, 5000); // Tempo total entre mudanças de imagem
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="hero">
      <div 
        className={`hero-background ${fadeIn ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="hero-content" data-aos="fade-up" data-aos-duration="1000">
        <h1 className="couple-names">{t('hero.title')}</h1>
        <p className="elegant-script">{t('hero.subtitle')}</p>
        <div className="hero-date wedding-date">
          <p>{t('hero.date')}</p>
          <p>{t('hero.location')}</p>
        </div>
        <Link to="/contact" className="btn btn-primary btn-lg mt-4">{t('navbar.message')}</Link>
      </div>
    </section>
  );
};

export default Hero; 