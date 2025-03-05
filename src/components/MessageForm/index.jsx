import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { FaHeart, FaEnvelope, FaUserAlt, FaPaperPlane, FaCheck, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';
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
  const [formSubmitted, setFormSubmitted] = useState(false);

  const isFromDonation = location.state?.fromDonation;
  const paymentMethod = location.state?.paymentMethod;

  // Efeito para animar elementos quando visíveis
  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, [formSubmitted]);

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

      // Configuração do EmailJS com o service_id fornecido
      await emailjs.send(
        'service_m1kjfpc', // Service ID
        'template_9fnlvfn', // Você pode precisar verificar se este é o Template ID correto
        templateParams,
        '0J-P_RUXALNQkc7JG' // Public Key fornecida
      );
      
      setStatus({
        type: 'success',
        message: t('message.thanks')
      });
      setFormSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus({
        type: 'error',
        message: t('message.form.error.generic')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para criar um link mailto com as informações do formulário
  const createMailtoLink = () => {
    const subject = encodeURIComponent(`Mensagem de ${formData.name || 'Convidado'} - Site do Casamento`);
    const body = encodeURIComponent(`Nome: ${formData.name || 'Não informado'}\nEmail: ${formData.email || 'Não informado'}\n\nMensagem:\n${formData.message || 'Não informada'}`);
    return `mailto:carvalho.bfr@gmail.com?subject=${subject}&body=${body}`;
  };

  // Exibe a mensagem de agradecimento quando o formulário é enviado com sucesso
  if (formSubmitted && status.type === 'success') {
    return (
      <section id="message" className="section message-section">
        <div className="container">
          <div className="message-form-container">
            <div className="message-success" data-aos="fade-up">
              <FaCheck size={48} className="success-icon" />
              <h3>{t('message.thanks')}</h3>
              <p>{t('message.confirmation')}</p>
              <button 
                className="btn-primary send-another"
                onClick={() => setFormSubmitted(false)}
              >
                <FaEnvelope className="me-2" />
                Enviar outra mensagem
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="message" className="section message-section">
      <div className="container">
        <div className="message-form-container">
          <h2 data-aos="fade-up">{t('message.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="100">{t('message.intro')}</p>
          
          {isFromDonation && (
            <div className="donation-note" data-aos="fade-up" data-aos-delay="150">
              <FaHeart className="me-2" />
              {t('message.donation_note', { paymentMethod })}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="message-form" data-aos="fade-up" data-aos-delay="200">
            <div className="form-group">
              <label htmlFor="name">
                <FaUserAlt className="me-2" />
                {t('message.form.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('message.form.name_placeholder')}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="me-2" />
                {t('message.form.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('message.form.email_placeholder')}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">
                <FaPaperPlane className="me-2" />
                {t('message.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder={t('message.form.message_placeholder')}
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {t('message.form.sending')}
                </span>
              ) : (
                <span>
                  <FaPaperPlane className="me-2" />
                  {t('message.form.submit')}
                </span>
              )}
            </button>
          </form>
          
          {status.message && (
            <div className={`status-message ${status.type}`} data-aos="zoom-in">
              {status.type === 'success' ? (
                <FaCheck className="me-2" />
              ) : (
                <FaExclamationTriangle className="me-2" />
              )}
              {status.message}
              
              {status.type === 'error' && (
                <div className="error-alternative">
                  <p>{t('message.form.error.alternative')}</p>
                  <a href={createMailtoLink()} className="mailto-link">
                    <FaEnvelope className="me-2" />
                    {t('message.form.error.send_email')}
                    <FaExternalLinkAlt className="ms-2" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MessageForm; 