import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ReactWindowGallery.scss';

const ReactWindowGallery = ({ title }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleImages, setVisibleImages] = useState(new Set());
  const [imageDimensions, setImageDimensions] = useState({});
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const totalImages = getTotalImageCount();
  
  // Calcular dimensões do grid baseado no zoom e largura
  const getGridDimensions = useCallback((zoom, width) => {
    if (!width) return { itemSize: 150, columnCount: 3, rowCount: 1 };
    
    // Número base de colunas baseado na largura da tela
    const baseColumns = width < 768 ? 3 : width < 1024 ? 4 : 5;
    const zoomedColumns = Math.max(1, Math.min(8, Math.round(baseColumns / zoom)));
    
    // Calcular tamanho exato para ocupar 100% da largura (considerando gaps)
    const gap = 1;
    const totalGaps = (zoomedColumns - 1) * gap;
    const itemSize = Math.floor((width - totalGaps) / zoomedColumns);
    
    // Calcular número de linhas necessárias
    const rowCount = Math.ceil(totalImages / zoomedColumns);
    
    return { itemSize, columnCount: zoomedColumns, rowCount };
  }, [totalImages]);
  
  const { itemSize, columnCount, rowCount } = getGridDimensions(zoomLevel, containerSize.width);
  
  // Observar mudanças no tamanho do container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    
    const timer = setTimeout(updateSize, 100);
    
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateSize);
    
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  // Controle de zoom com trackpad
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = e.deltaY;
        const zoomFactor = 0.1;
        
        setZoomLevel(prevZoom => {
          const newZoom = delta > 0 
            ? Math.max(0.6, prevZoom - zoomFactor)  // Zoom out limitado
            : Math.min(3, prevZoom + zoomFactor);   // Zoom in limitado
          
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
  
  // Função para carregar dimensões da imagem
  const loadImageDimensions = useCallback((imagePath, imageIndex) => {
    if (imageDimensions[imageIndex]) return;
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions(prev => {
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
      setImageDimensions(prev => ({
        ...prev,
        [imageIndex]: { width: 1200, height: 800 }
      }));
    };
    img.src = imagePath;
  }, [imageDimensions]);
  
  // Preparar dados das imagens
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
  
  // Componente de célula individual do grid
  const GridCell = ({ columnIndex, rowIndex, style }) => {
    const imageIndex = rowIndex * columnCount + columnIndex + 1;
    
    // Se o índice exceder o total de imagens, não renderizar nada
    if (imageIndex > totalImages) {
      return <div style={style} />;
    }
    
    const image = allImages[imageIndex - 1];
    const dimensions = imageDimensions[image.index];
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cellRef = useRef(null);
    
    // Intersection Observer para lazy loading
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setVisibleImages(prev => new Set([...prev, image.index]));
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      
      if (cellRef.current) {
        observer.observe(cellRef.current);
      }
      
      return () => observer.disconnect();
    }, [image.index]);
    
    return (
      <div 
        ref={cellRef}
        style={{
          ...style,
          padding: '0.5px', // Gap entre imagens
        }}
      >
        <PhotoSwipeItem
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
              className="react-window-gallery-cell"
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                backgroundColor: '#f2f2f7',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {!isVisible ? (
                <div className="react-window-placeholder">
                  <div className="react-window-placeholder-icon">📷</div>
                </div>
              ) : (
                <>
                  {!loaded && !error && (
                    <div className="react-window-loading">
                      <div className="react-window-spinner"></div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="react-window-error">
                      <div className="react-window-error-icon">❌</div>
                    </div>
                  )}
                  
                  <img
                    src={image.thumbnailPath}
                    alt={`Foto ${image.index}`}
                    className="react-window-image"
                    loading="lazy"
                    onLoad={(e) => {
                      setLoaded(true);
                      loadImageDimensions(image.fullPath, image.index);
                      console.log(`✅ React Window: Imagem ${image.index} carregada`);
                    }}
                    onError={() => {
                      setError(true);
                      console.error(`❌ React Window: Erro na imagem ${image.index}`);
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: loaded ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      display: 'block'
                    }}
                  />
                </>
              )}
            </div>
          )}
        </PhotoSwipeItem>
      </div>
    );
  };
  
  // Debug log
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`🚀 React Window - Largura: ${containerSize.width}px, Zoom: ${zoomLevel.toFixed(1)}x, Colunas: ${columnCount}, Tamanho: ${itemSize}px, Linhas: ${rowCount}`);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [containerSize.width, zoomLevel, columnCount, itemSize, rowCount]);
  
  return (
    <div className="react-window-gallery-container">
      {title && (
        <div className="react-window-gallery-header">
          <h1 className="react-window-gallery-title">{title}</h1>
          <p className="react-window-gallery-count">{totalImages} fotos</p>
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
          ref={containerRef}
          className="react-window-gallery-wrapper"
          style={{ 
            width: '100%', 
            height: 'calc(100vh - 60px)',
            minHeight: '400px'
          }}
        >
          {containerSize.width > 0 && (
            <Grid
              ref={gridRef}
              columnCount={columnCount}
              columnWidth={itemSize}
              height={containerSize.height}
              rowCount={rowCount}
              rowHeight={itemSize}
              width={containerSize.width}
              overscanRowCount={2}
              overscanColumnCount={2}
            >
              {GridCell}
            </Grid>
          )}
        </div>
      </PhotoSwipeGallery>
      
      {/* Indicador de zoom */}
      {zoomLevel !== 1 && (
        <div className="react-window-zoom-indicator">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  );
};

export default ReactWindowGallery; 