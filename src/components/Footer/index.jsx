import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="mb-3">Matheus & Nadia</h3>
            <p className="mb-4">{t('footer.credit')}</p>
            <div className="social-icons mb-4">
              <a href="#" className="mx-2">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="mx-2">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="mx-2">
                <i className="fas fa-envelope fa-lg"></i>
              </a>
            </div>
            <p className="mt-4">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 