/**
 * Script para renomear as fotos na pasta dist/assets/fotos
 * - Mantém a ordem original (baseada nos números no início dos nomes)
 * - Padroniza os nomes para "fotos-casamento-[número].webp"
 * 
 * Para executar: 
 * node scripts/rename-photos.js
 */

const fs = require('fs');
const path = require('path');

// Caminho para a pasta de fotos
const PHOTOS_DIR = path.join(__dirname, '../dist/assets/fotos');
// Caminho para o arquivo de mapeamento
const MAPPING_FILE = path.join(__dirname, '../src/utils/photo-mapping.json');

// Função principal
async function renamePhotos() {
  console.log('Renomeando fotos na pasta:', PHOTOS_DIR);
  
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
    
    console.log(`Encontrados ${imageFiles.length} arquivos de imagem para renomear.`);
    
    // Cria um array de objetos com informações sobre os arquivos
    const fileInfos = imageFiles.map(file => {
      // Extrai o número do início do nome do arquivo (por exemplo, "555-C0090.jpg" => "555")
      const match = file.match(/^(\d+)-(.+)$/);
      if (match) {
        const [_, numberStr, rest] = match;
        return {
          originalName: file,
          number: parseInt(numberStr, 10),
          extension: path.extname(file)
        };
      } else {
        // Se não seguir o padrão esperado, atribui um número grande para ficar no final
        return {
          originalName: file,
          number: 9999999,
          extension: path.extname(file)
        };
      }
    });
    
    // Ordena os arquivos pelo número (ordem decrescente para manter os números mais altos primeiro)
    fileInfos.sort((a, b) => b.number - a.number);
    
    // Cria um mapeamento de número original para novo nome
    const mapping = {};
    
    // Renomeia os arquivos
    for (let i = 0; i < fileInfos.length; i++) {
      const fileInfo = fileInfos[i];
      const newNumber = i + 1; // Começa do 1
      const newName = `fotos-casamento-${newNumber}${fileInfo.extension}`;
      
      // Armazena o mapeamento
      mapping[fileInfo.number.toString()] = newName;
      
      // Caminho completo para os arquivos
      const oldPath = path.join(PHOTOS_DIR, fileInfo.originalName);
      const newPath = path.join(PHOTOS_DIR, newName);
      
      // Renomeia o arquivo
      fs.renameSync(oldPath, newPath);
      
      console.log(`Renomeado: ${fileInfo.originalName} => ${newName}`);
    }
    
    // Salva o mapeamento em um arquivo JSON
    fs.writeFileSync(
      MAPPING_FILE, 
      JSON.stringify(mapping, null, 2)
    );
    
    console.log(`\nRenomeação concluída! ${fileInfos.length} imagens foram renomeadas.`);
    console.log(`Mapeamento salvo em: ${MAPPING_FILE}`);
    
    // Atualiza o imageUtils.js para usar os novos nomes
    updateImageUtils();
    
  } catch (error) {
    console.error('Erro ao renomear fotos:', error);
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
    
    // Atualiza a função getFullImagePath para usar o novo padrão de nome
    const getFullPathFunction = /export const getFullImagePath = \(fileIndex\) => \{[\s\S]+?\};/;
    const newGetFullPathFunction = `export const getFullImagePath = (fileIndex) => {
  const basePath = getBasePath();
  
  // Formato padronizado para imagens otimizadas
  return \`\${basePath}fotos-casamento-\${fileIndex}.webp\`;
};`;
    
    content = content.replace(getFullPathFunction, newGetFullPathFunction);
    
    // Atualiza a função getThumbnailPath se existir
    if (content.includes('getThumbnailPath')) {
      const getThumbnailFunction = /export const getThumbnailPath = \(fileIndex\) => \{[\s\S]+?\};/;
      const newGetThumbnailFunction = `export const getThumbnailPath = (fileIndex) => {
  // Caminho para thumbnails com formato padronizado
  return \`/assets/fotos-optimized/thumbnails/fotos-casamento-\${fileIndex}.webp\`;
};`;
      
      content = content.replace(getThumbnailFunction, newGetThumbnailFunction);
    }
    
    // Salva o arquivo atualizado
    fs.writeFileSync(utilsPath, content);
    
    console.log('Arquivo imageUtils.js atualizado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar imageUtils.js:', error);
  }
}

// Executa a função principal
renamePhotos(); 