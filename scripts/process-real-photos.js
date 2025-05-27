#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Verificar se sharp está disponível
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (error) {
  console.log('Sharp não está disponível. Pulando processamento de imagens.');
  process.exit(0);
}

// Para obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const CONFIG = {
  rawPhotosDir: path.join(__dirname, '../public/rawfotos'),
  optimizedDir: path.join(__dirname, '../public/fotos-optimized'),
  thumbnailsDir: path.join(__dirname, '../public/fotos-optimized/thumbnails'),
  fullImageWidth: 1200,
  thumbnailWidth: 600,
  quality: 85,
  format: 'webp'
};

// Função para calcular hash de um arquivo
function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

// Função para obter informações de uma imagem
async function getImageInfo(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    const hash = calculateFileHash(filePath);
    const stats = fs.statSync(filePath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size,
      hash: hash
    };
  } catch (error) {
    console.error(`Erro ao obter informações da imagem ${filePath}:`, error.message);
    return null;
  }
}

// Função para otimizar uma imagem
async function optimizeImage(inputPath, outputPath, width, quality = CONFIG.quality) {
  try {
    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Otimizada: ${path.basename(outputPath)} (${width}px)`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${inputPath}:`, error.message);
    return false;
  }
}

// Função para verificar se duas imagens são diferentes
async function areImagesDifferent(imagePath1, imagePath2) {
  if (!fs.existsSync(imagePath1) || !fs.existsSync(imagePath2)) {
    return true; // Se uma não existe, são diferentes
  }
  
  const info1 = await getImageInfo(imagePath1);
  const info2 = await getImageInfo(imagePath2);
  
  if (!info1 || !info2) return true;
  
  // Compara hash para verificar se são diferentes
  return info1.hash !== info2.hash;
}

// Função para processar uma foto
async function processPhoto(rawPhotoPath, index) {
  const fileName = `fotos-casamento-${index}.webp`;
  const fullImagePath = path.join(CONFIG.optimizedDir, fileName);
  const thumbnailPath = path.join(CONFIG.thumbnailsDir, fileName);
  
  console.log(`\n📸 Processando: ${path.basename(rawPhotoPath)} -> ${fileName}`);
  
  // Verifica informações da imagem original
  const originalInfo = await getImageInfo(rawPhotoPath);
  if (!originalInfo) {
    console.log(`❌ Não foi possível processar ${rawPhotoPath}`);
    return false;
  }
  
  console.log(`   Original: ${originalInfo.width}x${originalInfo.height} (${(originalInfo.size / 1024 / 1024).toFixed(2)}MB)`);
  
  // Cria diretórios se não existirem
  if (!fs.existsSync(CONFIG.optimizedDir)) {
    fs.mkdirSync(CONFIG.optimizedDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.thumbnailsDir)) {
    fs.mkdirSync(CONFIG.thumbnailsDir, { recursive: true });
  }
  
  // Verifica se a imagem atual é diferente
  const tempFullPath = fullImagePath + '.temp';
  const tempThumbnailPath = thumbnailPath + '.temp';
  
  // Otimiza para arquivos temporários primeiro
  const fullSuccess = await optimizeImage(rawPhotoPath, tempFullPath, CONFIG.fullImageWidth);
  const thumbnailSuccess = await optimizeImage(rawPhotoPath, tempThumbnailPath, CONFIG.thumbnailWidth);
  
  if (!fullSuccess || !thumbnailSuccess) {
    // Remove arquivos temporários em caso de erro
    if (fs.existsSync(tempFullPath)) fs.unlinkSync(tempFullPath);
    if (fs.existsSync(tempThumbnailPath)) fs.unlinkSync(tempThumbnailPath);
    return false;
  }
  
  // Verifica se as imagens são diferentes das atuais
  const fullImageDifferent = await areImagesDifferent(tempFullPath, fullImagePath);
  const thumbnailDifferent = await areImagesDifferent(tempThumbnailPath, thumbnailPath);
  
  if (fullImageDifferent || thumbnailDifferent) {
    // Move os arquivos temporários para os finais
    fs.renameSync(tempFullPath, fullImagePath);
    fs.renameSync(tempThumbnailPath, thumbnailPath);
    
    const newFullInfo = await getImageInfo(fullImagePath);
    const newThumbnailInfo = await getImageInfo(thumbnailPath);
    
    console.log(`   ✅ Imagem completa: ${newFullInfo.width}x${newFullInfo.height} (${(newFullInfo.size / 1024).toFixed(0)}KB)`);
    console.log(`   ✅ Thumbnail: ${newThumbnailInfo.width}x${newThumbnailInfo.height} (${(newThumbnailInfo.size / 1024).toFixed(0)}KB)`);
    console.log(`   🔄 Imagem ${index} atualizada com sucesso!`);
  } else {
    // Remove arquivos temporários se são iguais
    fs.unlinkSync(tempFullPath);
    fs.unlinkSync(tempThumbnailPath);
    console.log(`   ⏭️  Imagem ${index} já está atualizada (mesma imagem)`);
  }
  
  return true;
}

// Função para atualizar o contador no imageUtils.js
function updateImageCount(totalImages) {
  const imageUtilsPath = path.join(__dirname, '../src/utils/imageUtils.js');
  
  if (fs.existsSync(imageUtilsPath)) {
    let content = fs.readFileSync(imageUtilsPath, 'utf8');
    
    // Atualiza o número total de imagens
    content = content.replace(
      /return \d+; \/\/ Atualizado automaticamente pelo script de renomeação/,
      `return ${totalImages}; // Atualizado automaticamente pelo script de renomeação`
    );
    
    fs.writeFileSync(imageUtilsPath, content);
    console.log(`📝 Atualizado imageUtils.js: ${totalImages} imagens`);
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando processamento das fotos reais...\n');
  
  // Verifica se a pasta rawfotos existe
  if (!fs.existsSync(CONFIG.rawPhotosDir)) {
    console.error('❌ Pasta rawfotos não encontrada!');
    process.exit(1);
  }
  
  // Lista todas as fotos na pasta rawfotos
  const rawPhotos = fs.readdirSync(CONFIG.rawPhotosDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort(); // Ordena para processamento consistente
  
  if (rawPhotos.length === 0) {
    console.log('📁 Nenhuma foto encontrada na pasta rawfotos');
    return;
  }
  
  console.log(`📊 Encontradas ${rawPhotos.length} fotos para processar\n`);
  
  let processedCount = 0;
  let errorCount = 0;
  
  // Processa cada foto
  for (let i = 0; i < rawPhotos.length; i++) {
    const rawPhotoPath = path.join(CONFIG.rawPhotosDir, rawPhotos[i]);
    const imageIndex = i + 1;
    
    try {
      const success = await processPhoto(rawPhotoPath, imageIndex);
      
      if (success) {
        processedCount++;
        
        // Remove a foto original após processamento bem-sucedido
        fs.unlinkSync(rawPhotoPath);
        console.log(`   🗑️  Removida foto original: ${rawPhotos[i]}`);
      } else {
        errorCount++;
        console.log(`   ❌ Erro ao processar: ${rawPhotos[i]}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Erro inesperado ao processar ${rawPhotos[i]}:`, error.message);
    }
  }
  
  // Atualiza o contador de imagens
  updateImageCount(processedCount);
  
  // Relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(50));
  console.log(`✅ Fotos processadas com sucesso: ${processedCount}`);
  console.log(`❌ Fotos com erro: ${errorCount}`);
  console.log(`📁 Total de fotos na galeria: ${processedCount}`);
  
  if (processedCount > 0) {
    console.log('\n🎉 Processamento concluído! As fotos reais foram otimizadas e estão prontas para uso.');
    console.log('💡 Execute "git add . && git commit -m \'feat: Add real wedding photos\' && git push" para enviar ao GitHub');
  }
  
  // Remove pasta rawfotos se estiver vazia
  const remainingFiles = fs.readdirSync(CONFIG.rawPhotosDir);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(CONFIG.rawPhotosDir);
    console.log('🗑️  Pasta rawfotos removida (estava vazia)');
  }
}

// Executa o script se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { main, processPhoto, optimizeImage }; 