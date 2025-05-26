/**
 * Script para indexar as fotos na pasta dist/assets/fotos
 * - Conta o número total de imagens
 * - Cria um mapeamento dos arquivos
 * - Atualiza o arquivo imageUtils.js
 * 
 * Para executar: 
 * node scripts/index-photos.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para a pasta de fotos
const PHOTOS_DIR = path.join(__dirname, '../public/fotos');
// Caminho para o arquivo de mapeamento
const MAPPING_FILE = path.join(__dirname, '../src/utils/photo-mapping.json');

// Função principal
async function indexPhotos() {
  console.log('Indexando fotos na pasta:', PHOTOS_DIR);
  
  try {
    // Verifica se a pasta existe
    if (!fs.existsSync(PHOTOS_DIR)) {
      console.error('Pasta de fotos não encontrada:', PHOTOS_DIR);
      return;
    }
    
    // Lê os arquivos na pasta
    const files = fs.readdirSync(PHOTOS_DIR);
    console.log(`Encontrados ${files.length} arquivos.`);
    
    // Filtra apenas os arquivos de imagem
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`Encontrados ${imageFiles.length} arquivos de imagem.`);
    
    // Cria um mapeamento de índice para nome de arquivo
    const mapping = {};
    
    imageFiles.forEach((file, index) => {
      mapping[index + 1] = file; // Índices começam em 1
    });
    
    // Salva o mapeamento em um arquivo JSON
    fs.writeFileSync(
      MAPPING_FILE, 
      JSON.stringify(mapping, null, 2)
    );
    
    console.log(`Mapeamento salvo em: ${MAPPING_FILE}`);
    
    // Atualiza o imageUtils.js
    updateImageUtils(imageFiles.length);
    
    console.log(`\nIndexação concluída! ${imageFiles.length} imagens foram indexadas.`);
    
  } catch (error) {
    console.error('Erro ao indexar fotos:', error);
  }
}

// Função para atualizar o arquivo imageUtils.js
function updateImageUtils(totalImages) {
  const utilsPath = path.join(__dirname, '../src/utils/imageUtils.js');
  
  // Verifica se o arquivo existe
  if (!fs.existsSync(utilsPath)) {
    console.error('Arquivo imageUtils.js não encontrado:', utilsPath);
    return;
  }
  
  try {
    // Lê o conteúdo atual do arquivo
    let content = fs.readFileSync(utilsPath, 'utf8');
    
    // Atualiza a função getTotalImageCount
    const getTotalFunction = /export const getTotalImageCount = \(\) => \{[\s\S]+?\};/;
    const newGetTotalFunction = `export const getTotalImageCount = () => {
  return ${totalImages}; // Atualizado automaticamente pelo script de indexação
};`;
    
    content = content.replace(getTotalFunction, newGetTotalFunction);
    
    // Salva o arquivo atualizado
    fs.writeFileSync(utilsPath, content);
    
    console.log('Arquivo imageUtils.js atualizado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar imageUtils.js:', error);
  }
}

// Executa a função principal
indexPhotos(); 