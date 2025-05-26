import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getThumbnailPath, getFullImagePath, getTotalImageCount } from '../../utils/imageUtils';
import './Gallery.scss';

const SimpleGalleryTest = ({ batchSize = 15 }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  
  const totalImages = getTotalImageCount();
  
  // Função para carregar as imagens
  const loadImages = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    console.log(`🔄 SimpleTest: Carregando lote ${page} de imagens...`);
    
    const startIndex = (page - 1) * batchSize + 1;
    const endIndex = Math.min(startIndex + batchSize - 1, totalImages);
    
    const newImages = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const thumbnailPath = getThumbnailPath(i);
      const fullPath = getFullImagePath(i);
      console.log(`🖼️ SimpleTest: Criando imagem ${i}: ${thumbnailPath}`);
      newImages.push({
        id: i,
        index: i,
        thumbnailPath,
        fullPath
      });
    }
    
    console.log(`📸 SimpleTest: Adicionando ${newImages.length} novas imagens (${startIndex}-${endIndex})`);
    
    setImages(prevImages => [...prevImages, ...newImages]);
    setPage(prev => prev + 1);
    setHasMore(endIndex < totalImages);
    setLoading(false);
  }, [loading, hasMore, page, batchSize, totalImages]);
  
  // Observer para carregar mais imagens
  const lastImageRef = useCallback(node => {
    console.log('🔗 SimpleTest: lastImageRef chamado:', { node: !!node, loading, hasMore });
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    if (!node) return;
    
    console.log('👀 SimpleTest: Configurando observer');
    observer.current = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('🎯 SimpleTest: Última imagem visível, carregando mais...');
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
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Simple Gallery Test - Sem PhotoSwipe</h2>
      <p>Total de imagens: {totalImages} | Carregadas: {images.length}</p>
      
      <div className="row">
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="col-md-4 mb-4"
            ref={index === images.length - 1 ? lastImageRef : null}
          >
            <div className="gallery-item">
              <div className="image-container">
                <img
                  src={image.thumbnailPath}
                  alt={`Foto ${image.index}`}
                  className="gallery-image"
                  loading="lazy"
                  onLoad={() => console.log(`✅ SimpleTest: Imagem ${image.index} carregada`)}
                  onError={() => console.error(`❌ SimpleTest: Erro na imagem ${image.index}`)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '5px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '2px 6px',
                  fontSize: '12px',
                  borderRadius: '3px'
                }}>
                  #{image.index}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-4">
          <p>Todas as imagens foram carregadas!</p>
        </div>
      )}
    </div>
  );
};

export default SimpleGalleryTest; 