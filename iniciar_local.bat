@echo off
title Watermark Studio
echo ========================================================
echo          WATERMARK STUDIO - INICIALIZADOR LOCAL
echo ========================================================
echo.
echo Abrindo seu navegador em http://localhost:8080 ...
echo (O servidor local garante permissao total para gravar nas pastas)
echo.
echo Quando terminar de usar, basta fechar esta janela.
echo.
start http://localhost:8080
python -m http.server 8080
