import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaGift, FaUtensils, FaWalking, FaSpa, FaUmbrellaBeach, FaWater, FaShoppingBag, FaMoneyBillWave, FaCoffee, FaWineGlassAlt, FaIceCream, FaTaxi, FaEye } from 'react-icons/fa';
import { FaPersonPraying } from 'react-icons/fa6';
import { useImages } from '../../contexts/ImageContext';
import { Link, useLocation } from 'react-router-dom';
import './Gifts.scss';

const Gifts = () => {
  const { t } = useTranslation();
  const { images } = useImages();
  const location = useLocation();
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(6.0);
  const [freeContributionValue, setFreeContributionValue] = useState('');

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

  // Informações de pagamento
  const paymentMethods = {
    mbway: {
      title: t('gifts.mbway.title'),
      info: t('gifts.mbway.description') + ' +351934646436',
      number: '+351934646436'
    },
    pix: {
      title: t('gifts.pix.title'),
      info: t('gifts.pix.description') + ' carvalho.bfr@gmail.com',
      key: 'carvalho.bfr@gmail.com'
    },
    bizum: {
      title: t('gifts.bizum.title'),
      info: t('gifts.bizum.description') + ' +34617384134',
      number: '+34617384134'
    },
    bankAccount: {
      title: t('gifts.bankAccount.title'),
      info: t('gifts.bankAccount.description') + ' PT50 0023 0000 45552193281 94',
      iban: 'PT50 0023 0000 45552193281 94'
    }
  };

  // Função helper para obter o ícone correto
  function getActivityIcon(id) {
    switch(id) {
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

  // Função para alternar a moeda
  const toggleCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    // Force a refresh of the component to update all displayed prices
    setSelectedActivities([...selectedActivities]);
  };

  // Atualiza o valor total quando as atividades selecionadas ou a moeda mudam
  useEffect(() => {
    const newTotal = selectedActivities.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    setTotalAmount(newTotal);
  }, [selectedActivities, currency]);

  // Função para alternar a seleção de uma atividade
  const toggleActivity = (activity) => {
    setSelectedActivities(prev => {
      const isSelected = prev.some(item => item.id === activity.id);
      let newActivities;
      if (isSelected) {
        newActivities = prev.filter(item => item.id !== activity.id);
      } else {
        newActivities = [...prev, activity];
      }
      const newTotal = newActivities.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
      setTotalAmount(newTotal);
      return newActivities;
    });
  };

  // Prosseguir para o pagamento
  const handleProceedToPayment = () => {
    let finalAmount = totalAmount;
    if (currency === 'BRL') {
      finalAmount = parseFloat(convertAmount(totalAmount, 'EUR'));
    }
    setShowPaymentModal(true);
  };

  // Seleciona o método de pagamento
  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    setPaymentInfo(paymentMethods[method]);
  };

  // Converter valor conforme a moeda
  const convertAmount = (amount, toCurrency) => {
    if (toCurrency === 'BRL' && currency === 'EUR') {
      return (amount * exchangeRate);
    } else if (toCurrency === 'EUR' && currency === 'BRL') {
      return (amount / exchangeRate);
    }
    return amount;
  };

  // Exibir preço com símbolo correto
  const formatPrice = (price) => {
    if (currency === 'EUR') {
      return `€${parseFloat(price).toFixed(2)}`;
    } else {
      // For BRL, directly multiply by the exchange rate
      return `R$${(parseFloat(price) * exchangeRate).toFixed(2)}`;
    }
  };

  // Lida com contribuição personalizada
  const handleCustomAmountChange = (e, activityId) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? '' : parseFloat(inputValue);
    if (activityId === freeContribution.id && !selectedActivities.some(item => item.id === activityId)) {
      setFreeContributionValue(inputValue);
      return;
    }
    setSelectedActivities(prevActivities => {
      const updatedActivities = [...prevActivities];
      const index = updatedActivities.findIndex(act => act.id === activityId);
      if (index !== -1) {
        updatedActivities[index] = { ...updatedActivities[index], price: value };
      }
      return updatedActivities;
    });
  };

  // Adiciona contribuição personalizada
  const handleAddCustomActivity = (e, activity, inputValue) => {
    e.stopPropagation();
    const value = inputValue === '' ? 0 : parseFloat(inputValue);
    if (value > 0) {
      const isSelected = selectedActivities.some(item => item.id === activity.id);
      if (!isSelected) {
        setSelectedActivities([...selectedActivities, { ...activity, price: value }]);
        if (activity.id === freeContribution.id) {
          setFreeContributionValue('');
        }
      } else {
        toggleActivity(activity);
      }
    }
  };

  // Lida com carregamento de imagens
  const handleImageLoad = (activityId) => {
    setLoadingImages(prev => ({
      ...prev,
      [activityId]: false
    }));
  };

  // Lida com erro no carregamento de imagens
  const handleImageError = (activityId) => {
    setLoadingImages(prev => ({
      ...prev,
      [activityId]: false
    }));
  };

  // Inicializa estado de carregamento para as imagens
  useEffect(() => {
    const initialLoadingState = activities.reduce((acc, activity) => {
      acc[activity.id] = true;
      return acc;
    }, {});
    setLoadingImages(initialLoadingState);
  }, []);

  // Função para enviar o recibo (agora apenas confirma o pagamento)
  const handleSendReceipt = () => {
    setIsProcessing(true);
    // Simular processamento
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      setShowConfirmation(true);
      // Resetar seleções após confirmação
      setSelectedActivities([]);
      setTotalAmount(0);
      setPaymentMethod('');
    }, 1500);
  };

  // Fecha a confirmação
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  // Check if there's a state when coming back from a single gift page
  useEffect(() => {
    if (location.state?.addToCart) {
      const activityId = location.state.addToCart;
      const amount = location.state.amount;
      
      // If it's the free contribution, update the value
      if (activities.length + 1 === activityId) {
        setFreeContributionValue(amount.toString());
        toggleActivity(freeContribution, amount);
      } else {
        // Find the activity by ID
        const activity = activities.find(act => act.id === activityId);
        if (activity) {
          toggleActivity(activity);
        }
      }
      
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <section id="gifts" className="gifts-section">
      <Container>
        <div className="section-title">
          <h2>{t('gifts.title')}</h2>
          <p className="gift-intro">
            {t('gifts.intro')}
          </p>
        </div>

        <div className="currency-selector mb-4">
          <ButtonGroup>
            <ToggleButton
              id="currency-eur"
              type="radio"
              variant={currency === 'EUR' ? 'primary' : 'outline-primary'}
              name="currency"
              value="EUR"
              checked={currency === 'EUR'}
              onChange={(e) => toggleCurrency(e.currentTarget.value)}
            >
              EUR (€)
            </ToggleButton>
            <ToggleButton
              id="currency-brl"
              type="radio"
              variant={currency === 'BRL' ? 'primary' : 'outline-primary'}
              name="currency"
              value="BRL"
              checked={currency === 'BRL'}
              onChange={(e) => toggleCurrency(e.currentTarget.value)}
            >
              BRL (R$)
            </ToggleButton>
          </ButtonGroup>
        </div>

        <Row className="gift-activities">
          {activities.map((activity) => {
            const isSelected = selectedActivities.some(item => item.id === activity.id);
            const selectedActivity = selectedActivities.find(item => item.id === activity.id);
            return (
              <Col key={activity.id} lg={3} md={4} sm={6} className="mb-4">
                <Card 
                  className={`activity-card ${isSelected ? 'selected' : ''}`} 
                >
                  <div 
                    className="activity-image" 
                    style={{ backgroundImage: loadingImages[activity.id] ? 'none' : `url(${activity.image})` }}
                    onClick={() => !activity.customAmount && toggleActivity(activity)}
                  >
                    {isSelected && <div className="selected-badge">{t('gifts.selectedBadge')}</div>}
                    {loadingImages[activity.id] && (
                      <div className="image-loading">
                        <Spinner animation="border" variant="light" />
                      </div>
                    )}
                    <img 
                      src={activity.image} 
                      alt={activity.title} 
                      style={{ display: 'none' }} 
                      onLoad={() => handleImageLoad(activity.id)}
                      onError={() => handleImageError(activity.id)}
                    />
                    <Link to={`/gift/${activity.id}`} className="view-details-btn">
                      <FaEye /> {t('common.viewDetails')}
                    </Link>
                  </div>
                  <Card.Body onClick={() => !activity.customAmount && toggleActivity(activity)}>
                    <div className="activity-icon">{activity.icon}</div>
                    <Card.Title>{activity.title}</Card.Title>
                    <Card.Text>{activity.description}</Card.Text>
                    
                    {activity.customAmount ? (
                      <Form.Group className="mb-3">
                        <Form.Label>{t('gifts.customContributionLabel', { currency: currency === 'EUR' ? '€' : 'R$' })}:</Form.Label>
                        <Form.Control 
                          type="number" 
                          min="0.01"
                          value={freeContributionValue}
                          onChange={handleCustomAmountChange}
                          placeholder={`${currency === 'EUR' ? '10' : '60'}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Form.Group>
                    ) : (
                      <div className="price">{formatPrice(activity.price)}</div>
                    )}
                    
                    <Button 
                      variant={isSelected ? "danger" : "primary"} 
                      className="add-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activity.customAmount) {
                          if (freeContributionValue && parseFloat(freeContributionValue) > 0) {
                            toggleActivity(activity, parseFloat(freeContributionValue));
                          }
                        } else {
                          toggleActivity(activity);
                        }
                      }}
                    >
                      {isSelected ? t('gifts.remove') : t('gifts.add')}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="gift-summary">
          <div className="selected-activities">
            <h3>{t('gifts.selectedActivitiesTitle')}</h3>
            {selectedActivities.length === 0 ? (
              <div className="empty-selection">
                <p>{t('gifts.emptySelection')}</p>
                <p className="help-text">{t('gifts.emptySelectionHelp')}</p>
              </div>
            ) : (
              <ul>
                {selectedActivities.map(activity => (
                  <li key={activity.id}>
                    {activity.title} - {formatPrice(activity.price)}
                    <Button 
                      variant="link" 
                      className="remove-btn"
                      onClick={() => toggleActivity(activity)}
                    >
                      {t('gifts.remove')}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Seção de Contribuição Livre */}
          <div className="free-contribution-section">
            <h3>{freeContribution.title}</h3>
            <p>{freeContribution.description}</p>
            <div className="free-contribution-input">
              <Form.Group className="mb-3">
                <Form.Label>{t('gifts.contributionValue')}</Form.Label>
                <div className="d-flex">
                  <Form.Control 
                    type="number" 
                    min="0.01"
                    step="0.01"
                    value={selectedActivities.some(item => item.id === freeContribution.id) 
                      ? selectedActivities.find(item => item.id === freeContribution.id)?.price 
                      : freeContributionValue}
                    onChange={(e) => handleCustomAmountChange(e, freeContribution.id)}
                    id="free-contribution-input"
                  />
                  <Button 
                    variant="outline-primary" 
                    className="ms-2"
                    onClick={(e) => {
                      const inputValue = selectedActivities.some(item => item.id === freeContribution.id)
                        ? selectedActivities.find(item => item.id === freeContribution.id)?.price
                        : document.getElementById('free-contribution-input').value;
                      handleAddCustomActivity(e, freeContribution, inputValue);
                    }}
                  >
                    {selectedActivities.some(item => item.id === freeContribution.id) ? t('gifts.remove') : t('gifts.add')}
                  </Button>
                </div>
              </Form.Group>
            </div>
          </div>
          
          <div className="total-amount">
            <h3>{t('gifts.totalAmount')} {formatPrice(totalAmount)}</h3>
            <Button 
              variant="primary" 
              className="proceed-btn"
              disabled={totalAmount === 0}
              onClick={handleProceedToPayment}
            >
              {t('gifts.proceedToPayment')}
            </Button>
          </div>
        </div>

        {/* Modal de Pagamento */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('gifts.paymentModal.title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t('gifts.paymentModal.totalLabel')} <strong>{formatPrice(totalAmount)}</strong></p>
            <div className="payment-methods">
              {Object.keys(paymentMethods).map(method => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "primary" : "outline-primary"}
                  className="payment-method-btn"
                  onClick={() => handleSelectPaymentMethod(method)}
                >
                  {paymentMethods[method].title}
                </Button>
              ))}
            </div>
            {paymentMethod && (
              <div className="payment-info mt-4">
                <h5>{paymentInfo.title}</h5>
                <p className="payment-code">{paymentInfo.info}</p>
                <Button 
                  variant="success" 
                  className="mt-3 w-100"
                  onClick={handleSendReceipt}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      {t('gifts.paymentModal.processing')}
                    </>
                  ) : (
                    t('gifts.paymentModal.confirmPayment')
                  )}
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              {t('gifts.paymentModal.close')}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Confirmação */}
        <Modal show={showConfirmation} onHide={handleCloseConfirmation} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('gifts.confirmationModal.title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="confirmation-icon mb-3">
                <FaGift size={50} color="var(--accent-color)" />
              </div>
              <h4>{t('gifts.confirmationModal.thankYou')}</h4>
              <p>
                {t('gifts.confirmationModal.message')}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCloseConfirmation}>
              {t('gifts.confirmationModal.close')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </section>
  );
};

export default Gifts;
