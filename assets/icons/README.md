# Ícones PWA

Este diretório deve conter os ícones do PWA em diferentes tamanhos.

## Ícones necessários:
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)

## Como gerar os ícones:

### Opção 1: Online (mais fácil)
Acesse: https://www.pwabuilder.com/imageGenerator
1. Faça upload de um ícone 512x512
2. Baixe todos os tamanhos gerados
3. Coloque neste diretório

### Opção 2: Com ImageMagick (Linux/Mac)
```bash
# Instalar ImageMagick
sudo apt install imagemagick  # Ubuntu/Debian

# Gerar todos os tamanhos a partir de um ícone 512x512
for size in 72 96 128 144 152 192 384 512; do
  convert icon-512.png -resize ${size}x${size} icon-${size}.png
done
```

### Opção 3: Com Node.js
```bash
npm install -g pwa-asset-generator
pwa-asset-generator icon.svg ./assets/icons
```

## Ícone atual
O arquivo `icon.svg` já está criado e pode ser usado temporariamente.
Para melhor compatibilidade, gere os PNGs usando uma das opções acima.
