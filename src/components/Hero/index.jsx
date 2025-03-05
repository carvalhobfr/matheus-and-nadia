import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Importando diretamente as imagens WebP
import heroBg1 from '../../assets/images/hero-bg-1.webp';
import heroBg2 from '../../assets/images/hero-bg-2.webp';
import heroBg3 from '../../assets/images/hero-bg-3.webp';
import heroBg4 from '../../assets/images/hero-bg-4.webp';
import heroBg5 from '../../assets/images/hero-bg-5.webp';
import heroBg6 from '../../assets/images/hero-bg-6.webp';
import heroBg7 from '../../assets/images/hero-bg-7.webp';
import heroBg8 from '../../assets/images/hero-bg-8.webp';
import heroBg9 from '../../assets/images/hero-bg-9.webp';
import heroBg10 from '../../assets/images/hero-bg-10.webp';

import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Usar diretamente as imagens importadas
  const backgroundImages = [
    heroBg1,
    heroBg2,
    heroBg3,
    heroBg4,
    heroBg5,
    heroBg6,
    heroBg7,
    heroBg8,
    heroBg9,
    heroBg10
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeIn(false);
      
      // After fade out, change image and start fade in
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setFadeIn(true);
      }, 1000); // Fade out transition time (1 segundo)
      
    }, 8000); // Total time between image changes (7 segundos de exibição + 1 segundo de fade)
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section id="home" className="hero">
      <div 
        className={`hero-background ${fadeIn ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="hero-content" data-aos="fade-up" data-aos-duration="1000">
        <h3 className="wedding-date">{t('hero.date')}</h3>
        <h1 className="couple-names">{t('hero.title')}</h1>
        <h4 className="wedding-location">{t('hero.location')}</h4>
      </div>
    </section>
  );
};

export default Hero;