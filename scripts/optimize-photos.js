/**
 * Script para otimizar as fotos da galeria
 * - Converte para WebP
 * - Cria thumbnails (600px de largura)
 * - Cria versões full-size (1200px de largura)
 * 
 * Para executar: 
 * node scripts/optimize-photos.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Verificar se sharp está disponível
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (error) {
  console.log('Sharp não está disponível. Pulando otimização de imagens.');
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const PHOTOS_DIR = path.join(__dirname, '../public/fotos');
const OUTPUT_DIR = path.join(__dirname, '../public/fotos-optimized');
const THUMBNAILS_DIR = path.join(OUTPUT_DIR, 'thumbnails');

const THUMBNAIL_WIDTH = 600;
const FULLSIZE_WIDTH = 1200;
const WEBP_QUALITY = 80;

// Função principal
async function optimizePhotos() {
  console.log('Iniciando otimização das fotos...');
  
  try {
    // Verifica se a pasta de fotos existe
    if (!fs.existsSync(PHOTOS_DIR)) {
      console.error('Pasta de fotos não encontrada:', PHOTOS_DIR);
      return;
    }
    
    // Cria as pastas de saída se não existirem
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(THUMBNAILS_DIR)) {
      fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    }
    
    // Lê os arquivos na pasta
    const files = fs.readdirSync(PHOTOS_DIR);
    
    // Filtra apenas os arquivos de imagem
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    console.log(`Encontrados ${imageFiles.length} arquivos de imagem para otimizar.`);
    
    let processedCount = 0;
    
    // Processa cada imagem
    for (const file of imageFiles) {
      const inputPath = path.join(PHOTOS_DIR, file);
      const baseName = path.parse(file).name;
      
      // Caminhos de saída
      const fullsizeOutput = path.join(OUTPUT_DIR, `${baseName}.webp`);
      const thumbnailOutput = path.join(THUMBNAILS_DIR, `${baseName}.webp`);
      
      try {
        // Cria a versão full-size
        await sharp(inputPath)
          .resize(FULLSIZE_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: WEBP_QUALITY })
          .toFile(fullsizeOutput);
        
        // Cria o thumbnail
        await sharp(inputPath)
          .resize(THUMBNAIL_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: WEBP_QUALITY })
          .toFile(thumbnailOutput);
        
        processedCount++;
        console.log(`Processado (${processedCount}/${imageFiles.length}): ${file}`);
        
      } catch (error) {
        console.error(`Erro ao processar ${file}:`, error.message);
      }
    }
    
    console.log(`\nOtimização concluída! ${processedCount} imagens foram processadas.`);
    console.log(`Imagens full-size salvas em: ${OUTPUT_DIR}`);
    console.log(`Thumbnails salvos em: ${THUMBNAILS_DIR}`);
    
  } catch (error) {
    console.error('Erro durante a otimização:', error);
  }
}

// Executa a função principal
optimizePhotos(); 