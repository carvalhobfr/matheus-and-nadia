import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ProfessionalGallery.scss';

const SimpleGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalImages = getTotalImageCount();
  const IMAGES_PER_PAGE = 36; // Carregar 36 fotos por vez

  // Carregar imagens iniciais
  useEffect(() => {
    const loadInitialImages = () => {
      console.log('🚀 Carregando 36 imagens iniciais...');
      
      const imagesToLoad = Math.min(IMAGES_PER_PAGE, totalImages);
      const newImages = [];
      
      for (let i = 1; i <= imagesToLoad; i++) {
        newImages.push({
          id: i,
          index: i,
          thumbnailPath: getThumbnailPath(i),
          fullPath: getFullImagePath(i)
        });
      }
      
      console.log(`✅ Carregadas ${newImages.length} imagens iniciais`);
      setImages(newImages);
      setLoading(false);
    };

    loadInitialImages();
  }, []); // Array vazio - executa apenas uma vez

  // Função para carregar mais imagens de forma natural
  const loadMoreImages = useCallback(() => {
    if (loadingMore || images.length >= totalImages) return;
    
    setLoadingMore(true);
    console.log(`🔄 Carregando próximas 36 imagens... Lote ${currentPage + 1}`);
    
    const startIndex = images.length + 1;
    const endIndex = Math.min(startIndex + IMAGES_PER_PAGE - 1, totalImages);
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
    
    // Carregamento instantâneo para evitar piscar
    setImages(prevImages => [...prevImages, ...newImages]);
    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  }, [loadingMore, images.length, totalImages, currentPage]);

  // Ref para o elemento trigger
  const triggerRef = useRef(null);

  // Intersection Observer simples e estável
  useEffect(() => {
    const currentTrigger = triggerRef.current;
    if (!currentTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loadingMore && images.length < totalImages) {
          console.log(`🎯 Trigger ativado - carregando próximas 36 fotos`);
          loadMoreImages();
        }
      },
      { 
        rootMargin: '800px', // Carregar bem antes de chegar no final
        threshold: 0.1 
      }
    );

    observer.observe(currentTrigger);

    return () => {
      observer.unobserve(currentTrigger);
    };
  }, [loadMoreImages]);

  // Funções do modal
  const openModal = (image, index) => {
    setSelectedImage(image.fullPath);
    setSelectedIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const showNext = () => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex].fullPath);
  };

  const showPrevious = () => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex].fullPath);
  };

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
  }, [showModal, selectedIndex, images]);

  // Componente de imagem individual memoizado para evitar re-renders
  const GalleryImage = memo(({ image, index, onImageClick }) => {
    return (
      <div 
        className="gallery-item"
      >
        <div className="image-container">
          <img
            src={image.thumbnailPath}
            alt={`Foto ${image.index}`}
            className="gallery-image"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              visibility: 'visible'
            }}
            onLoad={(e) => {
              console.log(`✅ Galeria - Imagem ${image.index} carregada`);
              e.target.style.opacity = '1';
            }}
            onError={(e) => {
              console.error(`❌ Galeria - Erro na imagem ${image.index}: ${image.thumbnailPath}`);
              e.target.style.backgroundColor = '#ffebee';
              e.target.style.border = '2px dashed #f44336';
              e.target.style.opacity = '1';
            }}
            onClick={() => onImageClick(image, index)}
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
            <FaSearchPlus className="zoom-icon" />
          </div>
        </div>
      </div>
    );
  });

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
          Mostrando {images.length} de {totalImages} fotos 
          {images.length < totalImages && ` • Lote ${currentPage} de ${Math.ceil(totalImages / IMAGES_PER_PAGE)}`}
        </p>
      </div>

      <div className="gallery-grid">
        {images.map((image, index) => (
          <GalleryImage
            key={image.id}
            image={image}
            index={index}
            onImageClick={openModal}
          />
        ))}
      </div>

      {/* Elemento trigger para infinite scroll */}
      {images.length < totalImages && (
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
            Carregando mais 36 fotos... {images.length} de {totalImages}
          </p>
        </div>
      )}

      {/* Indicador de fim da galeria */}
      {images.length >= totalImages && (
        <div className="gallery-end" style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
          <p>🎉 Todas as {totalImages} fotos foram carregadas!</p>
        </div>
      )}

      {/* Modal de visualização */}
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
                  alt={`Foto ${selectedIndex + 1}`}
                  className="modal-image"
                />
              )}
            </div>

            {images.length > 1 && (
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
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SimpleGallery; 