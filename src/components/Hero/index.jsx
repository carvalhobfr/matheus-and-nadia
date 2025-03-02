import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useImages } from '../../contexts/ImageContext';
import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();
  const { images } = useImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  
  // Use the images from context
  const backgroundImages = [
    images['hero-bg-1'],
    images['hero-bg-2']
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