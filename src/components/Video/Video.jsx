import React from 'react';
import { useTranslation } from 'react-i18next';
import './Video.scss';

const Video = () => {
  const { t } = useTranslation();

  return (
    <section id="video" className="section py-16 bg-white">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('gallery.video.title', 'Nosso Vídeo')}</h2>
        </div>
        <div className="video-container" data-aos="fade-up">
          <div className="responsive-video">
            <iframe
              src="https://www.youtube.com/embed/gnrjdC9N2Lw"
              title={t('gallery.video.title', 'Nosso Vídeo')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video; 