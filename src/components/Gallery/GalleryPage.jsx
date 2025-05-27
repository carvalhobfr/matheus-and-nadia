import { useTranslation } from 'react-i18next';
import ResponsiveGallery from './ResponsiveGallery';
import './GalleryPage.scss';

const GalleryPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="gallery-page-wrapper">
      <ResponsiveGallery 
        title={t('gallery.title')}
        showLimited={false}
        batchSize={30}
      />
    </div>
  );
};

export default GalleryPage; 