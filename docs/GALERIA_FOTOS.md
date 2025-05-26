# Galeria de Fotos com Lazy Loading

Este documento explica como funciona a nova galeria de fotos com lazy loading implementada no site do casamento.

## Visão Geral

A galeria de fotos foi implementada com os seguintes recursos:

1. **Lazy Loading**: As imagens são carregadas conforme o usuário rola a página, melhorando a performance
2. **Paginação Automática**: Novas imagens são carregadas automaticamente ao chegar ao final da galeria
3. **Controle de Quantidade**: Possibilidade de escolher quantas imagens são carregadas por vez
4. **Visualizador de Imagens**: Modal para visualizar as imagens em tamanho maior com navegação por teclado
5. **Otimização de Imagens**: Conversão automática para WebP e redimensionamento para melhorar performance
6. **Padronização de Nomes**: Renomeação automática para um formato consistente e simples

## Estrutura

A implementação da galeria consiste em:

- **GalleryWithLazyLoad**: Componente principal que implementa o lazy loading das imagens
- **GalleryPage**: Página dedicada para exibir a galeria completa
- **Utilitários de Imagem**: Funções auxiliares para gerenciar o carregamento de imagens
- **Script de Indexação**: Script para indexar as fotos e facilitar o carregamento
- **Script de Renomeação**: Script para padronizar os nomes das fotos
- **Script de Otimização**: Script para converter e otimizar as imagens

## Como Usar

### Exibir a Galeria na Página Inicial

A galeria já está configurada para exibir as 21 primeiras imagens na página inicial (7 linhas de 3 imagens cada):

```jsx
<GalleryWithLazyLoad showLimited={true} itemLimit={21} />
```

### Exibir a Galeria Completa

A galeria completa está disponível na rota `/gallery`, que utiliza o componente `GalleryPage`:

```jsx
<Route path="/gallery" element={<GalleryPage />} />
```

### Adicionar Novas Fotos

Para adicionar novas fotos à galeria:

1. Copie as fotos para a pasta `dist/assets/fotos`
2. Renomeie as fotos (ou deixe no formato original com números no início, ex: `556-C0091.jpg`) 
3. Execute o script de renomeação para padronizar os nomes:

```bash
npm run rename-photos
```

4. Execute o script de otimização para converter as imagens:

```bash
npm run optimize-photos
```

5. Recompile a aplicação:

```bash
npm run build
```

Para fazer tudo em um só comando:

```bash
npm run build:all
```

## Padronização de Nomes

O processo de renomeação padroniza todas as fotos para o formato:

```
fotos-casamento-[NUMERO].webp
```

Onde `[NUMERO]` é um número sequencial que começa em 1. A ordem original das fotos é preservada baseada nos números no início dos nomes originais.

Por exemplo:
- `555-C0090.jpg` → `fotos-casamento-1.webp`
- `554-C0089.jpg` → `fotos-casamento-2.webp`
- `553-C0084.jpg` → `fotos-casamento-3.webp`

Esta padronização facilita:
- Carregamento mais eficiente das imagens
- Previsibilidade de nomes para o sistema
- Simplificação do código de carregamento

## Otimização de Imagens

O processo de otimização realiza:

1. **Conversão para WebP**: Todas as imagens são convertidas para o formato WebP, que oferece melhor compressão
2. **Redimensionamento**: 
   - Thumbnails: 600px de largura para exibição na galeria
   - Imagens completas: 1200px de largura para visualização no modal
3. **Compressão**: Qualidade de 80% para reduzir o tamanho dos arquivos mantendo boa qualidade visual

As imagens otimizadas são salvas em:
- Thumbnails: `dist/assets/fotos-optimized/thumbnails/`
- Imagens completas: `dist/assets/fotos-optimized/`

## Customização

### Alterar a Quantidade de Imagens

Para alterar a quantidade de imagens exibidas na página inicial:

```jsx
<GalleryWithLazyLoad showLimited={true} itemLimit={30} />
```

### Alterar o Tamanho do Lote de Carregamento

Na página completa da galeria, o usuário pode escolher o tamanho do lote de carregamento (15, 30 ou 50 imagens). Para alterar os valores padrão, edite o arquivo `src/components/GalleryPage/index.jsx`.

### Ajustar Configurações de Otimização

Para ajustar as configurações de otimização de imagens, edite o arquivo `scripts/optimize-photos.js`:

```javascript
// Configurações de otimização
const THUMBNAIL_SIZE = 600; // Largura máxima para thumbnails
const FULLSIZE_SIZE = 1200; // Largura máxima para visualização completa
const WEBP_QUALITY = 80; // Qualidade WebP (0-100)
```

## Implementação Técnica

### Como Funciona o Lazy Loading

O lazy loading é implementado usando o Intersection Observer API, que detecta quando um elemento está prestes a entrar na viewport (área visível) e então carrega a imagem. Isso evita o carregamento desnecessário de imagens que não estão visíveis.

### Como as Imagens São Encontradas

O sistema usa duas abordagens:
1. Para thumbnails: Imagens otimizadas armazenadas em `/assets/fotos-optimized/thumbnails/fotos-casamento-[NUMERO].webp`
2. Para visualização ampliada: Imagens otimizadas armazenadas em `/assets/fotos-optimized/fotos-casamento-[NUMERO].webp`

### Limitações e Melhorias Futuras

- Uma melhoria futura seria implementar uma API que lista automaticamente os arquivos disponíveis
- Outra melhoria seria adicionar tags e filtros para as fotos

## Solução de Problemas

Se as imagens não estão aparecendo corretamente:

1. Verifique se as fotos estão na pasta correta (`dist/assets/fotos`)
2. Execute o script de renomeação para padronizar os nomes
3. Execute o script de otimização para converter as imagens
4. Verifique o console do navegador para erros de carregamento 