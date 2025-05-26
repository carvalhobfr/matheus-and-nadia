import React from 'react';

const TestGallery = () => {
  const testImages = [
    '/fotos-optimized/thumbnails/fotos-casamento-1.webp',
    '/fotos-optimized/thumbnails/fotos-casamento-2.webp',
    '/fotos-optimized/thumbnails/fotos-casamento-3.webp'
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teste de Imagens</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {testImages.map((src, index) => (
          <div key={index} style={{ border: '2px solid red', padding: '10px' }}>
            <p>Imagem {index + 1}</p>
            <img
              src={src}
              alt={`Teste ${index + 1}`}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                backgroundColor: '#f0f0f0',
                border: '1px solid blue'
              }}
              onLoad={() => console.log(`✅ Teste ${index + 1} carregada: ${src}`)}
              onError={(e) => {
                console.error(`❌ Teste ${index + 1} erro: ${src}`);
                e.target.style.backgroundColor = 'red';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestGallery; 