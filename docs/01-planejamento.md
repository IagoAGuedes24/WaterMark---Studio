# Planejamento do Projeto: Web App de Marca d'Água em Lote

Este documento contém o planejamento inicial aprovado para a criação do Watermark Studio.

## 1. Visão Geral e Objetivos
O objetivo é desenvolver uma aplicação web moderna, intuitiva e de alta performance para aplicação automatizada de marcas d'água/logos em lotes de fotos de eventos (suportando de 500 a mais de 2.000 fotos de câmera por evento).

### Princípios Chave:
- **Zero Instalação:** Funciona direto no navegador (Chrome, Edge, etc.) sem exigir bibliotecas pesadas instaladas pelo usuário.
- **Privacidade e Desempenho Local:** As fotos não são enviadas para servidores externos. O processamento ocorre 100% no hardware do usuário via Canvas e APIs nativas de arquivo.
- **Simplicidade para Não-Técnicos:** Interface visual clara com prévia em tempo real, permitindo ver exatamente como a logo ficará antes de processar o lote.
- **Tratamento de Câmeras:** Respeito à orientação vertical e horizontal (metadados EXIF) e escalonamento proporcional.

---

## 2. Decisões Arquiteturais
- **Frontend:** HTML5 Semântico + Vanilla CSS3 (Dark Mode, Glassmorphism) + Vanilla JavaScript moderno.
- **APIs de Disco:**
  - *File System Access API* (`showDirectoryPicker`): Leitura e gravação direta no disco quando disponível.
  - *Fallback com `<input webkitdirectory>`*: Garante funcionamento mesmo em protocolos locais restritos (`file://`).
- **Renderização Gráfica:**
  - `createImageBitmap` com rotação EXIF (`imageOrientation: 'from-image'`).
  - Canvas 2D com suavização de alta qualidade (`imageSmoothingQuality: 'high'`).
  - Exportação direta para JPEG com liberação imediata de memória RAM após cada arquivo.
