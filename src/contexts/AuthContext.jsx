import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto para gerenciar a autenticação
export const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provider para o contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  
  // Credenciais para acesso administrativo (simplificado)
  // Em um ambiente de produção, isso seria gerenciado no servidor
  const adminCredentials = {
    username: 'admin',
    password: 'admin123'
  };
  
  // Salva o estado de autenticação no localStorage quando ele muda
  useEffect(() => {
    localStorage.setItem('adminAuthenticated', isAuthenticated);
  }, [isAuthenticated]);
  
  // Função para realizar login
  const login = (username, password) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  // Função para realizar logout
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 