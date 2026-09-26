/**
 * Módulo de Acesso ao Sistema de Arquivos (File System Access API)
 * Permite leitura e escrita direta no disco sem carregar tudo na memória RAM.
 */
export const StorageManager = {
  /**
   * Verifica se o navegador suporta a File System Access API
   */
  isSupported() {
    return 'showDirectoryPicker' in window;
  },

  /**
   * Solicita ao usuário a seleção da pasta de fotos (Origem)
   * @returns {Promise<{ dirHandle: FileSystemDirectoryHandle, files: Array<{name: string, handle: FileSystemFileHandle, getFile: Function}> }>}
   */
  async pickInputDirectory() {
    if (!this.isSupported()) {
      throw new Error('Seu navegador não suporta a seleção direta de pastas. Recomendamos usar o Google Chrome ou Microsoft Edge.');
    }

    const dirHandle = await window.showDirectoryPicker({
      id: 'watermark-input-dir',
      mode: 'read',
      startIn: 'pictures'
    });

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const files = [];

    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'file') {
        const lowerName = name.toLowerCase();
        if (validExtensions.some(ext => lowerName.endsWith(ext))) {
          files.push({
            name,
            handle,
            getFile: () => handle.getFile()
          });
        }
      }
    }

    // Ordenar arquivos por nome naturalmente
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    return { dirHandle, files };
  },

  /**
   * Solicita ao usuário a seleção da pasta de saída (Destino)
   * @returns {Promise<FileSystemDirectoryHandle>}
   */
  async pickOutputDirectory() {
    if (!this.isSupported()) {
      throw new Error('Seu navegador não suporta a seleção direta de pastas.');
    }

    const dirHandle = await window.showDirectoryPicker({
      id: 'watermark-output-dir',
      mode: 'readwrite',
      startIn: 'pictures'
    });

    // Validar permissão de escrita
    const permission = await this.verifyPermission(dirHandle, true);
    if (!permission) {
      throw new Error('Permissão de gravação na pasta de destino não foi concedida.');
    }

    return dirHandle;
  },

  /**
   * Grava um Blob de imagem diretamente na pasta de destino
   * @param {FileSystemDirectoryHandle} dirHandle 
   * @param {string} fileName 
   * @param {Blob} blob 
   */
  async saveFile(dirHandle, fileName, blob) {
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  },

  /**
   * Verifica e solicita permissão de acesso ao diretório
   */
  async verifyPermission(fileHandle, readWrite = false) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }

    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }

    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }

    return false;
  }
};
