/**
 * Script para renomear as fotos na pasta dist/assets/fotos
 * - Mantém a ordem original (baseada nos números no início dos nomes)
 * - Padroniza os nomes para "fotos-casamento-[número].webp"
 * 
 * Para executar: 
 * node scripts/rename-photos.js
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
    
    // Ordena os arquivos pelo número (ordem crescente para manter os números menores primeiro)
    fileInfos.sort((a, b) => a.number - b.number);
    
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
    
    // Atualiza a função getTotalImageCount com o número real de imagens
    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
    const totalImages = Object.keys(mapping).length;
    
    const getTotalFunction = /export const getTotalImageCount = \(\) => \{[\s\S]+?\};/;
    const newGetTotalFunction = `export const getTotalImageCount = () => {
  return ${totalImages}; // Atualizado automaticamente pelo script de renomeação
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
renamePhotos(); 