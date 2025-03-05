import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './MessageForm.scss';

const MessageForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFromDonation = location.state?.fromDonation;
  const paymentMethod = location.state?.paymentMethod;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        is_donation: isFromDonation ? 'Yes' : 'No',
        payment_method: paymentMethod || 'N/A'
      };

      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      );

      setStatus({
        type: 'success',
        message: t('message.thanks')
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: t('message.form.error.generic')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="message-form-container">
      <h2>{t('message.title')}</h2>
      <p>{t('message.intro')}</p>
      {isFromDonation && (
        <p className="donation-note">
          {t('message.donation_note', { paymentMethod })}
        </p>
      )}
      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="name">{t('message.form.name')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{t('message.form.email')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">{t('message.form.message')}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('message.form.sending') : t('message.form.submit')}
        </button>
      </form>
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default MessageForm; 