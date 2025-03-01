import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './MessageForm.scss';

const MessageForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Check if the honeypot field is filled (bot detection)
    if (formData.website) {
      console.log('Bot detected');
      // Pretend success but don't actually submit
      setSubmitted(true);
      return;
    }
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(t('message.form.error.required'));
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('message.form.error.email'));
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real application, you would send this data to a server
      console.log('Form submitted:', formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
        website: ''
      });
      
      // Show success message
      setLoading(false);
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section id="message" className="section">
      <div className="container">
        <div className="section-title">
          <h2 data-aos="fade-up">{t('message.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="100">{t('message.intro')}</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8" data-aos="fade-up" data-aos-delay="200">
            {submitted ? (
              <div className="alert alert-success text-center p-5">
                <i className="fas fa-check-circle fa-3x mb-3"></i>
                <h3>{t('message.thanks')}</h3>
                <p>{t('message.confirmation')}</p>
              </div>
            ) : (
              <div className="card">
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">{t('message.form.name')}</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">{t('message.form.email')}</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Honeypot field - hidden from users but bots will fill it */}
                    <div className="d-none" aria-hidden="true">
                      <label htmlFor="website" className="form-label">Website (leave empty)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex="-1"
                        autoComplete="off"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">{t('message.form.message')}</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('message.form.sending')}
                          </>
                        ) : (
                          t('message.form.submit')
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageForm; 