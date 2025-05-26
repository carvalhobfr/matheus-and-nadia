import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { getTotalImageCount } from '../../utils/imageUtils';
import './Gallery.scss';

const SimpleHomepageGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const totalImages = getTotalImageCount();
  const navigate = useNavigate();

  // Função para gerar números aleatórios únicos
  const getRandomImageNumbers = (count, max) => {
    const numbers = new Set();
    while (numbers.size < count) {
      const randomNum = Math.floor(Math.random() * max) + 1;
      numbers.add(randomNum);
    }
    return Array.from(numbers);
  };

  // Carrega 9 fotos RANDOMIZADAS
  useEffect(() => {
    const loadImages = () => {
      const newImages = [];
      const maxImages = Math.min(9, totalImages);
      const randomNumbers = getRandomImageNumbers(maxImages, totalImages);
      randomNumbers.forEach((randomNum, index) => {
        newImages.push({
          id: `random-${randomNum}`,
          src: `/fotos-optimized/thumbnails/fotos-casamento-${randomNum}.webp`,
          full: `/fotos-optimized/fotos-casamento-${randomNum}.webp`,
          alt: `Foto do casamento ${randomNum}`,
          index: randomNum
        });
      });
      setImages(newImages);
    };
    loadImages();
  }, []);

  // Ao clicar, navegar para a galeria com o índice da foto
  const handleImageClick = (image) => {
    navigate(`/gallery?foto=${image.index}`);
  };

  return (
    <section className="gallery-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">{t('gallery.specialMoments')}</h2>
          <div className="title-divider mx-auto"></div>
          <p className="text-muted">{t('gallery.subtitle')}</p>
        </div>
        <div className="row">
          {images.map((image) => (
            <div key={image.id} className="col-md-4 mb-4">
              <div className="gallery-item">
                <div 
                  className="image-container"
                  style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#f8f9fa', overflow: 'hidden', border: '1px solid #dee2e6' }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="gallery-image"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 1, opacity: 1, visibility: 'visible', cursor: 'pointer' }}
                    onClick={() => handleImageClick(image)}
                  />
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