import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ProfessionalGallery.scss';

// Componente de imagem com modal funcional
const StableImage = memo(({ imageIndex, onImageClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const thumbnailPath = getThumbnailPath(imageIndex);
  const fullPath = getFullImagePath(imageIndex);

  return (
    <div className="gallery-item">
      <div className="image-container">
        {!loaded && !error && (
          <div className="image-placeholder">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {error && (
          <div className="image-error">
            <span>Erro ao carregar imagem {imageIndex}</span>
          </div>
        )}
        
        <img
          src={thumbnailPath}
          alt={`Foto ${imageIndex}`}
          className="gallery-image"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: loaded ? 'block' : 'none',
            position: 'relative',
            zIndex: 1,
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
            setError(true);
          }}
          onClick={() => onImageClick({ fullPath, index: imageIndex })}
        />
        
        {loaded && (
          <div 
            className="image-overlay"
            onClick={() => onImageClick({ fullPath, index: imageIndex })}
          >
            <FaSearchPlus className="zoom-icon" />
          </div>
        )}
      </div>
    </div>
  );
});

const StableGallery = () => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(24); // Começar com menos imagens
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const totalImages = getTotalImageCount();
  const IMAGES_PER_BATCH = 24; // Reduzir o batch size para melhor performance
  const triggerRef = useRef(null);
  const observerRef = useRef(null);

  // Carregamento inicial
  useEffect(() => {
    console.log('🚀 Carregando galeria estável...');
    console.log(`Total de imagens: ${totalImages}`);
    setLoading(false);
  }, [totalImages]);

  // Função para carregar mais imagens
  const loadMoreImages = useCallback(() => {
    console.log(`🔄 Tentando carregar mais imagens. Estado atual:`, {
      loadingMore,
      visibleCount,
      totalImages,
      hasMore: visibleCount < totalImages
    });
    
    if (loadingMore || visibleCount >= totalImages) {
      console.log('❌ Bloqueado:', { loadingMore, visibleCount, totalImages });
      return;
    }
    
    setLoadingMore(true);
    console.log(`🔄 Carregando mais ${IMAGES_PER_BATCH} imagens...`);
    
    // Simular um pequeno delay para evitar múltiplas chamadas
    setTimeout(() => {
      const newCount = Math.min(visibleCount + IMAGES_PER_BATCH, totalImages);
      console.log(`📈 Aumentando visibleCount de ${visibleCount} para ${newCount}`);
      setVisibleCount(newCount);
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, visibleCount, totalImages]);

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const currentTrigger = triggerRef.current;
    if (!currentTrigger || visibleCount >= totalImages) {
      console.log('🚫 Observer não criado:', { currentTrigger: !!currentTrigger, visibleCount, totalImages });
      return;
    }

    // Limpar observer anterior se existir
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('👁️ Observer triggered:', {
          isIntersecting: target.isIntersecting,
          loadingMore,
          visibleCount,
          totalImages,
          hasMore: visibleCount < totalImages
        });
        
        if (target.isIntersecting && !loadingMore && visibleCount < totalImages) {
          console.log(`🎯 Trigger ativado - carregando mais imagens`);
          loadMoreImages();
        }
      },
      { 
        rootMargin: '300px', // Reduzir para trigger mais próximo
        threshold: 0.1 
      }
    );

    observerRef.current.observe(currentTrigger);
    console.log('👁️ Observer criado e observando trigger');

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreImages, visibleCount, totalImages, loadingMore]);

  // Cleanup do observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
            height: '50px', 
            width: '100%', 
            margin: '20px 0',
            backgroundColor: 'transparent',
            border: '1px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#999'
          }} 
        >
          Trigger Zone - {visibleCount}/{totalImages}
        </div>
      )}

      {/* Indicador de carregamento */}
      {loadingMore && (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>Carregando mais {IMAGES_PER_BATCH} fotos... {visibleCount} de {totalImages}</p>
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