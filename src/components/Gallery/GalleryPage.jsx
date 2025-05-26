import IOSGallery from './IOSGallery';
import './GalleryPage.scss';

const GalleryPage = () => {
  return (
    <div className="gallery-page-wrapper">
      <IOSGallery 
        title="Galeria de Fotos"
        showLimited={false}
        batchSize={30}
      />
    </div>
  );
};

export default GalleryPage; 