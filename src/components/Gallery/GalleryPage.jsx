import GalleryWithLazyLoad from './GalleryWithLazyLoad';
import './GalleryPage.scss';

const GalleryPage = () => {
  return (
    <div className="gallery-page-wrapper">
      <GalleryWithLazyLoad 
        title="Galeria de Fotos"
        showLimited={false}
        batchSize={30}
      />
    </div>
  );
};

export default GalleryPage; 