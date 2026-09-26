import { StorageManager } from './storage.js';
import { WatermarkEngine } from './watermark.js';

// Estado global da aplicação
const state = {
  engine: new WatermarkEngine(),
  inputFiles: [],
  inputDirHandle: null,
  outputDirHandle: null,
  currentSampleIndex: 0,
  currentSampleBitmap: null,
  isProcessing: false,
  isPaused: false,
  isCancelled: false,
  config: {
    position: 'bottom-right',
    sizePercent: 14,
    marginPercent: 3,
    opacity: 95,
    quality: 92,
    scaleMode: 'min',
    showPlacementBox: false,
    fileSuffix: ''
  }
};

// Elementos da Interface (DOM)
const elements = {
  // Entradas de Pastas e Arquivos
  btnSelectInputDir: document.getElementById('btn-select-input-dir'),
  btnSelectOutputDir: document.getElementById('btn-select-output-dir'),
  inputPhotosFiles: document.getElementById('input-photos-files'),
  inputWatermarkFile: document.getElementById('input-watermark-file'),
  watermarkDropZone: document.getElementById('watermark-drop-zone'),
  watermarkPreviewThumb: document.getElementById('watermark-preview-thumb'),
  watermarkNameDisplay: document.getElementById('watermark-name-display'),
  inputDirStatus: document.getElementById('input-dir-status'),
  outputDirStatus: document.getElementById('output-dir-status'),

  // Controles de Configuração
  positionButtons: document.querySelectorAll('.position-btn'),
  sliderSize: document.getElementById('slider-size'),
  valSize: document.getElementById('val-size'),
  sliderMargin: document.getElementById('slider-margin'),
  valMargin: document.getElementById('val-margin'),
  sliderOpacity: document.getElementById('slider-opacity'),
  valOpacity: document.getElementById('val-opacity'),
  selectQuality: document.getElementById('select-quality'),
  selectScaleMode: document.getElementById('select-scale-mode'),
  inputFileSuffix: document.getElementById('input-file-suffix'),
  checkPlacementBox: document.getElementById('check-placement-box'),

  // Área de Prévia
  previewCanvas: document.getElementById('preview-canvas'),
  previewContainer: document.getElementById('preview-container'),
  previewInfoBadge: document.getElementById('preview-info-badge'),
  previewOrientationBadge: document.getElementById('preview-orientation-badge'),
  btnPrevSample: document.getElementById('btn-prev-sample'),
  btnNextSample: document.getElementById('btn-next-sample'),
  sampleCounter: document.getElementById('sample-counter'),
  btnZoomFit: document.getElementById('btn-zoom-fit'),

  // Painel de Processamento e Ação
  btnStartProcess: document.getElementById('btn-start-process'),
  processingCard: document.getElementById('processing-card'),
  progressBar: document.getElementById('progress-bar'),
  progressPercent: document.getElementById('progress-percent'),
  progressCounter: document.getElementById('progress-counter'),
  progressEta: document.getElementById('progress-eta'),
  progressCurrentFile: document.getElementById('progress-current-file'),
  btnPauseProcess: document.getElementById('btn-pause-process'),
  btnCancelProcess: document.getElementById('btn-cancel-process'),

  // Modal de Conclusão
  modalSuccess: document.getElementById('modal-success'),
  modalSuccessClose: document.getElementById('modal-success-close'),
  modalTotalProcessed: document.getElementById('modal-total-processed'),
  modalTotalTime: document.getElementById('modal-total-time'),
  modalAvgSpeed: document.getElementById('modal-avg-speed')
};

// Inicialização da Aplicação
async function initApp() {
  setupEventListeners();
  checkBrowserCompatibility();

  // Carregar logo padrão de exemplo
  try {
    await state.engine.loadWatermark('./assets/sample-logo.svg');
    elements.watermarkNameDisplay.textContent = 'sample-logo.svg (Padrão)';
    elements.watermarkPreviewThumb.src = './assets/sample-logo.svg';
    elements.watermarkPreviewThumb.style.display = 'block';
  } catch (err) {
    console.warn('Não foi possível carregar a logo padrão:', err);
  }

  // Criar amostra visual inicial no canvas enquanto nenhuma foto foi selecionada
  createPlaceholderSample();
}

/**
 * Cria uma foto de exemplo estilizada no canvas para preview inicial imediato
 */
function createPlaceholderSample() {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Gradiente elegante de fundo simulando foto de evento
  const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Grid sutil
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }
  for (let y = 0; y < 1080; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y);
    ctx.stroke();
  }

  // Texto explicativo no centro
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '600 36px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Amostra de Demonstração (1920 × 1080 px)', 1920 / 2, 1080 / 2 - 20);
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Selecione a pasta com suas fotos para visualizar o teste real aqui', 1920 / 2, 1080 / 2 + 30);

  state.currentSampleBitmap = canvas;
  updatePreviewInfo(1920, 1080, 'Demonstração');
  renderCurrentPreview();
}

/**
 * Verifica compatibilidade do navegador com a File System Access API
 */
function checkBrowserCompatibility() {
  if (!StorageManager.isSupported()) {
    const alertBox = document.getElementById('browser-warning');
    if (alertBox) alertBox.style.display = 'flex';
  }
}

/**
 * Registra todos os listeners de eventos da UI
 */
function setupEventListeners() {
  // 1. Seleção de Pastas
  elements.btnSelectInputDir.addEventListener('click', handleSelectInputDir);
  elements.btnSelectOutputDir.addEventListener('click', handleSelectOutputDir);

  // 2. Upload da Marca D'água (Clique & Drag-and-Drop)
  elements.watermarkDropZone.addEventListener('click', () => elements.inputWatermarkFile.click());
  elements.inputWatermarkFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadCustomWatermark(e.target.files[0]);
    }
  });

  elements.watermarkDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.watermarkDropZone.classList.add('dragover');
  });

  elements.watermarkDropZone.addEventListener('dragleave', () => {
    elements.watermarkDropZone.classList.remove('dragover');
  });

  elements.watermarkDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.watermarkDropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadCustomWatermark(e.dataTransfer.files[0]);
    }
  });

  // 3. Grid de Posicionamento (9 Posições)
  elements.positionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      elements.positionButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.config.position = btn.dataset.position;
      renderCurrentPreview();
    });
  });

  // 4. Sliders e Seletores
  elements.sliderSize.addEventListener('input', (e) => {
    state.config.sizePercent = parseFloat(e.target.value);
    elements.valSize.textContent = `${state.config.sizePercent}%`;
    renderCurrentPreview();
  });

  elements.sliderMargin.addEventListener('input', (e) => {
    state.config.marginPercent = parseFloat(e.target.value);
    elements.valMargin.textContent = `${state.config.marginPercent}%`;
    renderCurrentPreview();
  });

  elements.sliderOpacity.addEventListener('input', (e) => {
    state.config.opacity = parseInt(e.target.value, 10);
    elements.valOpacity.textContent = `${state.config.opacity}%`;
    renderCurrentPreview();
  });

  elements.selectQuality.addEventListener('change', (e) => {
    state.config.quality = parseInt(e.target.value, 10);
  });

  elements.selectScaleMode.addEventListener('change', (e) => {
    state.config.scaleMode = e.target.value;
    renderCurrentPreview();
  });

  elements.inputFileSuffix.addEventListener('input', (e) => {
    state.config.fileSuffix = e.target.value;
  });

  elements.checkPlacementBox.addEventListener('change', (e) => {
    state.config.showPlacementBox = e.target.checked;
    renderCurrentPreview();
  });

  // 5. Navegação de Fotos de Amostra
  elements.btnPrevSample.addEventListener('click', () => navigateSample(-1));
  elements.btnNextSample.addEventListener('click', () => navigateSample(1));

  // 6. Botão de Processar e Ações
  elements.btnStartProcess.addEventListener('click', startBatchProcessing);
  elements.btnPauseProcess.addEventListener('click', togglePauseProcessing);
  elements.btnCancelProcess.addEventListener('click', cancelBatchProcessing);

  // 7. Modal de Sucesso
  elements.modalSuccessClose.addEventListener('click', () => {
    elements.modalSuccess.style.display = 'none';
  });
}

/**
 * Carrega a marca d'água personalizada escolhida pelo usuário
 */
async function loadCustomWatermark(file) {
  try {
    await state.engine.loadWatermark(file);
    elements.watermarkNameDisplay.textContent = file.name;
    elements.watermarkPreviewThumb.src = URL.createObjectURL(file);
    elements.watermarkPreviewThumb.style.display = 'block';
    renderCurrentPreview();
  } catch (err) {
    alert('Erro ao carregar a marca d\'água: ' + err.message);
  }
}

/**
 * Seleciona a pasta com as fotos originais
 */
async function handleSelectInputDir() {
  try {
    const { dirHandle, files } = await StorageManager.pickInputDirectory();
    if (files.length === 0) {
      alert('Nenhuma foto (JPG, PNG, WebP) foi encontrada na pasta selecionada.');
      return;
    }

    state.inputDirHandle = dirHandle;
    state.inputFiles = files;
    state.currentSampleIndex = 0;

    elements.inputDirStatus.innerHTML = `<strong>${files.length}</strong> fotos encontradas na pasta <code>${dirHandle.name}</code>`;
    elements.inputDirStatus.classList.add('ready');

    elements.btnPrevSample.disabled = false;
    elements.btnNextSample.disabled = false;

    // Carregar a primeira foto real para o preview
    await loadSamplePhoto(0);
    checkReadyToProcess();
  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('Aviso: ' + err.message);
    }
  }
}

/**
 * Seleciona a pasta onde salvar as fotos processadas
 */
async function handleSelectOutputDir() {
  try {
    const dirHandle = await StorageManager.pickOutputDirectory();
    state.outputDirHandle = dirHandle;

    elements.outputDirStatus.innerHTML = `Destino definido: <code>${dirHandle.name}</code>`;
    elements.outputDirStatus.classList.add('ready');
    checkReadyToProcess();
  } catch (err) {
    if (err.name !== 'AbortError') {
      alert('Aviso: ' + err.message);
    }
  }
}

/**
 * Carrega uma foto específica do lote para a área de prévia
 */
async function loadSamplePhoto(index) {
  if (!state.inputFiles || state.inputFiles.length === 0) return;

  const item = state.inputFiles[index];
  try {
    const file = await item.getFile();
    const bitmap = await state.engine.decodeImage(file);

    // Fechar o bitmap anterior caso tenha
    if (state.currentSampleBitmap && typeof state.currentSampleBitmap.close === 'function') {
      state.currentSampleBitmap.close();
    }

    state.currentSampleBitmap = bitmap;
    elements.sampleCounter.textContent = `${index + 1} de ${state.inputFiles.length}`;

    const orientation = bitmap.width >= bitmap.height ? 'Horizontal' : 'Vertical';
    updatePreviewInfo(bitmap.width, bitmap.height, item.name, orientation);
    renderCurrentPreview();
  } catch (err) {
    console.error('Erro ao carregar amostra:', err);
  }
}

/**
 * Navega entre as fotos do lote para conferir a prévia
 */
async function navigateSample(delta) {
  if (state.inputFiles.length === 0) return;

  let newIndex = state.currentSampleIndex + delta;
  if (newIndex < 0) newIndex = state.inputFiles.length - 1;
  if (newIndex >= state.inputFiles.length) newIndex = 0;

  state.currentSampleIndex = newIndex;
  await loadSamplePhoto(newIndex);
}

/**
 * Atualiza os badges de resolução e orientação no preview
 */
function updatePreviewInfo(width, height, name, orientation = null) {
  elements.previewInfoBadge.textContent = `${width} × ${height} px • ${name}`;
  if (orientation) {
    elements.previewOrientationBadge.textContent = orientation;
    elements.previewOrientationBadge.className = 'badge ' + (orientation === 'Vertical' ? 'badge-vertical' : 'badge-horizontal');
    elements.previewOrientationBadge.style.display = 'inline-flex';
  } else {
    elements.previewOrientationBadge.style.display = 'none';
  }
}

/**
 * Renderiza a prévia atual usando requestAnimationFrame
 */
let previewAnimFrame = null;
function renderCurrentPreview() {
  if (previewAnimFrame) cancelAnimationFrame(previewAnimFrame);

  previewAnimFrame = requestAnimationFrame(() => {
    if (state.currentSampleBitmap) {
      state.engine.renderPreview(elements.previewCanvas, state.currentSampleBitmap, state.config);
    }
  });
}

/**
 * Verifica se os requisitos para iniciar o lote estão prontos
 */
function checkReadyToProcess() {
  const ready = state.inputFiles.length > 0 && state.outputDirHandle !== null;
  elements.btnStartProcess.disabled = !ready;
  if (ready) {
    elements.btnStartProcess.classList.add('pulse');
  } else {
    elements.btnStartProcess.classList.remove('pulse');
  }
}

/**
 * Inicia o processamento em lote de todas as fotos
 */
async function startBatchProcessing() {
  if (state.inputFiles.length === 0) {
    alert('Por favor, selecione primeiro a pasta de fotos de origem.');
    return;
  }

  if (!state.outputDirHandle) {
    alert('Por favor, selecione primeiro a pasta onde as fotos serão salvas.');
    await handleSelectOutputDir();
    if (!state.outputDirHandle) return;
  }

  state.isProcessing = true;
  state.isPaused = false;
  state.isCancelled = false;

  // Atualizar UI para modo processamento
  toggleControlsDisabled(true);
  elements.processingCard.style.display = 'block';
  elements.processingCard.scrollIntoView({ behavior: 'smooth' });

  const total = state.inputFiles.length;
  let processed = 0;
  let errors = 0;
  const startTime = performance.now();

  elements.btnPauseProcess.textContent = 'Pausar';

  for (let i = 0; i < total; i++) {
    // 1. Checar se foi cancelado
    if (state.isCancelled) {
      break;
    }

    // 2. Checar se está pausado
    while (state.isPaused && !state.isCancelled) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const item = state.inputFiles[i];
    elements.progressCurrentFile.textContent = item.name;

    try {
      const file = await item.getFile();
      const processedBlob = await state.engine.processImage(file, state.config);

      // Nome do arquivo de saída
      let outputName = item.name;
      if (state.config.fileSuffix) {
        const lastDot = item.name.lastIndexOf('.');
        if (lastDot > 0) {
          outputName = `${item.name.substring(0, lastDot)}_${state.config.fileSuffix}${item.name.substring(lastDot)}`;
        }
      }

      await StorageManager.saveFile(state.outputDirHandle, outputName, processedBlob);
      processed++;
    } catch (err) {
      console.error(`Erro ao processar ${item.name}:`, err);
      errors++;
    }

    // Atualizar métricas de progresso
    const currentPercent = Math.round(((i + 1) / total) * 100);
    elements.progressBar.style.width = `${currentPercent}%`;
    elements.progressPercent.textContent = `${currentPercent}%`;
    elements.progressCounter.textContent = `${i + 1} de ${total} fotos`;

    // Cálculo de ETA (Tempo restante estimado)
    const elapsedSeconds = (performance.now() - startTime) / 1000;
    const speed = (i + 1) / elapsedSeconds; // fotos por segundo
    const remainingSeconds = Math.max(0, (total - (i + 1)) / (speed || 1));
    elements.progressEta.textContent = `Tempo restante: ~${formatSeconds(remainingSeconds)} (${speed.toFixed(1)} fotos/s)`;
  }

  const totalDuration = (performance.now() - startTime) / 1000;

  // Restaurar estado da UI
  state.isProcessing = false;
  toggleControlsDisabled(false);
  elements.processingCard.style.display = 'none';

  if (!state.isCancelled) {
    // Exibir Modal de Conclusão com Estatísticas
    elements.modalTotalProcessed.textContent = `${processed} de ${total} fotos`;
    elements.modalTotalTime.textContent = formatSeconds(totalDuration);
    elements.modalAvgSpeed.textContent = `${(processed / totalDuration).toFixed(1)} fotos/s`;
    elements.modalSuccess.style.display = 'flex';
  } else {
    alert(`Processamento cancelado pelo usuário. ${processed} fotos foram salvas antes do cancelamento.`);
  }
}

/**
 * Alterna a pausa do processamento
 */
function togglePauseProcessing() {
  state.isPaused = !state.isPaused;
  elements.btnPauseProcess.textContent = state.isPaused ? 'Continuar' : 'Pausar';
}

/**
 * Cancela o processamento em lote
 */
function cancelBatchProcessing() {
  if (confirm('Tem certeza de que deseja interromper o processamento em lote?')) {
    state.isCancelled = true;
    state.isPaused = false;
  }
}

/**
 * Habilita ou desabilita os controles durante o processamento
 */
function toggleControlsDisabled(disabled) {
  elements.btnSelectInputDir.disabled = disabled;
  elements.btnSelectOutputDir.disabled = disabled;
  elements.btnStartProcess.disabled = disabled;
  elements.sliderSize.disabled = disabled;
  elements.sliderMargin.disabled = disabled;
  elements.sliderOpacity.disabled = disabled;
  elements.positionButtons.forEach((btn) => (btn.disabled = disabled));
}

/**
 * Formata segundos em texto amigável (ex: 2m 14s)
 */
function formatSeconds(sec) {
  const s = Math.round(sec);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const remainingS = s % 60;
  return `${m}m ${remainingS}s`;
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);
