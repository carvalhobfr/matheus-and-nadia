import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ProfessionalGallery.scss';

// Componente de imagem com modal funcional
const StableImage = memo(({ imageIndex, onImageClick }) => {
  const [loaded, setLoaded] = useState(false);
  const thumbnailPath = getThumbnailPath(imageIndex);
  const fullPath = getFullImagePath(imageIndex);

  return (
    <div className="gallery-item">
      <div className="image-container">
        <img
          src={thumbnailPath}
          alt={`Foto ${imageIndex}`}
          className="gallery-image"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'relative',
            zIndex: 1,
            visibility: 'visible',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            margin: 0,
            padding: 0,
            border: 'none'
          }}
          onLoad={() => {
            console.log(`✅ Imagem ${imageIndex} carregada`);
            setLoaded(true);
          }}
          onError={(e) => {
            console.error(`❌ Erro na imagem ${imageIndex}`);
            e.target.style.backgroundColor = '#ffebee';
            e.target.style.border = '2px dashed #f44336';
            setLoaded(true);
          }}
          onClick={() => onImageClick({ fullPath, index: imageIndex })}
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
            zIndex: 2,
            cursor: 'pointer'
          }}
          onClick={() => onImageClick({ fullPath, index: imageIndex })}
        >
          <FaSearchPlus className="zoom-icon" style={{ color: 'white', fontSize: '1.5rem' }} />
        </div>
      </div>
    </div>
  );
});

const StableGallery = () => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(36);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const totalImages = getTotalImageCount();
  const IMAGES_PER_BATCH = 36;
  const triggerRef = useRef(null);

  // Carregamento inicial
  useEffect(() => {
    console.log('🚀 Carregando galeria estável...');
    setLoading(false);
  }, []);

  // Função para carregar mais imagens
  const loadMoreImages = useCallback(() => {
    if (loadingMore || visibleCount >= totalImages) return;
    
    setLoadingMore(true);
    console.log(`🔄 Carregando mais ${IMAGES_PER_BATCH} imagens...`);
    
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + IMAGES_PER_BATCH, totalImages));
      setLoadingMore(false);
    }, 100);
  }, [loadingMore, visibleCount, totalImages]);

  // Intersection Observer
  useEffect(() => {
    const currentTrigger = triggerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loadingMore && visibleCount < totalImages) {
          console.log(`🎯 Trigger ativado - carregando mais imagens`);
          loadMoreImages();
        }
      },
      { 
        rootMargin: '500px',
        threshold: 0.1 
      }
    );

    observer.observe(currentTrigger);

    return () => {
      observer.unobserve(currentTrigger);
    };
  }, [loadMoreImages, visibleCount, totalImages]);

  // Funções do modal
  const openModal = useCallback((imageData) => {
    setSelectedImage(imageData.fullPath);
    setSelectedIndex(imageData.index);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedImage(null);
  }, []);

  const showNext = useCallback(() => {
    const nextIndex = selectedIndex < visibleCount ? selectedIndex + 1 : 1;
    setSelectedIndex(nextIndex);
    setSelectedImage(getFullImagePath(nextIndex));
  }, [selectedIndex, visibleCount]);

  const showPrevious = useCallback(() => {
    const prevIndex = selectedIndex > 1 ? selectedIndex - 1 : visibleCount;
    setSelectedIndex(prevIndex);
    setSelectedImage(getFullImagePath(prevIndex));
  }, [selectedIndex, visibleCount]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal) return;
      
      switch (e.key) {
        case 'ArrowRight':
          showNext();
          break;
        case 'ArrowLeft':
          showPrevious();
          break;
        case 'Escape':
          closeModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showNext, showPrevious, closeModal]);

  // Gerar array de índices das imagens visíveis
  const imageIndices = Array.from({ length: visibleCount }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="professional-gallery">
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Carregando galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-gallery">
      <div className="gallery-header">
        <h1 className="gallery-title">{t('gallery.title')}</h1>
        <p className="gallery-subtitle">{t('gallery.subtitle')}</p>
        <p className="text-muted">
          Mostrando {visibleCount} de {totalImages} fotos 
          {visibleCount < totalImages && ` • Lote ${Math.ceil(visibleCount / IMAGES_PER_BATCH)} de ${Math.ceil(totalImages / IMAGES_PER_BATCH)}`}
        </p>
      </div>

      <div className="gallery-grid">
        {imageIndices.map((imageIndex) => (
          <StableImage
            key={imageIndex}
            imageIndex={imageIndex}
            onImageClick={openModal}
          />
        ))}
      </div>

      {/* Elemento trigger para infinite scroll */}
      {visibleCount < totalImages && (
        <div 
          ref={triggerRef} 
          style={{ 
            height: '20px', 
            width: '100%', 
            margin: '20px 0',
            visibility: 'hidden'
          }} 
        />
      )}

      {/* Indicador de carregamento */}
      {loadingMore && (
        <div 
          className="loading-more-indicator"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            opacity: 0.8
          }}
        >
          <div 
            className="loading-spinner"
            style={{
              width: '30px',
              height: '30px',
              margin: '0 auto 10px',
              border: '3px solid #e9ecef',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          <p style={{ 
            color: '#6c757d', 
            fontSize: '0.9rem', 
            margin: 0,
            fontWeight: '300'
          }}>
            Carregando mais {IMAGES_PER_BATCH} fotos... {visibleCount} de {totalImages}
          </p>
        </div>
      )}

      {/* Indicador de fim da galeria */}
      {visibleCount >= totalImages && (
        <div className="gallery-end" style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
          <p>🎉 Todas as {totalImages} fotos foram carregadas!</p>
        </div>
      )}

      {/* Modal de visualização em tamanho original */}
      <Modal 
        show={showModal} 
        onHide={closeModal} 
        size="xl" 
        centered
        className="gallery-modal"
        backdrop="static"
      >
        <Modal.Body className="p-0">
          <div className="modal-content-wrapper">
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            <div className="modal-image-container">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={`Foto ${selectedIndex}`}
                  className="modal-image"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain', // Mantém ratio original
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              )}
            </div>

            {visibleCount > 1 && (
              <>
                <button className="modal-nav prev" onClick={showPrevious}>
                  <FaChevronLeft />
                </button>
                <button className="modal-nav next" onClick={showNext}>
                  <FaChevronRight />
                </button>
              </>
            )}

            <div className="modal-counter">
              {selectedIndex} / {visibleCount}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StableGallery; 