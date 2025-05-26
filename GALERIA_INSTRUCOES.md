# 📸 Instruções para Adicionar Fotos à Galeria

## 🚀 Como Adicionar Suas Fotos de Casamento

### 1. Preparação das Fotos

1. **Organize suas fotos** em uma pasta no seu computador
2. **Renomeie as fotos** seguindo um padrão numérico (ex: `001-foto.jpg`, `002-foto.jpg`, etc.)
3. **Formatos suportados**: JPG, JPEG, PNG, WebP, GIF

### 2. Colocando as Fotos no Projeto

1. **Crie a pasta de fotos originais**:
   ```bash
   mkdir -p public/fotos
   ```

2. **Copie suas fotos** para a pasta `public/fotos/`

3. **Execute o processo de otimização**:
   ```bash
   npm run rename-photos    # Renomeia para padrão fotos-casamento-X
   npm run optimize-photos  # Converte para WebP e cria thumbnails
   ```

### 3. Atualizando o Número Total de Fotos

Após adicionar suas fotos, atualize o arquivo `src/utils/imageUtils.js`:

```javascript
export const getTotalImageCount = () => {
  return 150; // Substitua pelo número real de fotos
};
```

### 4. Scripts Disponíveis

- **`npm run rename-photos`**: Renomeia fotos para o padrão `fotos-casamento-X.ext`
- **`npm run optimize-photos`**: Converte para WebP e cria thumbnails (600px) e full-size (1200px)
- **`npm run index-photos`**: Indexa as fotos e atualiza contadores
- **`npm run build:all`**: Executa todo o processo (index → rename → build → preview)

### 5. Estrutura de Pastas

```
public/
├── fotos/                          # Fotos originais (ignoradas pelo Git)
│   ├── fotos-casamento-1.jpg
│   ├── fotos-casamento-2.jpg
│   └── ...
└── fotos-optimized/               # Fotos otimizadas (ignoradas pelo Git)
    ├── fotos-casamento-1.webp    # Versões full-size (1200px)
    ├── fotos-casamento-2.webp
    └── thumbnails/                # Thumbnails (600px)
        ├── fotos-casamento-1.webp
        ├── fotos-casamento-2.webp
        └── ...
```

### 6. Performance e Otimizações

#### Homepage (Componente HomepageGallery)
- Carrega apenas **9 imagens** inicialmente
- Lazy loading com Intersection Observer
- Animações escalonadas para melhor UX
- Link direto para galeria completa

#### Página da Galeria (Componente GalleryWithLazyLoad)
- Carregamento em lotes de **15 imagens**
- Scroll infinito automático
- Modal para visualização ampliada
- Navegação por teclado (setas, ESC)

### 7. Configurações de Performance

#### Tamanhos de Imagem
- **Thumbnails**: 600px de largura (para grid da galeria)
- **Full-size**: 1200px de largura (para modal)
- **Qualidade WebP**: 80%

#### Lazy Loading
- **Homepage**: Carrega quando está 100px antes de aparecer
- **Galeria**: Carrega quando está 50px antes de aparecer
- **Batch loading**: Carrega próximo lote quando chega ao final

### 8. Traduções

A galeria suporta 3 idiomas:
- **Português** (padrão)
- **Inglês**
- **Espanhol**

As traduções estão em `src/i18n.js` na seção `gallery`.

### 9. Git e Deploy

As pastas de fotos estão no `.gitignore`:
```
public/fotos/
public/fotos-optimized/
```

Isso significa que:
- ✅ As fotos não vão para o repositório Git
- ✅ Mantém o repositório leve
- ⚠️ Você precisa adicionar as fotos manualmente em cada ambiente

### 10. Troubleshooting

#### Fotos não aparecem
1. Verifique se estão na pasta `public/fotos-optimized/`
2. Confirme que o número total está correto em `imageUtils.js`
3. Verifique o console do navegador para erros

#### Performance lenta
1. Reduza o `batchSize` nos componentes
2. Otimize mais as imagens (menor qualidade WebP)
3. Considere usar um CDN para as imagens

#### Erro de build
1. Certifique-se que o Sharp está instalado: `npm install sharp`
2. Verifique se as pastas existem antes de executar os scripts

### 11. Exemplo Completo

```bash
# 1. Adicione suas fotos
cp ~/fotos-casamento/* public/fotos/

# 2. Execute o processo completo
npm run build:all

# 3. Atualize o contador (se necessário)
# Edite src/utils/imageUtils.js

# 4. Teste localmente
npm run dev
```

### 🎉 Pronto!

Sua galeria está configurada com:
- ⚡ Performance otimizada
- 📱 Design responsivo
- 🌍 Suporte a 3 idiomas
- 🖼️ Lazy loading inteligente
- 🎨 Animações suaves
- 📸 Modal de visualização
- ⌨️ Navegação por teclado 