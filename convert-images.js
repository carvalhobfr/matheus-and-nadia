import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Obter o caminho do diretório atual no contexto de ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = 'src';
const QUALITY = 80; // Qualidade da imagem WebP (0-100)

// Extensões de imagem para converter
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg'];

// Tipos de arquivo para atualizar referências
const CODE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

/**
 * Verifica se o arquivo é uma imagem válida antes de converter
 * @param {string} filePath - Caminho do arquivo
 * @returns {Promise<boolean>} - Se o arquivo é uma imagem válida
 */
async function isValidImage(filePath) {
  try {
    const fileStats = await fs.stat(filePath);
    // Se o arquivo tiver 0 bytes, não é válido
    if (fileStats.size === 0) return false;
    
    // Tenta ler os metadados da imagem para verificar se é válida
    await sharp(filePath).metadata();
    return true;
  } catch (error) {
    console.log(`⚠️ Arquivo não é uma imagem válida: ${filePath}`);
    return false;
  }
}

/**
 * Converte uma imagem JPG/JPEG para WebP
 * @param {string} filePath - Caminho do arquivo JPG
 * @returns {Promise<object|null>} - Objeto com caminhos original e WebP ou null em caso de erro
 */
async function convertImage(filePath) {
  try {
    // Verifica se é uma imagem válida
    const isValid = await isValidImage(filePath);
    if (!isValid) {
      throw new Error('Arquivo não é uma imagem válida');
    }
    
    const baseName = path.basename(filePath, path.extname(filePath));
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${baseName}.webp`);
    
    // Verifica se o arquivo WebP já existe
    try {
      await fs.access(webpPath);
      console.log(`ℹ️ Arquivo WebP já existe: ${path.basename(webpPath)}`);
      return { original: filePath, webp: webpPath };
    } catch (err) {
      // O arquivo WebP não existe, vamos criá-lo
    }
    
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);
      
    console.log(`✅ Convertido: ${path.basename(filePath)} -> ${path.basename(webpPath)}`);
    return { original: filePath, webp: webpPath };
  } catch (error) {
    console.log(`❌ Erro ao converter ${path.basename(filePath)}: ${error.message}`);
    return null;
  }
}

/**
 * Encontra todos os arquivos JPG/JPEG no projeto
 * @returns {Promise<string[]>} - Array com caminhos de arquivos JPG/JPEG
 */
async function findJpegImages() {
  const imagePatterns = IMAGE_EXTENSIONS.map(ext => `${SOURCE_DIR}/**/*${ext}`);
  const allImagePaths = [];
  
  for (const pattern of imagePatterns) {
    const matches = await glob(pattern);
    allImagePaths.push(...matches);
  }
  
  return allImagePaths;
}

/**
 * Atualiza referências para arquivos JPG/JPEG em arquivos de código
 * @param {Array<{original: string, webp: string}>} convertedImages - Lista de imagens convertidas
 * @returns {Promise<string[]>} - Lista de arquivos atualizados
 */
async function updateCodeReferences(convertedImages) {
  // Encontra todos os arquivos de código
  const codePatterns = CODE_EXTENSIONS.map(ext => `${SOURCE_DIR}/**/*${ext}`);
  const allCodeFiles = [];
  
  for (const pattern of codePatterns) {
    const matches = await glob(pattern);
    allCodeFiles.push(...matches);
  }
  
  console.log(`\n🔍 Procurando arquivos de código para atualizar referências...`);
  console.log(`\n📝 Encontrados ${allCodeFiles.length} arquivos de código para verificar.`);
  
  const updatedFiles = [];
  
  for (const codeFile of allCodeFiles) {
    let content = await fs.readFile(codeFile, 'utf-8');
    let fileWasUpdated = false;
    
    for (const { original, webp } of convertedImages.filter(Boolean)) {
      const originalExt = path.extname(original);
      const baseName = path.basename(original, originalExt);
      
      // Padrões de busca para importações e URLs
      const importRegex = new RegExp(`(['"])([^'"]*?\\/${baseName})${originalExt.replace('.', '\\.')}(['"])`, 'g');
      
      // Faz a substituição no conteúdo
      const newContent = content.replace(importRegex, `$1$2.webp$3`);
      
      if (newContent !== content) {
        content = newContent;
        fileWasUpdated = true;
      }
    }
    
    if (fileWasUpdated) {
      await fs.writeFile(codeFile, content, 'utf-8');
      console.log(`\n📝 Atualizado: ${codeFile}`);
      updatedFiles.push(codeFile);
    }
  }
  
  return updatedFiles;
}

/**
 * Remove os arquivos JPG/JPEG originais após a conversão
 * @param {Array<{original: string, webp: string}>} convertedImages - Lista de imagens convertidas
 * @returns {Promise<string[]>} - Lista de arquivos removidos
 */
async function removeOriginalFiles(convertedImages) {
  console.log(`\n🗑️ Removendo arquivos JPG/JPEG originais...`);
  
  const removedFiles = [];
  
  for (const image of convertedImages.filter(Boolean)) {
    try {
      await fs.unlink(image.original);
      console.log(`🗑️ Removido: ${path.basename(image.original)}`);
      removedFiles.push(image.original);
    } catch (error) {
      console.log(`⚠️ Não foi possível remover: ${path.basename(image.original)}`);
    }
  }
  
  return removedFiles;
}

/**
 * Função principal que coordena o processo de conversão
 */
async function main() {
  try {
    console.log(`🔍 Procurando imagens JPG/JPEG...`);
    
    // Encontra todas as imagens JPG/JPEG
    const imagePaths = await findJpegImages();
    
    if (!imagePaths.length) {
      console.log(`\n✅ Não foram encontradas imagens JPG/JPEG para converter.`);
      return;
    }
    
    console.log(`\n📷 Encontradas ${imagePaths.length} imagens para converter...`);
    
    // Converte todas as imagens para WebP
    const convertPromises = imagePaths.map(img => convertImage(img));
    const convertedImages = await Promise.all(convertPromises);
    const successfulConversions = convertedImages.filter(Boolean);
    
    console.log(`\n📊 Conversão completa: ${successfulConversions.length}/${imagePaths.length} imagens convertidas com sucesso.`);
    
    // Atualiza referências em arquivos de código
    const updatedFiles = await updateCodeReferences(successfulConversions);
    
    console.log(`\n📋 Total de arquivos de código atualizados: ${updatedFiles.length}`);
    
    // Remove os arquivos originais
    const removedFiles = await removeOriginalFiles(successfulConversions);
    
    console.log(`\n📋 Total de arquivos JPG/JPEG removidos: ${removedFiles.length}`);
    
    console.log(`\n✅ Processo concluído! Todas as imagens foram convertidas para WebP.`);
    console.log(`👉 Execute este script novamente sempre que adicionar novas imagens ao projeto.`);
    
  } catch (error) {
    console.error(`\n❌ Erro ao executar o script: ${error.message}`);
    process.exit(1);
  }
}

// Executa a função principal
main(); 