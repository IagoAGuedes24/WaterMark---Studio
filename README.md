# Watermark Studio 📸

Uma ferramenta web moderna, rápida e 100% segura para aplicação automatizada de marcas d'água e logos em lotes volumosos de fotos de eventos (suportando tranquilamente centenas ou mais de 2.000 fotos de câmera por evento).

---

## ⚡ Como Usar no Dia a Dia

### Opção 1: Uso Local Rápido no Windows (Recomendado para o computador pessoal)
1. Dê dois cliques no arquivo **`iniciar_local.bat`**.
2. Uma janela abrirá automaticamente no seu navegador em `http://localhost:8080`.
3. Escolha a pasta com as fotos originais e a pasta de destino para gravação direta no disco.

### Opção 2: Uso Online no GitHub Pages (Para compartilhar com a equipe via link)
1. Envie o projeto para o GitHub (veja as instruções abaixo).
2. Qualquer membro da equipe pode abrir o link no Google Chrome ou Microsoft Edge e carimbar as fotos diretamente, sem instalar nada.

---

## 🚀 Passo a Passo no Aplicativo

1. **Passo 1 (Pastas no Computador):**
   - Clique em **"Selecionar Pasta com Fotos"** para apontar onde estão as fotos originais.
   - Clique em **"Selecionar Pasta para Salvar"** e indique onde deseja salvar as fotos prontas.
2. **Passo 2 (Marca d'Água):**
   - O aplicativo já vem com uma logo padrão de demonstração.
   - Para usar a sua própria, clique na caixa da logo ou arraste seu arquivo PNG (com fundo transparente).
3. **Passo 3 (Posição & Ajustes):**
   - Escolha o canto desejado na grade de **9 posições** (o padrão é o canto inferior direito ↘).
   - Ajuste o tamanho proporcional, margem e opacidade.
   - Use os botões **◀ Anterior** e **Próxima ▶** para conferir as **10 fotos de amostra** (permitindo testar tanto fotos horizontais quanto verticais).
4. **Disparar Lote:**
   - Clique em **"Iniciar Processamento do Lote"**.
   - Acompanhe a barra de progresso em tempo real com contador, velocidade (fotos/s) e estimativa de tempo restante.

---

## 📚 Documentação do Projeto

Para manter este `README` focado e prático, as informações aprofundadas foram organizadas na pasta **`docs/`**:

- 📋 [Planejamento Inicial](docs/01-planejamento.md) — Objetivos, análise de volume e requisitos.
- 🏗️ [Arquitetura & Engenharia](docs/02-arquitetura.md) — Pipeline de memória do Canvas, rotação EXIF e APIs de arquivo.
- 📝 [Histórico de Mudanças (Changelog)](docs/historico-mudancas.md) — Registro de todas as versões e melhorias.

---

## 🌐 Como Subir para o GitHub e Ativar o GitHub Pages

### 1. Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê um nome ao repositório (ex: `projetoLogosCrisma` ou `watermark-studio`).
3. Deixe o repositório como **Público** (para usar o GitHub Pages gratuito) e **não** marque as opções de adicionar README ou .gitignore (pois já temos no projeto).
4. Clique em **Create repository**.

### 2. Enviar o Código do seu Computador
No seu terminal (ou Git Bash / WSL), dentro da pasta do projeto, execute os comandos exibidos pelo GitHub:
```bash
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 3. Ativar o Link Online (GitHub Pages)
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Branch**, selecione `main` e a pasta `/(root)`.
4. Clique em **Save**.
5. Aguarde cerca de 1 minuto e atualize a página: o GitHub mostrará o link (ex: `https://seu-usuario.github.io/projetoLogosCrisma/`).
6. Envie o link para a equipe e pronto!
