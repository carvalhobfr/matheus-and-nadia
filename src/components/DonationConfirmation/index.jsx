import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const DonationConfirmation = ({ isOpen, onClose, paymentMethod }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSendMessage = () => {
    onClose();
    navigate('/message', { state: { fromDonation: true, paymentMethod } });
  };

  return (
    <div className="donation-confirmation-overlay">
      <div className="donation-confirmation-modal">
        <h2>{t('gifts.confirmation.title')}</h2>
        <p>{t('gifts.confirmation.message')}</p>
        <p className="confirmation-question">{t('gifts.confirmation.question')}</p>
        <div className="confirmation-buttons">
          <button className="btn btn-primary" onClick={handleSendMessage}>
            {t('gifts.confirmation.yes')}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            {t('gifts.confirmation.no')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationConfirmation; 