import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import "./Details.scss";

const Details = () => {
  const { t } = useTranslation();

  return (
    <section id="details" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('details.title')}</h2>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="fas fa-ring fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                <h3>{t('details.ceremony.title')}</h3>
                <p className="mb-1">{t('details.ceremony.date')}</p>
                <p className="mb-1">{t('details.ceremony.location')}</p>
                <div className="timezone-info mt-3">
                  <h5>{t('details.ceremony.timezone.title')}</h5>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-globe-americas me-2"></i>{t('details.ceremony.timezone.brazil')}</li>
                    <li><i className="fas fa-globe-europe me-2"></i>{t('details.ceremony.timezone.portugal')}</li>
                    <li><i className="fas fa-globe-europe me-2"></i>{t('details.ceremony.timezone.spain')}</li>
                  </ul>
                </div>
               
                

              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="fas fa-gift fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                <h3>{t('gifts.title')}</h3>
                <p className="mb-3">{t('gifts.intro')}</p>
                <Link 
                  to="/gifts" 
                  className="btn btn-outline-primary"
                >
                  <i className="fas fa-heart me-2"></i>
                  {t('navbar.gifts')}
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="fas fa-glass-cheers fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                <h3>{t('details.reception.title')}</h3>
                <p className="mb-1">{t('details.reception.date')}</p>
                <p className="mb-1">{t('details.reception.time')}</p>
                <p className="mb-1">{t('details.reception.location')}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="fas fa-bed fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                <h3>{t('details.accommodation.title')}</h3>
                <p>{t('details.accommodation.description')}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="fas fa-tshirt fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                <h3>{t('details.dress.title')}</h3>
                <p>{t('details.dress.description')}</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Details; 