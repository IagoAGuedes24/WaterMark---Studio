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

---

## 2. Preservação de Rotação (EXIF)
Câmeras DSLR/Mirrorless e smartphones gravam a orientação da foto nos metadados EXIF (ex: Orientação 6 = rotação 90° horário). O método nativo `createImageBitmap(blob, { imageOrientation: 'from-image' })` normaliza a matriz de pixels automaticamente, garantindo que logos em fotos verticais (retrato) fiquem perfeitamente alinhadas com as fotos horizontais (paisagem).

---

## 3. Posicionamento Dinâmico (9 Posições)
O cálculo de escala utiliza `Math.min(largura, altura)` como base de referência por padrão. Isso garante que a logo mantenha a exata mesma dimensão visual física tanto em fotos na horizontal quanto na vertical, evitando logos desproporcionais entre orientações diferentes.

---

## 4. Segurança, Privacidade e LGPD
O Watermark Studio adota o conceito de **Zero-Knowledge / 100% Client-Side Processing**:

1. **Zero Envio de Fotos para a Internet:** 
   O código roda exclusivamente na CPU/GPU do navegador do operador. Nenhum byte de foto é transmitido para servidores de terceiros ou nuvem.
2. **Isolamento de Sistema (Sandbox):** 
   A *File System Access API* restringe o acesso estritamente à pasta que o operador selecionou e concedeu permissão explícita. O aplicativo não consegue visualizar ou acessar nenhum outro diretório da máquina.
3. **Conformidade com a LGPD:** 
   Como fotos de eventos comunitários e religiosos frequentemente contêm imagens de famílias, jovens e crianças, o processamento 100% local elimina qualquer risco de interceptação de tráfego, vazamento de banco de dados ou quebra de privacidade.
