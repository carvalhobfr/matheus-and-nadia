import React from 'react';
import { getThumbnailPath, getFullImagePath } from '../../utils/imageUtils';

const DebugGallery = () => {
  const testImages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Debug Gallery - Teste de Carregamento de Imagens</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {testImages.map(index => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h4>Imagem {index}</h4>
            <img 
              src={getThumbnailPath(index)}
              alt={`Teste ${index}`}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              onLoad={() => console.log(`✅ Debug: Imagem ${index} carregada`)}
              onError={() => console.error(`❌ Debug: Erro na imagem ${index}`)}
            />
            <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
              {getThumbnailPath(index)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugGallery; 