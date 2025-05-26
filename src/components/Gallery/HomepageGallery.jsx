import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearchPlus, FaCamera, FaArrowRight } from 'react-icons/fa';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import './Gallery.scss';

const HomepageGallery = ({ 
  title,
  maxImages = 9 // Apenas 9 imagens para performance máxima na homepage
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  // Memoiza o total de imagens
  const totalImages = useMemo(() => getTotalImageCount(), []);
  
  // Carrega apenas as primeiras imagens para a homepage
  useEffect(() => {
    const imagesToLoad = Math.min(maxImages, totalImages);
    const newImages = [];
    
    for (let i = 1; i <= imagesToLoad; i++) {
      newImages.push({
        id: i,
        thumbnailPath: getThumbnailPath(i),
        fullPath: getFullImagePath(i),
        index: i
      });
    }
    
    setImages(newImages);
  }, [maxImages, totalImages]);
  
  // Componente de imagem otimizado para homepage
  const OptimizedImage = ({ image, index }) => {
    const imgRef = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const [hasError, setHasError] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { 
          rootMargin: '100px',
          threshold: 0.1
        }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => observer.disconnect();
    }, []);
    
    const handleImageLoad = useCallback(() => {
      setLoadedImages(prev => new Set([...prev, image.id]));
    }, [image.id]);
    
    const handleImageError = useCallback(() => {
      setHasError(true);
    }, []);
    
    return (
      <div 
        className="col-md-4 mb-4" 
        ref={imgRef}
        data-aos="fade-up"
        data-aos-delay={index * 100}
        data-aos-duration="600"
      >
        <div className="gallery-item">
          <div className="image-container">
            {!isVisible && !hasError && (
              <div className="image-placeholder">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t('gallery.loading')}</span>
                </div>
              </div>
            )}
            
            {hasError && (
              <div className="image-error">
                <FaCamera size={48} className="text-muted" />
                <p className="text-muted mt-2">{t('gallery.imageNotFound')}</p>
              </div>
            )}
            
            {isVisible && !hasError && (
              <>
                <img
                  src={image.thumbnailPath}
                  alt={`Foto do casamento ${image.index}`}
                  className="gallery-image"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: loadedImages.has(image.id) ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                <div className="image-overlay">
                  <Link to="/gallery" className="zoom-icon">
                    <FaSearchPlus size={20} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <section className="gallery-section py-5">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="section-title">{title || t('gallery.specialMoments')}</h2>
          <div className="title-divider mx-auto"></div>
          <p className="text-muted">
            {t('gallery.subtitle')}
          </p>
        </div>
        
        <div className="row">
          {images.map((image, index) => (
            <OptimizedImage
              key={image.id}
              image={image}
              index={index}
            />
          ))}
        </div>
        
        <div className="text-center mt-5" data-aos="fade-up" data-aos-delay="300">
          <Link to="/gallery" className="btn btn-outline-primary btn-lg">
            <FaArrowRight className="me-2" />
            {t('gallery.viewAll')} ({totalImages})
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomepageGallery; 