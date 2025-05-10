import React from 'react';
import { useTranslation } from 'react-i18next';

const Video: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="video" className="section py-16 bg-white">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('video.title', 'Nosso Vídeo')}</h2>
        </div>
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/gnrjdC9N2Lw"
              title={t('video.title', 'Nosso Vídeo')}
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