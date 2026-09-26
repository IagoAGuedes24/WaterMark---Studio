# Watermark Studio 📸

Uma ferramenta web moderna, rápida e 100% segura para aplicação de marcas d'água e logos em lotes de fotos de eventos (suportando tranquilamente centenas ou mais de 2.000 fotos de câmera por evento).

---

## ✨ Principais Vantagens

- **Privacidade Total:** Suas fotos **não são enviadas para nenhum servidor na nuvem**. Todo o processamento ocorre no próprio hardware do computador.
- **Leveza e Desempenho:** Graças à *File System Access API*, o sistema lê e salva direto nas pastas do seu computador, foto por foto, sem esgotar a memória RAM.
- **Respeito à Orientação de Câmera (EXIF):** Reconhece automaticamente fotos verticais e horizontais, aplicando a logo na posição correta em ambas.
- **Prévia em Tempo Real:** Veja exatamente onde a logo vai ficar, navegue entre as fotos do lote e ajuste o tamanho e a transparência antes de disparar o lote todo.
- **Zero Instalação:** Não precisa instalar Python nem rodar executáveis `.exe`.

---

## 🚀 Como Usar no Dia a Dia

Recomendamos abrir no **Google Chrome** ou **Microsoft Edge** (navegadores compatíveis com leitura/escrita direta em pastas).

1. Abra o arquivo `index.html` no navegador (ou acesse pelo link online do GitHub Pages).
2. **Passo 1 (Pastas):**
   - Clique em **"Selecionar Pasta com Fotos"** e aponte para onde estão as fotos originais do evento.
   - Clique em **"Selecionar Pasta para Salvar"** e escolha onde deseja salvar as fotos carimbadas.
3. **Passo 2 (Marca d'Água):**
   - O sistema já vem com uma logo padrão de exemplo. Para usar a sua própria, basta clicar ou arrastar o seu arquivo PNG (com fundo transparente) para a área da logo.
4. **Passo 3 (Posição & Ajustes):**
   - Escolha o canto desejado na grade de 9 botões (o padrão é o canto inferior direito ↘).
   - Ajuste os controles de tamanho, margem e opacidade caso queira.
   - Use os botões **◀ Anterior** e **Próxima ▶** no topo da foto para conferir como fica em fotos horizontais e verticais.
5. **Iniciar:**
   - Clique em **"Iniciar Processamento do Lote"**.
   - Acompanhe a barra de progresso em tempo real com a estimativa de tempo restante (ETA).

---

## 🌐 Como Publicar Online no GitHub Pages (Para toda a equipe usar via link)

Se você quiser enviar um link fácil no WhatsApp da equipe para qualquer pessoa usar:

1. Suba este projeto para um repositório no seu GitHub.
2. No repositório, vá em **Settings** > **Pages**.
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
4. Clique em **Save**.
5. Em menos de 1 minuto, o GitHub gerará um link público (exemplo: `https://seu-usuario.github.io/projetoLogosCrisma/`).
6. Pronto! Qualquer membro da equipe pode acessar esse link no Chrome ou Edge e carimbar as fotos direto da casa dele, com 100% de privacidade.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** & **Vanilla CSS3** (Design System com Dark Mode, Glassmorphism e responsividade).
- **Vanilla JavaScript (ES6+)** sem dependências externas pesadas.
- **HTML5 Canvas API** + `createImageBitmap` com rotação EXIF nativa.
- **File System Access API** para streaming de arquivos no disco.
