/**
 * Utilitários para gerenciar o carregamento de imagens da galeria
 */

// URL base do GitHub para as imagens
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/carvalhobfr/weddind-website-matheus-nadia/main/public/fotos-optimized';

// Função para obter o caminho base para as imagens
export const getBasePath = () => {
  // Em desenvolvimento, usar local; em produção, usar GitHub
  if (import.meta.env.DEV) {
    return '/fotos-optimized/';
  }
  return `${GITHUB_BASE_URL}/`;
};

// Função para construir o caminho completo da imagem
export const getFullImagePath = (fileIndex) => {
  if (import.meta.env.DEV) {
    return `/fotos-optimized/fotos-casamento-${fileIndex}.webp`;
  }
  return `${GITHUB_BASE_URL}/fotos-casamento-${fileIndex}.webp`;
};

// Função para obter o caminho dos thumbnails
export const getThumbnailPath = (fileIndex) => {
  if (import.meta.env.DEV) {
    return `/fotos-optimized/thumbnails/fotos-casamento-${fileIndex}.webp`;
  }
  return `${GITHUB_BASE_URL}/thumbnails/fotos-casamento-${fileIndex}.webp`;
};

// Função para carregar uma imagem e verificar se ela existe
export const loadImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve(imagePath);
    };
    
    img.onerror = () => {
      reject(new Error(`Não foi possível carregar a imagem: ${imagePath}`));
    };
    
    img.src = imagePath;
  });
};

// Função para obter o número total de imagens disponíveis
export const getTotalImageCount = () => {
  return 555; // Atualizado automaticamente pelo script de renomeação
};

// Função para verificar se uma imagem existe
export const checkImageExists = async (fileIndex) => {
  try {
    const thumbnailPath = getThumbnailPath(fileIndex);
    await loadImage(thumbnailPath);
    return true;
  } catch (error) {
    return false;
  }
}; 