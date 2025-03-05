import React, { createContext, useState, useContext, useEffect } from 'react';

// Importando todas as imagens hero-bg
import heroBg1 from '../assets/images/hero-bg-1.webp';
import heroBg2 from '../assets/images/hero-bg-2.webp';
import heroBg3 from '../assets/images/hero-bg-3.webp';
import heroBg4 from '../assets/images/hero-bg-4.webp';
import heroBg5 from '../assets/images/hero-bg-5.webp';
import heroBg6 from '../assets/images/hero-bg-6.webp';
import heroBg7 from '../assets/images/hero-bg-7.webp';
import heroBg8 from '../assets/images/hero-bg-8.webp';
import heroBg9 from '../assets/images/hero-bg-9.webp';
import heroBg10 from '../assets/images/hero-bg-10.webp';

// Contexto para gerenciar as imagens do site
export const ImageContext = createContext();

// Hook personalizado para usar o contexto de imagens
export const useImages = () => useContext(ImageContext);

// Imagens padrão (iniciais) do site
const defaultImages = {
  // Hero section
  'hero-bg-1': heroBg1,
  'hero-bg-2': heroBg2,
  'hero-bg-3': heroBg3,
  'hero-bg-4': heroBg4,
  'hero-bg-5': heroBg5,
  'hero-bg-6': heroBg6,
  'hero-bg-7': heroBg7,
  'hero-bg-8': heroBg8,
  'hero-bg-9': heroBg9,
  'hero-bg-10': heroBg10,
  
  // Story section
  'couple-photo': 'https://images.unsplash.com/photo-1543157145-f78c636d023d',
  
  // Gifts section activities
  'gift-coffee': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9',
  'gift-dessert': 'https://images.unsplash.com/photo-1626697556651-69e29707bcc0',
  'gift-padthai': 'https://images.unsplash.com/photo-1626804475297-41608ea09aa0',
  'gift-tuktuk': 'https://images.unsplash.com/photo-1572455044327-21276ba47198',
  'gift-drinks': 'https://images.unsplash.com/photo-1545361446-1ac33007e21a',
  'gift-market': 'https://images.unsplash.com/photo-1528813860492-bb99459ec095',
  'gift-dinner': 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
  'gift-beach': 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a',
  'gift-temples': 'https://images.unsplash.com/photo-1528181304800-259b08848526',
  'gift-massage': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
  'gift-boat': 'https://images.unsplash.com/photo-1552074284-5e84a731cf65',
  'gift-elephants': 'https://images.unsplash.com/photo-1559466273-d95e72debaf8',
  'gift-custom': 'https://images.unsplash.com/photo-1565514020179-026b5cfddc2a',
  
  // Gallery section - Corrigindo as URLs das imagens
  'gallery-1': 'https://images.unsplash.com/photo-1537633552985-df8429e048b0',
  'gallery-2': 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af',
  'gallery-3': 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999',
  'gallery-4': 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f',
};

// Descrições das imagens e onde são usadas
const imageDescriptions = {
  'hero-bg-1': 'Imagem de fundo 1 do Hero (Seção inicial)',
  'hero-bg-2': 'Imagem de fundo 2 do Hero (Seção inicial)',
  'hero-bg-3': 'Imagem de fundo 3 do Hero (Seção inicial)',
  'hero-bg-4': 'Imagem de fundo 4 do Hero (Seção inicial)',
  'hero-bg-5': 'Imagem de fundo 5 do Hero (Seção inicial)',
  'hero-bg-6': 'Imagem de fundo 6 do Hero (Seção inicial)',
  'hero-bg-7': 'Imagem de fundo 7 do Hero (Seção inicial)',
  'hero-bg-8': 'Imagem de fundo 8 do Hero (Seção inicial)',
  'hero-bg-9': 'Imagem de fundo 9 do Hero (Seção inicial)',
  'hero-bg-10': 'Imagem de fundo 10 do Hero (Seção inicial)',
  'couple-photo': 'Foto do casal na seção Nossa História',
  'gift-coffee': 'Imagem da atividade Café Tailandês',
  'gift-dessert': 'Imagem da atividade Sobremesa Típica',
  'gift-padthai': 'Imagem da atividade Pad Thai de Rua',
  'gift-tuktuk': 'Imagem da atividade Passeio de Tuk-tuk',
  'gift-drinks': 'Imagem da atividade Drinks ao Pôr-do-sol',
  'gift-market': 'Imagem da atividade Mercado Flutuante',
  'gift-dinner': 'Imagem da atividade Jantar Tradicional',
  'gift-beach': 'Imagem da atividade Dia na Praia',
  'gift-temples': 'Imagem da atividade Tour pelos Templos',
  'gift-massage': 'Imagem da atividade Massagem Tailandesa',
  'gift-boat': 'Imagem da atividade Passeio de Barco',
  'gift-elephants': 'Imagem da atividade Santuário de Elefantes',
  'gift-custom': 'Imagem da atividade Contribuição Livre',
  'gallery-1': 'Imagem 1 da Galeria de Fotos',
  'gallery-2': 'Imagem 2 da Galeria de Fotos',
  'gallery-3': 'Imagem 3 da Galeria de Fotos',
  'gallery-4': 'Imagem 4 da Galeria de Fotos',
};

// Provider para o contexto de imagens
export const ImageProvider = ({ children }) => {
  // Estado para armazenar as imagens atuais
  const [images, setImages] = useState(() => {
    // Tenta carregar as imagens do localStorage primeiro
    const savedImages = localStorage.getItem('weddingImages');
    return savedImages ? JSON.parse(savedImages) : defaultImages;
  });
  
  // Salva as imagens no localStorage quando elas mudam
  useEffect(() => {
    localStorage.setItem('weddingImages', JSON.stringify(images));
  }, [images]);
  
  // Função para atualizar uma imagem específica
  const updateImage = (imageKey, newUrl) => {
    setImages(prevImages => ({
      ...prevImages,
      [imageKey]: newUrl
    }));
  };
  
  // Função para resetar todas as imagens para os valores padrão
  const resetImages = () => {
    setImages(defaultImages);
  };
  
  // Função para obter a descrição de uma imagem
  const getImageDescription = (imageKey) => {
    return imageDescriptions[imageKey] || 'Descrição não disponível';
  };
  
  // Função para obter todas as descrições de imagens
  const getAllImageDescriptions = () => {
    return imageDescriptions;
  };
  
  return (
    <ImageContext.Provider 
      value={{ 
        images, 
        updateImage, 
        resetImages, 
        getImageDescription,
        getAllImageDescriptions,
        defaultImages
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}; 