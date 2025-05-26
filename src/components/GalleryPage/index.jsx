import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Button } from 'react-bootstrap';
import GalleryWithLazyLoad from '../Gallery/GalleryWithLazyLoad';
import './GalleryPage.scss';

const GalleryPage = () => {
  const { t } = useTranslation();
  const [batchSize, setBatchSize] = useState(30);
  
  return (
    <div className="gallery-page">
      <Container>
        <Row className="gallery-header">
          <Col>
            <h1 className="page-title">{t('gallery.pageTitle') || 'Nossa Galeria de Fotos'}</h1>
            <p className="page-description">
              {t('gallery.pageDescription') || 'Confira as fotos do nosso casamento. As fotos são carregadas automaticamente conforme você rola a página.'}
            </p>
          </Col>
        </Row>
      </Container>
      
      <GalleryWithLazyLoad 
        title={t('gallery.title') || 'Galeria de Fotos'} 
        showLimited={false}
        batchSize={batchSize}
      />
      
      <Container>
        <Row className="gallery-footer">
          <Col className="text-center">
            <div className="batch-size-controls">
              <p>{t('gallery.batchSizeLabel') || 'Imagens por carregamento:'}</p>
              <div className="btn-group">
                <Button 
                  variant={batchSize === 15 ? 'primary' : 'outline-primary'} 
                  onClick={() => setBatchSize(15)}
                >
                  15
                </Button>
                <Button 
                  variant={batchSize === 30 ? 'primary' : 'outline-primary'} 
                  onClick={() => setBatchSize(30)}
                >
                  30
                </Button>
                <Button 
                  variant={batchSize === 50 ? 'primary' : 'outline-primary'} 
                  onClick={() => setBatchSize(50)}
                >
                  50
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GalleryPage; 