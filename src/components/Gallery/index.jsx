import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { FaSearchPlus, FaCamera } from 'react-icons/fa';
import { useImages } from '../../contexts/ImageContext';
import './Gallery.scss';

// For this demo, we'll use placeholder images
// Uncomment this to test with images
// const placeholderImages = [
  // 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Matheus+and+Nadia+1',
  // 'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Matheus+and+Nadia+2',
  // 'https://via.placeholder.com/600x400/FFE66D/FFFFFF?text=Matheus+and+Nadia+3',
  // 'https://via.placeholder.com/600x400/2C3E50/FFFFFF?text=Matheus+and+Nadia+4',
  // 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Matheus+and+Nadia+5',
  // 'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Matheus+and+Nadia+6',
  // 'https://via.placeholder.com/600x400/FFE66D/FFFFFF?text=Matheus+and+Nadia+7',
  // 'https://via.placeholder.com/600x400/2C3E50/FFFFFF?text=Matheus+and+Nadia+8',
  // 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Matheus+and+Nadia+9',
  // 'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Matheus+and+Nadia+10',
  // 'https://via.placeholder.com/600x400/FFE66D/FFFFFF?text=Matheus+and+Nadia+11',
  // 'https://via.placeholder.com/600x400/2C3E50/FFFFFF?text=Matheus+and+Nadia+12',
// ];

const Gallery = () => {
  const { t } = useTranslation();
  const { images } = useImages();
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Obter as imagens da galeria do contexto
  const galleryImages = [
    images['gallery-1'],
    images['gallery-2'],
    images['gallery-3'],
    images['gallery-4']
  ];
  
  // Display only all available images on the homepage
  const displayedImages = galleryImages.filter(img => img); // Remove any undefined images
  const hasMoreImages = false; // Desabilitando o botão de "Ver mais" por enquanto

  // Função para abrir o modal com a imagem selecionada
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeImageModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('gallery.title')}</h2>
        </div>

        {displayedImages.length === 0 ? (
          <div className="empty-gallery" data-aos="fade-up">
            <div className="empty-gallery-content">
              <FaCamera size={48} className="mb-3" />
              <h3>Em breve, memórias do nosso grande dia!</h3>
              <p>Estamos ansiosos para compartilhar os momentos especiais do nosso casamento com vocês.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              {displayedImages.map((image, index) => (
                <div 
                  key={index} 
                  className="col-md-4 col-sm-6"
                  data-aos="fade-up"
                  data-aos-delay={100 * (index % 3 + 1)}
                >
                  <div className="gallery-item" onClick={() => openImageModal(image)}>
                    <img src={image} alt={`Gallery image ${index + 1}`} className="img-fluid" />
                    <div className="gallery-overlay">
                      <div className="gallery-zoom-icon">
                        <FaSearchPlus />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMoreImages && !showAll && (
              <div className="text-center mt-4" data-aos="fade-up">
                <Link to="/gallery" className="view-more-link">
                  Ver todas as fotos <i className="fas fa-arrow-right ms-2"></i>
                </Link>
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
          <Modal.Title>{t('gallery.imageViewer')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="image-modal-container">
              <img 
                src={selectedImage} 
                alt="Expanded view" 
                className="modal-image" 
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Gallery; 