import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './IOSGallery.scss';

const IOSGallery = ({ title, showLimited = false, batchSize = 30 }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  
  const totalImages = getTotalImageCount();
  
  // Função para carregar as imagens
  const loadImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    console.log(`🔄 iOS Gallery: Carregando lote ${page} de imagens...`);
    
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
    
    console.log(`📸 iOS Gallery: Adicionando ${newImages.length} novas imagens (${startIndex}-${endIndex})`);
    
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
        console.log('🎯 iOS Gallery: Última imagem visível, carregando mais...');
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
  
  // Componente de imagem iOS style
  const IOSImage = React.forwardRef(({ image, index, isLast, onClick }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    
    const combinedRef = useCallback((node) => {
      if (ref) ref(node);
      if (isLast) lastImageRef(node);
    }, [ref, isLast, lastImageRef]);
    
    return (
      <div 
        className="ios-gallery-item"
        ref={combinedRef}
      >
        {!loaded && !error && (
          <div className="ios-image-placeholder">
            <div className="ios-spinner"></div>
          </div>
        )}
        
        {error && (
          <div className="ios-image-error">
            <div className="ios-error-icon">📷</div>
          </div>
        )}
        
        <img
          src={image.thumbnailPath}
          alt={`Foto ${image.index}`}
          className="ios-gallery-image"
          loading="lazy"
          onLoad={() => {
            setLoaded(true);
            console.log(`✅ iOS Gallery: Imagem ${image.index} carregada`);
          }}
          onError={() => {
            setError(true);
            console.error(`❌ iOS Gallery: Erro na imagem ${image.index}`);
          }}
          onClick={onClick}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
      </div>
    );
  });
  
  return (
    <div className="ios-gallery-container">
      {title && (
        <div className="ios-gallery-header">
          <h1 className="ios-gallery-title">{title}</h1>
        </div>
      )}
      
      <PhotoSwipeGallery
        options={{ 
          bgOpacity: 1,
          showHideAnimationType: 'zoom',
          wheelToZoom: true,
          closeOnVerticalDrag: true,
          pinchToClose: true,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }}
      >
        <div className="ios-gallery-grid">
          {images.map((image, index) => (
            <PhotoSwipeItem
              key={image.id}
              original={image.fullPath}
              thumbnail={image.thumbnailPath}
              width="1200"
              height="800"
              alt={`Foto ${image.index}`}
            >
              {({ ref, open }) => (
                <IOSImage
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
        <div className="ios-loading-container">
          <div className="ios-loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default IOSGallery; 