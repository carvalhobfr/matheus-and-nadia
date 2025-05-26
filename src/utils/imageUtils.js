/**
 * Utilitários para gerenciar o carregamento de imagens da galeria
 */

// Função para obter o caminho base para as imagens
export const getBasePath = () => {
  return '/assets/fotos-optimized/';
};

// Mapeamento para nomes de arquivos (será preenchido pelo script de renomeação)
export const imageFileMapping = {};

// Função para construir o caminho completo da imagem
export const getFullImagePath = (fileIndex) => {
  const basePath = getBasePath();
  
  // Formato padronizado para imagens otimizadas
  return `${basePath}fotos-casamento-${fileIndex}.webp`;
};

// Função para obter o caminho dos thumbnails
export const getThumbnailPath = (fileIndex) => {
  // Caminho para thumbnails com formato padronizado
  return `/assets/fotos-optimized/thumbnails/fotos-casamento-${fileIndex}.webp`;
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
// Será atualizado pelo script de indexação/renomeação
export const getTotalImageCount = () => {
  return 555; // Valor inicial, será atualizado pelo script
};

// Função para tentar diferentes variações de nomes de arquivo
export const findCorrectImagePath = async (fileIndex) => {
  const basePath = getBasePath();
  
  // Primeiro, tenta o mapeamento conhecido
  if (imageFileMapping[fileIndex]) {
    const path = `${basePath}${fileIndex}-${imageFileMapping[fileIndex]}`;
    try {
      await loadImage(path);
      return path;
    } catch (error) {
      // Se falhar, continua tentando outras opções
      console.log(`Tentativa falhou para ${path}`);
    }
  }
  
  // Lista de padrões comuns observados nos nomes de arquivo
  const commonPatterns = [
    `${basePath}${fileIndex}-C`,
    `${basePath}${fileIndex}-DSC`,
    `${basePath}${fileIndex}-alterada`
  ];
  
  // Tenta cada padrão com diferentes extensões
  for (const pattern of commonPatterns) {
    for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
      try {
        // Para arquivos que começam com C, tentamos números de 4 dígitos
        if (pattern.endsWith('-C')) {
          for (let i = 1; i <= 100; i++) {
            const paddedNumber = i.toString().padStart(4, '0');
            const path = `${pattern}${paddedNumber}${ext}`;
            try {
              await loadImage(path);
              return path;
            } catch (error) {
              // Continua tentando
            }
          }
        } 
        // Para arquivos DSC, tentamos números de 5 dígitos
        else if (pattern.endsWith('-DSC')) {
          for (let i = 0; i <= 9999; i++) {
            const paddedNumber = i.toString().padStart(5, '0');
            const path = `${pattern}${paddedNumber}${ext}`;
            try {
              await loadImage(path);
              return path;
            } catch (error) {
              // Continua tentando
            }
          }
        }
        // Para arquivos alterada, tentamos números de 1 dígito
        else if (pattern.endsWith('-alterada')) {
          for (let i = 1; i <= 9; i++) {
            const path = `${pattern}${i}${ext}`;
            try {
              await loadImage(path);
              return path;
            } catch (error) {
              // Continua tentando
            }
          }
        }
      } catch (error) {
        // Continua tentando
      }
    }
  }
  
  // Se todas as tentativas falharem, retorna null
  return null;
}; 