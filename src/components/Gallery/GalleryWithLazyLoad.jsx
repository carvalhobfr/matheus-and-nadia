import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { FaSearchPlus, FaCamera, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { getBasePath, getFullImagePath, getTotalImageCount, getThumbnailPath } from '../../utils/imageUtils';
import './Gallery.scss';
import { Link } from 'react-router-dom';

const GalleryWithLazyLoad = ({ 
  title, 
  showLimited = false, 
  itemLimit = 21, // 7 linhas × 3 imagens por linha
  batchSize = showLimited ? 9 : 15 // Para homepage, carrega apenas 9 imagens inicialmente (3 linhas)
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  
  // Memoiza o total de imagens para evitar recálculos
  const totalImages = useMemo(() => getTotalImageCount(), []);
  
  // Função otimizada para carregar as imagens
  const loadImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    console.log(`🔄 Carregando lote ${page} de imagens...`);
    
    const startIndex = (page - 1) * batchSize + 1;
    const endIndex = Math.min(startIndex + batchSize - 1, totalImages);
    
    const newImages = [];
    for (let i = startIndex; i <= endIndex; i++) {
      newImages.push({
        id: i,
        index: i,
        thumbnailPath: getThumbnailPath(i),
        fullPath: getFullImagePath(i)
      });
    }
    
    console.log(`📸 Adicionando ${newImages.length} novas imagens (${startIndex}-${endIndex})`);
    
    setImages(prevImages => [...prevImages, ...newImages]);
    setPage(prev => prev + 1);
    setHasMore(endIndex < totalImages);
    setLoading(false);
  }, [loading, hasMore, page, batchSize, totalImages]);
  
  // Observer para carregar mais imagens
  const lastImageRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    if (!node) return;
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('🎯 Última imagem visível, carregando mais...');
        loadImages();
      }
    }, {
      rootMargin: '200px',
      threshold: 0.1
    });
    observer.current.observe(node);
  }, [loading, hasMore, loadImages]);
  
  // Carregar imagens iniciais
  useEffect(() => {
    if (images.length === 0) {
      loadImages();
    }
  }, [loadImages]);
  

  
  // Componente otimizado para a imagem com lazy loading
  const LazyImage = React.forwardRef(({ image, index, isLast, onClick }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef();
    
    const handleImageLoad = useCallback(() => {
      setLoaded(true);
      console.log(`✅ Imagem ${image.index} carregada`);
    }, [image.index]);
    
    const handleImageError = useCallback(() => {
      setError(true);
      console.error(`❌ Erro ao carregar imagem ${image.index}`);
    }, [image.index]);
    
    return (
      <div 
        className="col-md-4 mb-4" 
        ref={isLast ? lastImageRef : (ref || imgRef)}
        data-aos="fade-up"
        data-aos-delay={showLimited ? index * 30 : index * 50}
      >
        <div className="gallery-item">
          <div className="image-container">
            {!loaded && !error && (
              <div className="image-placeholder">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t('gallery.loading')}</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="image-error">
                <FaCamera size={48} className="text-muted" />
                <p className="text-muted mt-2">{t('gallery.imageNotFound')}</p>
              </div>
            )}
            
            <img
              src={image.thumbnailPath}
              alt={`Foto do casamento ${image.index}`}
              className="gallery-image"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={onClick}
              style={{
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer'
              }}
            />
            
            <div className="image-overlay" onClick={onClick}>
              <FaSearchPlus 
                size={24} 
                className="zoom-icon"
              />
            </div>
          </div>
        </div>
      </div>
    );
  });
  
  return (
    <section className="gallery-section py-5">
      <div className="container">
        {title && (
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">{title}</h2>
            <div className="title-divider mx-auto"></div>
          </div>
        )}
        
        <PhotoSwipeGallery
          options={{ 
            bgOpacity: 0.95, 
            showHideAnimationType: 'zoom', 
            wheelToZoom: true 
          }}
        >
          <div className="row">
            {images.map((image, index) => (
              <PhotoSwipeItem
                key={image.id}
                original={image.fullPath}
                thumbnail={image.thumbnailPath}
                width="1200"
                height="800"
                alt={`Foto do casamento ${image.index}`}
              >
                {({ ref, open }) => (
                  <LazyImage
                    image={image}
                    index={index}
                    isLast={index === images.length - 1}
                    ref={ref}
                    onClick={open}
                  />
                )}
              </PhotoSwipeItem>
            ))}
          </div>
        </PhotoSwipeGallery>
        
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('gallery.loadingMore')}</span>
            </div>
          </div>
        )}
        
        {showLimited && !loading && (
          <div className="text-center mt-4" data-aos="fade-up">
            <Link to="/gallery" className="btn btn-outline-primary btn-lg">
              <FaArrowRight className="me-2" />
              {t('gallery.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryWithLazyLoad; 