import GalleryWithLazyLoad from './GalleryWithLazyLoad';
import DebugGallery from './DebugGallery';
import './GalleryPage.scss';

const GalleryPage = () => {
  return (
    <div className="gallery-page-wrapper">
      <DebugGallery />
      <hr />
      <GalleryWithLazyLoad 
        title="Galeria de Fotos"
        showLimited={false}
        batchSize={30}
      />
    </div>
  );
};

export default GalleryPage; 