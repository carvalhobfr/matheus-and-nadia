import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from 'i18next';
import { enTranslations, ptTranslations, esTranslations } from '../i18n';

// Contexto para gerenciar os textos do site
export const TextContext = createContext();

// Hook personalizado para usar o contexto de textos
export const useTexts = () => useContext(TextContext);

// Obter as traduções padrão de i18n.js
const defaultTexts = {
  en: enTranslations || {},
  pt: ptTranslations || {},
  es: esTranslations || {}
};

// Provider para o contexto de textos
export const TextProvider = ({ children }) => {
  // Estado para armazenar os textos atuais
  const [texts, setTexts] = useState(() => {
    // Tenta carregar os textos do localStorage primeiro
    const savedTexts = localStorage.getItem('weddingTexts');
    return savedTexts ? JSON.parse(savedTexts) : defaultTexts;
  });
  
  // Estados para controle da edição
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const [currentSection, setCurrentSection] = useState('hero');
  
  // Salva os textos no localStorage quando eles mudam
  useEffect(() => {
    localStorage.setItem('weddingTexts', JSON.stringify(texts));
    
    // Atualiza as traduções no i18n
    Object.keys(texts).forEach(lang => {
      i18n.addResourceBundle(lang, 'translation', texts[lang], true, true);
    });
    
  }, [texts]);
  
  // Função para atualizar um texto específico
  const updateText = (language, path, value) => {
    setTexts(prevTexts => {
      // Cria uma cópia profunda dos textos atuais
      const newTexts = JSON.parse(JSON.stringify(prevTexts));
      
      // Divide o caminho em partes (ex: "hero.title" -> ["hero", "title"])
      const pathParts = path.split('.');
      
      // Navega através do objeto até encontrar o valor a ser atualizado
      let current = newTexts[language];
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      // Atualiza o valor
      current[pathParts[pathParts.length - 1]] = value;
      
      return newTexts;
    });
  };
  
  // Função para obter um texto específico
  const getText = (language, path) => {
    // Divide o caminho em partes
    const pathParts = path.split('.');
    
    // Navega através do objeto para encontrar o valor
    let current = texts[language];
    for (const part of pathParts) {
      if (!current[part]) return '';
      current = current[part];
    }
    
    return current;
  };
  
  // Função para resetar todos os textos para os valores padrão
  const resetTexts = () => {
    setTexts(defaultTexts);
  };
  
  // Função para obter um objeto aninhado completo
  const getTextObject = (language, path) => {
    if (!path) return texts[language];
    
    // Divide o caminho em partes
    const pathParts = path.split('.');
    
    // Navega através do objeto para encontrar o valor
    let current = texts[language];
    for (const part of pathParts) {
      if (!current[part]) return {};
      current = current[part];
    }
    
    return current;
  };
  
  return (
    <TextContext.Provider 
      value={{ 
        texts,
        updateText,
        getText,
        resetTexts,
        getTextObject,
        currentLanguage,
        setCurrentLanguage,
        currentSection,
        setCurrentSection
      }}
    >
      {children}
    </TextContext.Provider>
  );
}; 