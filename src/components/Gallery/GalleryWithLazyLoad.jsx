import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaCamera, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { getBasePath, getFullImagePath, findCorrectImagePath, getTotalImageCount, getThumbnailPath } from '../../utils/imageUtils';
import './Gallery.scss';
import { Link } from 'react-router-dom';

const GalleryWithLazyLoad = ({ 
  title, 
  showLimited = false, 
  itemLimit = 21, // Alterado para 21 para ter 7 linhas com 3 imagens por linha
  batchSize = 30 // Número de imagens a serem carregadas de cada vez
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
  const lastImageElementRef = useRef();
  
  // Função para carregar as imagens
  const loadImages = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const totalImages = getTotalImageCount();
      
      // Calcular o intervalo de imagens a serem carregadas
      const start = (page - 1) * batchSize + 1;
      const end = showLimited ? Math.min(start + itemLimit - 1, totalImages) : start + batchSize - 1;
      
      const newImages = [];
      for (let i = start; i <= end && i <= totalImages; i++) {
        // Formatação do nome do arquivo: index-nome.jpg
        const fileIndex = (totalImages + 1) - i; // Inverte a ordem para começar da foto mais recente
        
        if (fileIndex <= 0) {
          setHasMore(false);
          break;
        }
        
        newImages.push({
          id: fileIndex,
          loaded: false,
          fullPath: null,
          thumbnailPath: null,
          index: fileIndex.toString()
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
  }, [page, batchSize, loading, hasMore, showLimited, itemLimit]);
  
  // Inicializa o observer para o carregamento lazy
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
  
  // Carrega as primeiras imagens quando o componente monta
  useEffect(() => {
    loadImages();
  }, [loadImages]);
  
  // Função para obter os caminhos das imagens (thumbnail e completa)
  const getImagePaths = useCallback(async (image) => {
    if (image.fullPath && image.thumbnailPath) {
      return { fullPath: image.fullPath, thumbnailPath: image.thumbnailPath };
    }
    
    try {
      // Obtem o caminho do thumbnail
      const thumbnailPath = getThumbnailPath(image.index);
      // Obtem o caminho da imagem completa
      const fullPath = getFullImagePath(image.index);
      
      // Atualiza o estado da imagem
      setImages(prev => prev.map(img => 
        img.id === image.id ? { 
          ...img, 
          loaded: true, 
          fullPath, 
          thumbnailPath 
        } : img
      ));
      
      return { fullPath, thumbnailPath };
    } catch (error) {
      console.error('Erro ao obter caminhos da imagem:', error);
      return { fullPath: null, thumbnailPath: null };
    }
  }, []);
  
  // Função para abrir o modal com a imagem selecionada
  const openImageModal = async (image, index) => {
    const { fullPath } = await getImagePaths(image);
    
    if (fullPath) {
      setSelectedImage(fullPath);
      setCurrentImageIndex(index);
      setShowModal(true);
    }
  };
  
  // Função para fechar o modal
  const closeImageModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };
  
  // Função para navegar para a próxima imagem
  const showNextImage = async () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
    
    const { fullPath } = await getImagePaths(images[nextIndex]);
    if (fullPath) {
      setSelectedImage(fullPath);
    }
  };
  
  // Função para navegar para a imagem anterior
  const showPreviousImage = async () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
    
    const { fullPath } = await getImagePaths(images[prevIndex]);
    if (fullPath) {
      setSelectedImage(fullPath);
    }
  };
  
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
  }, [showModal, currentImageIndex]);
  
  // Componente para a imagem com lazy loading
  const LazyImage = ({ image, index, isLast }) => {
    const imgRef = useRef();
    const [loaded, setLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Quando a imagem se torna visível, carrega o thumbnail
            const loadImage = async () => {
              try {
                const { thumbnailPath } = await getImagePaths(image);
                if (thumbnailPath) {
                  setImageSrc(thumbnailPath);
                }
              } catch (error) {
                console.error('Erro ao carregar imagem:', error);
              }
            };
            
            loadImage();
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }, [image]);
    
    return (
      <div 
        ref={isLast ? lastImageRef : null}
        className="col-md-4 col-sm-6"
        data-aos="fade-up"
        data-aos-delay={100 * (index % 3 + 1)}
      >
        <div 
          className={`gallery-item ${!imageSrc ? 'loading' : ''}`} 
          onClick={() => imageSrc && openImageModal(image, index)}
          ref={imgRef}
        >
          {imageSrc ? (
            <>
              <img 
                src={imageSrc} 
                alt={`Foto ${image.id}`} 
                className={`img-fluid ${loaded ? 'loaded' : ''}`}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                width="600"
                height="400"
              />
              <div className="gallery-overlay">
                <div className="gallery-zoom-icon">
                  <FaSearchPlus />
                </div>
              </div>
            </>
          ) : (
            <div className="image-placeholder">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <section id="gallery" className={`section ${showLimited ? '' : 'full-gallery'}`}>
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{title || t('gallery.title')}</h2>
        </div>
        
        {images.length === 0 ? (
          <div className="empty-gallery" data-aos="fade-up">
            <div className="empty-gallery-content">
              <FaCamera className="empty-gallery-icon" />
              <h3>{t('gallery.empty.title') || 'Nenhuma Foto Ainda'}</h3>
              <p>{t('gallery.empty.message') || 'Estamos carregando as fotos do casamento, aguarde um momento.'}</p>
            </div>
          </div>
        ) : (
          <>
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
              <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            )}
            
            {showLimited && (
              <div className="text-center mt-5">
                <Link to="/gallery" className="btn btn-primary btn-lg view-more-btn">
                  {t('gallery.viewMorePhotos') || 'Ver Todas as Fotos'} <FaArrowRight className="ms-2" />
                </Link>
              </div>
            )}
            
            {!hasMore && !loading && !showLimited && (
              <div className="text-center mt-4">
                <p>{t('gallery.noMorePhotos') || 'Não há mais fotos para carregar'}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal para visualização ampliada da imagem */}
      <Modal 
        show={showModal} 
        onHide={closeImageModal} 
        centered 
        dialogClassName="image-modal"
        contentClassName="image-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {t('gallery.imageViewer') || 'Visualizador de Imagens'} ({currentImageIndex + 1}/{images.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="image-modal-container">
              {/* Botão para imagem anterior */}
              {images.length > 1 && (
                <button 
                  className="nav-button prev-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    showPreviousImage();
                  }}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
              )}
              
              <img 
                src={selectedImage} 
                alt="Expanded view" 
                className="modal-image" 
                loading="lazy"
                width="1200"
                height="800"
              />
              
              {/* Botão para próxima imagem */}
              {images.length > 1 && (
                <button 
                  className="nav-button next-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    showNextImage();
                  }}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default GalleryWithLazyLoad; 