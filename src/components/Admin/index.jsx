import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Accordion } from 'react-bootstrap';
import { useImages } from '../../contexts/ImageContext';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.scss';

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

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Se o usuário estiver autenticado ou o login for bem-sucedido, mostra o editor de imagens
  if (isAuthenticated || loginSuccess) {
    return <ImageEditor />;
  }

  // Caso contrário, mostra a tela de login
  return <AdminLogin onLogin={() => setLoginSuccess(true)} />;
};

export default Admin; 