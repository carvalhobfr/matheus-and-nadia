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

  return (
    <div className="donation-container">
      <h2>{t('gifts.title')}</h2>
      <p>{t('gifts.intro')}</p>

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

      <DonationConfirmation
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        paymentMethod={selectedPaymentMethod}
      />
    </div>
  );
};

export default Donation; 