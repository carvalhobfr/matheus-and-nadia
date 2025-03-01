import { useTranslation } from 'react-i18next';
import './Story.scss';

const Story = () => {
  const { t } = useTranslation();
  const timeline = t('story.timeline', { returnObjects: true });

  return (
    <section id="story" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('story.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="100">{t('story.intro')}</p>
        </div>

        <div className="timeline">
          {timeline.map((item, index) => (
            <div 
              key={index} 
              className="timeline-item"
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={100 * (index + 1)}
            >
              <div className="timeline-content">
                <h4>{item.title}</h4>
                <h6>{item.date}</h6>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Story; 