import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './ProfessionalGallery.scss';

const ProfessionalGallery = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const observer = useRef();
  const totalImages = getTotalImageCount();
  const IMAGES_PER_BATCH = 18;

  // Função simples para carregar lote de imagens
  const loadImageBatch = () => {
    if (loading || !hasMore) {
      console.log('Bloqueado:', { loading, hasMore });
      return;
    }

    console.log('Carregando lote:', currentPage);
    setLoading(true);
    
    const startIndex = currentPage * IMAGES_PER_BATCH;
    const endIndex = Math.min(startIndex + IMAGES_PER_BATCH, totalImages);
    
    if (startIndex >= totalImages) {
      console.log('Fim das imagens');
      setHasMore(false);
      setLoading(false);
      return;
    }

    const newImages = [];
    for (let i = startIndex; i < endIndex; i++) {
      const imageIndex = i + 1;
      newImages.push({
        id: imageIndex,
        index: imageIndex,
        thumbnailPath: getThumbnailPath(imageIndex),
        fullPath: getFullImagePath(imageIndex),
        loaded: false
      });
    }

    console.log(`Adicionando ${newImages.length} imagens (${startIndex + 1} a ${endIndex})`);
    setImages(prev => [...prev, ...newImages]);
    setCurrentPage(prev => prev + 1);
    setHasMore(endIndex < totalImages);
    setLoading(false);
  };

  // Observer para infinite scroll
  const lastImageRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          if (!loading && hasMore) {
            loadImageBatch();
          }
        }, 100);
      }
    }, {
      rootMargin: '200px'
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Inicializar apenas uma vez
  useEffect(() => {
    if (!initialized) {
      loadImageBatch();
      setInitialized(true);
    }
  }, [initialized]);

  // Funções do modal
  const openModal = useCallback((image, index) => {
    setSelectedImage(image.fullPath);
    setSelectedIndex(index);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedImage(null);
  }, []);

  const showNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex].fullPath);
  }, [selectedIndex, images]);

  const showPrevious = useCallback(() => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex].fullPath);
  }, [selectedIndex, images]);

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

  // Componente de imagem individual
  const GalleryImage = ({ image, index, isLast }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
      const currentRef = imgRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !imageLoaded && !imageError) {
            setImageLoaded(true);
          }
        },
        { rootMargin: '100px' }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [imageLoaded, imageError]);

    return (
      <div 
        className="gallery-item"
        ref={isLast ? lastImageRef : imgRef}
        data-aos="fade-up"
        data-aos-delay={index % 6 * 100}
      >
        <div className="image-container">
          {!imageLoaded && !imageError && (
            <div className="image-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          {imageError && (
            <div className="image-error">
              <span>Erro ao carregar</span>
            </div>
          )}
          
          {imageLoaded && (
            <>
              <img
                src={image.thumbnailPath}
                alt={`Foto ${image.index}`}
                className="gallery-image"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                onClick={() => openModal(image, index)}
              />
              <div className="image-overlay">
                <FaSearchPlus className="zoom-icon" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="professional-gallery">
      <div className="gallery-header">
        <h1 className="gallery-title">{t('gallery.title')}</h1>
        <p className="gallery-subtitle">{t('gallery.subtitle')}</p>
      </div>

      <div className="gallery-grid">
        {images.map((image, index) => (
          <GalleryImage
            key={image.id}
            image={image}
            index={index}
            isLast={index === images.length - 1}
          />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner large"></div>
          <p>{t('gallery.loadingMore')}</p>
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

export default ProfessionalGallery; 