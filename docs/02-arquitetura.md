# Arquitetura e Engenharia do Watermark Studio

## 1. Pipeline de Processamento de Imagens
Para suportar mais de 2.000 fotos sem estourar o limite de memória do navegador (que gira em torno de 2GB a 4GB por aba), o sistema segue um fluxo estritamente sequencial:

```
[Foto no Disco] 
      ↓
[createImageBitmap com EXIF] (decodifica apenas 1 imagem por vez)
      ↓
[Composição no Canvas] (desenha foto + desenha logo no posicionamento calculado)
      ↓
[Exportação para Blob JPEG] (qualidade configurável 85-98%)
      ↓
[Gravação Direta no Disco via Stream Writable]
      ↓
[bitmap.close() & canvas reset] (Memória RAM liberada antes da próxima foto)
```

## 2. Preservação de Rotação (EXIF)
Câmeras DSLR/Mirrorless e smartphones gravam a orientação da foto nos metadados EXIF (ex: Orientação 6 = rotação 90° horário). O método nativo `createImageBitmap(blob, { imageOrientation: 'from-image' })` normaliza a matriz de pixels automaticamente, garantindo que logos em fotos verticais fiquem perfeitamente alinhadas.

## 3. Posicionamento Dinâmico (9 Posições)
O cálculo de escala utiliza `Math.min(largura, altura)` como base de referência por padrão. Isso garante que a logo mantenha a exata mesma dimensão visual física tanto em fotos na horizontal (paisagem) quanto na vertical (retrato).
