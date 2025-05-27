import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './SimpleVirtualGallery.scss';

const SimpleVirtualGallery = ({ title }) => {
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const totalImages = getTotalImageCount();
  
  // Calcular tamanho das imagens para ocupar 100% da largura
  const getImageSizeAndColumns = (zoom, width) => {
    if (!width) return { imageSize: 150, columns: 3 };
    
    // Definir número base de colunas baseado no zoom (mais conservador para performance)
    const baseColumns = width < 768 ? 3 : 4; // Mobile: 3 colunas, Desktop: 4 colunas
    const zoomedColumns = Math.max(1, Math.min(7, Math.round(baseColumns / zoom))); // Máximo 7 colunas
    
    // Calcular tamanho exato para ocupar 100% da largura (considerando gaps de 1px)
    const totalGaps = (zoomedColumns - 1) * 1; // 1px de gap entre imagens
    const imageSize = Math.floor((width - totalGaps) / zoomedColumns);
    
    return { imageSize, columns: zoomedColumns };
  };
  
  const { imageSize, columns } = getImageSizeAndColumns(zoomLevel, containerWidth || window.innerWidth);
  
  // Debug log (throttled para performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`📐 Largura: ${containerWidth}px, Zoom: ${zoomLevel.toFixed(1)}x, Colunas: ${columns}, Tamanho: ${imageSize}px`);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [containerWidth, zoomLevel, columns, imageSize]);
  
  // Estado para armazenar dimensões das imagens
  const [imageDimensions, setImageDimensions] = useState({});
  
  // Preparar todas as imagens
  const allImages = useMemo(() => {
    const images = [];
    for (let i = 1; i <= totalImages; i++) {
      images.push({
        id: i,
        index: i,
        thumbnailPath: getThumbnailPath(i),
        fullPath: getFullImagePath(i)
      });
    }
    return images;
  }, [totalImages]);
  
  // Função para carregar dimensões da imagem (otimizada)
  const loadImageDimensions = useCallback((imagePath, imageIndex) => {
    if (imageDimensions[imageIndex]) return; // Já carregada
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions(prev => {
        // Evitar re-renders desnecessários
        if (prev[imageIndex]) return prev;
        
        return {
          ...prev,
          [imageIndex]: {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
        };
      });
    };
    img.onerror = () => {
      // Fallback em caso de erro
      setImageDimensions(prev => ({
        ...prev,
        [imageIndex]: {
          width: 1200,
          height: 800
        }
      }));
    };
    img.src = imagePath;
  }, [imageDimensions]);
  
  // Configurar Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisibleImages = new Set();
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageIndex = parseInt(entry.target.dataset.imageIndex);
            newVisibleImages.add(imageIndex);
          }
        });
        
        if (newVisibleImages.size > 0) {
          setVisibleImages(prev => new Set([...prev, ...newVisibleImages]));
        }
      },
      {
        rootMargin: '100px', // Reduzido para melhor performance
        threshold: 0.1
      }
    );
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Observar mudanças no tamanho do container
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        console.log('📏 Container width updated:', width);
      }
    };
    
    const timer = setTimeout(updateWidth, 100);
    
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateWidth);
    
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);
  
  // Controle de zoom com trackpad (como iPhone)
  useEffect(() => {
    const handleWheel = (e) => {
      // Detectar se é pinch/zoom (ctrlKey indica zoom no trackpad)
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = e.deltaY;
        const zoomFactor = 0.1;
        
        setZoomLevel(prevZoom => {
          const newZoom = delta > 0 
            ? Math.max(0.6, prevZoom - zoomFactor)  // Zoom out limitado (min 0.6x para melhor performance)
            : Math.min(3, prevZoom + zoomFactor);   // Zoom in (max 3x)
          
          return newZoom;
        });
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);
  
  // Componente de imagem individual
  const GalleryImage = ({ image, isVisible }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imageRef = useRef(null);
    
    // Observar quando a imagem entra na viewport
    useEffect(() => {
      const imageElement = imageRef.current;
      if (imageElement && observerRef.current && !isVisible) {
        observerRef.current.observe(imageElement);
      }
      
      return () => {
        if (imageElement && observerRef.current) {
          observerRef.current.unobserve(imageElement);
        }
      };
    }, [isVisible]);
    
    return (
      <div 
        className="simple-virtual-gallery-item"
        ref={imageRef}
        data-image-index={image.index}
      >
        {!isVisible ? (
          <div className="simple-virtual-image-placeholder">
            <div className="simple-virtual-placeholder-icon">📷</div>
          </div>
        ) : (
          <>
            {!loaded && !error && (
              <div className="simple-virtual-image-loading">
                <div className="simple-virtual-spinner"></div>
              </div>
            )}
            
            {error && (
              <div className="simple-virtual-image-error">
                <div className="simple-virtual-error-icon">❌</div>
              </div>
            )}
            
            <img
              src={image.thumbnailPath}
              alt={`Foto ${image.index}`}
              className="simple-virtual-gallery-image"
              loading="lazy"
              onLoad={(e) => {
                setLoaded(true);
                // Carregar dimensões da imagem original
                loadImageDimensions(image.fullPath, image.index);
                console.log(`✅ Simple Virtual Gallery: Imagem ${image.index} carregada`);
              }}
              onError={() => {
                setError(true);
                console.error(`❌ Simple Virtual Gallery: Erro na imagem ${image.index}`);
              }}
              style={{
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="simple-virtual-gallery-container">
      {title && (
        <div className="simple-virtual-gallery-header">
          <h1 className="simple-virtual-gallery-title">{title}</h1>
          <p className="simple-virtual-gallery-count">{totalImages} fotos</p>
        </div>
      )}
      
      <PhotoSwipeGallery
        options={{ 
          bgOpacity: 1,
          showHideAnimationType: 'zoom',
          wheelToZoom: true,
          closeOnVerticalDrag: true,
          pinchToClose: true,
          padding: { top: 20, bottom: 20, left: 20, right: 20 },
          imageClickAction: 'close',
          tapAction: 'close'
        }}
      >
        <div 
          className="simple-virtual-gallery-flex"
          ref={containerRef}
        >
          {allImages.map((image) => {
            const dimensions = imageDimensions[image.index];
            return (
              <PhotoSwipeItem
                key={image.id}
                original={image.fullPath}
                thumbnail={image.thumbnailPath}
                width={dimensions?.width || 1200}
                height={dimensions?.height || 800}
                alt={`Foto ${image.index}`}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref} 
                    onClick={open}
                    style={{
                      width: `${imageSize}px`,
                      height: `${imageSize}px`,
                      flexShrink: 0
                    }}
                  >
                    <GalleryImage 
                      image={image}
                      isVisible={visibleImages.has(image.index)}
                    />
                  </div>
                )}
              </PhotoSwipeItem>
            );
          })}
        </div>
      </PhotoSwipeGallery>
      
      {/* Indicador de zoom */}
      {zoomLevel !== 1 && (
        <div className="simple-virtual-zoom-indicator">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  );
};

export default SimpleVirtualGallery; 