/**
 * Script para indexar as fotos na pasta dist/assets/fotos
 * Este script lê os nomes dos arquivos na pasta de fotos e gera um arquivo de mapeamento
 * para facilitar o carregamento das imagens no frontend.
 * 
 * Para executar: 
 * node scripts/index-photos.js
 */

const fs = require('fs');
const path = require('path');

// Caminho para a pasta de fotos
const PHOTOS_DIR = path.join(__dirname, '../dist/assets/fotos');
// Caminho para o arquivo de saída (mapeamento)
const OUTPUT_FILE = path.join(__dirname, '../src/utils/photo-mapping.json');

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
    
    // Cria o mapeamento de índice -> nome do arquivo
    const mapping = {};
    
    imageFiles.forEach(file => {
      // Formato esperado: 555-C0090.jpg
      const match = file.match(/^(\d+)-(.+)$/);
      
      if (match) {
        const [_, index, filename] = match;
        mapping[index] = filename;
      }
    });
    
    // Salva o mapeamento em um arquivo JSON
    fs.writeFileSync(
      OUTPUT_FILE, 
      JSON.stringify(mapping, null, 2)
    );
    
    console.log(`Mapeamento salvo em: ${OUTPUT_FILE}`);
    console.log(`Total de imagens indexadas: ${Object.keys(mapping).length}`);
    
    // Atualiza o arquivo imageUtils.js para usar o mapeamento
    updateImageUtils();
    
  } catch (error) {
    console.error('Erro ao indexar fotos:', error);
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
    // Lê o mapeamento gerado
    const mapping = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    
    // Lê o conteúdo atual do arquivo
    let content = fs.readFileSync(utilsPath, 'utf8');
    
    // Encontra a declaração do imageFileMapping
    const mappingRegex = /export const imageFileMapping = \{[^}]*\};/s;
    
    // Formata o novo mapeamento como string
    let newMappingStr = 'export const imageFileMapping = {\n';
    Object.entries(mapping).forEach(([key, value]) => {
      newMappingStr += `  "${key}": "${value}",\n`;
    });
    newMappingStr += '};';
    
    // Substitui o mapeamento antigo pelo novo
    if (mappingRegex.test(content)) {
      content = content.replace(mappingRegex, newMappingStr);
    } else {
      console.warn('Não foi possível encontrar a declaração de imageFileMapping no arquivo.');
      return;
    }
    
    // Atualiza também o total de imagens
    const totalCountRegex = /export const getTotalImageCount = \(\) => \{\s*return \d+;/;
    const totalCount = Object.keys(mapping).length;
    const newTotalCountStr = `export const getTotalImageCount = () => {\n  return ${totalCount};`;
    
    if (totalCountRegex.test(content)) {
      content = content.replace(totalCountRegex, newTotalCountStr);
    }
    
    // Salva o arquivo atualizado
    fs.writeFileSync(utilsPath, content);
    
    console.log('Arquivo imageUtils.js atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar imageUtils.js:', error);
  }
}

// Executa a função principal
indexPhotos(); 