/**
 * Motor de Processamento de Imagens e Aplicação de Marca D'Água (Canvas API)
 * Otimizado para alto desempenho e preservação de rotação EXIF de câmeras.
 */

export class WatermarkEngine {
  constructor() {
    this.watermarkImage = null;
    this.watermarkAspect = 1;
    this.watermarkWidth = 0;
    this.watermarkHeight = 0;
  }

  /**
   * Carrega a imagem da marca d'água a partir de um File ou URL
   * @param {File|string} source 
   * @returns {Promise<void>}
   */
  async loadWatermark(source) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        this.watermarkImage = img;
        this.watermarkWidth = img.naturalWidth || img.width;
        this.watermarkHeight = img.naturalHeight || img.height;
        this.watermarkAspect = this.watermarkWidth / this.watermarkHeight;
        resolve();
      };

      img.onerror = (err) => reject(new Error('Falha ao carregar a imagem da marca d\'água.'));

      if (typeof source === 'string') {
        img.src = source;
      } else {
        img.src = URL.createObjectURL(source);
      }
    });
  }

  /**
   * Calcula as coordenadas e dimensões exatas da marca d'água
   * @param {number} photoWidth 
   * @param {number} photoHeight 
   * @param {Object} config 
   * @returns {{x: number, y: number, width: number, height: number}}
   */
  calculatePlacement(photoWidth, photoHeight, config) {
    const { position = 'bottom-right', sizePercent = 15, marginPercent = 3, scaleMode = 'min' } = config;

    // Dimensão de referência para manter proporção justa entre fotos horizontais e verticais
    const referenceDim = scaleMode === 'width' ? photoWidth : Math.min(photoWidth, photoHeight);

    // Largura da marca d'água baseada na porcentagem
    const wmWidth = Math.round(referenceDim * (sizePercent / 100));
    const wmHeight = Math.round(wmWidth / this.watermarkAspect);

    // Margem em pixels
    const margin = Math.round(referenceDim * (marginPercent / 100));

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top-left':
        x = margin;
        y = margin;
        break;
      case 'top-center':
        x = Math.round((photoWidth - wmWidth) / 2);
        y = margin;
        break;
      case 'top-right':
        x = photoWidth - wmWidth - margin;
        y = margin;
        break;
      case 'middle-left':
        x = margin;
        y = Math.round((photoHeight - wmHeight) / 2);
        break;
      case 'center':
        x = Math.round((photoWidth - wmWidth) / 2);
        y = Math.round((photoHeight - wmHeight) / 2);
        break;
      case 'middle-right':
        x = photoWidth - wmWidth - margin;
        y = Math.round((photoHeight - wmHeight) / 2);
        break;
      case 'bottom-left':
        x = margin;
        y = photoHeight - wmHeight - margin;
        break;
      case 'bottom-center':
        x = Math.round((photoWidth - wmWidth) / 2);
        y = photoHeight - wmHeight - margin;
        break;
      case 'bottom-right':
      default:
        x = photoWidth - wmWidth - margin;
        y = photoHeight - wmHeight - margin;
        break;
    }

    return { x, y, width: wmWidth, height: wmHeight };
  }

  /**
   * Decodifica a foto do usuário com orientação EXIF preservada
   * @param {File|Blob} file 
   * @returns {Promise<ImageBitmap|HTMLImageElement>}
   */
  async decodeImage(file) {
    if ('createImageBitmap' in window) {
      try {
        // Tenta decodificar com orientação EXIF correta da câmera
        return await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch (e) {
        // Fallback para decodificação padrão caso o formato precise
        return await createImageBitmap(file);
      }
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Erro ao decodificar imagem'));
      };
      img.src = url;
    });
  }

  /**
   * Aplica a marca d'água na imagem e retorna o Blob resultante
   * @param {File|Blob} photoFile 
   * @param {Object} config 
   * @returns {Promise<Blob>}
   */
  async processImage(photoFile, config) {
    if (!this.watermarkImage) {
      throw new Error('Nenhuma marca d\'água foi carregada.');
    }

    const photoBitmap = await this.decodeImage(photoFile);
    const photoWidth = photoBitmap.width;
    const photoHeight = photoBitmap.height;

    // Criar Canvas temporário para a renderização
    const canvas = document.createElement('canvas');
    canvas.width = photoWidth;
    canvas.height = photoHeight;
    const ctx = canvas.getContext('2d');

    // Configuração de interpolação em alta qualidade
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Desenhar a foto original
    ctx.drawImage(photoBitmap, 0, 0, photoWidth, photoHeight);

    // Liberar o bitmap da memória imediatamente
    if (typeof photoBitmap.close === 'function') {
      photoBitmap.close();
    }

    // 2. Calcular posicionamento e desenhar marca d'água
    const placement = this.calculatePlacement(photoWidth, photoHeight, config);

    ctx.save();
    ctx.globalAlpha = (config.opacity ?? 90) / 100;
    ctx.drawImage(this.watermarkImage, placement.x, placement.y, placement.width, placement.height);
    ctx.restore();

    // 3. Exportar para Blob JPEG
    const quality = (config.quality ?? 92) / 100;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          // Limpar dimensões do canvas para forçar liberação de memória
          canvas.width = 1;
          canvas.height = 1;

          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao exportar imagem processada.'));
          }
        },
        'image/jpeg',
        quality
      );
    });
  }

  /**
   * Renderiza a prévia em tempo real em um Canvas fornecido
   * @param {HTMLCanvasElement} previewCanvas 
   * @param {ImageBitmap|HTMLImageElement} sampleImage 
   * @param {Object} config 
   */
  renderPreview(previewCanvas, sampleImage, config) {
    if (!sampleImage) return;

    const ctx = previewCanvas.getContext('2d');
    const photoWidth = sampleImage.width;
    const photoHeight = sampleImage.height;

    // Ajustar tamanho do canvas de preview para a resolução da imagem
    previewCanvas.width = photoWidth;
    previewCanvas.height = photoHeight;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Desenhar a foto base
    ctx.drawImage(sampleImage, 0, 0, photoWidth, photoHeight);

    // 2. Desenhar a marca d'água caso exista
    if (this.watermarkImage) {
      const placement = this.calculatePlacement(photoWidth, photoHeight, config);

      ctx.save();
      ctx.globalAlpha = (config.opacity ?? 90) / 100;
      ctx.drawImage(this.watermarkImage, placement.x, placement.y, placement.width, placement.height);
      ctx.restore();

      // Desenhar contorno sutil de seleção em volta da logo no preview para facilitar visualização
      if (config.showPlacementBox) {
        ctx.save();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = Math.max(2, Math.round(photoWidth * 0.0015));
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(placement.x, placement.y, placement.width, placement.height);
        ctx.restore();
      }
    }
  }
}
