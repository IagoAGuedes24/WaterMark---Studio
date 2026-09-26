#!/usr/bin/env bash

echo "========================================================"
echo "         WATERMARK STUDIO - INICIALIZADOR LOCAL"
echo "========================================================"
echo ""
echo "Iniciando servidor local em http://localhost:8080 ..."
echo "Abra http://localhost:8080 no seu navegador."
echo "Pressione Ctrl+C para encerrar quando terminar."
echo ""

# Tenta abrir o navegador padrao no Windows/WSL ou Linux
if command -v wslview >/dev/null 2>&1; then
    wslview http://localhost:8080 &
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open http://localhost:8080 &
fi

python3 -m http.server 8080
