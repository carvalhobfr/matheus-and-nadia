import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ResponsiveGallery.scss';

const ResponsiveGallery = ({ title, showLimited = false, batchSize = 30 }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({});
  const observer = useRef();
  const containerRef = useRef();
  
  const totalImages = getTotalImageCount();
  
  // Calcular número de colunas baseado na largura da tela
  const getColumnsCount = (width) => {
    if (width < 480) return 2;      // Mobile pequeno: 2 colunas
    if (width < 768) return 3;      // Mobile: 3 colunas
    if (width < 1024) return 4;     // Tablet: 4 colunas
    if (width < 1440) return 5;     // Desktop: 5 colunas
    if (width < 1920) return 6;     // Desktop grande: 6 colunas
    return 7;                       // Telas muito grandes: 7 colunas
  };

  // Função para carregar dimensões de uma imagem
  const loadImageDimensions = useCallback((imagePath, imageIndex) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        setImageDimensions(prev => ({
          ...prev,
          [imageIndex]: dimensions
        }));
        resolve(dimensions);
      };
      img.onerror = () => {
        const fallbackDimensions = { width: 1920, height: 1280 };
        setImageDimensions(prev => ({
          ...prev,
          [imageIndex]: fallbackDimensions
        }));
        resolve(fallbackDimensions);
      };
      img.src = imagePath;
    });
  }, []);

  // Observar mudanças no tamanho do container
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      setContainerWidth(containerRef.current.offsetWidth);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Função para carregar as imagens
  const loadImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    console.log(`🔄 Responsive Gallery: Carregando lote ${page} de imagens...`);
    
    const startIndex = (page - 1) * batchSize + 1;
    const endIndex = Math.min(startIndex + batchSize - 1, totalImages);
    
    const newImages = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const image = {
        id: i,
        index: i,
        thumbnailPath: getThumbnailPath(i),
        fullPath: getFullImagePath(i)
      };
      newImages.push(image);
      
      // Carregar dimensões da imagem em background
      loadImageDimensions(image.fullPath, i);
    }
    
    console.log(`📸 Responsive Gallery: Adicionando ${newImages.length} novas imagens (${startIndex}-${endIndex})`);
    
    setImages(prevImages => [...prevImages, ...newImages]);
    setPage(prev => prev + 1);
    setHasMore(endIndex < totalImages);
    setLoading(false);
  }, [loading, hasMore, page, batchSize, totalImages, loadImageDimensions]);

  // Observer para carregar mais imagens quando chegar ao final
  const lastImageRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadImages();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadImages]);

  // Carregar imagens iniciais
  useEffect(() => {
    loadImages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columnsCount = getColumnsCount(containerWidth);

  const GalleryImage = ({ image, index, isLast }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Delay escalonado muito sutil baseado no índice
    const delayMs = (index % 10) * 20; // Máximo 200ms de delay

    return (
      <div 
        className="responsive-gallery-item"
        ref={isLast ? lastImageRef : null}
      >
        <div 
          className="responsive-gallery-placeholder"
          style={{
            opacity: (!imageLoaded && !imageError) ? 1 : 0,
            pointerEvents: (!imageLoaded && !imageError) ? 'auto' : 'none'
          }}
        >
          <div className="responsive-gallery-spinner"></div>
        </div>
        
        {imageError && (
          <div className="responsive-gallery-error">
            <span>{t('gallery.imageNotFound')}</span>
          </div>
        )}
        
        <img
          src={image.thumbnailPath}
          alt={`Foto ${image.index}`}
          className="responsive-gallery-image"
          loading="lazy"
          onLoad={() => {
            // Delay sutil para evitar que todas apareçam ao mesmo tempo
            setTimeout(() => {
              setImageLoaded(true);
              console.log(`✅ Responsive Gallery: Imagem ${image.index} carregada`);
            }, delayMs);
          }}
          onError={() => {
            setImageError(true);
            console.error(`❌ Responsive Gallery: Erro na imagem ${image.index}`);
          }}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-out'
          }}
        />
      </div>
    );
  };

  return (
    <div className="responsive-gallery-container" ref={containerRef}>
      {title && (
        <div className="responsive-gallery-header">
          <h1 className="responsive-gallery-title">{title}</h1>
          <p className="responsive-gallery-count">{totalImages} {t('gallery.title').toLowerCase()}</p>
        </div>
      )}
      
      <PhotoSwipeGallery
        options={{ 
          bgOpacity: 1,
          showHideAnimationType: 'zoom'
        }}
      >
        <div 
          className="responsive-gallery-grid"
          style={{
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
            gap: '2px'
          }}
        >
          {images.map((image, index) => {
            const dimensions = imageDimensions[image.index] || { width: 1920, height: 1280 };
            
            return (
              <PhotoSwipeItem
                key={image.id}
                original={image.fullPath}
                thumbnail={image.thumbnailPath}
                width={dimensions.width}
                height={dimensions.height}
                alt={`Foto ${image.index}`}
              >
                {({ ref, open }) => (
                  <div 
                    ref={ref} 
                    onClick={() => {
                      console.log(`🖼️ Abrindo imagem ${image.index}: ${image.fullPath}`);
                      console.log(`📐 Dimensões: ${dimensions.width}x${dimensions.height}`);
                      
                      // Abrir diretamente sem verificação adicional
                      setTimeout(() => {
                        open();
                      }, 100);
                    }} 
                    style={{ cursor: 'pointer' }}
                  >
                    <GalleryImage
                      image={image}
                      index={index}
                      isLast={index === images.length - 1}
                    />
                  </div>
                )}
              </PhotoSwipeItem>
            );
          })}
        </div>
      </PhotoSwipeGallery>
      
      {loading && (
        <div className="responsive-gallery-loading">
          <div className="responsive-gallery-loading-spinner"></div>
          <p>{t('gallery.loadingMore')}</p>
        </div>
      )}
    </div>
  );
};

export default ResponsiveGallery; 