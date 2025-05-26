import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Gallery as PhotoSwipeGallery, Item as PhotoSwipeItem } from 'photoswipe-react';
import 'photoswipe/dist/photoswipe.css';
import { FaSearchPlus, FaCamera, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { getBasePath, getFullImagePath, getTotalImageCount, getThumbnailPath } from '../../utils/imageUtils';
import './Gallery.scss';
import { Link, useSearchParams } from 'react-router-dom';

const GalleryWithLazyLoad = ({ 
  title, 
  showLimited = false, 
  itemLimit = 21, // 7 linhas × 3 imagens por linha
  batchSize = showLimited ? 9 : 15 // Para homepage, carrega apenas 9 imagens inicialmente (3 linhas)
}) => {
  const { t } = useTranslation();
  const [pswpOpen, setPswpOpen] = useState(false);
  const [pswpIndex, setPswpIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingPhotoToOpen, setPendingPhotoToOpen] = useState(null);
  
  // Memoiza o total de imagens para evitar recálculos
  const totalImages = useMemo(() => getTotalImageCount(), []);
  
  // Função otimizada para carregar as imagens
  const loadImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    console.log(`🔄 Carregando lote ${page} de imagens...`);
    
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
    
    console.log(`📸 Adicionando ${newImages.length} novas imagens (${startIndex}-${endIndex})`);
    
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
        console.log('🎯 Última imagem visível, carregando mais...');
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
  
  // Verificar parâmetro 'foto' na URL ao carregar
  useEffect(() => {
    const fotoParam = searchParams.get('foto');
    if (fotoParam) {
      const targetImageIndex = parseInt(fotoParam);
      setPendingPhotoToOpen(targetImageIndex);
    }
  }, [searchParams]);

  // Abrir galeria automaticamente quando a imagem estiver disponível
  useEffect(() => {
    if (pendingPhotoToOpen && images.length > 0) {
      // Encontrar o índice da imagem correspondente no array atual
      const idx = images.findIndex(img => img.index === pendingPhotoToOpen);
      
      if (idx !== -1) {
        // Imagem já está carregada, abrir modal
        console.log(`🎯 Abrindo modal para foto ${pendingPhotoToOpen} no índice ${idx}`);
        setPswpIndex(idx);
        setPswpOpen(true);
        setPendingPhotoToOpen(null); // Limpar o estado pendente
      } else {
        // Imagem ainda não foi carregada, verificar se precisamos carregar mais
        const lastLoadedIndex = images[images.length - 1]?.index || 0;
        const needToLoadMore = pendingPhotoToOpen > lastLoadedIndex;
        
        if (needToLoadMore && hasMore && !loading) {
          console.log(`🔄 Carregando mais imagens para encontrar foto ${pendingPhotoToOpen} (última carregada: ${lastLoadedIndex})`);
          loadImages();
        }
      }
    }
  }, [pendingPhotoToOpen, images, hasMore, loading, loadImages]);
  
  // Função para abrir a galeria PhotoSwipe
  const openImageModal = useCallback((image, index) => {
    setPswpIndex(index);
    setPswpOpen(true);
    setSearchParams({ foto: image.index });
  }, [setSearchParams]);
  
  // Função para fechar a galeria
  const closeImageModal = useCallback(() => {
    setPswpOpen(false);
    setPendingPhotoToOpen(null);
    searchParams.delete('foto');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  // Componente otimizado para a imagem com lazy loading
  const LazyImage = ({ image, index, isLast }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef();
    
    const handleImageLoad = useCallback(() => {
      setLoaded(true);
      console.log(`✅ Imagem ${image.index} carregada`);
    }, [image.index]);
    
    const handleImageError = useCallback(() => {
      setError(true);
      console.error(`❌ Erro ao carregar imagem ${image.index}`);
    }, [image.index]);
    
    return (
      <div 
        className="col-md-4 mb-4" 
        ref={isLast ? lastImageRef : imgRef}
        data-aos="fade-up"
        data-aos-delay={showLimited ? index * 30 : index * 50}
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
                style={{
                  opacity: loaded ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }}
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
  
  // Montar os itens para o PhotoSwipe
  const pswpItems = images.map(img => ({
    src: img.fullPath,
    msrc: img.thumbnailPath,
    width: 1200,
    height: 800,
    alt: `Foto do casamento ${img.index}`
  }));
  
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
      
      {/* Modal para visualização da imagem estilo iOS */}
      <PhotoSwipeGallery
        open={pswpOpen}
        close={closeImageModal}
        options={{ index: pswpIndex, bgOpacity: 0.95, showHideAnimationType: 'zoom', wheelToZoom: true }}
        slides={pswpItems}
        onIndexChange={setPswpIndex}
      />
    </section>
  );
};

export default GalleryWithLazyLoad; 