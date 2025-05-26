import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  
  // Memoiza o total de imagens para evitar recálculos
  const totalImages = useMemo(() => getTotalImageCount(), []);
  
  // Função otimizada para carregar as imagens
  const loadImages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Calcular o intervalo de imagens a serem carregadas
      const start = (page - 1) * batchSize + 1;
      const end = showLimited ? Math.min(start + itemLimit - 1, totalImages) : Math.min(start + batchSize - 1, totalImages);
      
      if (start > totalImages) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const newImages = [];
      for (let i = start; i <= end; i++) {
        newImages.push({
          id: i,
          loaded: false,
          fullPath: getFullImagePath(i),
          thumbnailPath: getThumbnailPath(i),
          index: i
        });
      }
      
      // Se estamos no modo limitado, não precisamos carregar mais imagens
      if (showLimited) {
        setHasMore(false);
      } else {
        setHasMore(end < totalImages);
      }
      
      // Adiciona as novas imagens ao estado
      setImages(prev => [...prev, ...newImages]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  }, [page, batchSize, loading, hasMore, showLimited, itemLimit, totalImages]);
  
  // Observer otimizado para lazy loading
  const lastImageRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !showLimited) {
        loadImages();
      }
    }, {
      rootMargin: '100px' // Carrega imagens quando estão 100px antes de aparecer
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadImages, showLimited]);
  
  // Carrega as primeiras imagens quando o componente monta
  useEffect(() => {
    loadImages();
  }, []); // Removido loadImages da dependência para evitar loops
  
  // Função para abrir o modal com a imagem selecionada
  const openImageModal = useCallback((image, index) => {
    setSelectedImage(image.fullPath);
    setCurrentImageIndex(index);
    setShowModal(true);
  }, []);
  
  // Função para fechar o modal
  const closeImageModal = useCallback(() => {
    setShowModal(false);
    setSelectedImage(null);
  }, []);
  
  // Função para navegar para a próxima imagem
  const showNextImage = useCallback(() => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(images[nextIndex].fullPath);
  }, [currentImageIndex, images]);
  
  // Função para navegar para a imagem anterior
  const showPreviousImage = useCallback(() => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(images[prevIndex].fullPath);
  }, [currentImageIndex, images]);
  
  // Adicionar suporte para navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal) return;
      
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPreviousImage();
      } else if (e.key === 'Escape') {
        closeImageModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showNextImage, showPreviousImage, closeImageModal]);
  
  // Componente otimizado para a imagem com lazy loading
  const LazyImage = ({ image, index, isLast }) => {
    const imgRef = useRef();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !loaded && !error) {
            setLoaded(true);
          }
        },
        {
          rootMargin: '50px' // Carrega quando está 50px antes de aparecer
        }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, [loaded, error]);
    
    const handleImageError = useCallback(() => {
      setError(true);
    }, []);
    
    const handleImageLoad = useCallback(() => {
      setLoaded(true);
    }, []);
    
    return (
      <div 
        className="col-md-4 mb-4" 
        ref={isLast ? lastImageRef : imgRef}
        data-aos="fade-up"
        data-aos-delay={showLimited ? index * 30 : index * 50} // Animação mais rápida na homepage
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
            
            {loaded && (
              <img
                src={image.thumbnailPath}
                alt={`Foto do casamento ${image.index}`}
                className="gallery-image"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => openImageModal(image, index)}
              />
            )}
            
            <div className="image-overlay">
              <FaSearchPlus 
                size={24} 
                className="zoom-icon"
                onClick={() => openImageModal(image, index)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <section className="gallery-section py-5">
      <div className="container">
        {title && (
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">{title}</h2>
            <div className="title-divider mx-auto"></div>
          </div>
        )}
        
        <div className="row">
          {images.map((image, index) => (
            <LazyImage
              key={image.id}
              image={image}
              index={index}
              isLast={index === images.length - 1}
            />
          ))}
        </div>
        
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
      
      {/* Modal para visualização da imagem */}
      <Modal 
        show={showModal} 
        onHide={closeImageModal} 
        size="xl" 
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            {t('gallery.imageViewer')} ({currentImageIndex + 1}/{images.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="modal-image-container">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={`Foto do casamento ${currentImageIndex + 1}`}
                className="modal-image"
                loading="lazy"
              />
            )}
            
            {images.length > 1 && (
              <>
                <button
                  className="modal-nav-btn modal-nav-prev"
                  onClick={showPreviousImage}
                  aria-label="Foto anterior"
                >
                  <FaChevronLeft size={24} />
                </button>
                
                <button
                  className="modal-nav-btn modal-nav-next"
                  onClick={showNextImage}
                  aria-label="Próxima foto"
                >
                  <FaChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default GalleryWithLazyLoad; 