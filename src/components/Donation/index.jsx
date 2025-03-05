import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DonationConfirmation from '../DonationConfirmation';
import './styles.css';

const Donation = () => {
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentMethodClick = (method) => {
    setSelectedPaymentMethod(method);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedPaymentMethod(null);
  };

  // Experiências na Tailândia que os convidados podem presentear
  const thailandExperiences = [
    {
      title: t('gifts.experiences.beach.title'),
      description: t('gifts.experiences.beach.description'),
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1539&q=80',
    },
    {
      title: t('gifts.experiences.temple.title'),
      description: t('gifts.experiences.temple.description'),
      image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      title: t('gifts.experiences.food.title'),
      description: t('gifts.experiences.food.description'),
      image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    },
    {
      title: t('gifts.experiences.elephant.title'),
      description: t('gifts.experiences.elephant.description'),
      image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    }
  ];

  return (
    <div className="donation-container">
      <h2>{t('gifts.title')}</h2>
      <p>{t('gifts.intro')}</p>

      <div className="thailand-experiences">
        <h3>{t('gifts.experiences.title')}</h3>
        <p>{t('gifts.experiences.intro')}</p>
        
        <div className="experiences-grid">
          {thailandExperiences.map((experience, index) => (
            <div className="experience-card" key={index}>
              <div className="experience-image" style={{ backgroundImage: `url(${experience.image})` }}></div>
              <div className="experience-content">
                <h4>{experience.title}</h4>
                <p>{experience.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="payment-title">{t('gifts.payment.title')}</h3>
      <p>{t('gifts.payment.description')}</p>

      <div className="payment-methods">
        <div className="payment-method">
          <h3>{t('gifts.mbway.title')}</h3>
          <p>{t('gifts.mbway.description')}</p>
          <div className="payment-details">
            <span>{t('gifts.mbway.number')}</span>
          </div>
          <button 
            className="payment-button"
            onClick={() => handlePaymentMethodClick('MBWay')}
          >
            {t('gifts.mbway.title')}
          </button>
        </div>

        <div className="payment-method">
          <h3>{t('gifts.pix.title')}</h3>
          <p>{t('gifts.pix.description')}</p>
          <div className="payment-details">
            <span>{t('gifts.pix.key')}</span>
          </div>
          <button 
            className="payment-button"
            onClick={() => handlePaymentMethodClick('Pix')}
          >
            {t('gifts.pix.title')}
          </button>
        </div>

        <div className="payment-method">
          <h3>{t('gifts.bizum.title')}</h3>
          <p>{t('gifts.bizum.description')}</p>
          <div className="payment-details">
            <span>{t('gifts.bizum.number')}</span>
          </div>
          <button 
            className="payment-button"
            onClick={() => handlePaymentMethodClick('Bizum')}
          >
            {t('gifts.bizum.title')}
          </button>
        </div>
      </div>

      <div className="payment-note">
        <p>* {t('gifts.accounts_note')}</p>
      </div>

      <DonationConfirmation
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        paymentMethod={selectedPaymentMethod}
      />
    </div>
  );
};

export default Donation; 