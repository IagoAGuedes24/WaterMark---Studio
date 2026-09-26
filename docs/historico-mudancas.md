# Histórico de Mudanças (Changelog)

Todas as grandes alterações, correções e novas funcionalidades adicionadas ao projeto serão documentadas aqui para manter o `README.md` focado no uso diário.

---

### [Versão 1.1.0] - 2026-09-26
#### Adicionado
- **Pasta `docs/`:** Criação da documentação modular com planejamento, arquitetura e histórico de versões.
- **Limite inteligente de amostras na prévia:** Ao carregar uma pasta com centenas ou milhares de fotos, o carrossel de prévia seleciona as **primeiras 10 fotos** (amostras). Isso evita travamentos de memória na navegação de teste e mantém a experiência fluida.
- **Fallback para seletor de arquivos:** Suporte a `<input type="file" webkitdirectory>` para garantir compatibilidade caso a *File System Access API* esteja restrita.
- **Launcher local (`iniciar_local.bat`):** Script de 1 clique para iniciar um servidor local rápido no Windows caso o usuário abra por fora de um servidor web.

#### Corrigido
- **Bloqueio de CORS ao abrir `index.html` via `file:///`:** O JavaScript foi empacotado em um formato universal autocontido, sem depender de `type="module"` restrito pelo navegador no protocolo local, garantindo que o clique nos botões de pasta e logo abra o seletor imediatamente.
- **Abertura da logo por clique nativo:** O container da logo agora utiliza `<label for="input-watermark-file">`, disparando o seletor nativo de arquivos instantaneamente ao clique.

---

### [Versão 1.0.0] - 2026-09-26
#### Adicionado
- Versão inicial do Watermark Studio.
- Interface em Dark Mode com Glassmorphism.
- Grade de 9 posições para a marca d'água.
- Sliders de tamanho proporcional, margem, opacidade e qualidade JPEG.
- Motor de marca d'água com rotação EXIF e suporte a lotes volumosos.
- Barra de progresso com contador, velocidade média (fotos/s) e estimativa de tempo restante (ETA).
- Modal de conclusão com estatísticas do lote.
