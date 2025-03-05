import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { FaGift, FaUtensils, FaWalking, FaSpa, FaUmbrellaBeach, FaWater, FaShoppingBag, FaMoneyBillWave, FaCoffee, FaWineGlassAlt, FaIceCream, FaTaxi } from 'react-icons/fa';
import { FaPersonPraying } from 'react-icons/fa6';
import { useImages } from '../../contexts/ImageContext';
import './Gifts.scss';

const Gifts = () => {
  const { t } = useTranslation();
  const { images } = useImages();
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
  const activities = [
    {
      id: 1,
      icon: <FaCoffee />,
      title: 'Café Tailandês',
      description: 'Ofereça ao casal uma pausa para um café tailandês tradicional durante os passeios pela cidade.',
      price: 1,
      image: images['gift-coffee']
    },
    {
      id: 2,
      icon: <FaIceCream />,
      title: 'Sobremesa Típica',
      description: 'Presente uma sobremesa tailandesa tradicional, como o famoso arroz doce com manga ou bananas fritas.',
      price: 2,
      image: images['gift-dessert']
    },
    {
      id: 3,
      icon: <FaUtensils />,
      title: 'Pad Thai',
      description: 'Ofereça ao casal a experiência de provar um autêntico Pad Thai em uma barraquinha de rua tailandesa.',
      price: 3,
      image: images['gift-padthai']
    },
    {
      id: 4,
      icon: <FaTaxi />,
      title: 'Passeio de Tuk-tuk',
      description: 'Proporcione um passeio no tradicional tuk-tuk tailandês, uma experiência única e divertida para conhecer a cidade.',
      price: 5,
      image: images['gift-tuktuk']
    },
    {
      id: 5,
      icon: <FaWineGlassAlt />,
      title: 'Drinks ao Pôr-do-sol',
      description: 'Ofereça ao casal a experiência de apreciar drinks tropicais enquanto contemplam o lindo pôr-do-sol tailandês.',
      price: 15,
      image: images['gift-drinks']
    },
    {
      id: 6,
      icon: <FaShoppingBag />,
      title: 'Mercado Flutuante',
      description: 'Presente uma visita a um tradicional mercado flutuante tailandês, com guia local e degustação de comidas típicas.',
      price: 25,
      image: images['gift-market']
    },
    {
      id: 7,
      icon: <FaUtensils />,
      title: 'Jantar Tradicional',
      description: 'Ofereça ao casal uma autêntica experiência gastronômica tailandesa com um jantar tradicional completo em um restaurante local.',
      price: 30,
      image: images['gift-dinner']
    },
    {
      id: 8,
      icon: <FaUmbrellaBeach />,
      title: 'Dia na Praia',
      description: 'Ofereça um dia relaxante em uma das belas praias tailandesas, incluindo aluguel de espreguiçadeiras e bebidas refrescantes.',
      price: 40,
      image: images['gift-beach']
    },
    {
      id: 9,
      icon: <FaPersonPraying />,
      title: 'Tour pelos Templos',
      description: 'Ofereça um tour guiado pelos templos históricos e culturais da Tailândia.',
      price: 45,
      image: images['gift-temples']
    },
    {
      id: 10,
      icon: <FaSpa />,
      title: 'Massagem Tailandesa',
      description: 'Proporcione ao casal uma tradicional massagem tailandesa para relaxar durante a lua de mel.',
      price: 50,
      image: images['gift-massage']
    },
    {
      id: 11,
      icon: <FaWater />,
      title: 'Passeio de Barco',
      description: 'Presente um passeio de barco pelas ilhas e baías deslumbrantes da Tailândia.',
      price: 70,
      image: images['gift-boat']
    },
    {
      id: 12,
      icon: <FaWalking />,
      title: 'Santuário de Elefantes',
      description: 'Presente uma visita a um santuário ético de elefantes, onde o casal poderá alimentar, banhar e aprender sobre estes incríveis animais.',
      price: 80,
      image: images['gift-elephants']
    }
  ];

  // Contribuição Livre
  const freeContribution = {
    id: 13,
    icon: <FaMoneyBillWave />,
    title: 'Contribuição Livre',
    description: 'Contribua com o valor que desejar para ajudar o casal a realizar a lua de mel dos sonhos na Tailândia.',
    price: 10,
    customAmount: true,
    image: images['gift-custom']
  };

  // Informações de pagamento
  const paymentMethods = {
    pix: {
      title: 'PIX',
      info: 'Chave PIX: exemplo@email.com',
      instructions: 'Após realizar o pagamento, envie o comprovante para nosso WhatsApp: +XX XX XXXXX-XXXX'
    },
    mbway: {
      title: 'MB WAY',
      info: 'Número MB WAY: +XX XXX XXX XXX',
      instructions: 'Após realizar o pagamento, envie o comprovante para nosso WhatsApp: +XX XX XXXXX-XXXX'
    },
    bizum: {
      title: 'Bizum',
      info: 'Número Bizum: +XX XXX XXX XXX',
      instructions: 'Após realizar o pagamento, envie o comprovante para nosso WhatsApp: +XX XX XXXXX-XXXX'
    }
  };

  // Função para alternar a moeda
  const toggleCurrency = (newCurrency) => {
    setCurrency(newCurrency);
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
      return Math.round(amount * exchangeRate);
    } else if (toCurrency === 'EUR' && currency === 'BRL') {
      return (amount / exchangeRate).toFixed(2);
    }
    return amount;
  };

  // Exibir preço com símbolo correto
  const formatPrice = (price) => {
    if (currency === 'EUR') {
      return `€${parseFloat(price).toFixed(2).replace(/\.00$/, '')}`;
    } else {
      const brlValue = convertAmount(price, 'BRL');
      return `R$${parseFloat(brlValue).toFixed(2).replace(/\.00$/, '')}`;
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

  // Simula envio do comprovante
  const handleSendReceipt = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);
      setShowConfirmation(true);
      setSelectedActivities([]);
      setTotalAmount(0);
    }, 2000);
  };

  // Fecha a confirmação
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <section id="gifts" className="gifts-section">
      <Container>
        <div className="section-title">
          <h2>{t('gifts.title')}</h2>
          <p className="gift-intro">
            {t('gifts.intro')}
          </p>
          <div className="currency-selector">
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
        </div>

        <Row className="gift-activities">
          {activities.map((activity) => {
            const isSelected = selectedActivities.some(item => item.id === activity.id);
            const selectedActivity = selectedActivities.find(item => item.id === activity.id);
            return (
              <Col key={activity.id} lg={3} md={4} sm={6} className="mb-4">
                <Card 
                  className={`activity-card ${isSelected ? 'selected' : ''}`} 
                  onClick={() => !activity.customAmount && toggleActivity(activity)}
                >
                  <div className="activity-image" style={{ backgroundImage: loadingImages[activity.id] ? 'none' : `url(${activity.image})` }}>
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
                  </div>
                  <Card.Body>
                    <div className="activity-icon">{activity.icon}</div>
                    <Card.Title>{activity.title}</Card.Title>
                    <Card.Text>{activity.description}</Card.Text>
                    
                    {activity.customAmount ? (
                      <Form.Group className="mb-3">
                        <Form.Label>{t('gifts.customContributionLabel', { currency: currency === 'EUR' ? '€' : 'R$' })}:</Form.Label>
                        <Form.Control 
                          type="number" 
                          min="0.01"
                          step="0.01"
                          value={selectedActivity ? selectedActivity.price : ''}
                          onChange={(e) => handleCustomAmountChange(e, activity.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button 
                          variant="outline-primary" 
                          className="mt-2 w-100"
                          onClick={(e) => {
                            const inputValue = e.target.previousElementSibling.value;
                            handleAddCustomActivity(e, activity, inputValue);
                          }}
                        >
                          {isSelected ? t('gifts.remove') : t('gifts.add')}
                        </Button>
                      </Form.Group>
                    ) : (
                      <div className={`activity-price ${activity.price < 10 ? 'low-cost' : ''}`}>
                        {formatPrice(activity.price)}
                      </div>
                    )}
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
                <Form.Label>{t('gifts.customContributionLabel')}:</Form.Label>
                <div className="d-flex">
                  <Form.Control 
                    type="number" 
                    min="0.01"
                    step="0.10"
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
                <p className="payment-instructions">{paymentInfo.instructions}</p>
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
