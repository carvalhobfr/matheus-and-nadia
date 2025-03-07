import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaArrowLeft, FaGift, FaUtensils, FaWalking, FaSpa, FaUmbrellaBeach, FaWater, FaShoppingBag, FaMoneyBillWave, FaCoffee, FaWineGlassAlt, FaIceCream, FaTaxi } from 'react-icons/fa';
import { FaPersonPraying } from 'react-icons/fa6';
import { useImages } from '../../contexts/ImageContext';
import './Gift.scss';

const Gift = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { images } = useImages();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(6.0);
  const [customAmount, setCustomAmount] = useState('');

  // Lista de atividades na Tailândia (ordenadas por preço crescente)
  const activities = t('gifts.activities', { returnObjects: true }).map((activity, index) => ({
    ...activity,
    id: index + 1,
    icon: getActivityIcon(index + 1),
    image: images[`gift-${activity.imageKey}`]
  }));

  // Definição da contribuição livre
  const freeContribution = {
    id: activities.length + 1,
    icon: <FaMoneyBillWave />,
    title: t('gifts.freeContribution.title'),
    description: t('gifts.freeContribution.description'),
    price: 10,
    customAmount: true,
    image: images['gift-custom']
  };

  // Combine all options
  const allActivities = [...activities, freeContribution];

  // Find the selected activity by ID
  useEffect(() => {
    if (id) {
      const activityId = parseInt(id);
      const activity = allActivities.find(act => act.id === activityId);
      if (activity) {
        setSelectedActivity(activity);
        setAmount(activity.price || 0);
      } else {
        // If activity not found, navigate back to gifts page
        navigate('/gifts');
      }
    }
  }, [id, allActivities, navigate]);

  const handleAmountChange = (e) => {
    setCustomAmount(e.target.value);
    if (e.target.value && !isNaN(e.target.value)) {
      setAmount(parseFloat(e.target.value));
    } else {
      setAmount(0);
    }
  };

  const formatPrice = (price) => {
    if (currency === 'EUR') {
      return `€${parseFloat(price).toFixed(2)}`;
    } else {
      return `R$${parseFloat(price * exchangeRate).toFixed(2)}`;
    }
  };

  function getActivityIcon(id) {
    switch (id) {
      case 1: return <FaCoffee />;
      case 2: return <FaIceCream />;
      case 3: return <FaUtensils />;
      case 4: return <FaTaxi />;
      case 5: return <FaWineGlassAlt />;
      case 6: return <FaShoppingBag />;
      case 7: return <FaUtensils />;
      case 8: return <FaUmbrellaBeach />;
      case 9: return <FaPersonPraying />;
      case 10: return <FaSpa />;
      case 11: return <FaWater />;
      case 12: return <FaWalking />;
      default: return <FaGift />;
    }
  }

  const addToCart = () => {
    // Navigate back to the gifts page with the selected item
    navigate('/gifts', { state: { addToCart: selectedActivity.id, amount: selectedActivity.customAmount ? amount : selectedActivity.price } });
  };

  return (
    <Container className="single-gift-container">
      <Button variant="link" className="back-button" onClick={() => navigate('/gifts')}>
        <FaArrowLeft /> {t('common.back')}
      </Button>

      {selectedActivity ? (
        <Row className="gift-details">
          <Col md={6}>
            <div className="gift-image-container">
              {selectedActivity.image && (
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title} 
                  className="gift-image"
                />
              )}
            </div>
          </Col>
          <Col md={6}>
            <Card className="gift-info">
              <Card.Body>
                <div className="icon-container mb-3">
                  {selectedActivity.icon}
                </div>
                <Card.Title className="gift-title">{selectedActivity.title}</Card.Title>
                <Card.Text className="gift-description">{selectedActivity.description}</Card.Text>
                
                {selectedActivity.customAmount ? (
                  <div className="custom-amount-section">
                    <Form.Group className="mb-3">
                      <Form.Label>{t('gifts.customContributionLabel', { currency: currency === 'EUR' ? '€' : 'R$' })}:</Form.Label>
                      <Form.Control
                        type="number"
                        min="10"
                        value={customAmount}
                        onChange={handleAmountChange}
                        placeholder={`${currency === 'EUR' ? '10.00' : '60.00'}`}
                      />
                    </Form.Group>
                  </div>
                ) : (
                  <div className="price-section">
                    <h4 className="gift-price">{formatPrice(selectedActivity.price)}</h4>
                  </div>
                )}
                
                <ButtonGroup className="currency-toggle mb-3">
                  <ToggleButton
                    id="currency-eur"
                    type="radio"
                    variant="outline-primary"
                    name="currency"
                    value="EUR"
                    checked={currency === 'EUR'}
                    onChange={() => setCurrency('EUR')}
                  >
                    EUR (€)
                  </ToggleButton>
                  <ToggleButton
                    id="currency-brl"
                    type="radio"
                    variant="outline-primary"
                    name="currency"
                    value="BRL"
                    checked={currency === 'BRL'}
                    onChange={() => setCurrency('BRL')}
                  >
                    BRL (R$)
                  </ToggleButton>
                </ButtonGroup>
                
                <Button 
                  variant="primary" 
                  className="gift-add-button"
                  onClick={addToCart}
                  disabled={selectedActivity.customAmount && (!customAmount || parseFloat(customAmount) < 10)}
                >
                  {t('gifts.add')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <div className="loading-gift">
          <p>{t('common.loading')}</p>
        </div>
      )}
    </Container>
  );
};

export default Gift; 