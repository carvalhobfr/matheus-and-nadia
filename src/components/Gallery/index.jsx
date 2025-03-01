import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Gallery.scss';

// In a real application, you would have actual images
// import gallery1 from '../../assets/gallery/gallery1.jpg';
// import gallery2 from '../../assets/gallery/gallery2.jpg';
// import gallery3 from '../../assets/gallery/gallery3.jpg';
// import gallery4 from '../../assets/gallery/gallery4.jpg';
// import gallery5 from '../../assets/gallery/gallery5.jpg';
// import gallery6 from '../../assets/gallery/gallery6.jpg';

// For this demo, we'll use placeholder images
// Uncomment this to test with images
const placeholderImages = [
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
];

const Gallery = () => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  
  // Display only 9 images on the homepage
  const displayedImages = showAll ? placeholderImages : placeholderImages.slice(0, 9);
  const hasMoreImages = placeholderImages.length > 9;

  return (
    <section id="gallery" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('navbar.gallery')}</h2>
        </div>

        {placeholderImages.length === 0 ? (
          <div className="empty-gallery" data-aos="fade-up">
            <div className="empty-gallery-content">
              <i className="fas fa-camera fa-3x mb-3"></i>
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
                  <div className="gallery-item">
                    <img src={image} alt={`Gallery image ${index + 1}`} className="img-fluid" />
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
    </section>
  );
};

export default Gallery; 