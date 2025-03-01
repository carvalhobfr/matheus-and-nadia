import { useTranslation } from 'react-i18next';
import './Gifts.scss';

const Gifts = () => {
  const { t } = useTranslation();

  return (
    <section id="gifts" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('gifts.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="100">{t('gifts.intro')}</p>
        </div>

        <div className="row">
          <div className="col-lg-12 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
            <div className="gift-option">
              <div className="text-center">
                <i className="fas fa-plane gift-icon"></i>
                <h3>{t('gifts.honeymoon.title')}</h3>
                <p>{t('gifts.honeymoon.description')}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-12 col-md-6">
            <div className="row">
              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                <div className="gift-option">
                  <div className="text-center">
                    <i className="fas fa-mobile-alt gift-icon"></i>
                    <h3>{t('gifts.mbway.title')}</h3>
                    <p>{t('gifts.mbway.description')}</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="border rounded p-3 bg-light">
                        <code>{t('gifts.mbway.number')}</code>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => navigator.clipboard.writeText(t('gifts.mbway.number'))}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                <div className="gift-option">
                  <div className="text-center">
                    <i className="fas fa-qrcode gift-icon"></i>
                    <h3>{t('gifts.pix.title')}</h3>
                    <p>{t('gifts.pix.description')}</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="border rounded p-3 bg-light">
                        <code>{t('gifts.pix.key')}</code>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => navigator.clipboard.writeText(t('gifts.pix.key'))}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                <div className="gift-option">
                  <div className="text-center">
                    <i className="fas fa-money-bill-wave gift-icon"></i>
                    <h3>{t('gifts.bizum.title')}</h3>
                    <p>{t('gifts.bizum.description')}</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="border rounded p-3 bg-light">
                        <code>{t('gifts.bizum.number')}</code>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => navigator.clipboard.writeText(t('gifts.bizum.number'))}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gifts; 