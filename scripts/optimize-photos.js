/**
 * Script para otimizar as fotos na pasta dist/assets/fotos
 * - Converte todas as imagens para formato WebP
 * - Redimensiona para tamanhos otimizados
 * - Mantém a nomenclatura padronizada "fotos-casamento-[número].webp"
 * 
 * Para executar: 
 * node scripts/optimize-photos.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Caminho para a pasta de fotos original
const PHOTOS_DIR = path.join(__dirname, '../dist/assets/fotos');
// Caminho para a pasta de fotos otimizadas
const OUTPUT_DIR = path.join(__dirname, '../dist/assets/fotos-optimized');
// Caminho para o arquivo de mapeamento
const MAPPING_FILE = path.join(__dirname, '../src/utils/photo-mapping.json');

// Configurações de otimização
const THUMBNAIL_SIZE = 600; // Largura máxima para thumbnails na galeria
const FULLSIZE_SIZE = 1200; // Largura máxima para visualização completa
const WEBP_QUALITY = 80; // Qualidade WebP (0-100)

// Função principal
async function optimizePhotos() {
  console.log('Otimizando fotos na pasta:', PHOTOS_DIR);
  
  try {
    // Verifica se a pasta existe
    if (!fs.existsSync(PHOTOS_DIR)) {
      console.error('Pasta de fotos não encontrada:', PHOTOS_DIR);
      return;
    }
    
    // Cria a pasta de saída se não existir
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Cria pasta para thumbnails
    const thumbDir = path.join(OUTPUT_DIR, 'thumbnails');
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }
    
    // Lê os arquivos na pasta
    const files = fs.readdirSync(PHOTOS_DIR);
    console.log(`Encontrados ${files.length} arquivos.`);
    
    // Filtra apenas os arquivos de imagem
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`Encontrados ${imageFiles.length} arquivos de imagem para otimizar.`);
    
    // Processa cada imagem
    let processedCount = 0;
    const totalFiles = imageFiles.length;
    
    for (const file of imageFiles) {
      const inputPath = path.join(PHOTOS_DIR, file);
      
      // Verifica se o arquivo segue o novo padrão "fotos-casamento-[número].extensão"
      const match = file.match(/^fotos-casamento-(\d+)(\.\w+)$/);
      
      if (match) {
        const [_, numberStr, extension] = match;
        const number = parseInt(numberStr, 10);
        
        // Caminhos de saída com o mesmo padrão de nomenclatura
        const outputPathFull = path.join(OUTPUT_DIR, `fotos-casamento-${number}.webp`);
        const outputPathThumb = path.join(thumbDir, `fotos-casamento-${number}.webp`);
        
        try {
          // Carrega a imagem
          const image = sharp(inputPath);
          
          // Versão em tamanho completo
          await image
            .resize({ 
              width: FULLSIZE_SIZE, 
              height: undefined, 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPathFull);
          
          // Versão thumbnail
          await sharp(inputPath)
            .resize({ 
              width: THUMBNAIL_SIZE, 
              height: undefined, 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .webp({ quality: WEBP_QUALITY })
            .toFile(outputPathThumb);
          
          processedCount++;
          
          // Mostra progresso a cada 10 imagens
          if (processedCount % 10 === 0 || processedCount === totalFiles) {
            console.log(`Progresso: ${processedCount}/${totalFiles} (${Math.round(processedCount/totalFiles*100)}%)`);
          }
        } catch (error) {
          console.error(`Erro ao processar ${file}:`, error.message);
        }
      } else {
        console.warn(`Arquivo ${file} não segue o padrão esperado e será ignorado.`);
      }
    }
    
    console.log(`\nOtimização concluída! ${processedCount} imagens foram processadas.`);
    console.log(`Imagens otimizadas salvas em: ${OUTPUT_DIR}`);
    console.log(`Thumbnails salvos em: ${thumbDir}`);
    
    // Atualiza o imageUtils.js para usar as imagens otimizadas
    updateImageUtils();
    
  } catch (error) {
    console.error('Erro ao otimizar fotos:', error);
  }
}

// Função para atualizar o arquivo imageUtils.js
function updateImageUtils() {
  const utilsPath = path.join(__dirname, '../src/utils/imageUtils.js');
  
  // Verifica se o arquivo existe
  if (!fs.existsSync(utilsPath)) {
    console.error('Arquivo imageUtils.js não encontrado:', utilsPath);
    return;
  }
  
  try {
    // Lê o conteúdo atual do arquivo
    let content = fs.readFileSync(utilsPath, 'utf8');
    
    // Atualiza o caminho base para usar as imagens otimizadas
    const basePathRegex = /export const getBasePath = \(\) => \{\s*return ['"](.+)['"];?\s*\};/;
    const newBasePathStr = 'export const getBasePath = () => {\n  return \'/assets/fotos-optimized/\';\n};';
    
    if (basePathRegex.test(content)) {
      content = content.replace(basePathRegex, newBasePathStr);
      
      // Adiciona função para obter o caminho dos thumbnails
      if (!content.includes('getThumbnailPath')) {
        const getFullPathFunctionEnd = /export const getFullImagePath(.+?\n\};)/s;
        const thumbnailFunction = `
// Função para obter o caminho dos thumbnails
export const getThumbnailPath = (fileIndex) => {
  // Caminho para thumbnails com formato padronizado
  return \`/assets/fotos-optimized/thumbnails/fotos-casamento-\${fileIndex}.webp\`;
};`;
        
        content = content.replace(getFullPathFunctionEnd, (match) => {
          return match + thumbnailFunction;
        });
      } else {
        // Atualiza a função getThumbnailPath existente
        const getThumbnailFunction = /export const getThumbnailPath = \(fileIndex\) => \{[\s\S]+?\};/;
        const newGetThumbnailFunction = `export const getThumbnailPath = (fileIndex) => {
  // Caminho para thumbnails com formato padronizado
  return \`/assets/fotos-optimized/thumbnails/fotos-casamento-\${fileIndex}.webp\`;
};`;
        
        content = content.replace(getThumbnailFunction, newGetThumbnailFunction);
      }
      
      // Atualiza a função getFullImagePath para usar o novo padrão
      const getFullPathFunction = /export const getFullImagePath = \(fileIndex\) => \{[\s\S]+?\};/;
      const newGetFullPathFunction = `export const getFullImagePath = (fileIndex) => {
  const basePath = getBasePath();
  
  // Formato padronizado para imagens otimizadas
  return \`\${basePath}fotos-casamento-\${fileIndex}.webp\`;
};`;
      
      content = content.replace(getFullPathFunction, newGetFullPathFunction);
      
      // Salva o arquivo atualizado
      fs.writeFileSync(utilsPath, content);
      
      console.log('Arquivo imageUtils.js atualizado com sucesso!');
    } else {
      console.warn('Não foi possível encontrar a função getBasePath no arquivo imageUtils.js');
    }
  } catch (error) {
    console.error('Erro ao atualizar imageUtils.js:', error);
  }
}

// Executa a função principal
optimizePhotos(); 