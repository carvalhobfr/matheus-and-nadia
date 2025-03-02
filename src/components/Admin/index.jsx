import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Accordion, Tabs, Tab, Nav, InputGroup } from 'react-bootstrap';
import { useImages } from '../../contexts/ImageContext';
import { useTexts } from '../../contexts/TextContext';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import './Admin.scss';

// Importando os componentes reais para a prévia
import Navbar from '../Navbar';
import Hero from '../Hero';
import Footer from '../Footer';

// Componente de mockup para envelopar componentes que precisam de Router
const MockRouter = ({ children }) => {
  // No ambiente de produção/desenvolvimento, já estamos dentro de um Router do App.jsx
  // então apenas passamos os children sem envolvê-los em outro Router
  return (
    <div className="mock-router-container">
      {children}
    </div>
  );
};

// Componente de mockup para envolver componentes que precisam do LanguageContext
const MockLanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  
  // Mock do i18n.changeLanguage
  const mockI18n = {
    changeLanguage: (lang) => {
      console.log(`Mock changing language to: ${lang}`);
      setCurrentLanguage(lang);
      return Promise.resolve();
    }
  };
  
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    mockI18n.changeLanguage(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, i18n: mockI18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      onLogin();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <Container className="admin-login-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="login-card">
            <Card.Header className="text-center">
              <h3>Acesso ao Painel Administrativo</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">Entrar</Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center text-muted">
              <small>Acesso restrito a administradores do site</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const ImageEditor = () => {
  const { images, updateImage, resetImages, getAllImageDescriptions, getImageDescription } = useImages();
  const { logout } = useAuth();
  const [imageKey, setImageKey] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const allDescriptions = getAllImageDescriptions();

  const handleUpdateImage = (e) => {
    e.preventDefault();
    
    if (!imageKey || !imageUrl) {
      setMessage({ text: 'Por favor, selecione uma imagem e forneça uma URL válida.', type: 'danger' });
      return;
    }
    
    updateImage(imageKey, imageUrl);
    setMessage({ text: 'Imagem atualizada com sucesso!', type: 'success' });
    
    // Limpa o formulário após alguns segundos
    setTimeout(() => {
      setImageKey('');
      setImageUrl('');
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleResetImages = () => {
    if (window.confirm('Tem certeza que deseja restaurar todas as imagens para os valores padrão?')) {
      resetImages();
      setMessage({ text: 'Todas as imagens foram restauradas para os valores padrão.', type: 'success' });
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  const handleSelect = (key) => {
    setImageKey(key);
    setImageUrl(images[key] || '');
  };

  const handleLogout = () => {
    logout();
  };

  // Organize images by categories
  const categories = {
    'Hero': Object.keys(images).filter(key => key.startsWith('hero-')),
    'História': Object.keys(images).filter(key => key.startsWith('couple-')),
    'Presentes': Object.keys(images).filter(key => key.startsWith('gift-')),
    'Galeria': Object.keys(images).filter(key => key.startsWith('gallery-')),
  };

  return (
    <Container className="admin-container">
      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <Card className="admin-header">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Painel Administrativo - Gerenciamento de Imagens</h2>
              <Button variant="outline-danger" onClick={handleLogout}>Sair</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          {message.text && (
            <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleUpdateImage} className="mb-4">
            <Card>
              <Card.Header>
                <h4>Atualizar Imagem</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Selecione a Imagem</Form.Label>
                  <Form.Select 
                    value={imageKey} 
                    onChange={(e) => handleSelect(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma imagem...</option>
                    {Object.keys(images).map(key => (
                      <option key={key} value={key}>
                        {key} - {getImageDescription(key)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {imageKey && (
                  <div className="mb-3">
                    <p><strong>Descrição:</strong> {getImageDescription(imageKey)}</p>
                    <div className="image-preview">
                      <p><strong>Imagem Atual:</strong></p>
                      <img src={images[imageKey]} alt={imageKey} className="img-preview" />
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Nova URL da Imagem</Form.Label>
                  <Form.Control 
                    type="url" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </Form.Group>

                {imageUrl && (
                  <div className="mb-3">
                    <p><strong>Prévia da Nova Imagem:</strong></p>
                    <div className="image-preview">
                      <img src={imageUrl} alt="preview" className="img-preview" />
                    </div>
                  </div>
                )}
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" type="submit">Atualizar Imagem</Button>
                <Button variant="outline-secondary" onClick={() => {
                  setImageKey('');
                  setImageUrl('');
                }} className="ms-2">Limpar</Button>
                <Button variant="danger" onClick={handleResetImages} className="ms-2">Restaurar Todas as Imagens</Button>
              </Card.Footer>
            </Card>
          </Form>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h4>Lista de Imagens por Categoria</h4>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {Object.entries(categories).map(([category, keys]) => (
                  <Accordion.Item eventKey={category} key={category}>
                    <Accordion.Header>{category} ({keys.length} imagens)</Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Identificador</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keys.map(key => (
                            <tr key={key}>
                              <td>
                                <div>{key}</div>
                                <small className="text-muted">{getImageDescription(key)}</small>
                              </td>
                              <td>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  onClick={() => handleSelect(key)}
                                >
                                  Editar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const TextEditor = () => {
  const { texts, updateText, resetTexts, currentLanguage, setCurrentLanguage, currentSection, setCurrentSection } = useTexts();
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editPath, setEditPath] = useState('');
  const [editValue, setEditValue] = useState('');
  
  // Lista de seções disponíveis para edição
  const sections = [
    { key: 'navbar', label: 'Menu de Navegação' },
    { key: 'hero', label: 'Hero (Página Inicial)' },
    { key: 'countdown', label: 'Contagem Regressiva' },
    { key: 'story', label: 'Nossa História' },
    { key: 'details', label: 'Detalhes do Evento' },
    { key: 'gifts', label: 'Presentes' },
    { key: 'message', label: 'Mensagens' },
    { key: 'footer', label: 'Rodapé' }
  ];
  
  // Lista de idiomas disponíveis
  const languages = [
    { key: 'pt', label: 'Português' },
    { key: 'en', label: 'Inglês' },
    { key: 'es', label: 'Espanhol' }
  ];
  
  // Função para renderizar os campos de edição de texto para a seção e idioma selecionados
  const renderTextFields = () => {
    if (!currentSection || !currentLanguage || !texts[currentLanguage]) return null;
    
    const sectionData = texts[currentLanguage][currentSection];
    if (!sectionData) return <Alert variant="info">Seção não encontrada</Alert>;
    
    // Função recursiva para renderizar campos de um objeto aninhado
    const renderFields = (data, pathPrefix = '') => {
      if (typeof data !== 'object' || data === null) return null;
      
      return Object.entries(data).map(([key, value]) => {
        const path = pathPrefix ? `${pathPrefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Se for um objeto, renderiza um grupo de campos
          return (
            <div key={path} className="nested-fields mb-4">
              <h5 className="nested-title">{key.charAt(0).toUpperCase() + key.slice(1)}</h5>
              <div className="nested-content ps-3 border-start">
                {renderFields(value, path)}
              </div>
            </div>
          );
        } else if (Array.isArray(value)) {
          // Se for um array (como timelines), renderiza um grupo especial
          return (
            <div key={path} className="array-fields mb-4">
              <h5 className="array-title">{key.charAt(0).toUpperCase() + key.slice(1)} (Array)</h5>
              <div className="array-items">
                {value.map((item, index) => (
                  <div key={`${path}.${index}`} className="array-item card mb-2 p-3">
                    <h6>Item {index + 1}</h6>
                    {renderFields(item, `${path}[${index}]`)}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          // Caso contrário, renderiza um campo de edição
          return (
            <Form.Group key={path} className="mb-3">
              <Form.Label>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Form.Label>
              <InputGroup>
                <Form.Control 
                  type="text" 
                  value={value}
                  onChange={(e) => handleFieldChange(path, e.target.value)}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    setEditPath(path);
                    setEditValue(value);
                  }}
                >
                  Editar
                </Button>
              </InputGroup>
            </Form.Group>
          );
        }
      });
    };
    
    return (
      <div className="text-fields">
        {renderFields(sectionData, currentSection)}
      </div>
    );
  };
  
  // Função para lidar com a mudança imediata de um campo
  const handleFieldChange = (path, value) => {
    updateText(currentLanguage, path, value);
  };
  
  // Função para lidar com a atualização de um campo via modal
  const handleUpdateText = (e) => {
    e.preventDefault();
    
    if (!editPath || editValue === undefined) {
      setMessage({ text: 'Por favor, selecione um texto para editar.', type: 'danger' });
      return;
    }
    
    updateText(currentLanguage, editPath, editValue);
    setMessage({ text: 'Texto atualizado com sucesso!', type: 'success' });
    
    // Limpa o formulário após alguns segundos
    setTimeout(() => {
      setEditPath('');
      setEditValue('');
      setMessage({ text: '', type: '' });
    }, 3000);
  };
  
  // Função para resetar todos os textos para os valores padrão
  const handleResetTexts = () => {
    if (window.confirm('Tem certeza que deseja restaurar todos os textos para os valores padrão? Esta ação não pode ser desfeita.')) {
      resetTexts();
      setMessage({ text: 'Todos os textos foram restaurados para os valores padrão.', type: 'success' });
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };
  
  return (
    <div className="text-editor">
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
          {message.text}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Editar Textos</h4>
                <Button variant="danger" onClick={handleResetTexts}>Restaurar Textos Padrão</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h5>Selecione o Idioma</h5>
                <Nav variant="pills" className="language-selector">
                  {languages.map(lang => (
                    <Nav.Item key={lang.key}>
                      <Nav.Link 
                        active={currentLanguage === lang.key}
                        onClick={() => setCurrentLanguage(lang.key)}
                      >
                        {lang.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              
              <div className="mb-4">
                <h5>Selecione a Seção</h5>
                <Nav variant="tabs" className="section-selector">
                  {sections.map(section => (
                    <Nav.Item key={section.key}>
                      <Nav.Link 
                        active={currentSection === section.key}
                        onClick={() => setCurrentSection(section.key)}
                      >
                        {section.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              
              <div className="section-editor">
                {renderTextFields()}
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h4>Instruções</h4>
            </Card.Header>
            <Card.Body>
              <p>Este painel permite editar os textos do site em todos os idiomas disponíveis.</p>
              <ol>
                <li>Selecione o idioma que deseja editar</li>
                <li>Escolha a seção do site onde o texto está localizado</li>
                <li>Edite os campos diretamente ou use o botão "Editar" para textos mais longos</li>
                <li>Todas as alterações são salvas automaticamente</li>
              </ol>
              <Alert variant="warning">
                <strong>Atenção:</strong> Editar os textos afetará imediatamente a exibição do site. Certifique-se de verificar todas as páginas após fazer alterações significativas.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal para edição de textos longos (pode ser implementado se necessário) */}
    </div>
  );
};

const ColorEditor = () => {
  // Estado para histórico de paletas
  const [paletteHistory, setPaletteHistory] = useState(() => {
    const savedHistory = localStorage.getItem('colorPaletteHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  
  // Estado para controlar a prévia de cores
  const [previewActive, setPreviewActive] = useState(false);
  const [originalColors, setOriginalColors] = useState(null);
  
  // Definição das cores do tema atual
  const [currentPalette, setCurrentPalette] = useState({
    name: 'Atual',
    colors: [
      { name: 'Cor Primária', variable: '--primary-color', value: '#3D2314' },
      { name: 'Cor Secundária', variable: '--secondary-color', value: '#8B5A2B' },
      { name: 'Cor de Destaque', variable: '--accent-color', value: '#D4AF37' },
      { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
      { name: 'Cor Clara', variable: '--light-color', value: '#F7F5F0' },
      { name: 'Cor Escura', variable: '--dark-color', value: '#271409' }
    ]
  });
  
  // Descrições de uso das cores
  const colorUsages = {
    '--primary-color': 'Utilizada em cabeçalhos, botões principais, elementos de destaque.',
    '--secondary-color': 'Utilizada em elementos secundários, bordas, fundos de seções alternadas.',
    '--accent-color': 'Utilizada para destacar informações importantes, ícones, botões de ação.',
    '--text-color': 'Cor padrão para textos em todo o site.',
    '--light-color': 'Utilizada como fundo do site e em áreas que precisam de contraste leve.',
    '--dark-color': 'Utilizada para textos que precisam de maior ênfase e como fundo em seções escuras.'
  };

  // Paletas de cores sugeridas inspiradas na Tailândia
  const suggestedPalettes = [
    {
      name: 'Praia Tropical',
      description: 'Inspirada nas praias de areia branca e águas turquesa da Tailândia',
      colors: [
        { name: 'Cor Primária', variable: '--primary-color', value: '#00A896' },
        { name: 'Cor Secundária', variable: '--secondary-color', value: '#05668D' },
        { name: 'Cor de Destaque', variable: '--accent-color', value: '#F0F3BD' },
        { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
        { name: 'Cor Clara', variable: '--light-color', value: '#F7FBFC' },
        { name: 'Cor Escura', variable: '--dark-color', value: '#02556E' }
      ]
    },
    {
      name: 'Selva Tropical',
      description: 'Inspirada nas florestas tropicais e natureza exuberante',
      colors: [
        { name: 'Cor Primária', variable: '--primary-color', value: '#2E6E41' },
        { name: 'Cor Secundária', variable: '--secondary-color', value: '#4C956C' },
        { name: 'Cor de Destaque', variable: '--accent-color', value: '#FEFAE0' },
        { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
        { name: 'Cor Clara', variable: '--light-color', value: '#F6F8E6' },
        { name: 'Cor Escura', variable: '--dark-color', value: '#1B4332' }
      ]
    },
    {
      name: 'Pôr do Sol Tailandês',
      description: 'Cores quentes inspiradas no pôr do sol sobre o oceano',
      colors: [
        { name: 'Cor Primária', variable: '--primary-color', value: '#BC4749' },
        { name: 'Cor Secundária', variable: '--secondary-color', value: '#F18F01' },
        { name: 'Cor de Destaque', variable: '--accent-color', value: '#FADF7F' },
        { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
        { name: 'Cor Clara', variable: '--light-color', value: '#FEF9EF' },
        { name: 'Cor Escura', variable: '--dark-color', value: '#6C3A3B' }
      ]
    },
    {
      name: 'Ouro e Jade',
      description: 'Inspirada nos templos dourados e jade tradicional',
      colors: [
        { name: 'Cor Primária', variable: '--primary-color', value: '#1A535C' },
        { name: 'Cor Secundária', variable: '--secondary-color', value: '#4ECDC4' },
        { name: 'Cor de Destaque', variable: '--accent-color', value: '#D9B08C' },
        { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
        { name: 'Cor Clara', variable: '--light-color', value: '#F7F9F9' },
        { name: 'Cor Escura', variable: '--dark-color', value: '#143B40' }
      ]
    },
    {
      name: 'Orquídea Tailandesa',
      description: 'Inspirada na orquídea, flor nacional da Tailândia',
      colors: [
        { name: 'Cor Primária', variable: '--primary-color', value: '#694873' },
        { name: 'Cor Secundária', variable: '--secondary-color', value: '#8E6C88' },
        { name: 'Cor de Destaque', variable: '--accent-color', value: '#E6AACE' },
        { name: 'Cor de Texto', variable: '--text-color', value: '#2A2A2A' },
        { name: 'Cor Clara', variable: '--light-color', value: '#F9F4F8' },
        { name: 'Cor Escura', variable: '--dark-color', value: '#432E50' }
      ]
    }
  ];
  
  // Exemplos de uso específico das cores no site
  const colorExamples = [
    { variable: '--primary-color', examples: [
      'Barra de navegação',
      'Botões principais',
      'Fundo das abas ativas no Admin',
      'Títulos de seções aninhadas no Editor de Textos'
    ]},
    { variable: '--secondary-color', examples: [
      'Subtítulos no Editor de Textos',
      'Elementos interativos secundários',
      'Bordas de elementos importantes',
      'Fundo alternado de seções'
    ]},
    { variable: '--accent-color', examples: [
      'Destaques em datas importantes',
      'Ícones interativos',
      'Borda dos itens selecionados',
      'Elementos que precisam chamar atenção'
    ]},
    { variable: '--text-color', examples: [
      'Texto padrão em todo o site',
      'Texto dos formulários',
      'Textos informativos'
    ]},
    { variable: '--light-color', examples: [
      'Fundo principal do site',
      'Fundos de cartões e elementos',
      'Áreas que precisam parecer mais espaçosas'
    ]},
    { variable: '--dark-color', examples: [
      'Texto de títulos importantes',
      'Fundos de áreas que precisam de contraste',
      'Textos que precisam de maior ênfase'
    ]}
  ];
  
  // Função para salvar as cores originais antes de aplicar a prévia
  const saveOriginalColors = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const originals = currentPalette.colors.map(color => ({
      variable: color.variable,
      value: computedStyle.getPropertyValue(color.variable).trim() || color.value
    }));
    
    setOriginalColors(originals);
  };
  
  // Função para restaurar as cores originais
  const restoreOriginalColors = () => {
    if (originalColors) {
      originalColors.forEach(color => {
        document.documentElement.style.setProperty(color.variable, color.value);
      });
    }
  };
  
  // Função para converter hex para RGB
  const hexToRgb = (hex) => {
    // Remove o # se presente
    hex = hex.replace('#', '');
    
    // Converte para valores RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  };
  
  // Função para aplicar as cores temporariamente
  const applyColorsTemporarily = (palette) => {
    palette.colors.forEach(color => {
      document.documentElement.style.setProperty(color.variable, color.value);
      
      // Também definir variantes RGB das cores
      if (color.value.startsWith('#')) {
        const rgbValue = hexToRgb(color.value);
        document.documentElement.style.setProperty(`${color.variable}-rgb`, rgbValue);
      }
    });
  };
  
  // Função para adicionar uma paleta ao histórico
  const addToHistory = (palette) => {
    const updatedHistory = [...paletteHistory];
    
    // Verifica se a paleta já existe no histórico (comparando nome)
    const existingIndex = updatedHistory.findIndex(p => p.name === palette.name);
    if (existingIndex !== -1) {
      // Remove a versão existente para adicioná-la novamente no início (mais recente)
      updatedHistory.splice(existingIndex, 1);
    }
    
    // Adiciona a nova paleta no início do array
    updatedHistory.unshift({
      ...palette,
      timestamp: new Date().toISOString(),
      id: palette.id || `palette-${Date.now()}`
    });
    
    // Limita o histórico a 10 paletas
    if (updatedHistory.length > 10) {
      updatedHistory.pop();
    }
    
    // Atualiza o estado e o localStorage
    setPaletteHistory(updatedHistory);
    localStorage.setItem('colorPaletteHistory', JSON.stringify(updatedHistory));
  };
  
  // Função para ativar a prévia de uma paleta
  const applyPalette = (palette) => {
    // Se não tiver ainda salvado as cores originais, salva
    if (!originalColors) {
      saveOriginalColors();
    }
    
    // Atualiza a paleta atual
    setCurrentPalette(palette);
    
    // Aplica as cores temporariamente se estiver com a prévia ativa
    if (previewActive) {
      applyColorsTemporarily(palette);
    }
    
    // Adiciona ao histórico
    addToHistory(palette);
  };
  
  // Função para ativar/desativar a prévia
  const togglePreview = () => {
    if (!previewActive) {
      // Ativando a prévia
      if (!originalColors) {
        saveOriginalColors();
      }
      applyColorsTemporarily(currentPalette);
    } else {
      // Desativando a prévia
      restoreOriginalColors();
    }
    setPreviewActive(!previewActive);
  };
  
  // Efeito para limpar as cores quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (previewActive && originalColors) {
        restoreOriginalColors();
      }
    };
  }, [previewActive, originalColors]);
  
  // Cores do tema atual transformadas em array para renderização
  const colors = currentPalette.colors.map(color => ({
    ...color, 
    usage: colorUsages[color.variable],
    rgb: hexToRgb(color.value)
  }));

  // Definindo conteúdo para demonstração do card
  const demoCardContent = {
    icon: "fas fa-ring",
    title: "Cerimônia",
    details: [
      "15 de junho de 2024",
      "16:00",
      "Resort Paradise Beach",
      "Rua das Palmeiras, 123"
    ],
    buttonText: "Ver Localização",
    buttonIcon: "fas fa-map-marker-alt"
  };

  return (
    <div className="color-editor">
      <Row className="mb-4">
        <Col>
          <Alert variant={previewActive ? "warning" : "info"}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Nota:</strong> {previewActive ? 
                  "A prévia de cores está ATIVA! As cores são temporárias e serão restauradas ao sair do painel de administração." : 
                  "A prévia de cores está inativa. Ative-a para ver as cores aplicadas em tempo real no site."}
              </div>
              <Form.Check 
                type="switch"
                id="preview-switch"
                label={previewActive ? "Desativar Prévia" : "Ativar Prévia"}
                checked={previewActive}
                onChange={togglePreview}
                className="ms-3"
              />
            </div>
          </Alert>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4>Cores do Tema Atual: {currentPalette.name}</h4>
            </Card.Header>
            <Card.Body>
              <p className="mb-4">
                {previewActive ? 
                  "Estas cores estão sendo aplicadas temporariamente ao site. Para salvar permanentemente, edite o arquivo src/index.css." :
                  "Para ver como o site ficaria com estas cores, ative a prévia no topo da página."}
              </p>
              
              <div className="color-palette">
                {colors.map((color) => (
                  <div key={color.variable} className="color-item mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div className="color-info">
                        <h5 className="mb-0">{color.name}</h5>
                        <div className="color-specs">
                          <small className="text-muted">Variável: <code>{color.variable}</code></small>
                          <small className="text-muted">Valor: <code>{color.value}</code></small>
                        </div>
                      </div>
                    </div>
                    <p>{color.usage}</p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>
              <h4>Paletas Sugeridas</h4>
            </Card.Header>
            <Card.Body>
              <p className="mb-4">
                Escolha uma das paletas inspiradas na Tailândia abaixo. {previewActive ? 
                  "Com a prévia ativa, você verá as mudanças imediatamente no site!" : 
                  "Ative a prévia para ver as cores aplicadas ao site."}
              </p>
              
              <Row xs={1} md={2} className="g-4">
                {suggestedPalettes.map((palette, idx) => (
                  <Col key={idx}>
                    <Card className="palette-card h-100">
                      <Card.Header>
                        <h5 className="mb-0">{palette.name}</h5>
                      </Card.Header>
                      <Card.Body>
                        <p className="palette-description">{palette.description}</p>
                        <div className="palette-preview">
                          {palette.colors.map((color, i) => (
                            <div 
                              key={i}
                              className="color-strip"
                              style={{ 
                                backgroundColor: color.value,
                                width: `${100 / palette.colors.length}%`
                              }}
                              title={`${color.name}: ${color.value}`}
                            />
                          ))}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                        <Button 
                          variant={previewActive ? "primary" : "outline-primary"}
                          size="sm"
                          onClick={() => applyPalette(palette)}
                          className="w-100"
                        >
                          {previewActive ? "Aplicar ao Site" : "Visualizar"}
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h4>Prévia de Componentes</h4>
                <Form.Check 
                  type="switch"
                  id="preview-switch-2"
                  label={previewActive ? "Prévia Ativa" : "Ativar Prévia"}
                  checked={previewActive}
                  onChange={togglePreview}
                  className="ms-3"
                />
              </div>
            </Card.Header>
            <Card.Body>
              <p className="mb-4">
                Esta seção mostra como os componentes principais do site ficarão com a paleta de cores selecionada.
                {!previewActive && " Ative a prévia acima para ver as cores aplicadas aos componentes."}
                {previewActive && " As cores estão sendo aplicadas em tempo real enquanto você visualiza diferentes paletas."}
              </p>
              
              <Alert variant={previewActive ? "success" : "info"} className="mb-4">
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    {previewActive ? "✓" : "ℹ️"}
                  </div>
                  <div>
                    <strong>{previewActive ? "Prévia de cores ativa!" : "Prévia de cores inativa"}</strong>
                    <div>
                      {previewActive 
                        ? "Você está visualizando componentes reais do site com as cores aplicadas em tempo real. Experimente selecionar diferentes paletas sugeridas ou ajuste as cores para ver os efeitos." 
                        : "Ative a prévia para ver as cores aplicadas aos componentes reais do site. Os componentes abaixo são os mesmos utilizados no site, mas não estão com as cores da prévia aplicadas."}
                    </div>
                  </div>
                </div>
              </Alert>
              
              <div className="real-components-preview">
                {/* Prévia do Navbar */}
                <div className="preview-section">
                  <h5>Navegação</h5>
                  <div className="navbar-wrapper">
                    <MockRouter>
                      <MockLanguageProvider>
                        {previewActive ? (
                          // Somente renderiza o Navbar real se a prévia estiver ativa
                          <Navbar />
                        ) : (
                          // Caso contrário, mostra um placeholder estático
                          <div className="navbar-placeholder">
                            <div className="navbar-brand">
                              Matheus & Juliana
                            </div>
                            <div className="ms-auto navbar-links">
                              <span className="nav-link">Início</span>
                              <span className="nav-link">Detalhes</span>
                              <span className="nav-link">Presentes</span>
                              <span className="nav-link">Confirmar</span>
                            </div>
                          </div>
                        )}
                      </MockLanguageProvider>
                    </MockRouter>
                  </div>
                </div>
                
                {/* Prévia do Hero Section */}
                <div className="preview-section mt-4">
                  <h5>Seção Principal (Hero)</h5>
                  <div className="preview-component-wrapper hero-wrapper">
                    <MockRouter>
                      <MockLanguageProvider>
                        {previewActive ? (
                          // Somente renderiza o Hero real se a prévia estiver ativa
                          <Hero />
                        ) : (
                          // Caso contrário, mostra um placeholder estático
                          <div className="hero-placeholder">
                            <div className="hero-content">
                              <h3 className="wedding-date">06.03.2025</h3>
                              <h1 className="couple-names">Matheus & Nadia</h1>
                              <h4 className="wedding-location">Tailândia</h4>
                            </div>
                          </div>
                        )}
                      </MockLanguageProvider>
                    </MockRouter>
                  </div>
                </div>
                
                {/* Prévia de Cards */}
                <div className="preview-section mt-4">
                  <h5>Cards e Seções de Conteúdo</h5>
                  <div className="row">
                    {/* Card exemplo 1 */}
                    <div className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="fas fa-ring fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                          <h3 className="preview-card-title">Cerimônia</h3>
                          <p className="mb-1 preview-card-text">15 de junho de 2024</p>
                          <p className="mb-1 preview-card-text">16:00</p>
                          <p className="mb-1 preview-card-text">Resort Paradise Beach</p>
                          <p className="preview-card-text">Rua das Palmeiras, 123</p>
                          <a 
                            href="#"
                            className="btn btn-outline-primary preview-btn-primary"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Ver Localização
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card exemplo 2 */}
                    <div className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="fas fa-gift fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                          <h3 className="preview-card-title">Lista de Presentes</h3>
                          <p className="mb-3 preview-card-text">Sua presença é o nosso maior presente, mas se desejar nos presentear, ficaremos muito felizes.</p>
                          <a 
                            href="#"
                            className="btn btn-primary preview-btn-primary"
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-heart me-2"></i>
                            Ver Presentes
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card exemplo 3 */}
                    <div className="col-md-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="fas fa-tshirt fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
                          <h3 className="preview-card-title">Dress Code</h3>
                          <p className="mb-3 preview-card-text">Traje: Esporte fino. Sugerimos roupas leves e confortáveis devido ao clima de praia.</p>
                          <button className="btn btn-outline-secondary preview-btn-secondary">
                            <i className="fas fa-info-circle me-2"></i>
                            Mais Informações
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Prévia de Elementos de Interface */}
                <div className="preview-section mt-4">
                  <h5>Elementos de Interface</h5>
                  <div className="interface-elements-demo">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card p-4">
                          <h6 className="mb-3 preview-card-title">Botões</h6>
                          <div className="d-flex flex-wrap gap-2 mb-4">
                            <button className="btn btn-primary preview-btn-primary">Botão Primário</button>
                            <button className="btn btn-secondary preview-btn-secondary">Botão Secundário</button>
                            <button className="btn btn-outline-primary preview-btn-outline">Botão Outline</button>
                            <button className="btn btn-accent preview-btn-accent" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)', border: 'none' }}>Botão Destaque</button>
                          </div>
                          
                          <h6 className="mb-3 preview-card-title">Badges e Alertas</h6>
                          <div className="mb-3">
                            <span className="badge me-2 preview-badge-primary" style={{ backgroundColor: 'var(--primary-color)' }}>Primary</span>
                            <span className="badge me-2 preview-badge-secondary" style={{ backgroundColor: 'var(--secondary-color)' }}>Secondary</span>
                            <span className="badge me-2 preview-badge-accent" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)' }}>Accent</span>
                            <span className="badge me-2 preview-badge-dark" style={{ backgroundColor: 'var(--dark-color)' }}>Dark</span>
                          </div>
                          
                          <div className="alert preview-alert" style={{ 
                            backgroundColor: `rgba(${hexToRgb(colors.find(c => c.variable === '--primary-color')?.value || '#3D2314')}, 0.15)`, 
                            color: 'var(--primary-color)', 
                            borderColor: `rgba(${hexToRgb(colors.find(c => c.variable === '--primary-color')?.value || '#3D2314')}, 0.3)` 
                          }}>
                            Este é um alerta estilizado com as cores do tema
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="card p-4">
                          <h6 className="mb-3 preview-card-title">Formulários</h6>
                          <form>
                            <div className="mb-3">
                              <label htmlFor="name" className="form-label preview-form-label">Nome Completo</label>
                              <input type="text" className="form-control preview-form-control" id="name" placeholder="Seu nome completo" style={{ borderColor: 'var(--secondary-color)' }} />
                            </div>
                            
                            <div className="mb-3">
                              <label htmlFor="attendance" className="form-label preview-form-label">Confirmar Presença</label>
                              <select className="form-select preview-form-select" id="attendance" style={{ borderColor: 'var(--secondary-color)' }}>
                                <option>Sim, eu vou!</option>
                                <option>Infelizmente não poderei comparecer</option>
                              </select>
                            </div>
                            
                            <div className="form-check mb-3">
                              <input className="form-check-input preview-form-check" type="checkbox" id="terms" style={{ borderColor: 'var(--secondary-color)' }} />
                              <label className="form-check-label preview-form-label" htmlFor="terms">
                                Concordo em receber atualizações sobre o evento
                              </label>
                            </div>
                            
                            <button type="button" className="btn btn-primary preview-btn-primary">Enviar</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Prévia do Footer */}
                <div className="preview-section mt-4">
                  <h5>Rodapé</h5>
                  <div className="preview-component-wrapper footer-wrapper">
                    <MockRouter>
                      <Footer />
                    </MockRouter>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h4>Histórico de Paletas</h4>
            </Card.Header>
            <Card.Body>
              {paletteHistory.length > 0 ? (
                <>
                  <p className="mb-3">Últimas {paletteHistory.length} paletas visualizadas:</p>
                  <div className="history-palettes">
                    {paletteHistory.map((palette, idx) => (
                      <Card key={palette.id || idx} className="history-palette-card mb-3">
                        <Card.Body className="p-2">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">{palette.name}</h6>
                            <small className="text-muted">
                              {palette.timestamp ? new Date(palette.timestamp).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : ''}
                            </small>
                          </div>
                          <div className="palette-preview mb-2">
                            {palette.colors.map((color, i) => (
                              <div 
                                key={i}
                                className="color-strip"
                                style={{ 
                                  backgroundColor: color.value,
                                  width: `${100 / palette.colors.length}%`
                                }}
                                title={`${color.name}: ${color.value}`}
                              />
                            ))}
                          </div>
                          <Button 
                            variant={previewActive ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={() => applyPalette(palette)}
                            className="w-100"
                          >
                            {previewActive ? "Aplicar ao Site" : "Visualizar Novamente"}
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center py-4">
                  Nenhuma paleta no histórico.<br/>
                  Experimente visualizar algumas das paletas sugeridas.
                </p>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>
              <h4>Uso das Cores</h4>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {colorExamples.map((colorEx) => {
                  const color = colors.find(c => c.variable === colorEx.variable);
                  return (
                    <Accordion.Item eventKey={colorEx.variable} key={colorEx.variable}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center">
                          <div 
                            className="color-dot me-2" 
                            style={{ backgroundColor: color?.value }}
                          ></div>
                          {color?.name}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <h6>Utilizada em:</h6>
                        <ul className="usage-list">
                          {colorEx.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Header>
              <h4>Dicas de Personalização</h4>
            </Card.Header>
            <Card.Body>
              <p>Para uma experiência de usuário coesa, considere estas dicas ao personalizar as cores:</p>
              <ul className="tips-list">
                <li>Mantenha um bom contraste entre cores de fundo e texto</li>
                <li>Use a cor de destaque com moderação para itens realmente importantes</li>
                <li>Considere escolher cores que tenham relação com o tema do casamento</li>
                <li>Teste as alterações em dispositivos móveis e desktops</li>
              </ul>
              <Alert variant="info" className="mt-3">
                <strong>Dica pro:</strong> Utilize ferramentas como o <a href="https://coolors.co/" target="_blank" rel="noopener noreferrer">Coolors</a> para criar paletas de cores harmoniosas.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const AdminPanel = ({ logout }) => {
  const [activeTab, setActiveTab] = useState('images');

  return (
    <Container className="admin-container">
      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <Card className="admin-header">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Painel Administrativo</h2>
              <Button variant="outline-danger" onClick={logout}>Sair</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row className="mb-3">
          <Col>
            <Nav variant="tabs" className="admin-tabs">
              <Nav.Item>
                <Nav.Link eventKey="images">Gerenciar Imagens</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="texts">Gerenciar Textos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="colors">Cores do Tema</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="images">
                <ImageEditor />
              </Tab.Pane>
              <Tab.Pane eventKey="texts">
                <TextEditor />
              </Tab.Pane>
              <Tab.Pane eventKey="colors">
                <ColorEditor />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Se o usuário estiver autenticado ou o login for bem-sucedido, mostra o painel administrativo
  if (isAuthenticated || loginSuccess) {
    return <AdminPanel logout={logout} />;
  }

  // Caso contrário, mostra a tela de login
  return <AdminLogin onLogin={() => setLoginSuccess(true)} />;
};

export default Admin; 