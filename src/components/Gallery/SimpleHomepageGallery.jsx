import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCamera } from 'react-icons/fa';
import { getTotalImageCount } from '../../utils/imageUtils';
import './Gallery.scss';

const SimpleHomepageGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const totalImages = getTotalImageCount();

  // Função para gerar números aleatórios únicos
  const getRandomImageNumbers = (count, max) => {
    const numbers = new Set();
    while (numbers.size < count) {
      const randomNum = Math.floor(Math.random() * max) + 1;
      numbers.add(randomNum);
    }
    return Array.from(numbers);
  };

  // Carrega 9 fotos RANDOMIZADAS - SEM LOOPS
  useEffect(() => {
    const loadImages = () => {
      const newImages = [];
      const maxImages = Math.min(9, totalImages);
      
      // Gera 9 números aleatórios únicos
      const randomNumbers = getRandomImageNumbers(maxImages, totalImages);
      
      randomNumbers.forEach((randomNum, index) => {
        newImages.push({
          id: `random-${randomNum}`,
          src: `/fotos-optimized/thumbnails/fotos-casamento-${randomNum}.webp`,
          alt: `Foto do casamento ${randomNum}`,
          index: randomNum
        });
      });
      
      console.log('Imagens randomizadas carregadas:', randomNumbers);
      setImages(newImages);
    };

    loadImages();
  }, []); // Array vazio - executa apenas UMA vez

  return (
    <section className="gallery-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">{t('gallery.specialMoments')}</h2>
          <div className="title-divider mx-auto"></div>
          <p className="text-muted">{t('gallery.subtitle')}</p>
        </div>
        
        <div className="row">
          {images.map((image, index) => (
            <div key={image.id} className="col-md-4 mb-4">
              <div className="gallery-item">
                <div 
                  className="image-container"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f8f9fa',
                    overflow: 'hidden',
                    border: '1px solid #dee2e6'
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="gallery-image"
                    loading="lazy"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      display: 'block',
                      position: 'relative',
                      zIndex: 1,
                      opacity: 1,
                      visibility: 'visible'
                    }}
                    onLoad={() => console.log(`✅ Imagem carregada: ${image.src}`)}
                    onError={(e) => {
                      console.error(`❌ Erro ao carregar: ${image.src}`);
                      e.target.style.backgroundColor = '#ffebee';
                      e.target.style.border = '2px dashed #f44336';
                      e.target.style.minHeight = '250px';
                    }}
                  />
                  <div 
                    className="image-overlay" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 2
                    }}
                  >
                    <Link to="/gallery" className="zoom-icon">
                      <FaCamera size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-5">
          <Link to="/gallery" className="btn btn-outline-primary btn-lg">
            <FaArrowRight className="me-2" />
            {t('gallery.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SimpleHomepageGallery; 